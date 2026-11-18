"use strict";

class MidiReader {
  constructor(bytes) {
    this.bytes = bytes;
    this.offset = 0;
  }

  take(length) {
    const end = this.offset + length;
    if (end > this.bytes.length) throw new Error("MIDI 文件不完整。");
    const slice = this.bytes.subarray(this.offset, end);
    this.offset = end;
    return slice;
  }

  number(length) {
    return this.take(length).reduce((value, byte) => value * 256 + byte, 0);
  }

  variable() {
    let value = 0;
    for (let index = 0; index < 4; index++) {
      const byte = this.number(1);
      value = value * 128 + (byte & 127);
      if (byte < 128) return value;
    }
    throw new Error("MIDI 事件的长度无效。");
  }

  chunk() {
    const type = String.fromCharCode(...this.take(4));
    return { type, reader: new MidiReader(this.take(this.number(4))) };
  }
}

function readMidiTrack(reader, track, division, metadata) {
  const channels = new Map();
  const held = new Map();
  let name = "";
  let tick = 0;
  let runningStatus = 0;
  while (reader.offset < reader.bytes.length) {
    tick += reader.variable();
    let status = reader.number(1);
    if (status < 128) {
      reader.offset--;
      status = runningStatus;
    }
    runningStatus = status < 240 ? status : 0;
    if (status === 0xff) {
      const type = reader.number(1);
      const data = reader.take(reader.variable());
      if (type === 0x2f) break;
      if (type === 0x03 && !name) name = new TextDecoder().decode(data).replaceAll("\0", "").trim();
      if ([0x51, 0x58, 0x59].includes(type)) metadata.push({ tick, type, data });
      continue;
    }
    if (status === 0xf0 || status === 0xf7) {
      reader.take(reader.variable());
      continue;
    }
    if (status < 0x80 || status >= 0xf0) throw new Error("MIDI 文件中有无效事件。");

    const command = status >> 4;
    const channel = status & 15;
    const pitch = reader.number(1);
    if (pitch > 127) throw new Error("MIDI 事件的数据无效。");
    if (command === 0xc || command === 0xd) continue;
    const value = reader.number(1);
    if (value > 127) throw new Error("MIDI 事件的数据无效。");
    if ((command !== 8 && command !== 9) || channel === 9) continue;
    const key = channel * 128 + pitch;
    if (command === 9 && value) {
      if (!channels.has(channel)) channels.set(channel, []);
      const note = { pitch, start: tick, end: null };
      channels.get(channel).push(note);
      if (!held.has(key)) held.set(key, []);
      held.get(key).push(note);
    } else {
      const notes = held.get(key);
      if (!notes) continue;
      notes.shift().end = tick;
      if (!notes.length) held.delete(key);
    }
  }
  for (const notes of held.values()) for (const note of notes) note.end = Math.max(tick, note.start + division);
  return [...channels].map(([channel, notes]) => ({ track, channel: channel + 1, name, notes }));
}

function readMidiFile(buffer) {
  const reader = new MidiReader(new Uint8Array(buffer));
  const header = reader.chunk();
  if (header.type !== "MThd") throw new Error("请选择标准的 MIDI 文件（.mid 或 .midi）。");
  const format = header.reader.number(2);
  const trackCount = header.reader.number(2);
  const division = header.reader.number(2);
  if (format > 2 || !trackCount || !division) throw new Error("MIDI 文件头无效。");
  if (division & 0x8000) throw new Error("此 MIDI 使用 SMPTE 时间码。请导出为按拍计时的 MIDI 后再导入。");
  const parts = [];
  const sharedMetadata = [];
  for (let track = 1; track <= trackCount; track++) {
    const { type, reader: trackReader } = reader.chunk();
    if (type !== "MTrk") throw new Error("MIDI 音轨数据不完整。");
    const metadata = format === 2 ? [] : sharedMetadata;
    for (const part of readMidiTrack(trackReader, track, division, metadata)) parts.push({ ...part, metadata });
  }
  if (!parts.length) throw new Error("MIDI 文件里没有可以导入的旋律音符。");
  return { division, parts };
}

function midiToScore(midi, part) {
  const firstTick = part.notes.reduce((first, note) => Math.min(first, note.start), Infinity);
  const events = [...part.metadata].sort((a, b) => a.tick - b.tick);
  const setting = (type) => events.findLast((event) => event.type === type && event.tick <= firstTick)?.data;
  const tempo = setting(0x51);
  const signature = setting(0x58);
  const accidental = setting(0x59)?.[0] ?? 0;
  const sharpCount = accidental < 128 ? accidental : accidental - 256;
  const keys = ["C♭", "G♭", "D♭", "A♭", "E♭", "B♭", "F", "C", "G", "D", "A", "E", "B", "F♯", "C♯"];
  const key = keys[7 + sharpCount] ?? "C";
  const micros = tempo?.length === 3 ? tempo[0] * 65536 + tempo[1] * 256 + tempo[2] : 0;
  const bpm = micros ? Math.max(30, Math.min(maxBpm, Math.round(60000000 / micros))) : 120;
  const requestedMeter = signature?.length >= 2 ? `${signature[0]}/${2 ** signature[1]}` : "4/4";
  const meter = Object.hasOwn(meterUnits, requestedMeter) ? requestedMeter : "4/4";
  const measure = meterUnits[meter];
  const notes = part.notes.map(({ pitch, start, end }) => ({ pitch, start: start * 48 / midi.division, end: end * 48 / midi.division }));
  const alignmentError = (step) => notes.reduce((error, { start, end }) => error +
    Math.abs(start - Math.round(start / step) * step) + Math.abs(end - Math.round(end / step) * step), 0);
  const step = alignmentError(4) < alignmentError(6) ? 4 : 6;
  const snap = (value) => Math.round(value / step) * step;
  const melody = new Map();
  for (const note of notes) {
    const start = snap(note.start);
    const end = Math.max(start + step, snap(note.end));
    const chord = melody.get(start);
    if (!chord || note.pitch > chord.pitch || (note.pitch === chord.pitch && end > chord.end)) {
      melody.set(start, { pitch: note.pitch, start, end });
    }
  }
  const ordered = [...melody.values()].sort((a, b) => a.start - b.start);
  const barCount = Math.ceil(ordered.at(-1).end / measure);
  if (barCount > 2048) throw new Error("这条 MIDI 音轨超过 2048 小节，请拆分后导入。");
  const bars = Array.from({ length: barCount }, () => []);
  const rhythms = [1, 2, 4, 8, 16, 32].flatMap((duration) => [
    { duration, units: 192 / duration, dotted: false, triplet: false },
    { duration, units: 288 / duration, dotted: true, triplet: false },
    { duration, units: 128 / duration, dotted: false, triplet: true }
  ]).filter(({ units }) => units % step === 0).sort((a, b) => b.units - a.units);

  let cursor = 0;
  function append(end, pitch = null) {
    let kind = pitch === null ? "rest" : "note";
    while (cursor < end) {
      const bar = Math.floor(cursor / measure);
      const limit = Math.min(end - cursor, measure - cursor % measure);
      const { duration, units, dotted, triplet } = rhythms.find((rhythm) => rhythm.units <= limit);
      bars[bar].push(newNote(pitch, duration, { dotted, triplet, kind }));
      cursor += units;
      if (kind === "note") kind = "tie";
    }
  }
  for (const [index, note] of ordered.entries()) {
    append(note.start);
    append(Math.min(note.end, ordered[index + 1]?.start ?? note.end), note.pitch);
  }
  append(barCount * measure);
  return { key, bpm, meter, bars };
}
