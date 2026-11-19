"use strict";

const annotatedSharePrefix = "oc4.";
const sharePrefix = "oc3.";
const previousSharePrefix = "oc2.";
const legacySharePrefix = "oc1.";
const sharePrefixes = [annotatedSharePrefix, sharePrefix, previousSharePrefix, legacySharePrefix];
const scoreFileLimit = 8 * 1024 * 1024;
const shareRest = 128;
const shareBarEnd = 129;
const shareFingeringButtons = "LRAYX";
const shareKeys = "C G D A E B F♯ C♯ F B♭ E♭ A♭ D♭ G♭ C♭".split(" ");
const shareMeters = ["4/4", "3/4", "2/4", "6/8"];
const shareSwing = ["straight", "eighth", "sixteenth", "dotted-eighth", "dotted-sixteenth", "scottish-eighth", "scottish-sixteenth"];
const shareLoops = ["off", "all", "section"];
const shareCommonRhythms = [2, 3, 1, 10, 4, 9, 11, 0, 34, 35, 33, 5];
const sharePitchStart = 59;
const shareCommonRest = 19;
const shareCommonPitchCount = 20;
const shareCompactBarEnd = shareCommonRhythms.length * shareCommonPitchCount;
const shareExtendedNote = shareCompactBarEnd + 1;
const shareNoteAnnotation = shareCompactBarEnd + 2;
const shareSheetWidth = 1200;
const shareQrBox = { x: 890, y: 270, size: 214 };
const shareBendLegendHeight = 203;

function shareBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 16384) binary += String.fromCharCode(...bytes.subarray(i, i + 16384));
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

async function makeShareCode(record) {
  const { title, author, key, meter, bpm, swing, loop, loopStart, loopEnd, bars } = record;
  let hasAnnotations = false;
  const notes = bars.map((bar) => bar.map((note) => {
    const { pitch, duration, kind, dotted, triplet, annotation } = note;
    const stored = writtenFingering(note);
    const packed = [kind === "rest" ? null : pitch, duration, Number(Boolean(dotted)) + 2 * Number(Boolean(triplet)) + 4 * Number(kind === "tie")];
    const otherPitches = Object.entries(note.fingeringsByPitch ?? {})
      .filter(([savedPitch]) => Number(savedPitch) !== pitch)
      .map(([savedPitch, { code, stick, dpad }]) => [Number(savedPitch), code, stick, dpad]);
    if (stored || otherPitches.length) packed.push(stored ? [stored.code, stored.stick, stored.dpad] : null);
    if (otherPitches.length) packed.push(otherPitches);
    if (annotation) {
      while (packed.length < 5) packed.push(null);
      packed.push(annotation);
      hasAnnotations = true;
    }
    return packed;
  }));
  const fields = [title, key, meter, bpm, swing, loop, loopStart, loopEnd, notes];
  if (author) fields.push(author);
  const raw = new Blob([packShareFields(fields)]);
  const payload = await new Response(raw.stream().pipeThrough(new CompressionStream("deflate"))).arrayBuffer();
  return (hasAnnotations ? annotatedSharePrefix : sharePrefix) + shareBase64(new Uint8Array(payload));
}

function shareFingeringByte([code, stick, dpad]) {
  return shareFingeringButtons.indexOf(code) * 9 + (stick + 1) * 3 + dpad + 1;
}

function shareFingeringFields(byte) {
  if (byte >= 45) throw new Error(tr("无效的按法。"));
  return [shareFingeringButtons[Math.floor(byte / 9)], Math.floor(byte % 9 / 3) - 1, byte % 3 - 1];
}

function pushShareInteger(bytes, value) {
  while (value >= 128) {
    bytes.push(value % 128 + 128);
    value = Math.floor(value / 128);
  }
  bytes.push(value);
}

function pushShareText(bytes, encoder, text) {
  const encoded = encoder.encode(text);
  pushShareInteger(bytes, encoded.length);
  for (const byte of encoded) bytes.push(byte);
}

function packShareFields([title, key, meter, bpm, swing, loop, loopStart, loopEnd, bars, author = ""]) {
  const hasLoopRange = loopStart !== 0 || loopEnd !== 0;
  const bytes = [shareKeys.indexOf(key) | (shareMeters.indexOf(meter) << 4),
    shareSwing.indexOf(swing) | (shareLoops.indexOf(loop) << 3) | (hasLoopRange ? 32 : 0)];
  pushShareInteger(bytes, bpm - 30);
  if (hasLoopRange) {
    pushShareInteger(bytes, loopStart);
    pushShareInteger(bytes, loopEnd);
  }
  const encoder = new TextEncoder();
  for (const text of [title, author]) pushShareText(bytes, encoder, text);
  for (const bar of bars) {
    for (const [pitch, duration, flags, fingering, otherPitches, annotation] of bar) {
      const rhythm = Math.log2(duration) | (flags << 3);
      const commonRhythm = shareCommonRhythms.indexOf(rhythm);
      const commonPitch = pitch === null ? shareCommonRest : pitch - sharePitchStart;
      if (!fingering && !otherPitches && commonRhythm >= 0 &&
          (pitch === null || (commonPitch >= 0 && commonPitch < shareCommonRest))) {
        bytes.push(commonRhythm * shareCommonPitchCount + commonPitch);
      } else {
        // The rhythm byte stores the duration exponent, note flags and two fingering markers.
        bytes.push(shareExtendedNote, pitch ?? shareRest, rhythm | (fingering ? 64 : 0) | (otherPitches ? 128 : 0));
        if (fingering) bytes.push(shareFingeringByte(fingering));
        if (otherPitches) {
          bytes.push(otherPitches.length);
          for (const [savedPitch, ...fingeringFields] of otherPitches) {
            bytes.push(savedPitch, shareFingeringByte(fingeringFields));
          }
        }
      }
      if (annotation) {
        bytes.push(shareNoteAnnotation);
        pushShareText(bytes, encoder, annotation);
      }
    }
    bytes.push(shareCompactBarEnd);
  }
  return Uint8Array.from(bytes);
}

function unpackShareFields(bytes, compact, annotated) {
  let offset = 0;
  const readByte = () => {
    if (offset >= bytes.length) throw new Error(tr("曲谱数据不完整。"));
    return bytes[offset++];
  };
  const decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
  const readInteger = () => {
    let value = 0;
    for (let multiplier = 1; multiplier <= 2 ** 49; multiplier *= 128) {
      const byte = readByte();
      value += (byte & 127) * multiplier;
      if (byte < 128) return value;
    }
    throw new Error(tr("无效的曲谱数值。"));
  };
  const readText = () => {
    const size = readInteger();
    if (size > bytes.length - offset) throw new Error(tr("曲谱文字数据不完整。"));
    const value = decoder.decode(bytes.subarray(offset, offset + size));
    offset += size;
    return value;
  };
  let header;
  if (compact) {
    const signature = readByte();
    const playback = readByte();
    const bpm = 30 + readInteger();
    const loopStart = playback & 32 ? readInteger() : 0;
    const loopEnd = playback & 32 ? readInteger() : 0;
    header = [readText(), shareKeys[signature & 15], shareMeters[signature >> 4], bpm,
      shareSwing[playback & 7], shareLoops[(playback >> 3) & 3], loopStart, loopEnd];
    const author = readText();
    if (author) header.push(author);
  } else {
    const headerEnd = bytes.indexOf(10);
    if (headerEnd < 0) throw new Error(tr("缺少曲谱信息。"));
    header = JSON.parse(decoder.decode(bytes.subarray(0, headerEnd)));
    if (!Array.isArray(header) || header.length < 8 || header.length > 9) throw new Error(tr("无效的曲谱信息。"));
    offset = headerEnd + 1;
  }
  const barEnd = compact ? shareCompactBarEnd : shareBarEnd;
  const bars = [];
  let bar = [];
  while (offset < bytes.length) {
    const symbol = readByte();
    if (symbol === barEnd) {
      bars.push(bar);
      bar = [];
      continue;
    }
    if (annotated && symbol === shareNoteAnnotation) {
      const note = bar.at(-1);
      if (!note || note.length === 6) throw new Error(tr("无效的音符备注。"));
      while (note.length < 5) note.push(null);
      note.push(readText());
      continue;
    }
    if (compact && symbol < barEnd) {
      const pitch = symbol % shareCommonPitchCount;
      const rhythm = shareCommonRhythms[Math.floor(symbol / shareCommonPitchCount)];
      bar.push([pitch === shareCommonRest ? null : pitch + sharePitchStart, 2 ** (rhythm & 7), rhythm >> 3]);
      continue;
    }
    if (compact && symbol !== shareExtendedNote) throw new Error(tr("无效的音符标记。"));
    const pitch = compact ? readByte() : symbol;
    const rhythm = readByte();
    const exponent = rhythm & 7;
    if (pitch > shareRest || exponent > 5) throw new Error(tr("无效的音符。"));
    const note = [pitch === shareRest ? null : pitch, 2 ** exponent, (rhythm >> 3) & 7];
    const fingering = rhythm & 64 ? shareFingeringFields(readByte()) : null;
    const hasOtherPitches = Boolean(rhythm & 128);
    if (fingering || hasOtherPitches) note.push(fingering);
    if (hasOtherPitches) {
      const count = readByte();
      const otherPitches = [];
      for (let i = 0; i < count; i++) {
        const savedPitch = readByte();
        if (savedPitch > 127) throw new Error(tr("无效的按法音高。"));
        otherPitches.push([savedPitch, ...shareFingeringFields(readByte())]);
      }
      note.push(otherPitches);
    }
    bar.push(note);
  }
  if (bar.length) throw new Error(tr("缺少小节结束标记。"));
  return [...header.slice(0, 8), bars, ...header.slice(8)];
}

function shareCodeFromText(text) {
  const value = text.trim();
  if (sharePrefixes.some((prefix) => value.startsWith(prefix))) return value;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.hash.slice(1);
  } catch { /* A shared score can be a raw code or a URL. */ }
  return "";
}

async function readShareCode(text) {
  const code = shareCodeFromText(text);
  const prefix = sharePrefixes.find((candidate) => code.startsWith(candidate));
  if (!prefix || !/^[\w-]+$/.test(code.slice(prefix.length)) || code.length > scoreFileLimit * 2) {
    throw new Error(tr("这不是有效的陶笛曲谱分享码。"));
  }
  try {
    const base64 = code.slice(prefix.length).replaceAll("-", "+").replaceAll("_", "/");
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    const reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate")).getReader();
    const chunks = [];
    let length = 0;
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > scoreFileLimit) {
        await reader.cancel();
        throw new Error(tr("曲谱太大。"));
      }
      chunks.push(value);
    }
    const payload = new Blob(chunks);
    // Preserve the content fingerprint so all versions identify the same score.
    const raw = prefix === legacySharePrefix
      ? await payload.text()
      : JSON.stringify(unpackShareFields(new Uint8Array(await payload.arrayBuffer()),
        prefix === sharePrefix || prefix === annotatedSharePrefix, prefix === annotatedSharePrefix));
    const [title, key, meter, bpm, swing, loop, loopStart, loopEnd, notes, author] = JSON.parse(raw);
    const bars = notes.map((bar) => bar.map(([pitch, duration, flags, fingering, otherPitches, annotation]) => {
      if (!Number.isInteger(flags) || flags < 0 || flags > 7) throw new Error(tr("无效的音符标记。"));
      const note = newNote(pitch, duration, { dotted: Boolean(flags & 1), triplet: Boolean(flags & 2),
        kind: pitch === null ? "rest" : flags & 4 ? "tie" : "note" });
      if (typeof annotation === "string") note.annotation = annotation;
      if (Array.isArray(fingering) && fingering.length === 3) {
        const [code, stick, dpad] = fingering;
        note.fingering = { code, stick, dpad };
      }
      if (Array.isArray(otherPitches)) {
        for (const entry of otherPitches) {
          if (!Array.isArray(entry) || entry.length !== 4) continue;
          const [savedPitch, code, stick, dpad] = entry;
          const match = matchingFingering(savedPitch, { code, stick, dpad });
          if (match && savedPitch !== pitch) rememberFingering(note, match, savedPitch);
        }
      }
      return note;
    }));
    const digest = crypto.subtle && await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
    const id = digest ? "score-share-" + [...new Uint8Array(digest).slice(0, 16)].map((byte) => byte.toString(16).padStart(2, "0")).join("") : makeScore().id;
    return parseScoreFile(JSON.stringify({ id, title, author, key, meter, bpm, swing, loop, loopStart, loopEnd, bars }));
  } catch {
    throw new Error(tr("分享码无法解码。请使用原始分享图、完整链接或曲谱文件。"));
  }
}

function shareQr(text) {
  const code = qrcode(0, "M");
  code.addData(text);
  try { code.make(); }
  catch { return null; }
  const size = code.getModuleCount();
  let path = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) if (code.isDark(y, x)) path += `M${x + 4} ${y + 4}h1v1h-1z`;
  }
  return { path, extent: size + 8 };
}

function drawShareQr({ path, extent }, attributes) {
  return `<svg xmlns="http://www.w3.org/2000/svg" ${attributes} viewBox="0 0 ${extent} ${extent}" shape-rendering="crispEdges"><rect width="${extent}" height="${extent}" fill="white"/><path d="${path}" fill="#18251f"/></svg>`;
}

function scoreShareUrl(code) {
  const local = ["127.0.0.1", "[::1]", "localhost"].includes(location.hostname);
  const base = location.protocol === "https:" && !local ?
    location.origin + location.pathname : "https://theramenes.github.io/ocarina-score/";
  return base + (uiLanguage === "en" ? "?lang=en" : "") + "#" + code;
}

function shareTokens(bar, b, record) {
  return bar.flatMap((source, n) => {
    const onset = source.kind === "tie" && fingeringSource(b, n, record);
    const note = onset ? { ...source, fingeringsByPitch: onset.fingeringsByPitch } : source;
    if (note.duration > 2 || note.triplet) return [note];
    const count = noteUnits(note) / 48;
    return Array.from({ length: count }, (_, index) => ({ ...note, duration: 4, dotted: false, annotation: index ? undefined : note.annotation,
      kind: index && note.kind !== "rest" ? "tie" : note.kind }));
  });
}

function shareToken(note, x, y) {
  const playable = note.kind !== "note" || fingerings.has(note.pitch);
  let symbol = playable ? badge(note, 0, -14, false) :
    `<circle r="13" fill="#dedfd6"/><text y="3" text-anchor="middle" font-size="7.6" font-weight="700">${pitchLabel(note.pitch)}</text>`;
  for (let line = 0; line < Math.log2(note.duration) - 2; line++) {
    symbol += `<path d="M-7 ${19 + line * 3.1}h14" stroke="#33483b" stroke-width="1.15" stroke-linecap="round"/>`;
  }
  if (note.dotted) symbol += '<circle cx="17" r="1.5" fill="#33483b"/>';
  if (note.duration <= 2) symbol += `<text y="24" text-anchor="middle" font-size="7">1/${note.duration}</text>`;
  return `<g transform="translate(${x} ${y}) scale(1.65)">${symbol}</g>`;
}

function shareEscape(value) {
  return String(value).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function shareTripletBracket(first, last, y) {
  const middle = (first + last) / 2;
  return `<path d="M${first} ${y + 6}v-6H${middle - 10}M${middle + 10} ${y}H${last}v6" fill="none" stroke="#465d4b" stroke-width="1.6"/><text x="${middle}" y="${y + 5}" text-anchor="middle" font-size="16" font-weight="700">3</text>`;
}

function shareBendLegend(y) {
  const base = natural.find(({ code }) => code === "A");
  const example = (x, center, stick, dpad) => badge(newNote(base.pitch + 2 * stick + dpad, 4, {
    fingering: { code: base.code, stick, dpad }
  }), x, center - 14, false);
  const rows = [
    [0, 1, "十字键 ↑ / ↓", "±1 半音"],
    [1, 0, "左摇杆 ↑ / ↓", "±2 半音"],
    [1, 1, "同向同时输入", "±3 半音"]
  ].map(([stick, dpad, name, shift], index) => {
    const center = y + 77 + index * 50;
    return `<g>
      ${example(884, center, stick, dpad)}${example(925, center, -stick, -dpad)}
      <text x="965" y="${center - 3}" font-size="15" font-weight="600">${tr(name)}</text>
      <text x="965" y="${center + 16}" font-size="14" fill="#646e5d">${tr(shift)}</text>
    </g>`;
  });
  return `<g aria-label="${tr("变音图例")}">
    <rect x="855" y="${y}" width="283" height="${shareBendLegendHeight}" rx="19" fill="#f6f7ee" stroke="#d8dfcb"/>
    <text x="875" y="${y + 27}" font-size="21" font-weight="700">${tr("变音图例")}</text>
    <text x="875" y="${y + 47}" font-size="13" fill="#646e5d">${tr("按键右侧的标记表示变音。")}</text>
    <path d="M875 ${y + 102}H1118 M875 ${y + 152}H1118" fill="none" stroke="#d8dfcb"/>
    ${rows.join("")}
  </g>`;
}

function shareRhythmLegend(y, outOfRange) {
  const example = newNote(74);
  const label = (x, baseline, name, detail) => `<text x="${x}" y="${baseline}" font-size="17" font-weight="700">${name}</text>` +
    `<text x="${x}" y="${baseline + 25}" font-size="15" fill="#646e5d">${detail}</text>`;
  const durations = [[4, tr("四分音符"), tr("1 拍")], [8, tr("八分音符"), tr("1/2 拍")],
    [16, tr("十六分音符"), tr("1/4 拍")], [32, tr("三十二分音符"), tr("1/8 拍")]];
  const durationExamples = durations.map(([duration, name, detail], index) => {
    const x = 62 + index * 269;
    return shareToken({ ...example, duration }, x + 30, y + 81) + label(x + 70, y + 77, name, detail);
  }).join("");
  const marks = [
    [{ ...example, dotted: true }, tr("附点"), tr("时值加一半")],
    [newNote(null, 4, { kind: "rest" }), tr("休止"), tr("此处停吹")],
    [{ ...example, kind: "tie" }, tr("延音"), tr("继续吹前一个音")]
  ];
  const markExamples = marks.map(([note, name, detail], index) => {
    const x = 62 + index * 214;
    return shareToken(note, x + 30, y + 181) + label(x + 72, y + 177, name, detail);
  }).join("");
  const triplet = [62, 65, 74].map((pitch, index) => shareToken(newNote(pitch, 8, { triplet: true }), 726 + 51 * index, y + 181)).join("");
  return `<g aria-label="${tr("节奏图例")}">
    <path d="M62 ${y}H1138 M62 ${y + 133}H1138" fill="none" stroke="#d8dbcb"/>
    <text x="62" y="${y + 29}" font-size="22" font-weight="700">${tr("节奏图例")}</text>
    <text x="1138" y="${y + 29}" text-anchor="end" font-size="15" fill="#646e5d">${tr("以下以四分音符为 1 拍")}</text>
    ${durationExamples}${markExamples}
    ${shareTripletBracket(707, 847, y + 151)}${triplet}${label(872, y + 177, tr("八分三连音"), tr("3 个音均分 1 拍"))}
    ${outOfRange ? `<text x="1138" y="${y + 241}" text-anchor="end" font-size="15" fill="#646e5d">${tr("灰色音名 · 游戏音域外")}</text>` : ""}
  </g>`;
}

function renderSharedScore(record, qr, publicLink) {
  const rows = [];
  for (const [index, bar] of record.bars.entries()) {
    const tokens = shareTokens(bar, index, record);
    let row = rows.at(-1);
    if (tokens.length <= 6 && row?.length === 1 && row[0].tokens.length <= 6 && !row[0].continued) {
      row.push({ number: index + 1, tokens });
    } else {
      let start = 0;
      do {
        let end = Math.min(start + 12, tokens.length);
        if (end < tokens.length && tokens[end - 1]?.triplet && tokens[end]?.triplet) {
          let first = end - 1;
          while (first > start && tokens[first - 1].triplet) first--;
          end -= (end - first) % 3;
        }
        rows.push([{ number: index + 1, tokens: tokens.slice(start, end), continued: start > 0 }]);
        start = end;
      } while (start < tokens.length);
    }
  }
  let rowY = 241;
  const rowHeight = 117;
  const outOfRange = record.bars.some((bar) => bar.some((note) => note.kind === "note" && !fingerings.has(note.pitch)));
  const notation = rows.map((row) => {
    const measureWidth = 755 / row.length;
    const measures = row.map((measure, index) => {
      const left = 62 + index * measureWidth;
      const spacing = Math.min(96, (measureWidth - 20) / Math.max(measure.tokens.length, 1));
      const start = left + (measureWidth - spacing * (measure.tokens.length - 1)) / 2;
      const annotations = measure.tokens.map((note) => note.annotation && layoutAnnotation(note.annotation, spacing - 8));
      return { ...measure, left, spacing, start, annotations };
    });
    const annotationHeight = annotationLineHeight * Math.max(0,
      ...measures.flatMap(({ annotations }) => annotations.map((annotation) => annotation?.lines.length ?? 0)));
    const y = rowY;
    const drawing = measures.map(({ number, tokens, continued, left, spacing, start, annotations }, index) => {
      let drawing = `<text x="${left + (index ? 16 : 0)}" y="${y + 16}" font-size="15" fill="#677564">${number}${continued ? " · " + tr("续") : ""}</text>`;
      if (index) drawing += `<path d="M${left} ${y + 4}v${101 + annotationHeight}" stroke="#d8dbcb"/>`;
      for (const [n, note] of tokens.entries()) {
        const x = start + n * spacing;
        drawing += shareToken(note, x, y + 63);
        if (annotations[n]) drawing += drawAnnotation(annotations[n], x, y + rowHeight + 7);
      }
      for (let n = 0; n < tokens.length;) {
        if (!tokens[n].triplet) { n++; continue; }
        let count = 1;
        while (count < 3 && tokens[n + count]?.triplet && tokens[n + count].duration === tokens[n].duration) count++;
        const first = start + n * spacing - 19;
        const last = start + (n + count - 1) * spacing + 19;
        drawing += shareTripletBracket(first, last, y + 28);
        n += count;
      }
      return drawing;
    });
    rowY = y + rowHeight + annotationHeight;
    return drawing.join("") + `<path d="M62 ${rowY - 4}H817" stroke="#d8dbcb"/>`;
  }).join("");
  const qrCardHeight = qr ? 324 : 131;
  const bendY = 211 + qrCardHeight + 14;
  const legendY = Math.max(bendY + shareBendLegendHeight, rowY) + 15;
  const height = legendY + (outOfRange ? 278 : 244);
  const title = scoreTitle(record);
  const { x, y, size } = shareQrBox;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${shareSheetWidth}" height="${height}" viewBox="0 0 ${shareSheetWidth} ${height}" font-family="DM Sans, Noto Sans SC, Microsoft YaHei, sans-serif" fill="#243c30">
  <rect width="${shareSheetWidth}" height="${height}" fill="#eae7da"/><rect x="24" y="24" width="1152" height="${height - 48}" rx="24" fill="#fffdf4" stroke="#d7d4c4"/>
  <path d="M48 24H1152a24 24 0 0 1 24 24V177H24V48a24 24 0 0 1 24-24Z" fill="#193a2d"/><path d="M24 177h1152" stroke="#c3a365" stroke-width="2"/>
  <text x="62" y="67" font-size="17" font-weight="700" fill="#e8d4a1">${tr("陶笛曲谱")}</text>
  <text x="62" y="131" font-size="44" font-weight="700" fill="#fff5da"${title.length > 15 ? ' textLength="820" lengthAdjust="spacingAndGlyphs"' : ""}>${shareEscape(title)}</text>
  ${record.author ? `<text x="62" y="157" font-size="15" fill="#dbd7be">${tr("制作者")} ${shareEscape(record.author)}</text>` : ""}
  <text x="1139" y="99" text-anchor="end" font-size="26" font-weight="700" fill="#fff5da">${record.meter} · ${record.bpm} BPM</text><text x="1139" y="131" text-anchor="end" font-size="16" fill="#dbd7be">Nintendo Switch 2</text>
  <text x="62" y="226" font-size="24" font-weight="700">${tr("按键谱")}</text><text x="817" y="225" text-anchor="end" font-size="15" fill="#646e5d">${barCount(record.bars.length)}</text>${notation}
  <rect x="855" y="211" width="283" height="${qrCardHeight}" rx="19" fill="#eff2e6" stroke="#d8dfcb"/>
  <text x="996.5" y="250" text-anchor="middle" font-size="23" font-weight="700">${qr ? (publicLink ? tr("扫码打开曲谱") : tr("从图片导入")) : tr("分享曲谱")}</text>
  ${qr ? drawShareQr(qr, `x="${x}" y="${y}" width="${size}" height="${size}"`) : `<text x="996.5" y="284" text-anchor="middle" font-size="16">${tr("谱面较长，请复制分享码")}</text>`}
  <text x="996.5" y="${qr ? 515 : 314}" text-anchor="middle" font-size="15" fill="#646e5d">${qr ? (publicLink ? tr("查看、播放或收藏") : tr("打开「导入曲谱」并选择此图")) : tr("也可以保存 JSON 文件")}</text>
  ${shareBendLegend(bendY)}
  ${shareRhythmLegend(legendY, outOfRange)}</svg>`;
}

async function drawImageBlob(blob) {
  const image = new Image();
  const url = URL.createObjectURL(blob);
  try {
    image.src = url;
    await image.decode();
    return image;
  } finally { URL.revokeObjectURL(url); }
}

function scanQrFrame(source, canvas, region) {
  const [x, y, width, height] = region;
  const scale = Math.min(1, 1600 / Math.max(width, height));
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(source, x, y, width, height, 0, 0, canvas.width, canvas.height);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  return jsQR(data, canvas.width, canvas.height)?.data ?? "";
}

async function scanQrImage(file) {
  const image = await drawImageBlob(file);
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const canvas = document.createElement("canvas");
  return scanQrFrame(image, canvas, [0, 0, width, height]) ||
    scanQrFrame(image, canvas, [width / 2, 0, width / 2, Math.min(height, width * .65)]);
}

async function sharePng(svg) {
  const image = await drawImageBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  const canvas = document.createElement("canvas");
  const scale = Math.min(2, 8192 / image.naturalHeight);
  canvas.width = Math.round(image.naturalWidth * scale);
  canvas.height = Math.round(image.naturalHeight * scale);
  canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error(tr("图像尺寸太大，可改用 SVG。"))), "image/png"));
}

function downloadShareFile(blob, title, extension) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const name = title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").trim() || tr("陶笛曲谱");
  link.href = url;
  link.download = `${name}-${uiLanguage === "en" ? "button-score" : "按键谱"}.${extension}`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function setupScoreSharing() {
  const importer = $("import-dialog");
  const importText = $("import-share-code");
  const importStatus = $("import-share-status");
  const acceptScore = $("accept-shared-score");
  const fileInput = $("score-file");
  let candidate = null;
  let reading = 0;

  function clearCandidate() {
    reading++;
    candidate = null;
    acceptScore.disabled = true;
    importStatus.textContent = "";
  }

  async function prepareImport(readText) {
    clearCandidate();
    const request = reading;
    importStatus.textContent = tr("正在识别曲谱…");
    try {
      const value = await readText();
      if (!value) throw new Error(tr("图片中没有识别到二维码。可试试原图或粘贴分享码。"));
      const record = await readShareCode(value);
      if (request !== reading || !importer.open) return;
      candidate = record;
      importText.value = value;
      importStatus.textContent = [scoreTitle(record), barCount(record.bars.length), record.bpm + " BPM",
        record.author && tr("制作者") + " " + record.author].filter(Boolean).join(" · ");
      acceptScore.disabled = false;
    } catch (error) {
      if (request === reading && importer.open) importStatus.textContent = error.message;
    }
  }

  $("import-score").onclick = () => importer.showModal();
  $("pick-score-file").onclick = () => fileInput.click();
  fileInput.onchange = (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (file.type.startsWith("image/") || /\.(?:png|jpe?g|webp|gif|svg)$/i.test(file.name)) {
      void prepareImport(() => scanQrImage(file));
    } else {
      importer.close();
      void importScoreFile(file);
    }
  };
  importText.oninput = clearCandidate;
  $("import-share-form").onsubmit = (event) => {
    event.preventDefault();
    void prepareImport(() => importText.value);
  };
  acceptScore.onclick = async () => {
    if (!candidate) return;
    const record = candidate;
    const request = reading;
    acceptScore.disabled = true;
    try {
      await storeImportedScore(record, record.title + ".json");
      if (request === reading && importer.open) {
        if (location.hash.slice(1) === shareCodeFromText(importText.value)) {
          history.replaceState(history.state, "", location.pathname + location.search);
        }
        importer.close();
      }
    } catch (error) {
      if (request !== reading || !importer.open) return;
      importStatus.textContent = tr("导入失败。") + error.message;
      acceptScore.disabled = false;
    }
  };
  importer.addEventListener("close", () => {
    clearCandidate();
    importText.value = "";
  });

  const sharer = $("share-dialog");
  const preview = $("share-preview");
  const expandQr = $("expand-share-qr");
  const qrDialog = $("share-qr-dialog");
  const qrPreview = $("share-qr");
  const previewImage = preview.querySelector("img");
  const shareStatus = $("share-status");
  const copyField = $("share-copy-field");
  const shareValue = $("share-value");
  const downloadSvg = $("download-score-svg");
  const downloadPng = $("download-score-png");
  let shareRun = 0;
  let draft = null;
  let previewUrl = "";
  const sheetPercent = (value) => `${value / shareSheetWidth * 100}%`;
  expandQr.style.left = sheetPercent(shareQrBox.x);
  // The SVG scales with image width, and percentage margins use that same width.
  expandQr.style.marginTop = sheetPercent(shareQrBox.y);
  expandQr.style.width = sheetPercent(shareQrBox.size);

  expandQr.onclick = () => {
    if (!draft?.qr) return;
    qrPreview.innerHTML = drawShareQr(draft.qr, `role="img" aria-label="${tr("曲谱二维码")}"`);
    qrDialog.showModal();
  };

  $("share-score").onclick = async () => {
    if (!score.bars.some((bar) => bar.length)) { toast(tr("先输入音符或打开一份曲谱。")); return; }
    commitTitle();
    commitAuthor();
    commitBpm();
    const record = structuredClone(score);
    const run = ++shareRun;
    shareStatus.textContent = tr("正在生成分享图…");
    sharer.showModal();
    try {
      const code = await makeShareCode(record);
      if (run !== shareRun || !sharer.open) return;
      const value = scoreShareUrl(code);
      const qr = shareQr(value);
      const svg = renderSharedScore(record, qr, true);
      const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      draft = { title: record.title, svg, svgBlob, qr };
      previewUrl = URL.createObjectURL(svgBlob);
      previewImage.src = previewUrl;
      preview.hidden = copyField.hidden = false;
      preview.scrollTop = 0;
      expandQr.hidden = !qr;
      $("share-copy-label").textContent = tr("分享链接");
      shareValue.value = value;
      downloadSvg.disabled = downloadPng.disabled = false;
      shareStatus.textContent = qr ? tr("点击谱图里的二维码可放大。") :
        tr("曲谱较长，放不进一张二维码。请复制分享内容，或使用 JSON 曲谱文件。");
    } catch {
      if (run === shareRun && sharer.open) shareStatus.textContent = tr("生成分享图失败。可以用「保存谱子」导出曲谱文件。");
    }
  };
  sharer.addEventListener("close", () => {
    shareRun++;
    draft = null;
    if (qrDialog.open) qrDialog.close();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = "";
    previewImage.removeAttribute("src");
    qrPreview.replaceChildren();
    shareValue.value = "";
    preview.hidden = copyField.hidden = expandQr.hidden = true;
    downloadSvg.disabled = downloadPng.disabled = true;
  });
  $("copy-score-share").onclick = async () => {
    try {
      await navigator.clipboard.writeText(shareValue.value);
      shareStatus.textContent = tr("已复制{item}。", { item: $("share-copy-label").textContent });
    } catch {
      shareValue.focus();
      shareValue.select();
      shareStatus.textContent = tr("已选中内容，按 Ctrl+C 复制。");
    }
  };
  downloadSvg.onclick = () => { if (draft) downloadShareFile(draft.svgBlob, draft.title, "svg"); };
  downloadPng.onclick = async () => {
    if (!draft) return;
    const result = draft;
    downloadPng.disabled = true;
    try {
      const blob = await sharePng(result.svg);
      if (result === draft) downloadShareFile(blob, result.title, "png");
    } catch (error) {
      if (result === draft) shareStatus.textContent = error.message;
    } finally { if (result === draft) downloadPng.disabled = false; }
  };

  const addOpenScore = $("add-open-shared-score");
  addOpenScore.onclick = async () => {
    commitTitle();
    commitAuthor();
    commitBpm();
    const record = structuredClone(score);
    addOpenScore.disabled = true;
    try {
      await storeImportedScore(record, record.title + ".json");
      if (openedShareId === record.id) {
        openedShareId = null;
        updateStatus();
      }
    } catch (error) {
      toast(tr("导入失败。") + error.message);
    } finally {
      addOpenScore.disabled = false;
    }
  };

  let opening = 0;
  async function receiveShareLink() {
    const request = ++opening;
    const code = location.hash.slice(1);
    if (!sharePrefixes.some((prefix) => code.startsWith(prefix))) return;
    try {
      const record = await readShareCode(code);
      if (request !== opening) return;
      if (sharer.open) sharer.close();
      if (importer.open) importer.close();
      switchScore(record, false, null, { shared: true });
    } catch (error) {
      if (request === opening) toast(error.message);
    }
  }
  window.addEventListener("hashchange", receiveShareLink);
  receiveShareLink();
}
