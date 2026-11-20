"use strict";

const $ = (id) => document.getElementById(id);
const all = (selector) => [...document.querySelectorAll(selector)];
const icons = {
  moon: '<path d="M20.8 14.2A9 9 0 0 1 9.8 3.2 9 9 0 1 0 20.8 14.2Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19m0-14-1.5 1.5m-11 11L5 19"/>',
  github: '<path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.4c0-1-.3-1.7-.9-2.1 3-.4 5.9-1.5 5.9-6.7 0-1.4-.5-2.5-1.3-3.4.2-.5.5-1.7-.2-3.4 0 0-1.1-.4-3.5 1.3a12 12 0 0 0-6 0C6.6 2.6 5.5 3 5.5 3c-.7 1.7-.4 2.9-.2 3.4A4.8 4.8 0 0 0 4 9.8c0 5.2 2.9 6.3 5.9 6.7-.5.4-.9 1.1-.9 2.1V22"/>',
  ocarina: '<path d="M2.4 12.9c2.5-1.4 7.2-2.6 11.1-2.5l2.6-5.3c.5-1.1 1.4-1.3 2.4-.9l1.3.5c.8.3 1 1 .9 1.9l-.6 5.1c2.4 1.4 3.4 3.6 2.2 6-1.8 3.7-7.1 3.8-12 2.2-3.8-1.2-7.3-3.3-8.4-5.1-.4-.8-.2-1.5.5-1.9Z"/><path d="M13.5 10.4c2.7 0 5 .5 6.6 1.3" stroke-width="1.2"/><g fill="currentColor" stroke="none"><circle cx="6.1" cy="13.8" r=".87"/><circle cx="9.1" cy="13.1" r=".98"/><circle cx="12.2" cy="13" r=".8"/><circle cx="14.3" cy="16.6" r=".95"/><circle cx="17.2" cy="16.9" r="1"/><circle cx="19.9" cy="16.1" r=".84"/></g>',
  music: '<path d="M9 18V5l11-2v13M9 18c0 1.4-1.6 2.5-3.5 2.5S2 19.4 2 18s1.6-2.5 3.5-2.5S9 16.6 9 18Zm11-2c0 1.4-1.6 2.5-3.5 2.5S13 17.4 13 16s1.6-2.5 3.5-2.5S20 14.6 20 16ZM9 9l11-2"/>',
  book: '<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"/>',
  library: '<path d="M3 4h4v16H3zm7 0h4v16h-4zm7 1 3-1 4 15-3 1z"/>',
  import: '<path d="M12 3v12m-4-4 4 4 4-4M4 15v5h16v-5"/>',
  save: '<path d="M20 21H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h13l4 4v13a1 1 0 0 1-1 1Z M7 3v6h9V3M7 21v-7h10v7"/>',
  pencil: '<path d="m13 6 5 5M4 20l4-.8L21 6l-4-4L4.8 15Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  tie: '<path d="M3 12c4 7 14 7 18 0M6 10h.01m12 0h.01" stroke-width="2.3"/>',
  rest: '<g stroke="none">' + glyph("rest4", 8.4, 12, "currentColor", .67) + '</g>',
  triplet: '<path d="M2.5 9V6h6m7 0h6v3" stroke-width="1.4"/>' +
    '<path d="M6 19v-6h13v6m-6.5-6v6" stroke-width="1.25"/>' +
    '<path d="M6 13h13" stroke-width="1.9"/><g stroke="none">' +
    glyph("tuplet3", 9.15, 9.6, "currentColor", .47) +
    [6, 12.5, 19].map((x) => glyph("filled", x - 3.4, 19.2, "currentColor", .31)).join("") + '</g>',
  undo: '<path d="M8 4 3 9l5 5M3 9h11a6 6 0 0 1 0 12h-3"/>',
  redo: '<path d="m16 4 5 5-5 5m5-5H10a6 6 0 0 0 0 12h3"/>',
  cursor: '<path d="m5 3 14 9-7 2-2 7Z"/>',
  skip: '<path d="M5 5v14"/><path d="m19 5-9 7 9 7Z" fill="currentColor"/>',
  play: '<path d="m7 4 13 8-13 8Z" fill="currentColor"/>',
  volume: '<path d="M3 9v6h4l5 4V5L7 9H3Zm12 0a4 4 0 0 1 0 6m2-9a8 8 0 0 1 0 12"/>',
  pause: '<path d="M8 5v14m8-14v14" stroke-width="4"/>',
  keys: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M9 11v9m6-9v9M8 4v7h2V4m4 0v7h2V4"/>',
  delete: '<path d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-7-7Z M11 9l6 6m0-6-6 6"/>',
  pad: '<path d="M7 6h10c3 0 4 3 5 7 2 7-2 8-5 3H7c-3 5-7 4-5-3 1-4 2-7 5-7Z M7 9v5m-2.5-2.5h5m6.5-1h.01m3 3h.01"/>',
  "arrow-right": '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H5m6-6-6 6 6 6"/>',
  external: '<path d="M13 4h7v7m0-7-9 9m7 0v6H5V6h6"/>',
  share: '<path d="M8 13l8-5M8 13l8 5"/><circle cx="6" cy="13" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="20" r="2.5"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  repeat: '<path d="M18 6H7a4 4 0 0 0-4 4m14-7 3 3-3 3M6 18h11a4 4 0 0 0 4-4m-14 7-3-3 3-3"/>'
};

function icon(name) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">' + icons[name] + '</svg>';
}
all("[data-icon]").forEach((element) => { element.innerHTML = icon(element.dataset.icon); });

const natural = [
  { pitch: 62, code: "L", color: "#80ad76", ink: "#29352b" },
  { pitch: 65, code: "R", color: "#7464a6" },
  { pitch: 69, code: "A", color: "#b95642" },
  { pitch: 71, code: "Y", color: "#367da1" },
  { pitch: 74, code: "X", color: "#e8bd4d", ink: "#29352b" }
];
const sharpNames = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const flatNames = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
const diatonicLetters = "CDEFGAB";
const majorScale = [0, 2, 4, 5, 7, 9, 11];
const keySignatures = {
  "C": "", "G": "F", "D": "FC", "A": "FCG", "E": "FCGD", "B": "FCGDA", "F♯": "FCGDAE", "C♯": "FCGDAEB",
  "F": "B", "B♭": "BE", "E♭": "BEA", "A♭": "BEAD", "D♭": "BEADG", "G♭": "BEADGC", "C♭": "BEADGCF"
};
const meterUnits = { "4/4": 192, "3/4": 144, "2/4": 96, "6/8": 144 };
const durationNames = { 1: "全音符", 2: "二分音符", 4: "四分音符", 8: "八分音符", 16: "十六分音符", 32: "三十二分音符" };
const swingPatterns = {
  eighth: { title: "三连音", duration: 8, ratio: 2 / 3, feel: "triplet" },
  sixteenth: { title: "三连音", duration: 16, ratio: 2 / 3, feel: "triplet" },
  "dotted-eighth": { title: "附点", duration: 8, ratio: 3 / 4, feel: "dotted" },
  "dotted-sixteenth": { title: "附点", duration: 16, ratio: 3 / 4, feel: "dotted" },
  "scottish-eighth": { title: "Scottish", duration: 8, ratio: 1 / 4, feel: "scottish" },
  "scottish-sixteenth": { title: "Scottish", duration: 16, ratio: 1 / 4, feel: "scottish" },
  straight: { title: "直拍", duration: 0, ratio: 1 / 2, feel: "straight" }
};
function normalizeSwing(value) {
  return typeof value === "string" && Object.hasOwn(swingPatterns, value) ? value : "straight";
}
const maxBpm = 320;
const minimumPitch = 59;
const maximumPitch = 77;
const slotWidth = 24;
const storageKey = "ocarina-score-library-v1";
const localScoreService = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
const useProjectFolder = localScoreService && new URLSearchParams(location.search).get("storage") !== "files";
const activeKey = useProjectFolder ? "ocarina-score-active-v1" : "ocarina-web-active-v1";
const webLibraryPrefix = "ocarina-web-score-v1:";
const pitches = Array.from({ length: maximumPitch - minimumPitch + 1 }, (_, index) => minimumPitch + index);
const pianoPitches = Array.from({ length: 31 }, (_, index) => 53 + index);

function pitchLabel(pitch, preferFlats = false) {
  return (preferFlats ? flatNames : sharpNames)[pitch % 12] + (Math.floor(pitch / 12) - 1);
}

function tonicPitch(key) {
  return 60 + majorScale[diatonicLetters.indexOf(key[0])] + Number(key.endsWith("♯")) - Number(key.endsWith("♭"));
}

const fingerings = new Map(pitches.map((pitch) => {
  const choices = natural.flatMap((base) => [-1, 0, 1].flatMap((dpad) =>
    [-1, 0, 1].filter((stick) => base.pitch + dpad + 2 * stick === pitch)
      .map((stick) => ({ ...base, dpad, stick }))));
  choices.sort((a, b) => (Math.abs(a.dpad) + 1.1 * Math.abs(a.stick)) - (Math.abs(b.dpad) + 1.1 * Math.abs(b.stick)));
  return [pitch, choices];
}));

function matchingFingering(pitch, saved) {
  if (!saved) return undefined;
  return fingerings.get(pitch)?.find(({ code, stick, dpad }) =>
    code === saved.code && stick === saved.stick && dpad === saved.dpad);
}

function writtenFingering(note) {
  if (note.kind === "rest") return undefined;
  return matchingFingering(note.pitch, note.fingeringsByPitch?.[note.pitch]) ??
    matchingFingering(note.pitch, note.fingering);
}

function rememberFingering(note, { code, stick, dpad }, pitch = note.pitch) {
  (note.fingeringsByPitch ??= {})[pitch] = { code, stick, dpad };
}

function fingeringFor(note) {
  return writtenFingering(note) ?? fingerings.get(note.pitch)?.[0];
}

function fingeringEffort({ stick, dpad }) {
  const modifiers = Math.abs(stick) + Math.abs(dpad);
  return 4 * modifiers + (modifiers === 2 ? 7 : 0) + (stick === 1 && dpad === -1 ? 18 : 0);
}
function fingeringTransition(from, to) {
  const button = from.code === to.code ? 0 : 2;
  const stick = from.stick === to.stick ? 0 : from.stick * to.stick < 0 ? 17 : 5;
  const dpad = from.dpad === to.dpad ? 0 : from.dpad * to.dpad < 0 ? 6 : 3;
  return button + stick + dpad;
}
function betterFingeringPath(candidate, best) {
  return !best || candidate.cost < best.cost ||
    (candidate.cost === best.cost && candidate.changes < best.changes);
}
function planFingerings(record, selection = null) {
  const quarter = 48;
  let silence = quarter;
  let states = [{ cost: 0, changes: 0 }];
  for (const [b, bar] of record.bars.entries()) {
    for (const [n, note] of bar.entries()) {
      if (note.kind === "tie") continue;
      const choices = note.kind === "note" && fingerings.get(note.pitch);
      if (!choices?.length) {
        silence += noteUnits(note);
        continue;
      }
      const current = fingeringFor(note);
      const candidates = selection && !selection.has(`${b}:${n}`) ? [current] : choices;
      // Keep the best route into each possible fingering. Silence gives the player time to reset.
      const continuity = Math.max(0, quarter - silence);
      states = candidates.map((choice) => {
        const changed = choice !== current;
        const effort = quarter * fingeringEffort(choice);
        let best;
        for (const previous of states) {
          const transition = previous.choice && continuity ? continuity * fingeringTransition(previous.choice, choice) : 0;
          const candidate = { cost: previous.cost + effort + transition, changes: previous.changes + Number(changed), previous };
          if (betterFingeringPath(candidate, best)) best = candidate;
        }
        return { ...best, note, choice, changed };
      });
      silence = 0;
    }
    silence += Math.max(0, meterUnits[record.meter] - barUnits(bar));
  }
  let best;
  for (const state of states) if (betterFingeringPath(state, best)) best = state;
  const changes = [];
  for (let step = best; step?.note; step = step.previous) {
    if (step.changed) changes.push({ note: step.note, choice: step.choice });
  }
  return changes.reverse();
}
function optimizeFingerings() {
  const selection = selectedNotes.size > 1 ? new Set(selectedNotes) : null;
  const changes = planFingerings(score, selection);
  if (!changes.length) {
    toast(selection ? tr("选区按法已符合优化规则。") : tr("当前按法已符合优化规则。"));
    return;
  }
  updateHistory(() => {
    for (const { note, choice } of changes) rememberFingering(note, choice);
    if (selection) selectedNotes = selection;
  });
  toast(tr(selection ? "选区内已优化 {count} 个音符的按法 · 可撤销" : "已优化 {count} 个音符的按法 · 可撤销", { count: changes.length }));
}

function instructions({ dpad, stick }) {
  return [stick && tr("左摇杆 {direction}", { direction: stick > 0 ? "↑" : "↓" }),
    dpad && tr("十字键 {direction}", { direction: dpad > 0 ? "↑" : "↓" })].filter(Boolean).join(" + ");
}
function modifierGlyph(type, direction, x, y, size = 17) {
  const up = direction > 0;
  const body = type === "dpad"
    ? '<path d="M6 1h6v5h5v6h-5v5H6v-5H1V6h5Z" fill="#39463e" stroke="#fffdf4" stroke-width="1.1" stroke-linejoin="round"/>' +
      '<rect class="dpad-hot" x="6.7" y="' + (up ? "1.7" : "12") + '" width="4.6" height="4.3" rx=".65" fill="#ffd44d"/>'
    : '<circle cx="9" cy="9" r="8.3" fill="#344139" stroke="#fffdf4" stroke-width="1.15"/><circle cx="9" cy="9" r="5.8" fill="#49584d" stroke="#728072" stroke-width=".55"/>' +
      '<path class="stick-arrow" d="M9 13V5m-3 3 3-3 3 3" transform="' + (up ? "rotate(0 9 9)" : "rotate(180 9 9)") + '" fill="none" stroke="#ffd44d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
  return '<g class="pitch-modifier" data-bend="' + type + '" data-direction="' + (up ? "up" : "down") +
    '" transform="translate(' + x + ' ' + y + ') scale(' + size / 18 + ')" aria-hidden="true">' + body + "</g>";
}
function modifierIcon(type, direction) {
  return '<svg class="modifier-icon ' + type + '" viewBox="0 0 18 18" aria-hidden="true">' + modifierGlyph(type, direction, 0, 0, 18) + "</svg>";
}
function cap({ code, color, ink, stick, dpad }) {
  const shape = code === "L" || code === "R" ? " shoulder" : "";
  const button = '<span class="cap' + shape + '" style="--cap:' + color + (ink ? ';color:' + ink : '') + '">' + code + '</span>';
  if (!stick && !dpad) return button;
  return '<span class="mapped-cap">' + button + (stick ? modifierIcon("stick", stick) : "") +
    (dpad ? modifierIcon("dpad", dpad) : "") + "</span>";
}
function newNote(pitch, duration = 4, extras = {}) {
  return { pitch, duration, dotted: false, triplet: false, kind: "note", ...extras };
}
const untitledScore = "未命名曲谱";
function makeScore(id = "score-" + (crypto.randomUUID?.() ?? Date.now())) {
  return { id, title: untitledScore, author: "", key: "C", bpm: 96, meter: "4/4", bars: [], swing: "straight", loop: "off", loopStart: 0, loopEnd: 0 };
}
function normalizeAuthor(value) { return typeof value === "string" ? [...value.trim()].slice(0, 32).join("") : ""; }
// Nintendo's Switch 2 melody cards give the notes and rhythms. BPM is adjustable.
function ocarinaSong(id, title, meter, bpm, bars) {
  return {
    ...makeScore("score-builtin-" + id), title, meter, bpm,
    bars: bars.map((bar) => bar.map(([pitch, duration, dotted = false, kind = pitch === null ? "rest" : "note"]) =>
      newNote(pitch, duration, { dotted, kind })))
  };
}
const builtInScores = [
  ocarinaSong("lullaby", "塞尔达摇篮曲", "3/4", 72, [
    [[71, 2], [74, 4]], [[69, 2, true]], [[71, 2], [74, 4]], [[69, 2, true]]
  ]),
  ocarinaSong("time", "时之歌", "4/4", 76, [
    [[69, 4], [62, 2], [65, 4]], [[69, 4], [62, 2], [65, 4]]
  ]),
  ocarinaSong("sun", "太阳之歌", "3/4", 96, [
    [[69, 8], [65, 8], [74, 4], [null, 4]], [[69, 8], [65, 8], [74, 4], [null, 4]]
  ]),
  ocarinaSong("storms", "风暴之歌", "3/4", 100, [
    [[62, 8], [65, 8], [74, 2]], [[62, 8], [65, 8], [74, 2]]
  ]),
  ocarinaSong("epona", "艾波娜之歌", "3/4", 84, [
    [[74, 8], [71, 8], [69, 4, true], [null, 8]], [[74, 8], [71, 8], [69, 4, true], [null, 8]]
  ]),
  ocarinaSong("saria", "莎莉亚之歌", "2/4", 108, [
    [[65, 8], [69, 8], [71, 4]], [[65, 8], [69, 8], [71, 4]]
  ]),
  ocarinaSong("minuet", "森林小步舞曲", "3/4", 84, [
    [[62, 8], [74, 8], [71, 2]], [[69, 8], [71, 8], [69, 2]]
  ]),
  ocarinaSong("bolero", "火焰波莱罗", "3/4", 72, [
    [[65, 16], [62, 16], [65, 16], [62, 16], [69, 16], [65, 16], [69, 16], [65, 16], [65, 8, false, "tie"], [null, 8]]
  ]),
  ocarinaSong("serenade", "水之小夜曲", "3/4", 72, [
    [[62, 4], [65, 4], [69, 4]], [[69, 4], [71, 2]]
  ]),
  ocarinaSong("requiem", "灵魂安魂曲", "4/4", 72, [
    [[62, 4], [65, 8], [62, 8], [69, 4], [65, 4]], [[62, 2, true], [null, 4]]
  ]),
  ocarinaSong("nocturne", "暗影夜曲", "4/4", 72, [
    [[71, 4], [69, 4], [69, 8], [62, 8], [71, 8], [69, 8]], [[65, 2, true], [null, 4]]
  ]),
  ocarinaSong("prelude", "光之前奏曲", "4/4", 84, [
    [[74, 8], [69, 4, true], [74, 8], [69, 8], [71, 8], [74, 8]], [[74, 2, true, "tie"], [null, 4]]
  ])
];
const isBuiltIn = (id) => builtInScores.some((item) => item.id === id);
function scoreTitle(record) {
  const builtIn = builtInScores.find((item) => item.id === record.id && item.title === record.title);
  return builtIn || record.title === untitledScore ? tr(record.title) : record.title;
}

function loadBrowserCopies() {
  try {
    const entries = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(entries) ? entries.filter((entry) => entry && typeof entry.id === "string") : [];
  }
  catch { return []; }
}
function getActiveId() {
  try { return localStorage.getItem(activeKey); }
  catch { return null; }
}
function rememberActive(id) {
  try { localStorage.setItem(activeKey, id); }
  catch { /* The file is saved independently of this browser preference. */ }
}
function loadWebLibrary() {
  const entries = [];
  try {
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key?.startsWith(webLibraryPrefix)) continue;
      try {
        const entry = JSON.parse(localStorage.getItem(key));
        if (entry?.score?.id) entries.push(entry);
      } catch { /* Ignore an unreadable browser entry. */ }
    }
  } catch { /* The library still works for this visit. */ }
  return entries;
}
const browserCopies = useProjectFolder ? loadBrowserCopies() : [];
let scoreFiles = useProjectFolder ? [] : loadWebLibrary();
const activeIdAtLoad = getActiveId();
const activeWebEntry = scoreFiles.find((entry) => entry.score.id === activeIdAtLoad);
const savedScore = activeWebEntry?.score ?? browserCopies.find((entry) => entry.id === activeIdAtLoad);
const activeBuiltIn = builtInScores.find((item) => item.id === activeIdAtLoad);
let folderState = useProjectFolder ? "loading" : "ready";
let saving = false;
let deletingScore = false;
let webFile = activeWebEntry ?? null;
let openedShareId = null;
function restoreScore(record) {
  const restored = { ...makeScore(), ...structuredClone(record), author: normalizeAuthor(record.author) };
  restored.swing = normalizeSwing(restored.swing);
  restored.bars = restored.bars.map((bar) => bar.map(normalizeScoreNote));
  return restored;
}
let score = restoreScore(savedScore ?? activeBuiltIn ?? builtInScores[0]);
let savedVersion = JSON.stringify(score);
let position = { b: 0, n: 0, slot: score.bars[0]?.length ? "" : "tail" };
let selectedNotes = new Set();
let display = "both";
let duration = 4;
let dotted = false;
let triplet = false;
let undoStack = [];
let redoStack = [];
let view = "editor";
let toastTimer;

function noteAt() { return position.slot ? undefined : score.bars[position.b]?.[position.n]; }
function notesInSelection() {
  return [...selectedNotes].map((key) => {
    const [b, n] = key.split(":").map(Number);
    return score.bars[b][n];
  });
}
function noteUnits(note) { return 192 / note.duration * (note.dotted ? 1.5 : 1) * (note.triplet ? 2 / 3 : 1); }
function barUnits(bar) { return bar.reduce((sum, note) => sum + noteUnits(note), 0); }
function previousNote(b, n, record = score) {
  if (n) return record.bars[b][n - 1];
  const priorBar = record.bars[b - 1];
  return priorBar && barUnits(priorBar) >= meterUnits[record.meter] ? priorBar.at(-1) : undefined;
}
function fingeringSource(b, n, record = score) {
  let note = record.bars[b]?.[n];
  while (note?.kind === "tie") {
    const prior = previousNote(b, n, record);
    if (!prior || prior.kind === "rest" || prior.pitch !== note.pitch) return undefined;
    if (n) n--;
    else {
      b--;
      n = record.bars[b].length - 1;
    }
    note = prior;
  }
  return note?.kind === "note" ? note : undefined;
}
function isDirty() { return JSON.stringify(score) !== savedVersion; }
function snapshot() { return { score: structuredClone(score), position: { ...position } }; }
function toast(message) {
  const element = $("toast");
  element.textContent = message;
  element.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { element.hidden = true; }, 2600);
}
function updateStatus() {
  const saved = !isDirty();
  const openedShare = openedShareId === score.id;
  const projectFile = useProjectFolder && scoreFiles.find((entry) => entry.score.id === score.id);
  let status = webFile?.status ?? "浏览器旧版备份";
  if (projectFile) status = "已保存到「曲谱」";
  if (isBuiltIn(score.id)) status = "内置曲谱";
  if (!saved) status = "未保存";
  if (openedShare && !undoStack.length) status = "已打开分享曲谱";
  if (saving) status = "保存中…";
  $("save-status").textContent = tr(status);
  $("save-status").title = projectFile ? tr("曲谱 / {filename}", { filename: projectFile.filename }) : webFile?.filename ?? "";
  $("save-status").classList.toggle("saved", saved && Boolean(projectFile || webFile));
  $("save").disabled = saving;
  $("add-open-shared-score").hidden = !openedShare || saved;
  $("undo").disabled = !undoStack.length;
  $("redo").disabled = !redoStack.length;
}
function updateHistory(mutator, redraw = refresh, groupWithPrevious = false) {
  pausePlayback();
  if (!groupWithPrevious) undoStack.push(snapshot());
  redoStack = [];
  selectedNotes.clear();
  mutator();
  redraw();
}
function moveHistory(from, to) {
  if (!from.length) return;
  resetTempoTaps();
  pausePlayback();
  to.push(snapshot());
  const id = score.id;
  ({ score, position } = from.pop());
  score.id = id;
  selectedNotes.clear();
  syncTools();
  refresh();
}
async function requestFolder(path = "", options) {
  let response;
  try {
    response = await fetch("/api/scores" + path, { cache: "no-store", ...options });
  } catch {
    throw new Error(tr("无法连接本地曲谱服务。"));
  }
  if (!response.headers.get("Content-Type")?.includes("application/json")) {
    throw new Error(tr("请用项目的本地曲谱服务打开网页。"));
  }
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  return result;
}

function writeScoreFile(record, onlyIfMissing = false) {
  const headers = { "Content-Type": "application/json" };
  if (onlyIfMissing) headers["If-None-Match"] = "*";
  return requestFolder("/" + encodeURIComponent(record.id), { method: "PUT", headers, body: JSON.stringify(record) });
}

function addScoreFile(entry) {
  scoreFiles = [entry, ...scoreFiles.filter((file) => file.score.id !== entry.score.id)];
}

function storeWebScore(entry) {
  addScoreFile(entry);
  try {
    localStorage.setItem(webLibraryPrefix + entry.score.id, JSON.stringify(entry));
    return true;
  } catch {
    return false;
  }
}

async function loadScoreFolder() {
  const initialScore = score;
  const initialVersion = JSON.stringify(score);
  try {
    const records = await requestFolder();
    const loadedIds = new Set(scoreFiles.map((entry) => entry.score.id));
    scoreFiles.push(...records.filter((entry) => !loadedIds.has(entry.score.id)));
    const active = scoreFiles.find((entry) => entry.score.id === activeIdAtLoad);
    if (active && !saving && score === initialScore && JSON.stringify(score) === initialVersion &&
        $("title").value === scoreTitle(score) && $("author").value === score.author && Number($("bpm").value) === score.bpm) {
      applyScore(active.score, true);
    }
    if (view === "library") renderLibrary();

    // Migrate old browser saves once per score ID without replacing files already on disk.
    const missing = browserCopies.filter((record) => !scoreFiles.some((entry) => entry.score.id === record.id));
    for (const record of missing) {
      try {
        const entry = await writeScoreFile(restoreScore(record), true);
        if (!scoreFiles.some((file) => file.score.id === entry.score.id)) addScoreFile(entry);
      } catch {
        // Failed migrations stay available as browser backups in the library.
      }
    }
    folderState = "ready";
  } catch {
    folderState = "error";
  }
  updateStatus();
  if (view === "library") renderLibrary();
}

function validScoreNote(note) {
  return note && Number.isInteger(note.duration) && Object.hasOwn(durationNames, note.duration) &&
    (note.kind === "rest" || (["note", "tie"].includes(note.kind) && Number.isInteger(note.pitch) && note.pitch >= 0 && note.pitch <= 127));
}

function normalizeAnnotation(text) {
  if (typeof text !== "string") return "";
  return [...text.replace(/[\u0000-\u001f\ufffe\uffff]/g, " ").replace(/\s+/g, " ").trim()].slice(0, 80).join("").trimEnd();
}

function normalizeScoreNote(source) {
  const { pitch, duration, kind, dotted, triplet } = source;
  const note = newNote(kind === "rest" ? null : pitch, duration, { kind, dotted: dotted === true, triplet: triplet === true });
  const annotation = normalizeAnnotation(source.annotation);
  if (annotation) note.annotation = annotation;
  if (kind === "rest") return note;
  if (source.fingeringsByPitch && typeof source.fingeringsByPitch === "object") {
    for (const savedPitch of pitches) {
      const match = matchingFingering(savedPitch, source.fingeringsByPitch[savedPitch]);
      if (match) rememberFingering(note, match, savedPitch);
    }
  }
  const legacy = matchingFingering(pitch, source.fingering);
  if (legacy && !note.fingeringsByPitch?.[pitch]) rememberFingering(note, legacy);
  return note;
}

function parseScoreFile(text) {
  const record = JSON.parse(text.replace(/^\uFEFF/, ""));
  if (!record || typeof record.id !== "string" || !/^score-[a-zA-Z0-9-]{1,80}$/.test(record.id) ||
      typeof record.title !== "string" || !record.title.trim() || typeof record.key !== "string" || !Object.hasOwn(keySignatures, record.key) ||
      typeof record.meter !== "string" || !Object.hasOwn(meterUnits, record.meter) || !Number.isInteger(record.bpm) || record.bpm < 30 || record.bpm > maxBpm ||
      !Array.isArray(record.bars) || !record.bars.every((bar) => Array.isArray(bar) && bar.every(validScoreNote))) {
    throw new Error(tr("无效的曲谱数据。"));
  }
  const { id, title, key, meter, bpm, bars, swing, loop, loopStart, loopEnd } = record;
  const start = Number.isInteger(loopStart) ? Math.max(0, loopStart) : 0;
  return {
    id, title, key, meter, bpm,
    author: normalizeAuthor(record.author),
    bars: bars.map((bar) => bar.map(normalizeScoreNote)),
    swing: normalizeSwing(swing),
    loop: ["all", "section"].includes(loop) ? loop : "off",
    loopStart: start,
    loopEnd: Number.isInteger(loopEnd) ? Math.max(start, loopEnd) : start
  };
}

async function saveBrowserFile(record, { allowDownload = true, existingName = webFile?.filename } = {}) {
  const title = record.title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").trim().slice(0, 48);
  const filename = /\.json$/i.test(existingName ?? "") ? existingName : `${title || tr("未命名曲谱")}.json`;
  const data = JSON.stringify(record, null, 2) + "\n";
  let handle;
  if (typeof window.showSaveFilePicker === "function") {
    try {
      handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: tr("陶笛曲谱"), accept: { "application/json": [".json"] } }]
      });
    } catch (error) {
      if (error.name === "AbortError") return null;
      if (error.name !== "SecurityError" && error.name !== "NotAllowedError") throw error;
    }
  }
  if (handle) {
    const writer = await handle.createWritable();
    await writer.write(data);
    await writer.close();
    return { filename: handle.name, status: "已保存文件" };
  }
  if (!allowDownload) return undefined;
  const url = URL.createObjectURL(new Blob([data], { type: "application/json;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return { filename, status: "已发起下载" };
}

async function save() {
  if (saving || deletingScore) return false;
  if ($("title").value !== scoreTitle(score)) commitTitle();
  commitAuthor();
  commitBpm();
  if (!score.title.trim()) score.title = untitledScore;
  const record = structuredClone(score);
  const sourceId = score.id;
  const savedKey = savedVersion ? JSON.parse(savedVersion).key : record.key;
  if (isBuiltIn(sourceId) || record.key !== savedKey) record.id = makeScore().id;
  saving = true;
  updateStatus();
  let file;
  try {
    file = await saveBrowserFile(record, useProjectFolder ? { allowDownload: false, existingName: null } : undefined);
    if (useProjectFolder && file === undefined) {
      file = await requestFolder("/save-as", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record)
      });
    }
    if (!file || file.cancelled) return false;
    if (useProjectFolder) {
      const entry = file.entry ?? await writeScoreFile(record);
      addScoreFile(entry);
      folderState = "ready";
      toast(tr("已保存 {file} · 已更新曲谱库", { file: file.filename }));
    } else {
      if (score.id === sourceId) webFile = file;
      const stored = storeWebScore({ score: record, ...file });
      toast(tr(file.status) + " · " + (stored ? file.filename : tr("曲谱库仅保留到本次访问结束")));
    }
    if (score.id === sourceId) {
      score.id = record.id;
      rememberActive(record.id);
      savedVersion = JSON.stringify(record);
    }
    return true;
  } catch (error) {
    toast(tr(file ? "曲谱库更新失败" : "保存失败") + " · " + error.message);
    return false;
  } finally {
    saving = false;
    updateStatus();
    if (view === "library") renderLibrary();
  }
}

function applyScore(next, saved) {
  resetTempoTaps();
  pausePlayback();
  score = restoreScore(next);
  savedVersion = saved ? JSON.stringify(score) : "";
  position = { b: 0, n: 0, slot: score.bars[0]?.length ? "" : "tail" };
  selectedNotes.clear();
  undoStack = [];
  redoStack = [];
  syncTools();
  refresh();
}
function switchScore(next, saved, file = null, { shared = false } = {}) {
  const apply = () => {
    webFile = file;
    openedShareId = shared ? next.id : null;
    applyScore(next, saved);
    if (saved) rememberActive(next.id);
    setView("editor");
  };
  const dialog = $("unsaved");
  if (saving || dialog.open) return;
  if (!isDirty() || (!undoStack.length && !savedVersion)) return apply();
  dialog.querySelector("form").onsubmit = async (event) => {
    event.preventDefault();
    const action = event.submitter?.value;
    dialog.close();
    if (action === "discard" || (action === "save" && await save() && !isDirty())) apply();
  };
  dialog.showModal();
}

function syncTools() {
  const note = noteAt();
  if (!note) return;
  ({ duration, dotted, triplet } = note);
}

function selectNote(b, n, slot = "", selection = new Set()) {
  closeFingeringEditor();
  const wasPlaying = Boolean(playback);
  if (wasPlaying) pausePlayback();
  position = { b, n, slot };
  selectedNotes = selection;
  syncTools();
  renderNotation();
  renderControls();
  if (wasPlaying) startPlayback();
  else renderPlayback();
}

function repairTies() {
  for (let b = 0; b < score.bars.length; b++) {
    score.bars[b].forEach((note, n) => {
      const prior = previousNote(b, n);
      if (note.kind === "tie" && (!prior || prior.kind === "rest" || prior.pitch !== note.pitch)) note.kind = "note";
    });
  }
}

function advanceAfterAppend(b) {
  const bar = score.bars[b];
  if (barUnits(bar) < meterUnits[score.meter]) {
    position = { b, n: bar.length, slot: "tail" };
  } else {
    position = { b: b + 1, n: 0, slot: score.bars[b + 1]?.length ? "" : "tail" };
    syncTools();
  }
}

function insertEmptyBar(index) {
  if (index < score.bars.length) {
    if (score.loopStart >= index) score.loopStart++;
    if (score.loopEnd >= index) score.loopEnd++;
  }
  score.bars.splice(index, 0, []);
}

function insertMeasure() {
  $("insert-menu").hidden = true;
  const b = Math.min(position.b + 1, score.bars.length);
  updateHistory(() => {
    insertEmptyBar(b);
    position = { b, n: 0, slot: "tail" };
    repairTies();
  });
  focusCursor();
}

function deleteMeasure() {
  $("insert-menu").hidden = true;
  const { b } = position;
  if (b >= score.bars.length) return;
  updateHistory(() => {
    score.bars.splice(b, 1);
    const last = Math.max(0, score.bars.length - 1);
    const first = score.loopStart - Number(score.loopStart > b);
    const end = score.loopEnd - Number(score.loopEnd >= b);
    score.loopStart = Math.min(first, last);
    score.loopEnd = Math.min(Math.max(score.loopStart, end), last);
    position = { b, n: 0, slot: score.bars[b]?.length ? "" : "tail" };
    repairTies();
    syncTools();
  });
  focusCursor();
}

function enter(pitch, kind = "note", { advance = false, audition = true } = {}) {
  const { b, n } = position;
  const current = noteAt();
  const prior = previousNote(b, n);
  if (kind === "tie" && (!prior || prior.kind === "rest")) {
    toast(tr("延音需要紧接在一个有音高的音符之后。"));
    return;
  }
  const note = newNote(kind === "tie" ? prior.pitch : pitch, current?.duration ?? duration, {
    kind, dotted: current?.dotted ?? dotted, triplet: current?.triplet ?? triplet
  });
  if (current?.annotation) note.annotation = current.annotation;
  if (kind === "note" && current?.kind === "note" && current.fingeringsByPitch) {
    note.fingeringsByPitch = current.fingeringsByPitch;
  }
  updateHistory(() => {
    score.bars[b] ??= [];
    const bar = score.bars[b];
    bar.splice(n, Number(Boolean(current)), note);
    position = { b, n, slot: "" };
    repairTies();
    if (n === bar.length - 1 && (!current || advance)) {
      advanceAfterAppend(b);
    } else if (advance) {
      position.n++;
      syncTools();
    }
  });
  if (position.b !== b) revealNotationElement($("notation").querySelector(".target.selected"));
  if (audition && note.kind !== "rest") preview(note.pitch);
}

function pasteNotes(bars) {
  const { b, n, slot } = position;
  const index = slot ? n : n + 1;
  const lastBar = b + bars.length - 1;
  updateHistory(() => {
    const bar = score.bars[b] ?? [];
    const tail = bar.slice(index);
    score.bars[b] = bar.slice(0, index).concat(bars[0]);
    for (let i = 1; i < bars.length; i++) {
      insertEmptyBar(b + i);
      score.bars[b + i] = bars[i];
    }
    const last = score.bars[lastBar];
    position = { b: lastBar, n: last.length - 1, slot: "" };
    score.bars[lastBar] = last.concat(tail);
    repairTies();
    syncTools();
  });
  focusCursor();
  const count = bars.reduce((sum, bar) => sum + bar.length, 0);
  toast(tr("已粘贴 {count} 个音符", { count }));
}

function editRhythm(field, requestedValue) {
  const note = noteAt();
  const notes = selectedNotes.size > 1 ? notesInSelection() : note ? [note] : [];
  const inputRhythm = { duration, dotted, triplet };
  const value = requestedValue ?? !(notes.length ? notes.every((entry) => entry[field]) : inputRhythm[field]);
  if (!notes.length) {
    ({ duration, dotted, triplet } = { ...inputRhythm, [field]: value });
    renderNotation();
    renderControls();
    return;
  }
  if (notes.every((entry) => entry[field] === value)) return;
  const selection = new Set(selectedNotes);
  updateHistory(() => {
    for (const entry of notes) entry[field] = value;
    selectedNotes = selection;
    repairTies();
    syncTools();
  });
}
function removeNoteRange(range, leaveInsertSlot = false) {
  const [firstBar, firstNote] = range[0].split(":").map(Number);
  const [lastBar, lastNote] = range.at(-1).split(":").map(Number);
  updateHistory(() => {
    for (let b = firstBar; b <= lastBar; b++) {
      const bar = score.bars[b];
      const start = b === firstBar ? firstNote : 0;
      const end = b === lastBar ? lastNote + 1 : bar.length;
      bar.splice(start, end - start);
    }
    const remaining = score.bars[firstBar].length;
    const slot = firstNote >= remaining ? "tail" : leaveInsertSlot ? "insert" : "";
    position = { b: firstBar, n: Math.min(firstNote, remaining), slot };
    repairTies();
    syncTools();
  });
  focusCursor();
}
function deleteNote() {
  if (selectedNotes.size > 1) {
    removeNoteRange([...selectedNotes]);
    return;
  }
  const note = noteAt();
  if (!note) {
    if (score.bars[position.b]?.length === 0) deleteMeasure();
    return;
  }
  if (note.kind !== "rest") {
    enter(null, "rest");
  } else {
    const { b, n } = position;
    updateHistory(() => {
      score.bars[b].splice(n, 1);
      const bar = score.bars[b];
      position = { b, n: Math.min(n, bar.length), slot: n < bar.length ? "" : "tail" };
      repairTies();
      syncTools();
    });
  }
  focusCursor();
}

function moveCursor(direction) {
  const { b, n, slot } = position;
  const bar = score.bars[b] ?? [];
  if (direction < 0) {
    if (n > 0) selectNote(b, n - 1);
    else if (b > 0) selectNote(b - 1, Math.max(0, score.bars[b - 1].length - 1), score.bars[b - 1].length ? "" : "tail");
  } else if (n < bar.length) {
    const next = n + Number(!slot);
    selectNote(b, next, next === bar.length ? "tail" : "");
  } else if (b < score.bars.length) {
    selectNote(b + 1, 0, score.bars[b + 1]?.length ? "" : "tail");
  }
  focusCursor();
}
function openInsert(before = false) {
  if (!noteAt()) return;
  const { b, n } = position;
  const index = before ? n : n + 1;
  $("insert-menu").hidden = true;
  selectNote(b, index, index === score.bars[b].length ? "tail" : "insert");
  focusCursor();
}

const chromaticKeys = ["C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
function transpose(semitones) {
  const soundingNotes = score.bars.flat().filter((note) => note.kind !== "rest");
  if (soundingNotes.some((note) => note.pitch + semitones < 12 || note.pitch + semitones > 107)) {
    toast(tr("移调超出可显示的音高范围。"));
    return;
  }
  updateHistory(() => {
    score.key = chromaticKeys[(tonicPitch(score.key) + semitones) % 12];
    for (const note of soundingNotes) note.pitch += semitones;
  });
}

const keyOptions = Object.keys(keySignatures);
function renderKeyOptions() {
  $("key").replaceChildren(...keyOptions.map((key) => new Option(tr("{key} 大调", { key }), key)));
  $("key").value = score.key;
}
renderKeyOptions();

function glyph(name, x, y, color, scale = 1) {
  return '<path d="' + engraving[name] + '" transform="translate(' + x + ' ' + y + ') scale(' + scale + ')" fill="' + color + '"/>';
}
const stemOffset = 5.35;
function drawNote(note, x, y, color, stemUp, beamY) {
  const head = note.duration === 1 ? "whole" : note.duration === 2 ? "half" : "filled";
  const drawing = glyph(head, x - (note.duration === 1 ? 8.44 : 5.9), y, color);
  if (note.duration === 1) return drawing;
  const stemX = x + (stemUp ? stemOffset : -stemOffset);
  const stemY = beamY ?? y + (stemUp ? -1 : 1) * (note.duration === 32 ? 38 : 34);
  const stem = '<path d="M' + stemX + ' ' + (y + (stemUp ? 1.8 : -1.8)) + 'V' + stemY + '" stroke="' + color + '" stroke-width="1.35"/>';
  const flag = beamY == null && note.duration >= 8 ? glyph("flag" + note.duration + (stemUp ? "up" : "down"), stemX - .4, stemY, color) : "";
  return drawing + stem + flag;
}

function drawSwingPair(x, durations, dotted = -1) {
  const y = 48;
  const beamY = 14;
  const spacing = 22;
  const levels = durations.map((duration) => beamLevels({ duration }));
  const shared = Math.min(...levels);
  const segments = [];
  for (let level = 0; shared && level < Math.max(...levels); level++) {
    const start = x + stemOffset;
    const right = start + spacing;
    const from = level < shared || level < levels[0] ? start : right - 8;
    const to = level < shared || level < levels[1] ? right : start + 8;
    segments.push(`M${from} ${beamY + level * 4.6}H${to}`);
  }
  const notes = durations.map((duration, i) => drawNote({ duration }, x + i * spacing, y, "currentColor", true, shared ? beamY : undefined)).join("");
  const beams = segments.length ? `<path d="${segments.join(" ")}" fill="none" stroke="currentColor" stroke-width="3.1"/>` : "";
  const dot = dotted === -1 ? "" : `<circle cx="${x + dotted * spacing + 10}" cy="${y - 1}" r="1.8" fill="currentColor"/>`;
  return notes + beams + dot;
}

function swingPreview({ duration, feel }) {
  const unit = duration || 8;
  const ordinary = drawSwingPair(13, [unit, unit]);
  let interpreted;
  if (feel === "triplet") {
    interpreted = drawSwingPair(83, [unit / 2, unit]) +
      '<path d="M80 10V5H94 M106 5H120V10" fill="none" stroke="currentColor" stroke-width="1.35"/>' +
      glyph("tuplet3", 97, 9, "currentColor", .62);
  } else if (feel === "dotted") interpreted = drawSwingPair(83, [unit, unit * 2], 0);
  else if (feel === "scottish") interpreted = drawSwingPair(83, [unit * 2, unit], 1);
  else interpreted = drawSwingPair(83, [unit, unit]);
  return '<svg viewBox="0 0 132 55" aria-hidden="true">' + ordinary +
    '<path d="M57 33h12m-12 5h12" fill="none" stroke="currentColor" stroke-width="1.6"/>' + interpreted + "</svg>";
}

function renderSwingOptions() {
  $("swing-options").innerHTML = Object.entries(swingPatterns).map(([value, pattern]) =>
    `<label class="swing-option"><input type="radio" name="swing" value="${value}"><span class="swing-card">` +
    swingPreview(pattern) + `<span>${tr(pattern.title)}</span>` +
    (pattern.duration ? `<small>${tr(durationNames[pattern.duration])}</small>` : "") + "</span></label>"
  ).join("");
}

function setupSwingPicker() {
  const dialog = $("swing-dialog");
  const form = dialog.querySelector("form");
  renderSwingOptions();
  $("swing").onclick = () => {
    dialog.returnValue = "";
    const selected = form.elements.swing;
    selected.value = score.swing;
    dialog.showModal();
    form.querySelector("input:checked")?.focus({ preventScroll: true });
  };
  dialog.addEventListener("close", () => {
    if (dialog.returnValue !== "apply") return;
    const value = form.elements.swing.value;
    if (Object.hasOwn(swingPatterns, value) && value !== score.swing) updateHistory(() => { score.swing = value; });
  });
}

$("durations").innerHTML = Object.entries(durationNames).map(([value, label]) =>
  '<button class="tool" data-duration="' + value + '" title="' + tr(label) + '" aria-label="' + tr(label) + '"><svg viewBox="0 -4 36 48" aria-hidden="true">' + drawNote({ duration: +value }, 14, 39, "currentColor", true) + '</svg></button>'
).join("");

function svgText(text, x, y, attributes = "") {
  return '<text x="' + x + '" y="' + y + '" ' + attributes + '>' + text + '</text>';
}

const annotationFont = "13px";
const annotationLineHeight = 17;
const annotationMeasure = document.createElement("canvas").getContext("2d");
annotationMeasure.font = `600 ${annotationFont} "DM Sans", "Noto Sans SC", "Microsoft YaHei", sans-serif`;

function layoutAnnotation(text, maxWidth = 156) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    const combined = line ? line + " " + word : word;
    if (annotationMeasure.measureText(combined).width <= maxWidth) {
      line = combined;
      continue;
    }
    if (line) lines.push(line);
    line = "";
    for (const char of word) {
      if (annotationMeasure.measureText(line + char).width > maxWidth && line) {
        lines.push(line);
        line = "";
      }
      line += char;
    }
  }
  if (line) lines.push(line);
  return { lines, width: Math.max(0, ...lines.map((part) => annotationMeasure.measureText(part).width)) };
}

function drawAnnotation(annotation, x, y) {
  return annotation.lines.map((line, i) => svgText(shareEscape(line), x, y + i * annotationLineHeight,
    `class="note-annotation" text-anchor="middle" font-size="${annotationFont}" font-weight="600" fill="var(--score-annotation, #365843)"`)).join("");
}

function spelling(pitch) {
  const signature = keySignatures[score.key];
  const flat = score.key === "F" || score.key.includes("♭");
  const sign = flat ? "♭" : "♯";
  const baseName = pitchLabel(pitch, flat);
  const alternate = pitchLabel(pitch + (flat ? 1 : -1), flat);
  const special = pitch % 12 === (flat ? 4 : 5) || pitch % 12 === (flat ? 11 : 0);
  if (special && alternate.length === 2 && signature.includes(alternate[0])) return alternate[0] + sign + alternate[1];
  return baseName;
}
function noteY(name, staffY) {
  const steps = "CDEFGAB".indexOf(name[0]) + 7 * Number(name.replace(/^[A-G][♯♭]?/, ""));
  return staffY + 40 - (steps - 30) * 5;
}
function drawClef(x, y) {
  return glyph("treble", x + 4, y, "var(--score-ink, #354036)");
}
function drawRest(duration, x, y, color) {
  if (duration <= 2) {
    return '<rect x="' + (x - 5) + '" y="' + (y - (duration === 2 ? 4 : 10)) + '" width="10" height="4" fill="' + color + '"/>';
  }
  return glyph("rest" + duration, x - 5.5, y, color);
}
function cursorFrame(x, y, width, height) {
  return '<rect class="cursor-frame" x="' + (x - width / 2) + '" y="' + y + '" width="' + width +
    '" height="' + height + '" rx="3" fill="none" pointer-events="none"/>';
}
function restFrame(length, x, y) {
  const [top, height] = { 1: [-13, 10], 2: [-7, 10], 4: [-18, 36], 8: [-10, 24], 16: [-11, 35], 32: [-12, 46] }[length];
  return cursorFrame(x, y + top, 24, height);
}
function staffSignature(x, y, includeMeter) {
  const flat = score.key === "F" || score.key.includes("♭");
  const positions = flat ? [20, 5, 25, 10, 30, 15, 35] : [0, 15, -5, 10, 25, 5, 20];
  const count = keySignatures[score.key].length;
  let drawing = drawClef(x, y + 30);
  for (let i = 0; i < count; i++) {
    drawing += svgText(flat ? "♭" : "♯", x + 42 + i * 9, y + positions[i] + 5, 'font-size="17"');
  }
  if (includeMeter) {
    const [top, bottom] = score.meter.split("/");
    const meterX = x + 46 + count * 9;
    drawing += svgText(top, meterX, y + 19, 'font-family="Georgia" font-size="23" font-weight="700"');
    drawing += svgText(bottom, meterX, y + 39, 'font-family="Georgia" font-size="23" font-weight="700"');
  }
  return drawing;
}
function restBadge(x, y) {
  return '<circle class="button-rest" cx="' + x + '" cy="' + (y + 14) + '" r="11" fill="none" stroke="#8c816a" stroke-width="1.2" stroke-dasharray="3 2"/>';
}
function badge(note, x, y, showPitch = true, source = note) {
  if (note.kind === "rest") return restBadge(x, y);
  const match = fingeringFor(source);
  if (note.kind === "tie") {
    return '<path class="button-tie" d="M' + (x - 9) + ' ' + (y + 14) + 'h18" fill="none" stroke="' +
      (match?.color ?? "#6a7164") + '" stroke-width="1.8" stroke-linecap="round"/>';
  }
  if (!match) return svgText("—", x, y + 20, 'text-anchor="middle" fill="var(--score-pitch, #817c70)"') +
    svgText(spelling(note.pitch), x, y + 41, 'text-anchor="middle" font-size="10.5" fill="var(--score-pitch, #817c70)"');
  const { code, color, ink = "#fffdf2", stick, dpad } = match;
  let drawing;
  if (code === "L" || code === "R") {
    const flipped = code === "R";
    const transform = `translate(${x + (flipped ? 13 : -13)} ${y + 2})${flipped ? " scale(-1 1)" : ""}`;
    drawing = `<path d="M5 24Q.4 24 1 19l1.4-6.5Q4 4 14 2.5L19 2q3.1-.3 4.1 2.8l3.4 13.8Q27.8 24 22.5 24Z" transform="${transform}" fill="${color}"/>`;
  } else {
    drawing = '<circle cx="' + x + '" cy="' + (y + 14) + '" r="12" fill="' + color + '"/>';
  }
  drawing += '<path d="M' + (x - 7) + ' ' + (y + 20) + 'q7 5 14 0" stroke="#0003" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
  drawing += svgText(code, x, y + 18, 'text-anchor="middle" font-size="13" font-weight="700" fill="' + ink + '"');
  if (stick) drawing += modifierGlyph("stick", stick, x + 8.5, y - 5);
  if (dpad) drawing += modifierGlyph("dpad", dpad, x + 8.5, y + 16);
  return drawing + (showPitch ? svgText(spelling(note.pitch), x, y + 41, 'text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--score-pitch, #606b5f)"') : "");
}
function tieArc(fromX, toX, noteY, staffY, part = "complete") {
  if (toX <= fromX) return "";
  const padding = Math.min(5.5, (toX - fromX) / 4);
  const start = fromX + (part === "incoming" ? 0 : padding);
  const end = toX - (part === "outgoing" ? 0 : padding);
  const side = noteY > staffY + 20 ? 1 : -1;
  const y = noteY + side * 5.5;
  const depth = Math.min(12, Math.max(4, (end - start) * .16));
  const middle = (start + end) / 2;
  return '<path class="tie-arc ' + part + '" d="M' + start + ' ' + y + ' Q' + middle + ' ' + (y + side * depth) + ' ' +
    end + ' ' + y + '" fill="none" stroke="var(--score-ink, #354036)" stroke-width="1.35" stroke-linecap="round" pointer-events="none"/>';
}
function numberedExtensions(note) {
  return note.duration <= 2 ? 4 / note.duration * (note.dotted ? 1.5 : 1) - 1 : 0;
}

function drawNumberedNote(note, x, y, color, preview = false) {
  const isRest = note.kind === "rest";
  const { number, accidental, octave } = isRest ? { number: 0, accidental: "", octave: 0 } : scaleDegree(note.pitch);
  const digit = 'text-anchor="middle" font-size="19" font-weight="700"';
  let drawing = svgText(number, x, y, digit + ' class="score-degree"');
  if (accidental) drawing += svgText(accidental, x - 10, y - 1, 'text-anchor="end" font-size="14"');
  const underlines = Math.max(0, Math.log2(note.duration) - 2);
  for (let line = 0; line < underlines; line++) {
    drawing += `<path class="numbered-underline" d="M${x - 6} ${y + 4 + line * 3}h12" stroke="${color}" stroke-width="1.15"/>`;
  }
  for (let dot = 0; dot < Math.abs(octave); dot++) {
    const cy = octave > 0 ? y - 18 - dot * 4 : y + 6 + underlines * 3 + dot * 4;
    drawing += `<circle class="numbered-octave" cx="${x}" cy="${cy}" r="1.4"/>`;
  }
  if (note.dotted && note.duration >= 4) {
    drawing += `<circle class="numbered-dot" cx="${x + 10}" cy="${y - 6}" r="1.5"/>`;
  }
  for (let mark = 0; !preview && mark < numberedExtensions(note); mark++) {
    const at = x + 19 + mark * 13;
    drawing += isRest ? svgText("0", at, y, digit + ' class="numbered-extension"') :
      `<path class="numbered-extension" d="M${at - 4} ${y - 6}h8" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`;
  }
  return `<g class="numbered-note" fill="${color}">${drawing}</g>`;
}

function measureSpacing(bar, b, staff, buttons, numbered) {
  const selected = b === position.b;
  const tail = barUnits(bar) < meterUnits[score.meter] || (selected && position.slot === "tail");
  const insertAt = selected && position.slot === "insert" ? position.n : -1;
  const gap = insertAt === -1 ? 0 : slotWidth + 10;
  const cells = bar.map((note) => {
    const annotation = note.annotation && layoutAnnotation(note.annotation);
    const textHalf = annotation ? annotation.width / 2 + 5 : 0;
    const extensions = numbered ? numberedExtensions(note) : 0;
    const left = Math.max(textHalf, note.kind === "rest" ? 13 : staff || numbered ? 19 : 15);
    const right = Math.max(textHalf, extensions ? 15 + extensions * 13 : 0,
      note.kind === "note" && buttons ? 25 : note.duration >= 8 && staff && note.kind !== "rest" ? 19 : 13);
    const weight = note.kind === "tie" ? .75 : 1 + .22 * Math.log2(1 + Math.min(noteUnits(note), 96) / 12);
    return { left, right, weight, annotation };
  });
  const cellWidth = cells.reduce((sum, { left, right }) => sum + left + right, 0);
  const weight = cells.reduce((sum, cell) => sum + cell.weight, 0);
  const minWidth = Math.max(88, 18 + cellWidth + gap + (tail ? slotWidth + 12 : 0));
  return { tail, insertAt, gap, cells, weight, cellWidth, minWidth };
}

function beamLevels(note) {
  return note.kind === "rest" ? 0 : Math.max(0, Math.log2(note.duration) - 2);
}
function drawBeamGroup(group, staffY) {
  const first = group[0];
  const last = group.at(-1);
  const up = group.reduce((sum, item) => sum + item.y, 0) / group.length > staffY + 20;
  const direction = up ? 1 : -1;
  const shift = direction * stemOffset;
  const layerGap = 4.6;
  const slope = Math.max(-6, Math.min(6, last.y - first.y)) / (last.x - first.x);
  const edges = group.map((item) => item.y - direction * (29 + (beamLevels(item.note) - 1) * layerGap) - slope * (item.x - first.x));
  const base = up ? Math.min(...edges) : Math.max(...edges);
  for (const item of group) {
    item.beamUp = up;
    item.beam = base + slope * (item.x - first.x);
  }
  let drawing = "";
  for (let level = 1; level <= 3; level++) {
    for (const [index, item] of group.entries()) {
      if (beamLevels(item.note) < level) continue;
      const prev = group[index - 1];
      const next = group[index + 1];
      const x = item.x + shift;
      const y = item.beam + direction * (level - 1) * layerGap;
      let dx;
      if (next && beamLevels(next.note) >= level) dx = next.x - item.x;
      else if (!prev || beamLevels(prev.note) < level) {
        // An isolated secondary beam points toward its rhythmic subdivision, or inward at the ends.
        const subdivision = 48 / 2 ** (level - 1);
        const toward = !next || (prev && Math.floor(prev.beat / subdivision) === Math.floor(item.beat / subdivision)) ? prev : next;
        const distance = toward.x - item.x;
        dx = Math.sign(distance) * Math.min(10, Math.abs(distance) * .42);
      } else continue;
      drawing += `<path class="staff-beam" data-beam-level="${level}" d="M${x} ${y}L${x + dx} ${y + slope * dx}" fill="none" stroke="var(--score-ink, #354036)" stroke-width="3.2" pointer-events="none"/>`;
    }
  }
  return drawing;
}

function drawRhythm(notePositions, staffY, meter, insertAt, numbered) {
  const tuplets = [];
  for (let n = 0; n + 2 < notePositions.length; n++) {
    const group = notePositions.slice(n, n + 3);
    if (!group.every(({ note }) => note.triplet && note.duration === group[0].note.duration) ||
        (insertAt > n && insertAt <= n + 2)) continue;
    group.forEach((item) => { item.tupletGroup = n + 1; });
    tuplets.push(group);
    n += 2;
  }
  const beatUnits = meter === "6/8" ? 72 : 48;
  let drawing = "";
  for (let start = 0; !numbered && start < notePositions.length;) {
    const first = notePositions[start];
    let end = start + 1;
    if (beamLevels(first.note)) {
      const beatEnd = (Math.floor(first.beat / beatUnits) + 1) * beatUnits;
      for (; end < notePositions.length && end !== insertAt; end++) {
        const item = notePositions[end];
        if (!beamLevels(item.note)) break;
        const sameGroup = first.tupletGroup ? first.tupletGroup === item.tupletGroup :
          !item.tupletGroup && !first.note.triplet && !item.note.triplet && item.beat + noteUnits(item.note) <= beatEnd;
        if (!sameGroup) break;
      }
      if (end - start > 1) drawing += drawBeamGroup(notePositions.slice(start, end), staffY);
    }
    start = end;
  }
  for (const group of tuplets) {
    const first = group[0].x - 5;
    const last = group[2].x + 5;
    const middle = (first + last) / 2;
    const top = numbered ? 27 : Math.max(8, Math.min(25, ...group.map((item) => item.beamUp ? item.beam - 9 : item.y - 14)));
    drawing += `<path d="M${first} ${top + 5}v-5H${middle - 6}M${middle + 6} ${top}H${last}v5" fill="none" stroke="var(--score-rhythm, #64755e)"/>` +
      glyph("tuplet3", middle - 3.2, top + 3, "var(--score-ink, #354036)", .6);
  }
  return drawing;
}

function barDrawing(bar, b, x1, x2, { staff, numbered, buttons, prefix, spacing, staffY, badgeY, previousAnchor, endsSystem }) {
  const pitched = staff || numbered;
  const end = buttons ? badgeY + 50 : badgeY;
  const start = x1 + prefix;
  const selectedBar = b === position.b;
  const { tail, insertAt, gap, cells, cellWidth, weight } = spacing;
  const inserting = insertAt !== -1;
  const empty = b === score.bars.length;
  const slotHalf = slotWidth / 2;
  const targetTop = pitched ? 26 : 21;
  const stretch = Math.max(0, x2 - start - cellWidth - gap - 18 - (tail ? slotWidth + 12 : 0));
  let beatsUsed = 0;
  let cellStart = start + 9;
  let drawing = svgText(empty ? (b + 1) + " · " + tr("空小节") : b + 1, start + 1, 19, 'font-size="11" font-weight="700" fill="var(--score-label, #788071)"');
  const barlineTop = staff ? staffY : numbered ? 38 : 25;
  const barlineBottom = staff ? staffY + 40 : numbered ? end - 5 : badgeY + 43;
  drawing += '<path d="M' + x2 + ' ' + barlineTop + 'V' + barlineBottom + '" stroke="var(--score-barline, #929981)" stroke-width="1.15"/>';
  const notePositions = [];
  const accidentals = new Map();
  const flat = score.key === "F" || score.key.includes("♭");
  const sign = flat ? "♭" : "♯";
  for (const [n, note] of bar.entries()) {
    const cell = cells[n];
    const extra = stretch * cell.weight / weight;
    if (n === insertAt) cellStart += gap;
    const x = cellStart + cell.left + extra / 2;
    const name = note.kind === "rest" ? "" : spelling(note.pitch);
    notePositions.push({ n, note, x, name, cellStart, beat: beatsUsed, y: staff && name ? noteY(name, staffY) : staffY + 20 });
    beatsUsed += noteUnits(note);
    cellStart += cell.left + cell.right + extra;
  }
  const midpoint = (a, b) => (a + b) / 2;
  let slotX = null;
  if (inserting) {
    slotX = numbered || insertAt === 0 ? notePositions[insertAt].cellStart - gap / 2 :
      midpoint(notePositions[insertAt - 1].x, notePositions[insertAt].x);
  }
  const tailStart = bar.length ? Math.min(x2 - slotWidth - 6, notePositions.at(-1).x + cells.at(-1).right + 3) : start;
  const tailX = tail ? tailStart + slotHalf + 3 : null;
  const rhythm = pitched ? drawRhythm(notePositions, staffY, score.meter, insertAt, numbered) : "";
  for (const [index, item] of notePositions.entries()) {
    const { n, note, x, y, name } = item;
    const prev = notePositions[index - 1];
    const next = notePositions[index + 1];
    const left = inserting && n === position.n ? slotX + slotHalf : prev ? numbered ? item.cellStart : midpoint(prev.x, x) : start;
    const right = inserting && n === position.n - 1 ? slotX - slotHalf : next ? numbered ? next.cellStart : midpoint(next.x, x) : tail ? tailStart : x2;
    const width = Math.max(3, right - left);
    const selected = selectedBar && n === position.n && !position.slot;
    const batchSelected = selectedNotes.has(`${b}:${n}`);
    const color = "var(--score-ink, #354036)";
    const label = (numbered && name ? pitchInputLabel(note.pitch).text : name || tr("休止")) + " · " + tr(durationNames[note.duration]);
    drawing += '<g class="target' + (selected ? " selected" : "") + (batchSelected ? " batch-selected" : "") + '" data-bar="' + b + '" data-note="' + n + '" tabindex="-1" role="button" aria-label="' + label + '"><rect x="' + left + '" y="' + targetTop + '" width="' + width + '" height="' + (end - targetTop) + '" fill="transparent"/>';
    drawing += `<rect class="playback-frame" x="${x - 21}" y="${targetTop}" width="${buttons ? 51 : 43}" height="${end - targetTop - 2}" rx="4" aria-hidden="true"/>`;
    if (staff) {
      if (note.kind === "rest") drawing += drawRest(note.duration, x, y, color);
      else {
        for (let ledgerY = staffY + 50; ledgerY <= y; ledgerY += 10) drawing += '<path d="M' + (x - 9) + ' ' + ledgerY + 'h18" stroke="' + color + '"/>';
        for (let ledgerY = staffY - 10; ledgerY >= y; ledgerY -= 10) drawing += '<path d="M' + (x - 9) + ' ' + ledgerY + 'h18" stroke="' + color + '"/>';
        const step = name.replace(/[♯♭]/, "");
        const priorSign = accidentals.get(step) ?? (keySignatures[score.key].includes(name[0]) ? sign : "");
        const noteSign = name[1] === "♯" || name[1] === "♭" ? name[1] : "";
        if (priorSign !== noteSign) {
          drawing += svgText(noteSign || "♮", x - 15, y + 4, 'font-size="15" fill="' + color + '"');
          accidentals.set(step, noteSign);
        }
        drawing += drawNote(note, x, y, color, item.beamUp ?? y > staffY + 20, item.beam);
      }
      if (note.dotted) drawing += '<circle cx="' + (x + 9) + '" cy="' + (y % 10 === staffY % 10 ? y - 3 : y) + '" r="1.6" fill="' + color + '"/>';
      drawing += note.kind === "rest" ? restFrame(note.duration, x, y) : cursorFrame(x, y - 8, note.duration === 1 ? 23 : 20, 16);
    } else if (numbered) {
      drawing += drawNumberedNote(note, x, y, color);
      drawing += cursorFrame(x, y - 17, 24, 23);
    }
    if (pitched && note.triplet && !item.tupletGroup) drawing += glyph("tuplet3", x - 3.2, 30, color, .6);
    if (pitched && note.kind === "tie" && previousNote(b, n)?.pitch === note.pitch) {
      const source = prev ?? previousAnchor;
      const tieY = numbered ? y - 30 : y;
      drawing += source ? tieArc(source.x, x, tieY, staffY) : tieArc(start, x, tieY, staffY, "incoming");
    }
    if (buttons) {
      drawing += badge(note, x, badgeY, !numbered, fingeringSource(b, n));
      drawing += cursorFrame(x, badgeY - 1, 28, 30);
      if (!numbered && note.kind === "note" && note.duration >= 8) drawing += '<path d="M' + (x - 6) + ' ' + (badgeY + 44) + 'h12' + 'm-12 2.5h12'.repeat(Math.log2(note.duration) - 3) + '" stroke="var(--score-rhythm, #758171)" stroke-linecap="round" stroke-width="1.15"/>';
    }
    if (cells[n].annotation) drawing += drawAnnotation(cells[n].annotation, x, end + 15);
    drawing += "</g>";
  }
  const lastAnchor = notePositions.at(-1);
  const continuation = score.bars[b + 1]?.[0];
  if (pitched && endsSystem && continuation?.kind === "tie" && lastAnchor &&
      previousNote(b + 1, 0)?.pitch === continuation.pitch) {
    drawing += tieArc(lastAnchor.x, x2 - 2, numbered ? lastAnchor.y - 30 : lastAnchor.y, staffY, "outgoing");
  }
  drawing += rhythm;
  const drawSlot = (n, slot, cursorX, hitLeft, hitRight) => {
    const isNewBar = empty && slot === "tail";
    const my = staffY + 20;
    const selected = selectedBar && position.slot === slot;
    const label = slot === "insert" ? tr("插入空档") : tr("第 {bar} 小节末尾输入", { bar: b + 1 });
    const hitTop = isNewBar ? 5 : targetTop;
    // The measure can be clicked across its remaining space. Only the beat cursor is visible.
    drawing += '<g class="target score-slot' + (selected ? " selected" : isNewBar ? " new-bar-slot" : "") + '" data-bar="' + b + '" data-note="' + n + '" data-slot="' + slot + '" tabindex="-1" role="button" aria-label="' + label + '"><rect class="slot-hit-area" x="' + hitLeft + '" y="' + hitTop + '" width="' + (hitRight - hitLeft) + '" height="' + (end - hitTop) + '" fill="none" pointer-events="all"/>';
    if (pitched) {
      drawing += cursorFrame(cursorX, numbered ? my - 17 : my - slotHalf, slotWidth, slotWidth);
      if (selected) {
        const color = "var(--score-ink, #354036)";
        drawing += '<g class="pending-rest" aria-hidden="true" pointer-events="none">' + (numbered ?
          drawNumberedNote(newNote(null, duration, { kind: "rest", dotted }), cursorX, my, color, true) :
          drawRest(duration, cursorX, my, color));
        if (staff && dotted) drawing += '<circle cx="' + (cursorX + 9) + '" cy="' + (my - 3) + '" r="1.6" fill="var(--score-ink, #354036)"/>';
        if (triplet) drawing += glyph("tuplet3", cursorX - 3.2, 30, "var(--score-ink, #354036)", .6);
        drawing += "</g>";
      }
    }
    if (buttons) {
      drawing += cursorFrame(cursorX, badgeY + 13 - slotHalf, slotWidth, slotWidth);
      if (selected) drawing += '<g class="pending-rest" aria-hidden="true">' + restBadge(cursorX, badgeY) + "</g>";
    }
    drawing += "</g>";
  };
  if (inserting) drawSlot(insertAt, "insert", slotX, slotX - slotHalf, slotX + slotHalf);
  if (tail) drawSlot(bar.length, "tail", tailX, tailStart, x2 - 2);
  const hitArea = `<rect x="${x1}" y="0" width="${x2 - x1}" height="${end}" fill="none" pointer-events="all"/>`;
  return { drawing: `<g data-measure="${b}">${hitArea}${drawing}</g>`, lastAnchor, noteXs: notePositions.map(({ x }) => x), tailX };
}

let sounding = null;
let playbackLayout = [];
function renderNotation() {
  const notation = $("notation");
  if (!notation.clientWidth) return;
  const style = getComputedStyle(notation);
  const available = Math.floor(notation.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
  const numbered = display !== "buttons" && pitchDisplay === "relative";
  const staff = display !== "buttons" && !numbered;
  const buttons = display !== "staff";
  const rows = [];
  const layout = [];
  const barsPerRow = available < 560 ? 1 : 2;
  const displayedBars = [...score.bars, []];
  const signatureWidth = keySignatures[score.key].length * 9;
  for (let b = 0; b < displayedBars.length;) {
    const count = barsPerRow === 2 && displayedBars.length - b === 3 ? 3 : barsPerRow;
    const selectedBars = displayedBars.slice(b, b + count);
    const spacings = selectedBars.map((bar, index) => measureSpacing(bar, b + index, staff, buttons, numbered));
    const annotationHeight = annotationLineHeight * Math.max(0,
      ...spacings.flatMap(({ cells }) => cells.map(({ annotation }) => annotation?.lines.length ?? 0)));
    const noteYs = staff ? selectedBars.flat().filter((note) => note.kind !== "rest").map((note) => noteY(spelling(note.pitch), 0)) : [];
    const staffY = numbered ? 54 : 48 + Math.max(0, -Math.min(0, ...noteYs));
    const badgeY = staff ? staffY + 63 + Math.max(0, Math.max(40, ...noteYs) - 40) : numbered ? 115 : 33;
    const musicHeight = badgeY + (buttons ? 52 : 4);
    const height = musicHeight + annotationHeight;
    const left = 4;
    const prefix = staff ? signatureWidth + (b === 0 ? 69 : 49) : numbered && b === 0 ? 69 : 10;
    const minimum = left + 8 + prefix + 6 * (spacings.length - 1) + spacings.reduce((sum, spacing) => sum + spacing.minWidth, 0);
    const width = Math.max(available, minimum);
    const right = width - 8;
    const total = spacings.reduce((sum, spacing) => sum + Math.max(2, spacing.weight), 0);
    let staves = "";
    let drawing = staff ? staffSignature(left + 4, staffY, b === 0) : "";
    if (numbered && b === 0) drawing += svgText(`1 = ${score.key}4`, left + 2, 19, 'font-size="12" font-weight="700"');
    let previousAnchor;
    let x = left;
    selectedBars.forEach((bar, index) => {
      const inset = index === 0 ? prefix : 6;
      const endsSystem = index === selectedBars.length - 1;
      const spacing = spacings[index];
      const end = endsSystem ? right : x + inset + spacing.minWidth + (width - minimum) * Math.max(2, spacing.weight) / total;
      const error = b + index < score.bars.length && barUnits(bar) !== meterUnits[score.meter];
      if (staff) {
        const lines = Array.from({ length: 5 }, (_, n) => "M" + x + " " + (staffY + 10 * n) + "H" + end).join(" ");
        staves += '<path class="staff-lines' + (error ? " error" : "") + '" data-staff-bar="' + (b + index) + '" d="' + lines +
          '" stroke="' + (error ? "var(--score-error, #c63832)" : "var(--score-rule, #929985)") + '" stroke-width="' + (error ? "1.1" : ".85") + '" fill="none" pointer-events="none"/>';
      } else if (numbered && error) {
        staves += `<path class="numbered-measure-error" d="M${x} ${badgeY - 2}H${end}" stroke="var(--score-error, #c63832)" stroke-width="1.1" pointer-events="none"/>`;
      }
      const contents = barDrawing(bar, b + index, x, end, { staff, numbered, buttons, prefix: inset, spacing, staffY, badgeY, previousAnchor, endsSystem });
      drawing += contents.drawing;
      layout.push({ row: rows.length, right: end - 2, noteXs: contents.noteXs, tailX: contents.tailX });
      previousAnchor = contents.lastAnchor;
      x = end;
    });
    const marker = `<line class="playhead" x1="0" x2="0" y1="${staff || numbered ? 26 : 21}" y2="${musicHeight - 5}" visibility="hidden" aria-hidden="true"/>`;
    const label = tr("第 {first} 至 {last} 小节", { first: b + 1, last: b + selectedBars.length });
    rows.push(`<svg viewBox="0 0 ${width} ${height}" style="height:${height}px;min-width:${width}px" aria-label="${label}" fill="var(--ink)">` + staves + drawing + marker + "</svg>");
    b += selectedBars.length;
  }
  playbackLayout = layout;
  notation.innerHTML = rows.join("");
  showSounding();
  updatePlayhead();
}

function drawController() {
  const [L, R, A, Y, X] = natural;
  const shoulder = (x, shape, key) => '<path d="' + shape + '" fill="' + key.color + '"/>' + svgText(key.code, x, 26, 'text-anchor="middle" fill="' + (key.ink ?? "#fffbed") + '" font-size="11" font-weight="700"');
  const face = (x, y, key) => '<circle cx="' + x + '" cy="' + (y + 1.5) + '" r="8.7" fill="#1f2923"/><circle cx="' + x + '" cy="' + y + '" r="8" fill="' + key.color + '"/>' +
    svgText(key.code, x, y + 3.5, 'text-anchor="middle" fill="' + (key.ink ?? "#fffbed") + '" font-size="10.5" font-weight="700"');
  const stick = (x, y) => '<g transform="translate(' + x + ' ' + y + ')"><circle r="16" fill="#25332c" stroke="#899084"/><circle cy="-1" r="12.2" fill="#48574d"/><circle cy="-1" r="9.5" fill="#5a675b" stroke="#34463a"/></g>';
  const mini = (x, y, name) => '<circle cx="' + x + '" cy="' + y + '" r="5.2" fill="#29372e" stroke="#879183" stroke-width=".6"/>' +
    svgText(name, x, y + 2.8, 'text-anchor="middle" fill="#d9dccf" font-size="8" font-weight="700"');
  $("pad-figure").innerHTML = '<svg viewBox="0 0 250 166" role="img" aria-label="' + tr("Switch 2 Pro Controller 正面按键分布") + '">' +
    '<defs><linearGradient id="pad-body-fill" x2="0" y2="1"><stop stop-color="#46534a"/><stop offset="1" stop-color="#283a30"/></linearGradient></defs>' +
    '<path d="M21 40Q28 17 51 14L83 12 93 27h64l10-15 32 2q23 3 30 26l-9 16H30Z" fill="#a9ada2" stroke="#75867a" stroke-width="1.4"/>' +
    shoulder(55, "M32 27Q40 16 56 16l26-2 6 15H32Z", L) + shoulder(195, "M218 27q-8-11-24-11l-26-2-6 15h56Z", R) +
    '<path d="M51 29h148c23 0 34 13 38 31l9 50c3 19 0 35-12 39-12 5-23-2-33-15l-15-20c-5-7-10-11-18-11-24 4-59 4-86 0-8-1-13 4-18 11l-15 20c-10 13-21 20-33 15C4 145 1 129 4 110l9-50c4-18 15-31 38-31Z" fill="url(#pad-body-fill)" stroke="#25362c" stroke-width="1.8"/>' +
    '<path d="M22 63c3-13 9-20 17-24M228 63c-3-13-9-20-17-24M15 115c-1 10 0 18 5 23m215-23c1 10 0 18-5 23" fill="none" stroke="#a7b29f" stroke-opacity=".39" stroke-linecap="round"/>' +
    stick(57, 55) + stick(166, 88) +
    '<path d="M74 76h9v8h8v9h-8v8h-9v-8h-8v-9h8Z" fill="#25332b" stroke="#a2ac9d" stroke-width=".7"/>' +
    face(193, 47, X) + face(177, 61, Y) + face(209, 61, A) + face(193, 75, { code: "B", color: "#57665b" }) +
    mini(97, 46, "−") + mini(151, 46, "+") + mini(102, 70, "◉") + mini(145, 70, "⌂") + mini(138, 88, "C") +
    '<path d="M116 59l8-10 8 10-8 9Z" fill="none" stroke="#c5aa69" stroke-width="1.1"/><path d="M113 91h3m3 0h3m3 0h3" stroke="#a6c48b" stroke-linecap="round"/>' +
    '</svg>';
  $("natural-keys").innerHTML = natural.map((item) => '<button data-listen="' + item.pitch + '" title="' +
    tr("试听 {pitch}", { pitch: pitchLabel(item.pitch) }) + '">' + cap(item) + pitchLabel(item.pitch) + '</button>').join("");
}

function renderGuide() {
  all("[data-bend-example]").forEach((element) => {
    const type = element.dataset.bendExample;
    element.innerHTML = type === "both" ? modifierIcon("stick", 1) + modifierIcon("dpad", 1) : modifierIcon(type, 1);
  });
  const rows = pitches.map((pitch) => {
    const options = fingerings.get(pitch);
    const render = (item) => item.code + (instructions(item) ? " + " + instructions(item) : "");
    const recommended = options[0];
    return '<tr><td><button class="guide-pitch" data-listen="' + pitch + '">' + pitchLabel(pitch) + '</button></td><td><span class="guide-fingering">' +
      cap(recommended) + '<strong>' + (instructions(recommended) || tr("原音")) + '</strong></span></td><td>' +
      (options.slice(1).map(render).join(uiLanguage === "en" ? ", " : "、") || "—") + '</td></tr>';
  });
  $("guide-table").innerHTML = '<table><thead><tr>' + ["音高", "推荐按法", "其他按法"].map((title) => '<th>' + tr(title) + '</th>').join("") +
    '</tr></thead><tbody>' + rows.join("") + '</tbody></table>';
}

const pitchDisplayPreference = "ocarina-pitch-display-v1";
let pitchDisplay = readPreference(pitchDisplayPreference) === "relative" ? "relative" : "absolute";
let renderedPitchDisplay = "";

function drawKeyboard() {
  const white = pianoPitches.filter((pitch) => pitchLabel(pitch).length === 2);
  const black = pianoPitches.filter((pitch) => pitchLabel(pitch).length === 3);
  const key = (pitch, type, style = "") => '<button type="button" class="piano ' + type + (fingerings.has(pitch) ? "" : " outside") + '" data-pitch="' + pitch + '" ' + style + '></button>';
  $("keyboard").innerHTML = white.map((pitch) => key(pitch, "white")).join("") + black.map((pitch) =>
    key(pitch, "black", 'style="left:' + (white.filter((value) => value < pitch).length * 100 / white.length) + '%"')
  ).join("");
}

function scaleDegree(pitch) {
  const distance = pitch - tonicPitch(score.key);
  const octave = Math.floor(distance / 12);
  const semitone = distance - octave * 12;
  let degree = majorScale.indexOf(semitone);
  let accidental = "";
  if (degree === -1) {
    const above = majorScale.indexOf(semitone + 1);
    const upperLetter = diatonicLetters[(diatonicLetters.indexOf(score.key[0]) + above) % 7];
    const flatten = spelling(pitch)[0] === upperLetter;
    degree = flatten ? above : above - 1;
    accidental = flatten ? "♭" : "♯";
  }
  return { number: degree + 1, accidental, octave };
}

function pitchInputLabel(pitch, absolute = pitchDisplay === "relative" ? spelling(pitch) : pitchLabel(pitch)) {
  if (pitchDisplay === "absolute") return { html: absolute, text: absolute };
  const { number, accidental, octave } = scaleDegree(pitch);
  const dots = octave ? `<span class="octave-dots ${octave > 0 ? "above" : "below"}">${"<span></span>".repeat(Math.abs(octave))}</span>` : "";
  const html = `<span class="numbered-pitch" aria-hidden="true">${accidental}<span class="numbered-digit">${number}${dots}</span></span>`;
  const register = octave ? " · " + tr("八度 {offset}", { offset: octave > 0 ? "+" + octave : "−" + Math.abs(octave) }) : "";
  return { html, text: accidental + number + register + " · " + absolute };
}

function renderPitchInput() {
  const state = [pitchDisplay, score.key, uiLanguage].join("/");
  if (state === renderedPitchDisplay) return;
  renderedPitchDisplay = state;
  $("keyboard").dataset.pitchDisplay = pitchDisplay;
  $("pitch-input-reference").textContent = pitchDisplay === "relative" ? `1 = ${score.key}4` : "F3–B5";
  document.querySelector('[data-display="staff"]').textContent = tr(pitchDisplay === "relative" ? "简谱" : "五线谱");
  for (const button of all("button[data-pitch-display]")) {
    button.setAttribute("aria-pressed", button.dataset.pitchDisplay === pitchDisplay);
  }
  for (const key of all("#keyboard [data-pitch]")) {
    const pitch = Number(key.dataset.pitch);
    const { html, text } = pitchInputLabel(pitch);
    key.innerHTML = html;
    key.title = text + (fingerings.has(pitch) ? "" : " · " + tr("无游戏按法"));
    key.setAttribute("aria-label", key.title);
  }
  document.dispatchEvent(new Event("ocarina-pitch-labels-change"));
}

function rhythmText({ duration, dotted, triplet }) {
  let label = tr(durationNames[duration]);
  if (dotted) label = tr("附点{duration}", { duration: label });
  return triplet ? tr("{duration}三连音", { duration: label }) : label;
}

function renderControls() {
  const note = noteAt();
  const bar = score.bars[position.b];
  const hasRange = selectedNotes.size > 1;
  const range = hasRange ? notesInSelection() : [];
  const annotationTool = $("note-annotation");
  annotationTool.disabled = !note || hasRange;
  annotationTool.classList.toggle("has-annotation", Boolean(note?.annotation) && !hasRange);
  $("measure-count").textContent = barCount(score.bars.length);
  const optimizeButton = $("optimize-fingering");
  const hasAlternative = (note) => note?.kind === "note" && (fingerings.get(note.pitch)?.length ?? 0) > 1;
  optimizeButton.disabled = !(hasRange ? range.some(hasAlternative) : score.bars.some((bar) => bar.some(hasAlternative)));
  optimizeButton.querySelector("span").textContent = hasRange ? tr("优化所选按法") : tr("自动优化按法");
  optimizeButton.title = hasRange ? tr("优化选区内音符的按法，支持撤销") : tr("优化整首曲谱的换键，支持撤销");
  const deleteButton = $("delete");
  const isRest = note?.kind === "rest";
  const emptyMeasure = bar?.length === 0;
  deleteButton.disabled = !note && !emptyMeasure && !hasRange;
  deleteButton.querySelector("span").textContent = hasRange ? tr("删除所选") : emptyMeasure ? tr("删除小节") : isRest ? tr("删除休止") : tr("转为休止");
  deleteButton.title = tr(hasRange ? "移除选中的全部音符" : emptyMeasure ? "删除空小节" : isRest ? "删除休止符" : "转为等时值休止符") +
    (uiLanguage === "en" ? " (Delete / Backspace)" : "（Delete / Backspace）");
  $("position").textContent = tr("第 {bar} 小节", { bar: position.b + 1 });
  $("bar-number").textContent = tr("当前小节 {bar}", { bar: position.b + 1 });
  const unitsPerBeat = 192 / Number(score.meter.split("/")[1]);
  const total = barUnits(bar ?? []) / unitsPerBeat;
  const capacity = meterUnits[score.meter] / unitsPerBeat;
  const format = (value) => Number(value.toFixed(3)).toString();
  $("bar-duration").textContent = format(total) + " / " + beatCount(capacity);
  const warning = $("bar-warning");
  warning.textContent = !bar ? tr("空小节") : total === capacity ? tr("正常") :
    tr(total > capacity ? "多 {count} 拍" : "少 {count} 拍", { count: format(Math.abs(total - capacity)) });
  warning.classList.toggle("error", Boolean(bar) && total !== capacity);
  const uniformDuration = range.every((entry) => entry.duration === duration);
  const flagState = (field, value) => range.some((entry) => entry[field] !== value) ? "mixed" : value;
  const dotState = flagState("dotted", dotted);
  const tripletState = flagState("triplet", triplet);
  const rhythmLabel = rhythmText({ duration, dotted, triplet });
  const entryBeats = noteUnits({ duration, dotted, triplet }) / unitsPerBeat;
  const entryLabel = uniformDuration && dotState !== "mixed" && tripletState !== "mixed" ? rhythmLabel + " / " + beatCount(format(entryBeats)) : tr("混合时值");
  $("entry-duration").textContent = tr(position.slot ? "输入时值" : "选中时值") + " · " + entryLabel;
  $("dot").setAttribute("aria-pressed", dotState);
  $("triplet").setAttribute("aria-pressed", tripletState);
  all("[data-duration]").forEach((button) => button.setAttribute("aria-pressed", uniformDuration && Number(button.dataset.duration) === duration));
  let detail = '<span>' + tr("待输入") + '</span>';
  if (note?.kind === "rest") detail = '<strong class="pitch">' + tr("休止") + '</strong><span>' + rhythmText(note) + '</span>';
  else if (note) {
    const source = fingeringSource(position.b, position.n);
    const fingering = fingeringFor(source ?? note);
    const rhythm = rhythmText(note);
    detail = '<strong class="pitch">' + spelling(note.pitch) + '</strong><span>' + rhythm + '</span>';
    if (fingering) {
      const label = instructions(fingering) || tr("原音");
      const content = cap(fingering) + '<strong>' + (note.kind === "tie" ? tr("延音") + " · " : "") + label + '</strong>';
      detail += source && fingerings.get(source.pitch)?.length > 1
        ? '<button type="button" class="inspector-fingering" aria-haspopup="dialog" aria-controls="fingering-panel" aria-expanded="false" aria-label="' +
          tr("编辑按键，当前 {fingering}", { fingering: fingering.code + " · " + label }) + '" title="' + tr("编辑按键") + '">' + content + icon("chevron-down") + '</button>'
        : '<span class="inspector-fingering">' + content + '</span>';
    } else detail += '<strong>' + tr("无游戏按法") + '</strong>';
  }
  if (selectedNotes.size > 1) detail = `<strong>${tr("已选中 {count} 个音符", { count: selectedNotes.size })}</strong>`;
  $("inspector-detail").innerHTML = detail;
  updateStatus();
}

function selectedFingeringSource() {
  if (position.slot || selectedNotes.size > 1) return undefined;
  return fingeringSource(position.b, position.n);
}

const fingeringPanel = $("fingering-panel");
const fingeringHandle = $("fingering-handle");
let fingeringAnchor = null;
let fingeringDrag = null;
let fingeringMoved = false;

function moveFingeringPanel(x, y) {
  const margin = 8;
  fingeringPanel.style.left = Math.max(margin, Math.min(x, innerWidth - fingeringPanel.offsetWidth - margin)) + "px";
  fingeringPanel.style.top = Math.max(margin, Math.min(y, innerHeight - fingeringPanel.offsetHeight - margin)) + "px";
}

function placeFingeringPanel(makeRoom = false) {
  if (!fingeringAnchor?.isConnected) return closeFingeringEditor();
  const inspector = fingeringAnchor.matches(".inspector-fingering");
  const gap = inspector ? 7 : 18;
  const height = fingeringPanel.offsetHeight;
  let bounds = fingeringAnchor.getBoundingClientRect();
  const overflow = bounds.bottom + gap + height + 8 - innerHeight;
  if (makeRoom && inspector && overflow > 0) {
    window.scrollBy({ top: overflow, behavior: "instant" });
    bounds = fingeringAnchor.getBoundingClientRect();
  }
  const below = bounds.bottom + gap;
  const top = below + height + 8 <= innerHeight ? below : bounds.top - gap - height;
  moveFingeringPanel(inspector ? bounds.right - fingeringPanel.offsetWidth : bounds.left, top);
}

function focusFingeringInvoker(inspector) {
  if (inspector) $("inspector-detail").querySelector("button.inspector-fingering")?.focus({ preventScroll: true });
  else focusCursor();
}

function closeFingeringEditor(returnFocus = false) {
  if (fingeringPanel.hidden) return;
  const inspector = fingeringAnchor?.matches(".inspector-fingering");
  if (inspector) fingeringAnchor.setAttribute("aria-expanded", "false");
  fingeringPanel.hidden = true;
  fingeringAnchor = null;
  fingeringDrag = null;
  fingeringMoved = false;
  fingeringHandle.classList.remove("dragging");
  if (returnFocus) focusFingeringInvoker(inspector);
}

function openFingeringEditor(anchor) {
  if (!anchor) return;
  if (anchor === fingeringAnchor) return closeFingeringEditor(true);
  closeFingeringEditor();
  const source = selectedFingeringSource();
  const choices = source && fingerings.get(source.pitch);
  if (!choices || choices.length < 2) return;
  const inspector = anchor.matches(".inspector-fingering");
  const current = fingeringFor(source);
  const options = $("fingering-options");
  const tied = noteAt().kind === "tie";
  $("fingering-description").textContent = `${spelling(source.pitch)} · ${tied ? tr("延音沿用起音的按法") : tr("选择更顺手的按法")}`;
  options.replaceChildren(...choices.map((choice, index) => {
    const active = choice === current;
    const recommended = index === 0;
    const label = instructions(choice) || tr("原音");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "fingering-option";
    button.setAttribute("aria-pressed", String(active));
    button.innerHTML = cap(choice) + `<span>${label}</span>` +
      (active || recommended ? `<small>${active ? tr("当前") : ""}${active && recommended ? " · " : ""}${recommended ? tr("默认") : ""}</small>` : "");
    button.onclick = () => {
      closeFingeringEditor();
      if (!active && selectedFingeringSource() === source) {
        updateHistory(() => { rememberFingering(source, choice); });
      }
      focusFingeringInvoker(inspector);
    };
    return button;
  }));
  fingeringAnchor = anchor;
  if (inspector) anchor.setAttribute("aria-expanded", "true");
  fingeringPanel.hidden = false;
  placeFingeringPanel(true);
  options.querySelector('[aria-pressed="true"]')?.focus({ preventScroll: true });
}

$("inspector-detail").addEventListener("click", (event) => {
  const button = event.target.closest("button.inspector-fingering");
  if (button) openFingeringEditor(button);
});
$("close-fingering").onclick = () => closeFingeringEditor(true);
$("optimize-fingering").onclick = optimizeFingerings;

fingeringHandle.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || event.target.closest("button")) return;
  const bounds = fingeringPanel.getBoundingClientRect();
  fingeringDrag = { id: event.pointerId, x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  fingeringHandle.setPointerCapture(event.pointerId);
  fingeringHandle.classList.add("dragging");
  event.preventDefault();
});
fingeringHandle.addEventListener("pointermove", (event) => {
  if (fingeringDrag?.id !== event.pointerId) return;
  fingeringMoved = true;
  moveFingeringPanel(event.clientX - fingeringDrag.x, event.clientY - fingeringDrag.y);
});
fingeringHandle.addEventListener("lostpointercapture", () => {
  fingeringDrag = null;
  fingeringHandle.classList.remove("dragging");
});
window.addEventListener("scroll", () => {
  if (!fingeringPanel.hidden && !fingeringMoved && !fingeringDrag) placeFingeringPanel();
}, true);
window.addEventListener("resize", () => {
  if (fingeringPanel.hidden) return;
  if (fingeringMoved) moveFingeringPanel(fingeringPanel.offsetLeft, fingeringPanel.offsetTop);
  else placeFingeringPanel();
});

function refresh() {
  closeFingeringEditor();
  $("title").value = $("title-width").textContent = scoreTitle(score);
  $("author").value = score.author;
  $("bpm").value = score.bpm;
  $("meter").value = score.meter;
  $("key").value = score.key;
  renderSwingValue();
  $("loop").value = score.loop;
  const barOptions = score.bars.map((_, i) => '<option value="' + i + '">' + (i + 1) + '</option>').join("");
  $("loop-range").hidden = score.loop !== "section";
  $("loop-start").innerHTML = $("loop-end").innerHTML = barOptions;
  $("loop-start").value = Math.min(score.loopStart, Math.max(0, score.bars.length - 1));
  $("loop-end").value = Math.min(score.loopEnd, Math.max(0, score.bars.length - 1));
  renderNotation();
  renderControls();
  renderPitchInput();
  renderPlayback();
}

function renderSwingValue() {
  const swing = swingPatterns[score.swing];
  const title = tr(swing.title);
  const unit = tr(durationNames[swing.duration]);
  $("swing-value").textContent = swing.duration ? (uiLanguage === "en" ? `${title} (${unit})` : `${title}（${unit}）`) : title;
}

let audio;
let masterVolume;
let playback = null;
let offset = 0;
let frame;
let soundingElement;
let playheadElement;

// MIDI root and PCM frame offsets in the bundled FreePats recording bank.
const ocarinaSamples = [
  [66, 0, 7402, 22513],
  [73, 22519, 42298, 97796],
  [74, 97802, 109503, 135459],
  [76, 135465, 143799, 167093],
  [77, 167099, 208197, 270221],
  [81, 270227, 305375, 379614],
  [83, 379620, 386499, 420377],
  [88, 420383, 422281, 451689]
];
const ocarinaSampleRate = 24000;
let ocarinaBuffer;

async function loadOcarinaSamples() {
  try {
    const response = await fetch("assets/ocarina.wav");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const decoder = new OfflineAudioContext(1, 1, ocarinaSampleRate);
    ocarinaBuffer = await decoder.decodeAudioData(await response.arrayBuffer());
  } catch (error) {
    console.warn("陶笛采样加载失败，使用合成音色。", error);
  }
}
void loadOcarinaSamples();

function audioContext() {
  if (!audio) {
    audio = new AudioContext();
    masterVolume = audio.createGain();
    masterVolume.gain.value = Number($("volume").value) / 100;
    masterVolume.connect(audio.destination);
  }
  if (audio.state === "suspended") void audio.resume();
  return audio;
}
function setupVolume() {
  const input = $("volume");
  const preference = "ocarina-volume-v1";
  try {
    const saved = localStorage.getItem(preference);
    if (saved !== null && Number.isFinite(Number(saved))) input.value = saved;
  } catch { /* Volume still works without browser preference storage. */ }
  input.oninput = () => {
    $("volume-value").value = input.value + "%";
    if (!masterVolume) return;
    const gain = masterVolume.gain;
    const now = audio.currentTime;
    const level = Number(input.value) / 100;
    gain.cancelScheduledValues(now);
    gain.setTargetAtTime(level, now, .012);
    gain.setValueAtTime(level, now + .084);
  };
  input.onchange = () => {
    try { localStorage.setItem(preference, input.value); }
    catch { /* Keep the current volume until the page closes. */ }
  };
  input.oninput();
}
function pitchHz(pitch) {
  return 440 * 2 ** ((pitch - 69) / 12);
}
function createToneVoice(context, destination, pitch) {
  const envelope = context.createGain();
  envelope.connect(destination);
  const sample = ocarinaBuffer && ocarinaSamples.reduce((nearest, candidate) =>
    Math.abs(candidate[0] - pitch) < Math.abs(nearest[0] - pitch) ? candidate : nearest);
  if (sample && Math.abs(pitch - sample[0]) <= 12) {
    const [root, start, loopStart, loopEnd] = sample;
    const source = context.createBufferSource();
    const rate = (note) => 2 ** ((note - root) / 12);
    source.buffer = ocarinaBuffer;
    source.loop = true;
    source.loopStart = loopStart / ocarinaSampleRate;
    source.loopEnd = loopEnd / ocarinaSampleRate;
    source.playbackRate.value = rate(pitch);
    source.connect(envelope);
    source.onended = () => envelope.disconnect();
    return {
      envelope, level: .24, attack: .004,
      start: (time) => source.start(time, start / ocarinaSampleRate),
      stop: (time) => source.stop(time),
      setPitch: (note, time) => source.playbackRate.setTargetAtTime(rate(note), time, .006)
    };
  }

  const fundamental = context.createOscillator();
  const overtone = context.createOscillator();
  const mix = context.createGain();
  const hz = pitchHz(pitch);
  fundamental.frequency.value = hz;
  overtone.frequency.value = hz * 2;
  mix.gain.value = .07;
  fundamental.connect(envelope);
  overtone.connect(mix).connect(envelope);
  fundamental.onended = () => envelope.disconnect();
  return {
    envelope, level: .18, attack: .025,
    start(time) { fundamental.start(time); overtone.start(time); },
    stop(time) { fundamental.stop(time); overtone.stop(time); },
    setPitch(note, time) {
      const hz = pitchHz(note);
      fundamental.frequency.setTargetAtTime(hz, time, .006);
      overtone.frequency.setTargetAtTime(hz * 2, time, .006);
    }
  };
}
function tone(context, destination, pitch, start, length) {
  if (length <= 0) return;
  const voice = createToneVoice(context, destination, pitch);
  const gain = voice.envelope.gain;
  const releaseEnd = start + length + Math.min(.048, length * .33 + .012);
  gain.setValueAtTime(.0001, start);
  gain.exponentialRampToValueAtTime(voice.level, start + Math.min(voice.attack, length / 2));
  gain.setValueAtTime(voice.level, start + length);
  gain.exponentialRampToValueAtTime(.0001, releaseEnd);
  voice.start(start);
  voice.stop(releaseEnd);
}
function preview(pitch) {
  const context = audioContext();
  tone(context, masterVolume, pitch, context.currentTime + .012, .24);
}
function timeline() {
  const secondsPerUnit = 60 / score.bpm / 48;
  const capacity = meterUnits[score.meter];
  const events = [];
  const bars = [];
  const { duration, ratio } = swingPatterns[score.swing];
  const division = duration ? 192 / duration : 0;
  let time = 0;
  score.bars.forEach((bar, b) => {
    const end = time + Math.max(capacity, barUnits(bar)) * secondsPerUnit;
    let units = 0;
    const simple = (entry) => entry && !entry.triplet && !entry.dotted && entry.kind !== "tie" && noteUnits(entry) === division;
    const append = (note, n, beat, length) => {
      events.push({ ...note, b, n, start: time + beat * secondsPerUnit, end: time + (beat + length) * secondsPerUnit });
    };
    for (let n = 0; n < bar.length; n++) {
      const note = bar[n];
      if (division && units % (division * 2) === 0 && simple(note) && simple(bar[n + 1])) {
        const first = division * 2 * ratio;
        append(note, n, units, first);
        append(bar[n + 1], ++n, units + first, division * 2 - first);
        units += division * 2;
      } else {
        const length = noteUnits(note);
        append(note, n, units, length);
        units += length;
      }
    }
    bars.push({ start: time, end, contentEnd: time + units * secondsPerUnit });
    time = end;
  });
  return { events, bars, total: time };
}
function cursorTime({ events, bars, total }) {
  const bar = bars[position.b];
  if (!bar) return total;
  const event = events.find((entry) => entry.b === position.b && entry.n === position.n);
  if (event) return event.start;
  return events.findLast((entry) => entry.b === position.b)?.end ?? bar.start;
}
function timestamp(seconds) {
  const whole = Math.floor(seconds + .00001);
  return Math.floor(whole / 60) + ":" + String(whole % 60).padStart(2, "0");
}
function renderPlayback() {
  const schedule = playback ?? timeline();
  const total = schedule.total;
  const current = playback ? offset : cursorTime(schedule);
  const percent = total ? Math.max(0, Math.min(100, 100 * current / total)) : 0;
  $("progress").value = percent;
  $("progress").style.setProperty("--progress", percent + "%");
  $("time").value = timestamp(current) + " / " + timestamp(total);
}
function showSounding() {
  soundingElement?.classList.remove("sounding");
  soundingElement = sounding && $("notation").querySelector('[data-bar="' + sounding.b + '"][data-note="' + sounding.n + '"]:not([data-slot])');
  soundingElement?.classList.add("sounding");
}

function updatePlayhead(realign = false) {
  const b = sounding?.b ?? playback?.bars.findIndex((bar) => bar.start <= offset && offset < bar.end);
  const layout = playback && playbackLayout[b];
  if (!layout) {
    playheadElement?.setAttribute("visibility", "hidden");
    playheadElement = null;
    return;
  }
  const bar = playback.bars[b];
  const next = playbackLayout[b + 1];
  const crossesBar = next?.row === layout.row && bar.end < playback.end;
  const right = crossesBar ? next.noteXs[0] ?? next.tailX ?? layout.right : layout.right;
  const from = sounding ? layout.noteXs[sounding.n] : layout.tailX ?? layout.right;
  const to = sounding ? layout.noteXs[sounding.n + 1] ?? layout.tailX ?? right : right;
  const start = sounding?.start ?? bar.contentEnd;
  const end = sounding?.end ?? bar.end;
  const progress = end > start ? Math.max(0, Math.min(1, (offset - start) / (end - start))) : 0;
  const notation = $("notation");
  const row = notation.children[layout.row];
  const marker = row.lastElementChild;
  marker.setAttribute("transform", `translate(${from + (to - from) * progress} 0)`);
  const changedRow = marker !== playheadElement;
  if (changedRow) {
    playheadElement?.setAttribute("visibility", "hidden");
    marker.setAttribute("visibility", "visible");
    playheadElement = marker;
  }
  if (changedRow || realign) {
    const lastRow = playbackLayout[playback.bars.length - 1]?.row;
    followPlaybackRow(notation, row, layout.row < lastRow ? row.nextElementSibling : null);
  }
}

function followPlaybackRow(notation, row, nextRow) {
  if (view !== "editor") return;
  const paneTop = notation.getBoundingClientRect().top + notation.clientTop;
  const visibleTop = Math.max(0, paneTop);
  const visibleBottom = Math.min(innerHeight, paneTop + notation.clientHeight);
  const height = visibleBottom - visibleTop;
  if (height <= 0) return;

  const { top, height: rowHeight } = row.getBoundingClientRect();
  const centered = top - Math.max(0, (height - rowHeight) / 2);
  const nextBottom = nextRow?.getBoundingClientRect().bottom ?? Infinity;
  // If both rows fit, reserve space for the full next row before centering.
  const target = nextBottom - top <= height ? Math.max(centered, nextBottom - height) : centered;
  notation.scrollTop += target - visibleTop;
}
function pausePlayback() {
  if (playback) {
    playback.channel.disconnect();
    playback = null;
  }
  cancelAnimationFrame(frame);
  renderPlayButton();
  sounding = null;
  showSounding();
  updatePlayhead();
  renderPlayback();
}
function tick() {
  if (!playback) return;
  const { context, events, begin, end, looping, channel } = playback;
  let clock = context.currentTime - playback.started;
  if (looping) {
    const cycle = end - begin;
    if (clock >= end) {
      const elapsed = Math.floor((clock - end) / cycle) + 1;
      playback.started += elapsed * cycle;
      playback.launch = begin;
      clock -= elapsed * cycle;
      if (!playback.loopQueued || elapsed > 1) {
        scheduleMelody(events, context, channel, playback.started, end, clock + .012);
      }
      playback.loopQueued = false;
    }
    if (!playback.loopQueued && clock >= end - .2) {
      scheduleMelody(events, context, channel, playback.started + cycle, end, begin);
      playback.loopQueued = true;
    }
  }
  offset = Math.min(end, Math.max(playback.launch, clock));
  const active = events.find((event) => event.start <= offset && event.end > offset);
  if (active !== sounding) {
    sounding = active;
    showSounding();
  }
  updatePlayhead();
  renderPlayback();
  if (offset >= end) {
    pausePlayback();
  } else frame = requestAnimationFrame(tick);
}
function startPlayback(from) {
  const schedule = timeline();
  const { events, bars, total } = schedule;
  if (!events.length) {
    toast(tr("先输入音符或休止符。"));
    return;
  }
  const looping = score.loop !== "off";
  const first = score.loop === "section" && looping ? Math.min(score.loopStart, bars.length - 1) : 0;
  const last = score.loop === "section" && looping ? Math.min(score.loopEnd, bars.length - 1) : bars.length - 1;
  const begin = bars[first].start;
  const end = bars[last].end;
  const requested = from ?? cursorTime(schedule);
  const sectionLoop = looping && score.loop === "section";
  if (requested >= total && !sectionLoop) {
    toast(tr("光标已在谱末，请先选一个拍位。"));
    return;
  }
  offset = sectionLoop && (requested < begin || requested >= end) ? begin : requested;
  const context = audioContext();
  const channel = context.createGain();
  channel.connect(masterVolume);
  const started = context.currentTime + (from === undefined ? .05 : .012) - offset;
  playback = { context, channel, started, events, bars, total, begin, end, launch: offset, looping, loopQueued: false };
  scheduleMelody(events, context, channel, started, end);
  renderPlayButton();
  tick();
}
function scheduleMelody(events, context, channel, started, end, from = offset) {
  const phrases = [];
  for (const event of events) {
    if (event.kind === "rest") continue;
    const prior = phrases.at(-1);
    if (event.kind === "tie" && prior && Math.abs(prior.end - event.start) < .0001) prior.end = event.end;
    else phrases.push({ ...event });
  }
  for (const phrase of phrases) {
    const start = Math.max(from, phrase.start);
    const duration = Math.min(end, phrase.end) - start;
    if (duration > 0) {
      const gap = Math.min(.045, duration * .17);
      tone(context, channel, phrase.pitch, started + start, duration - gap);
    }
  }
}
function togglePlayback() {
  if (playback) {
    pausePlayback();
    return;
  }
  commitBpm();
  startPlayback();
}

function renderPlayButton() {
  const label = playback ? tr("暂停") : tr("播放");
  const button = $("play");
  button.setAttribute("aria-label", label);
  button.title = playback ? tr("暂停（空格）") : tr("播放（空格）");
  button.innerHTML = icon(playback ? "pause" : "play");
}

let padIndex = null;
let previousPadButtons = [];
let activePadButton = -1;
let previousTapButton = false;

function createLivePitchInput() {
  let voice = null;
  return (pitch) => {
    if (pitch === null) {
      if (!voice) return;
      const now = audio.currentTime;
      voice.envelope.gain.cancelScheduledValues(now);
      voice.envelope.gain.setTargetAtTime(0, now, .01);
      voice.stop(now + .06);
      voice = null;
      return;
    }
    if (audio?.state !== "running" || voice?.pitch === pitch) return;
    const now = audio.currentTime;
    if (!voice) {
      voice = createToneVoice(audio, masterVolume, pitch);
      voice.envelope.gain.setValueAtTime(0, now);
      voice.envelope.gain.setTargetAtTime(voice.level, now, voice.attack / 3);
      voice.start(now);
    } else {
      voice.setPitch(pitch, now);
    }
    voice.pitch = pitch;
  };
}
const setControllerPitch = createLivePitchInput();
let controllerStatus = [];

function updateGamepadStatus(message, devices = [], active) {
  controllerStatus = [message, devices, active];
  const label = tr(message);
  const status = $("pad-state");
  const list = $("pad-device-list");
  if (status.textContent !== label) status.textContent = label;
  const deviceNames = devices.map((device) => {
    const name = device.id || tr("手柄 {number}", { number: device.index + 1 });
    if (device === active) {
      const mapping = Object.keys(controllerProfile(device)).length ? "已使用校准按键" :
        device.mapping === "standard" ? "浏览器标准映射" : "可校准按键";
      return [name, tr("当前设备"), tr(mapping)].join(" · ");
    }
    return device.mapping !== "standard" ? name + " · " + tr("未提供标准映射") : name;
  });
  const detail = deviceNames.join("\n") || label;
  if (list.textContent !== detail) list.textContent = detail;
}

function readGamepad() {
  if (!navigator.getGamepads) {
    updateGamepadStatus("此浏览器未提供手柄输入。");
    return;
  }
  let devices;
  try {
    devices = Array.from(navigator.getGamepads()).filter((device) => device?.connected);
  } catch {
    setControllerPitch(null);
    updateGamepadStatus("此页面无法读取手柄，可在独立浏览器打开。");
    return;
  }
  const device = chooseController(devices);
  const label = device
    ? (device.mapping !== "standard" && !Object.keys(controllerProfile(device)).length ? "手柄已连接 · 可校准按键" :
      audio?.state === "running" ? "手柄已连接 · 可直接吹奏" : "手柄已连接 · 点击网页启用声音")
    : devices.length ? "已检测到手柄，但浏览器未提供标准映射" : "未检测到手柄 · 连接电脑后按任意键";
  updateGamepadStatus(label, devices, device);
  const controls = device && readControllerControls(device);
  updateControllerPanel(device, devices, controls);
  if (device && !controllerCalibration && !document.hidden && document.hasFocus()) {
    const { pressed, stick, dpad } = controls;
    if (device.index !== padIndex) {
      activePadButton = -1;
      previousPadButtons = [];
      previousTapButton = false;
    }
    const tapPressed = controls.tap;
    if (tapPressed && !previousTapButton && view === "editor" && !document.querySelector("dialog[open]")) {
      registerTempoTap();
    }
    previousTapButton = tapPressed;
    const newest = pressed.findLastIndex((value, index) => value && !previousPadButtons[index]);
    if (newest >= 0) activePadButton = newest;
    if (!pressed[activePadButton]) activePadButton = pressed.findIndex(Boolean);
    setControllerPitch(activePadButton < 0 ? null : natural[activePadButton].pitch + 2 * stick + dpad);
    padIndex = device.index;
    previousPadButtons = pressed;
  } else {
    setControllerPitch(null);
    padIndex = null;
  }
  requestAnimationFrame(readGamepad);
}

function setupMidiInput() {
  const connect = $("midi-connect");
  const settings = $("midi-settings");
  const devices = $("midi-device");
  const mode = $("midi-mode");
  const status = $("midi-status");
  const setMidiPitch = createLivePitchInput();
  const held = new Map();
  let sessionFrame;
  let access;
  let input;
  let deviceSync = Promise.resolve();
  let preferredId;
  let highlightedKey;
  let statusMessage = "";

  function showStatus(message) {
    statusMessage = message;
    status.textContent = tr(message);
    status.removeAttribute("aria-label");
  }

  function refreshPitch() {
    const pitch = [...held.values()].at(-1) ?? null;
    setMidiPitch(pitch);
    highlightedKey?.classList.remove("midi-held");
    highlightedKey = pitch === null ? null : $("keyboard").querySelector(`[data-pitch="${pitch}"]`);
    highlightedKey?.classList.add("midi-held");
    if (!input) return;
    showStatus("已连接");
    if (pitch !== null) {
      const { html, text } = pitchInputLabel(pitch, spelling(pitch));
      const unavailable = fingerings.has(pitch) ? "" : " · " + tr("无游戏按法");
      status.innerHTML = html + unavailable;
      status.setAttribute("aria-label", text + unavailable);
    }
  }

  function stopNotes() {
    held.clear();
    refreshPitch();
  }

  function receiveNote({ data }) {
    if (data.length !== 3 || document.hidden || !document.hasFocus()) return;
    const [command, pitch, velocity] = data;
    const type = command & 0xf0;
    const channel = command & 15;
    const key = channel * 128 + pitch;
    if (type === 0x90 && velocity) {
      held.delete(key);
      held.set(key, pitch);
      if (mode.value === "score" && view === "editor" && !document.querySelector("dialog[open]")) {
        enter(pitch, "note", { advance: true, audition: false });
      }
    } else if (type === 0x80 || type === 0x90) {
      held.delete(key);
    } else if (type === 0xb0 && (pitch === 120 || pitch === 123)) {
      for (const heldKey of held.keys()) if (Math.floor(heldKey / 128) === channel) held.delete(heldKey);
    } else return;
    refreshPitch();
  }

  function requestMidiSession() {
    // Chromium can retain Windows MIDI handles until the requesting document is gone.
    const frame = document.createElement("iframe");
    frame.hidden = true;
    frame.title = tr("MIDI 输入连接");
    frame.allow = "midi";
    frame.srcdoc = "<script>function openMidiInput() { return navigator.requestMIDIAccess({ sysex: false }); }</script>";
    sessionFrame = frame;
    return new Promise((resolve, reject) => {
      frame.onload = () => {
        frame.onload = null;
        Promise.resolve().then(() => frame.contentWindow.openMidiInput()).then(resolve, reject);
      };
      document.body.append(frame);
    });
  }

  async function closeMidiInput(port) {
    if (!port) return;
    port.onmidimessage = null;
    await port.close();
  }

  function endMidiSession() {
    if (access) access.onstatechange = null;
    access = null;
    const previous = input;
    input = null;
    stopNotes();
    // Tear down the browser MIDI session even if closing the port is still pending.
    void closeMidiInput(previous).catch(() => {});
    sessionFrame?.remove();
    sessionFrame = null;
    deviceSync = Promise.resolve();
  }

  function syncDevices() {
    const session = access;
    deviceSync = deviceSync.then(async () => {
      if (!session || access !== session) return;
      const inputs = [...session.inputs.values()].filter((port) => port.state === "connected");
      const next = inputs.find((port) => port.id === preferredId) ?? inputs[0];
      if (input !== next) {
        const previous = input;
        input = null;
        stopNotes();
        await closeMidiInput(previous);
        if (access !== session) return;
        input = next?.state === "connected" ? next : undefined;
        if (input) {
          input.onmidimessage = receiveNote;
          showStatus("已连接");
        }
      }
      devices.replaceChildren(...inputs.map((port) => new Option(port.name || tr("MIDI 输入"), port.id)));
      if (input) devices.value = input.id;
      devices.hidden = mode.hidden = !input;
      if (!input) showStatus("已授权 · 等待连接 MIDI 键盘");
    }).catch(() => {
      if (access === session) showStatus("切换 MIDI 设备失败，请断开 MIDI 后重新连接。");
    });
    return deviceSync;
  }

  devices.onchange = () => { preferredId = devices.value; syncDevices(); };
  connect.onclick = async () => {
    if (access) {
      endMidiSession();
      devices.hidden = mode.hidden = true;
      mode.value = "preview";
      showStatus("已断开 MIDI");
      connect.textContent = tr("连接 MIDI");
      return;
    }
    settings.hidden = false;
    if (typeof navigator.requestMIDIAccess !== "function") {
      showStatus("当前浏览器不支持 Web MIDI，可在 Chrome 或 Edge 打开。");
      return;
    }
    audioContext();
    connect.disabled = true;
    showStatus("正在请求 MIDI 访问权限…");
    try {
      access = await requestMidiSession();
      access.onstatechange = syncDevices;
      await syncDevices();
      connect.textContent = tr("断开 MIDI");
    } catch {
      endMidiSession();
      showStatus("无法访问 MIDI。请检查站点权限，或在 Chrome 或 Edge 中打开。");
    } finally {
      connect.disabled = false;
    }
  };
  document.addEventListener("ocarina-language-change", () => {
    connect.textContent = tr(access ? "断开 MIDI" : "连接 MIDI");
    if (!held.size) showStatus(statusMessage);
    for (const option of devices.options) option.textContent = access?.inputs.get(option.value)?.name || tr("MIDI 输入");
  });
  document.addEventListener("ocarina-pitch-labels-change", () => { if (held.size) refreshPitch(); });
  window.addEventListener("blur", stopNotes);
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopNotes(); });
}

function renderLibrary() {
  const list = $("library-list");
  $("built-in-list").replaceChildren(...builtInScores.map((score) => libraryButton({ score }, true)));
  const storedIds = new Set(scoreFiles.map((entry) => entry.score.id));
  const entries = [...scoreFiles, ...browserCopies.filter((record) => !storedIds.has(record.id)).map((score) => ({ score }))];
  list.replaceChildren();
  if (folderState !== "ready" || !entries.length) {
    const empty = document.createElement("p");
    empty.className = "card empty";
    empty.textContent = folderState === "loading" ? tr("正在读取项目的「曲谱」文件夹…") :
      folderState === "error" ? tr("无法读取「曲谱」文件夹，请用本地曲谱服务打开网页。") :
      tr("导入曲谱文件或分享图，或保存当前曲谱以加入曲谱库。");
    list.append(empty);
  }
  list.append(...entries.map((entry) => libraryButton(entry)));
}

async function deleteLibraryScore(entry) {
  if (saving || deletingScore || folderState === "loading") return;
  const { id, title } = entry.score;
  const projectFile = useProjectFolder && Boolean(entry.filename);
  const detail = projectFile ? tr("文件将移到「曲谱 / 已删除」。") : tr("这首曲谱会从当前浏览器的曲谱库移除。");
  if (!window.confirm(tr("删除《{title}》？", { title }) + "\n" + detail)) return;
  deletingScore = true;
  try {
    if (projectFile) await requestFolder("/" + encodeURIComponent(id), { method: "DELETE" });
    if (useProjectFolder) {
      const records = loadBrowserCopies();
      if (records.some((record) => record.id === id)) {
        localStorage.setItem(storageKey, JSON.stringify(records.filter((record) => record.id !== id)));
      }
      const index = browserCopies.findIndex((record) => record.id === id);
      if (index >= 0) browserCopies.splice(index, 1);
    } else {
      localStorage.removeItem(webLibraryPrefix + id);
    }
    scoreFiles = scoreFiles.filter((file) => file.score.id !== id);
    if (score.id === id) {
      webFile = null;
      if (isDirty()) {
        score.id = makeScore().id;
        savedVersion = "";
      } else {
        applyScore(makeScore(), false);
      }
      rememberActive(score.id);
      updateStatus();
    }
    toast(projectFile ? tr("已移到「曲谱 / 已删除」") : tr("已从曲谱库删除"));
  } catch (error) {
    toast(tr("删除失败") + " · " + error.message);
  } finally {
    deletingScore = false;
    if (view === "library") renderLibrary();
  }
}

function libraryButton(entry, builtIn = false) {
  const { filename, score: item } = entry;
  const isCurrent = item.id === score.id && (builtIn || useProjectFolder || JSON.stringify(restoreScore(item)) === savedVersion);
  const button = document.createElement("button");
  button.className = "card library-entry";
  const heading = document.createElement("div");
  heading.className = "library-entry-heading";
  const title = document.createElement("strong");
  title.textContent = scoreTitle(item);
  heading.append(title);
  const author = normalizeAuthor(item.author);
  if (author) {
    const attribution = document.createElement("span");
    attribution.className = "library-entry-author";
    attribution.textContent = tr("制作者") + " " + author;
    heading.append(attribution);
  }
  const detail = document.createElement("span");
  detail.className = "library-entry-detail";
  detail.textContent = [barCount(item.bars.length), tr("{key} 大调", { key: item.key }), item.meter, item.bpm + " BPM",
    !filename && !builtIn && tr("浏览器旧版备份"), isCurrent && tr("当前曲谱")].filter(Boolean).join(" · ");
  if (isCurrent) button.setAttribute("aria-current", "true");
  if (filename) button.title = useProjectFolder ? tr("曲谱 / {filename}", { filename }) : filename;
  button.append(heading, detail);
  button.onclick = () => {
    if (isCurrent) setView("editor");
    else switchScore(item, true, builtIn || useProjectFolder ? null : entry);
  };
  if (builtIn) return button;
  const row = document.createElement("div");
  row.className = "library-row";
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "secondary library-remove";
  remove.textContent = tr("删除");
  remove.setAttribute("aria-label", tr("删除《{title}》", { title: item.title }));
  remove.disabled = folderState === "loading";
  remove.onclick = () => deleteLibraryScore(entry);
  row.append(button, remove);
  return row;
}
function setView(next) {
  if (next !== "editor") {
    closeFingeringEditor();
    $("insert-menu").hidden = true;
    resetTempoTaps();
  }
  view = next;
  for (const page of all("main")) page.hidden = page.id !== view;
  for (const button of all(".nav-item")) {
    const active = button.dataset.view === view;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  }
  if (view === "library") renderLibrary();
  if (view === "editor") renderNotation();
}
function commitTitle() {
  const typed = $("title").value.trim();
  const title = typed === scoreTitle(score) ? score.title : typed || untitledScore;
  if (score.title !== title) updateHistory(() => { score.title = title; }, updateStatus);
  $("title").value = $("title-width").textContent = scoreTitle(score);
}
function commitAuthor() {
  const author = normalizeAuthor($("author").value);
  if (score.author !== author) updateHistory(() => { score.author = author; }, updateStatus);
  $("author").value = author;
}
function setScoreBpm(value, groupWithPrevious = false) {
  $("bpm").value = value;
  if (value === score.bpm) return false;
  // Timelines store seconds, so scale the current offset to hold the same beat.
  const resumeAt = playback ? offset * score.bpm / value : undefined;
  updateHistory(() => { score.bpm = value; }, () => {
    updateStatus();
    renderPlayback();
  }, groupWithPrevious);
  if (resumeAt !== undefined) startPlayback(resumeAt);
  return true;
}

function commitBpm() {
  const value = Math.max(30, Math.min(maxBpm, Math.round(Number($("bpm").value) || score.bpm)));
  setScoreBpm(value);
}

let previousTempoTap = null;
const tempoIntervals = [];
let tapHistoryEntry = null;
let tapFlashTimer;

function resetTempoTaps() {
  previousTempoTap = null;
  tempoIntervals.length = 0;
  tapHistoryEntry = null;
  clearTimeout(tapFlashTimer);
  $("tap-tempo").classList.remove("tapped");
  $("tap-feedback").textContent = "";
}

function registerTempoTap(now = performance.now()) {
  if (previousTempoTap !== null) {
    const interval = now - previousTempoTap;
    if (interval < 120) return;
    if (interval > 2500) resetTempoTaps();
    else {
      tempoIntervals.push(interval);
      if (tempoIntervals.length > 4) tempoIntervals.shift();
    }
  }
  previousTempoTap = now;
  $("tap-tempo").classList.add("tapped");
  clearTimeout(tapFlashTimer);
  tapFlashTimer = setTimeout(() => $("tap-tempo").classList.remove("tapped"), 115);
  if (tempoIntervals.length < 2) {
    $("tap-feedback").textContent = tr("已打 {count} 拍，至少打 3 拍。", { count: tempoIntervals.length + 1 });
    return;
  }
  const average = tempoIntervals.reduce((sum, interval) => sum + interval, 0) / tempoIntervals.length;
  const bpm = Math.max(30, Math.min(maxBpm, Math.round(60000 / average)));
  if (setScoreBpm(bpm, tapHistoryEntry !== null && undoStack.at(-1) === tapHistoryEntry)) {
    tapHistoryEntry = undoStack.at(-1);
  }
  $("tap-feedback").textContent = tr("测得 {bpm} BPM", { bpm });
}

function chooseMidiPart(parts) {
  if (parts.length === 1) return Promise.resolve(parts[0]);
  const dialog = $("midi-tracks");
  const select = $("midi-track");
  select.replaceChildren(...parts.map(({ track, channel, name, notes }, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = tr("音轨 {track} · 通道 {channel} · {count} 音", { track, channel, count: notes.length }) +
      (name ? " · " + name : "");
    return option;
  }));
  dialog.returnValue = "";
  return new Promise((resolve) => {
    dialog.addEventListener("close", () => resolve(dialog.returnValue === "import" ? parts[Number(select.value)] : null), { once: true });
    dialog.showModal();
  });
}

drawController();
drawKeyboard();
renderGuide();
function bindPreviewButtons() {
  all("[data-listen]").forEach((button) => button.onclick = () => preview(Number(button.dataset.listen)));
}
bindPreviewButtons();
all("[data-pitch]").forEach((button) => button.onclick = () => enter(Number(button.dataset.pitch)));
all("button[data-pitch-display]").forEach((button) => button.onclick = () => {
  pitchDisplay = button.dataset.pitchDisplay;
  writePreference(pitchDisplayPreference, pitchDisplay);
  renderPitchInput();
  renderNotation();
});
all("[data-duration]").forEach((button) => button.onclick = () => editRhythm("duration", Number(button.dataset.duration)));
all("[data-transpose]").forEach((button) => button.onclick = () => transpose(Number(button.dataset.transpose)));
all("[data-view]").forEach((button) => button.onclick = () => setView(button.dataset.view));
all("[data-display]").forEach((button) => button.onclick = () => {
  closeFingeringEditor();
  display = button.dataset.display;
  all("[data-display]").forEach((item) => item.setAttribute("aria-pressed", item === button));
  renderNotation();
});
document.querySelector(".brand").onclick = (event) => {
  event.preventDefault();
  setView("editor");
};
$("new").onclick = () => switchScore(makeScore(), false);
$("save").onclick = save;

function scoreContents(record) {
  const { id, ...contents } = parseScoreFile(JSON.stringify(record));
  return JSON.stringify(contents);
}

async function storeImportedScore(imported, filename) {
  const entries = useProjectFolder ? await requestFolder() : [...scoreFiles, ...loadWebLibrary()];
  const contents = scoreContents(imported);
  const same = entries.find(({ score }) => {
    try { return scoreContents(score) === contents; }
    catch { return false; }
  });
  if (same) {
    if (!scoreFiles.some((entry) => entry.score.id === same.score.id)) addScoreFile(same);
    toast(tr("曲谱已在库中") + " · " + scoreTitle(same.score));
    if (view === "library") renderLibrary();
    return;
  }

  const conflict = isBuiltIn(imported.id) || entries.some(({ score }) => score.id === imported.id);
  const record = conflict ? { ...imported, id: makeScore().id } : imported;
  if (useProjectFolder) {
    let entry = await writeScoreFile(record, true);
    // Another tab may have used the same ID after the library snapshot was read.
    if (scoreContents(entry.score) !== contents) entry = await writeScoreFile({ ...record, id: makeScore().id }, true);
    addScoreFile(entry);
    if (folderState !== "loading") folderState = "ready";
    toast(tr("已导入") + " · " + scoreTitle(record));
  } else {
    const stored = storeWebScore({ score: record, filename, status: "已导入曲谱" });
    toast(tr("已导入") + " · " + (stored ? scoreTitle(record) : tr("曲谱库仅保留到本次访问结束")));
  }
  if (view === "library") renderLibrary();
}

async function importScoreFile(file) {
  const button = $("import-score");
  button.disabled = true;
  try {
    let imported;
    const isMidi = /\.midi?$/i.test(file.name);
    if (isMidi) {
      const midi = readMidiFile(await file.arrayBuffer());
      const part = await chooseMidiPart(midi.parts);
      if (!part) return;
      const name = file.name.replace(/\.midi?$/i, "").trim() || tr("MIDI 曲谱");
      const suffix = midi.parts.length > 1 ? ` · ${part.track}.${part.channel}` : "";
      imported = { ...makeScore(), ...midiToScore(midi, part), title: name.slice(0, 32 - suffix.length) + suffix };
    } else {
      try {
        imported = parseScoreFile(await file.text());
      } catch {
        throw new Error(tr("请选择陶笛曲谱的 JSON 文件或 MIDI 文件。"));
      }
    }
    await storeImportedScore(imported, isMidi ? imported.title + ".json" : file.name);
  } catch (error) {
    toast(tr("导入失败") + " · " + error.message);
  } finally {
    button.disabled = false;
  }
}

function setupScoreRecognition() {
  if (!useProjectFolder) return;
  const trigger = $("recognize-score");
  const dialog = $("recognition-dialog");
  const fileInput = $("recognition-file");
  const run = $("run-recognition");
  const accept = $("accept-recognition");
  const status = $("recognition-result");
  const warnings = $("recognition-warnings");
  const service = $("recognition-service");
  let ready = false;
  let busy = false;
  let recognized = null;

  function updateControls() {
    fileInput.disabled = !ready || busy;
    run.disabled = fileInput.disabled || !fileInput.files.length;
    accept.disabled = busy || !recognized;
  }

  async function requestRecognition(suffix = "", options = {}) {
    const response = await fetch("/api/recognize-score" + suffix, { cache: "no-store", ...options });
    if (!response.headers.get("Content-Type")?.includes("application/json")) {
      throw new Error(tr("请通过项目的本地曲谱服务打开网页后再识别。"));
    }
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result;
  }

  trigger.onclick = async () => {
    dialog.showModal();
    try {
      const { engine } = await requestRecognition();
      ready = true;
      $("recognition-download").hidden = engine;
      service.textContent = engine ? "" : tr("安装 Audiveris 后可识别 PDF 和图片。现在可以导入 MusicXML 或 MXL。");
    } catch {
      ready = false;
      service.textContent = tr("无法连接本地识谱服务。请用新版 server.py 启动项目后再试。");
    }
    updateControls();
  };
  fileInput.onchange = () => {
    recognized = null;
    status.textContent = warnings.textContent = "";
    updateControls();
  };
  $("recognition-form").onsubmit = async (event) => {
    event.preventDefault();
    const file = fileInput.files[0];
    if (!file || !ready || busy) return;
    if (file.size > 24 * 1024 * 1024) {
      status.textContent = tr("文件超过 24 MB，请缩小图片或拆分 PDF。");
      return;
    }
    recognized = null;
    busy = true;
    status.textContent = tr("正在识别乐谱并检查声部与时值…");
    warnings.textContent = "";
    updateControls();
    try {
      const extension = file.name.split(".").at(-1).toLowerCase();
      const result = await requestRecognition("/" + encodeURIComponent(extension), {
        method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: file
      });
      const title = result.score.title && result.score.title !== "input" ? result.score.title : file.name.replace(/\.[^.]+$/, "");
      recognized = parseScoreFile(JSON.stringify({ ...makeScore(), ...result.score, title: title.trim().slice(0, 32) || "识别曲谱" }));
      status.textContent = [recognized.title, tr("单声部"), barCount(recognized.bars.length),
        tr("识别拍号 {meter}", { meter: recognized.meter })].join(" · ");
      warnings.textContent = result.warnings.length
        ? [...result.warnings, tr("可先加入曲谱库，再在制谱页校对。")].join("\n")
        : "";
    } catch (error) {
      status.textContent = error.message;
    } finally {
      busy = false;
      updateControls();
    }
  };
  accept.onclick = async () => {
    if (!recognized || busy) return;
    busy = true;
    updateControls();
    try {
      await storeImportedScore(recognized, recognized.title + ".json");
      fileInput.value = "";
      fileInput.onchange();
      dialog.close();
    } catch (error) {
      status.textContent = tr("加入曲谱库失败") + " · " + error.message;
    } finally {
      busy = false;
      updateControls();
    }
  };
  trigger.hidden = false;
}
$("rename").onclick = () => { $("title").focus(); $("title").select(); };
$("title").oninput = () => { $("title-width").textContent = $("title").value; };
$("title").onchange = commitTitle;
$("title").onkeydown = (event) => { if (event.key === "Enter") $("title").blur(); };
$("author").onchange = commitAuthor;
$("author").onkeydown = (event) => {
  if (event.key === "Enter" && !event.isComposing) {
    commitAuthor();
    $("author").blur();
  }
};
$("delete").onclick = deleteNote;
$("rest").onclick = () => enter(null, "rest");
$("tie").onclick = () => enter(null, "tie");
$("dot").onclick = () => editRhythm("dotted");
$("triplet").onclick = () => editRhythm("triplet");
const annotationDialog = $("note-annotation-dialog");
const annotationInput = $("note-annotation-text");
$("note-annotation").onclick = () => {
  const note = noteAt();
  if (!note || selectedNotes.size > 1) return;
  annotationInput.value = note.annotation ?? "";
  $("remove-note-annotation").hidden = !note.annotation;
  annotationDialog.showModal();
  annotationInput.select();
};
function commitAnnotation(annotation) {
  annotationDialog.close();
  const note = noteAt();
  if (!note) return;
  if (annotation !== (note.annotation ?? "")) updateHistory(() => {
    if (annotation) note.annotation = annotation;
    else delete note.annotation;
  });
  focusCursor();
}
$("close-note-annotation").onclick = () => annotationDialog.close();
$("remove-note-annotation").onclick = () => commitAnnotation("");
annotationDialog.querySelector("form").onsubmit = (event) => {
  event.preventDefault();
  commitAnnotation(normalizeAnnotation(annotationInput.value));
};
$("undo").onclick = () => moveHistory(undoStack, redoStack);
$("redo").onclick = () => moveHistory(redoStack, undoStack);
$("key").onchange = (event) => updateHistory(() => { score.key = event.target.value; });
$("meter").onchange = (event) => {
  updateHistory(() => {
    score.meter = event.target.value;
    repairTies();
  });
};
$("loop").onchange = (event) => updateHistory(() => {
  score.loop = event.target.value;
  if (score.loop === "section") score.loopEnd = score.loopStart = Math.min(position.b, Math.max(0, score.bars.length - 1));
});
$("loop-start").onchange = (event) => updateHistory(() => {
  score.loopStart = +event.target.value;
  score.loopEnd = Math.max(score.loopStart, score.loopEnd);
});
$("loop-end").onchange = (event) => updateHistory(() => {
  score.loopEnd = +event.target.value;
  score.loopStart = Math.min(score.loopStart, score.loopEnd);
});
$("bpm").oninput = resetTempoTaps;
$("bpm").onchange = commitBpm;
$("bpm").onblur = commitBpm;
$("bpm").onkeydown = (event) => {
  if (event.key === "Enter") $("bpm").blur();
};
$("tap-tempo").onclick = (event) => registerTempoTap(event.timeStamp);
$("tap-tempo").onkeydown = (event) => {
  if (event.repeat && (event.key === " " || event.key === "Enter")) event.preventDefault();
};
function cursorTarget() {
  const { b, n, slot } = position;
  return $("notation").querySelector('[data-bar="' + b + '"][data-note="' + n + '"]' + (slot ? '[data-slot="' + slot + '"]' : ":not([data-slot])"));
}
function focusCursor() {
  const item = cursorTarget();
  item?.focus({ preventScroll: true });
  item?.scrollIntoView({ block: "nearest", inline: "nearest" });
}
function selectFromEvent(event) {
  const item = event.target.closest("[data-bar]");
  if (!item) return;
  const { bar, note, slot } = item.dataset;
  selectNote(Number(bar), Number(note), slot);
  focusCursor();
}
const notationElement = $("notation");
const rangeNoteSelector = ".target:not([data-slot])";
let noteDrag = null;
let ignoreDragClick = false;
let noteHold = null;

function cancelNoteHold() {
  clearTimeout(noteHold?.timer);
  noteHold = null;
}

function notationViewport() {
  const box = notationElement.getBoundingClientRect();
  const left = box.left + notationElement.clientLeft;
  const top = box.top + notationElement.clientTop;
  return {
    left: Math.max(0, left), top: Math.max(0, top),
    right: Math.min(innerWidth, left + notationElement.clientWidth),
    bottom: Math.min(innerHeight, top + notationElement.clientHeight),
    originX: left - notationElement.scrollLeft,
    originY: top - notationElement.scrollTop
  };
}

function noteRangeLayout(anchor) {
  const { originX, originY } = notationViewport();
  const notes = [];
  const systems = [...notationElement.children].map((system) => {
    const start = notes.length;
    const targets = [...system.querySelectorAll(rangeNoteSelector)];
    notes.push(...targets);
    const cells = targets.map((target) => target.firstElementChild.getBoundingClientRect());
    // Use existing hit areas, splitting any gap between two cells at its midpoint.
    const limits = cells.slice(0, -1).map((cell, i) => (cell.right + cells[i + 1].left) / 2 - originX);
    return { start, count: targets.length, limits, bottom: system.getBoundingClientRect().bottom - originY };
  });
  return { notes, systems, start: notes.indexOf(anchor), end: null };
}

function noteRangeEndpoint({ systems, notes }, x, y) {
  const system = systems.find((row) => y < row.bottom);
  if (!system) return notes.length - 1;
  if (!system.count) return Math.max(0, system.start - 1);
  const cell = system.limits.findIndex((right) => x < right);
  return system.start + (cell < 0 ? system.count - 1 : cell);
}

function previewNoteRange(drag, viewport) {
  const x = Math.max(viewport.left, Math.min(drag.x, viewport.right - 1)) - viewport.originX;
  const y = Math.max(viewport.top, Math.min(drag.y, viewport.bottom - 1)) - viewport.originY;
  const end = noteRangeEndpoint(drag, x, y);
  if (end === drag.end) return;
  const first = Math.min(drag.start, end);
  const last = Math.max(drag.start, end);
  const previous = drag.end ?? drag.start;
  for (let i = Math.min(previous, end); i <= Math.max(previous, end); i++) {
    drag.notes[i].classList.toggle("batch-selected", i >= first && i <= last);
  }
  drag.end = end;
}

function edgeScroll(point, low, high) {
  const band = Math.min(30, (high - low) / 3);
  if (band <= 0) return 0;
  if (point < low + band) return -Math.ceil(18 * Math.min(1, (low + band - point) / band));
  if (point > high - band) return Math.ceil(18 * Math.min(1, (point - high + band) / band));
  return 0;
}

function trackNoteRange() {
  const drag = noteDrag;
  if (!drag?.notes || !drag.anchor.isConnected) return;
  const viewport = notationViewport();
  const dx = edgeScroll(drag.x, viewport.left, viewport.right);
  const dy = edgeScroll(drag.y, viewport.top, viewport.bottom);
  if (dx || dy) {
    const before = notationElement.scrollTop;
    notationElement.scrollBy({ left: dx, top: dy, behavior: "instant" });
    if (dy && notationElement.scrollTop === before &&
        (dy < 0 ? viewport.top === 0 : viewport.bottom === innerHeight)) {
      window.scrollBy({ top: dy, behavior: "instant" });
    }
  }
  previewNoteRange(drag, dx || dy ? notationViewport() : viewport);
  drag.frame = requestAnimationFrame(trackNoteRange);
}

notationElement.addEventListener("pointerdown", (event) => {
  ignoreDragClick = false;
  if (event.pointerType === "touch") {
    cancelNoteHold();
    if (!event.isPrimary || !event.target.closest("[data-measure]")) return;
    const { target, pointerId, clientX, clientY } = event;
    noteHold = { pointerId, clientX, clientY, timer: setTimeout(() => {
      if (!target.isConnected) return;
      ignoreDragClick = true;
      openNotationMenu(target, clientX, clientY);
    }, 500) };
    return;
  }
  if (event.pointerType !== "mouse" || event.button !== 0) return;
  const anchor = event.target.closest(rangeNoteSelector);
  if (anchor) noteDrag = { id: event.pointerId, anchor, x: event.clientX, y: event.clientY };
});

document.addEventListener("pointermove", (event) => {
  if (noteHold?.pointerId === event.pointerId &&
      Math.hypot(event.clientX - noteHold.clientX, event.clientY - noteHold.clientY) > 10) cancelNoteHold();
  const drag = noteDrag;
  if (drag?.id !== event.pointerId || !(event.buttons & 1) || !drag.anchor.isConnected) return;
  if (!drag.notes) {
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 5) return;
    Object.assign(drag, noteRangeLayout(drag.anchor));
    closeFingeringEditor();
    notationElement.querySelectorAll(".batch-selected, .target.selected").forEach((target) =>
      target.classList.remove("batch-selected", "selected"));
    notationElement.focus({ preventScroll: true });
    notationElement.setPointerCapture(event.pointerId);
    drag.frame = requestAnimationFrame(trackNoteRange);
  }
  drag.x = event.clientX;
  drag.y = event.clientY;
  previewNoteRange(drag, notationViewport());
});

function finishNoteRange(event) {
  if (noteHold?.pointerId === event.pointerId) cancelNoteHold();
  const drag = noteDrag;
  if (drag?.id !== event.pointerId) return;
  noteDrag = null;
  if (!drag.notes) return;
  cancelAnimationFrame(drag.frame);
  if (event.type !== "pointerup" || !drag.anchor.isConnected) {
    renderNotation();
    return;
  }
  ignoreDragClick = true;
  drag.x = event.clientX;
  drag.y = event.clientY;
  previewNoteRange(drag, notationViewport());
  const first = Math.min(drag.start, drag.end);
  const last = Math.max(drag.start, drag.end);
  const selection = new Set(drag.notes.slice(first, last + 1).map(({ dataset }) => `${dataset.bar}:${dataset.note}`));
  const { bar, note } = drag.notes[drag.end].dataset;
  selectNote(Number(bar), Number(note), "", first === last ? new Set() : selection);
  notationElement.focus({ preventScroll: true });
}

document.addEventListener("pointerup", finishNoteRange);
document.addEventListener("pointercancel", finishNoteRange);
notationElement.addEventListener("lostpointercapture", finishNoteRange);
notationElement.onclick = (event) => {
  if (ignoreDragClick) {
    ignoreDragClick = false;
    return;
  }
  selectFromEvent(event);
};

function scoreClipboardIsActive(event) {
  return view === "editor" && !document.querySelector("dialog[open]") &&
    !event.target.closest("input, select, textarea, [contenteditable]");
}

function copyScoreNotes(event) {
  if (!event.clipboardData || !scoreClipboardIsActive(event) || document.getSelection()?.toString()) return;
  const range = [...selectedNotes];
  if (!range.length && noteAt()) range.push(`${position.b}:${position.n}`);
  if (!range.length) return;
  const [firstBar, firstNote] = range[0].split(":").map(Number);
  const [lastBar, lastNote] = range.at(-1).split(":").map(Number);
  const bars = score.bars.slice(firstBar, lastBar + 1).map((bar, i) =>
    bar.slice(i === 0 ? firstNote : 0, firstBar + i === lastBar ? lastNote + 1 : bar.length));
  event.clipboardData.setData("text/plain", JSON.stringify({ format: "ocarina-notes-v2", bars }));
  event.preventDefault();
  const cut = event.type === "cut";
  if (cut) removeNoteRange(range, true);
  toast(tr(cut ? "已剪切 {count} 个音符" : "已复制 {count} 个音符", { count: range.length }));
}
document.addEventListener("copy", copyScoreNotes);
document.addEventListener("cut", copyScoreNotes);

document.addEventListener("paste", (event) => {
  if (!event.clipboardData || !scoreClipboardIsActive(event)) return;
  let data;
  try {
    data = JSON.parse(event.clipboardData.getData("text/plain"));
  } catch {
    return;
  }
  const bars = data?.format === "ocarina-notes-v1" ? [data.notes] : data?.format === "ocarina-notes-v2" ? data.bars : null;
  if (!Array.isArray(bars) || !bars[0]?.length || !bars.at(-1)?.length ||
      !bars.every((bar) => Array.isArray(bar) && bar.every(validScoreNote))) return;
  event.preventDefault();
  pasteNotes(bars.map((bar) => bar.map(normalizeScoreNote)));
});

function openNotationMenu(target, clientX, clientY) {
  const measure = target.closest("[data-measure]");
  if (!measure) return;
  const b = Number(measure.dataset.measure);
  if (target.closest("[data-bar]")) selectFromEvent({ target });
  else if (b !== position.b) selectNote(b, 0, score.bars[b]?.length ? "" : "tail");
  const menu = $("insert-menu");
  const insertNote = $("context-insert");
  insertNote.disabled = !noteAt();
  $("context-insert-before").disabled = insertNote.disabled;
  $("context-delete-measure").disabled = b >= score.bars.length;
  const source = selectedFingeringSource();
  $("context-fingering").disabled = !source || (fingerings.get(source.pitch)?.length ?? 0) < 2;
  menu.hidden = false;
  menu.style.left = Math.max(4, Math.min(clientX, innerWidth - menu.offsetWidth - 6)) + "px";
  menu.style.top = Math.max(4, Math.min(clientY, innerHeight - menu.offsetHeight - 6)) + "px";
  (insertNote.disabled ? $("context-insert-measure") : insertNote).focus({ preventScroll: true });
}
notationElement.oncontextmenu = (event) => {
  if (!event.target.closest("[data-measure]")) return;
  event.preventDefault();
  if (noteHold || event.pointerType === "touch" || event.sourceCapabilities?.firesTouchEvents) return;
  openNotationMenu(event.target, event.clientX, event.clientY);
};
$("context-insert-before").onclick = () => openInsert(true);
$("context-insert").onclick = () => openInsert();
$("context-fingering").onclick = () => {
  const target = cursorTarget();
  const frames = target?.querySelectorAll(".cursor-frame");
  $("insert-menu").hidden = true;
  openFingeringEditor(frames?.[frames.length - 1] ?? target);
};
$("context-insert-measure").onclick = insertMeasure;
$("context-delete-measure").onclick = deleteMeasure;
document.addEventListener("pointerdown", (event) => {
  if (noteHold && event.pointerId !== noteHold.pointerId) cancelNoteHold();
  if (!$("insert-menu").contains(event.target)) $("insert-menu").hidden = true;
  if (!event.target.closest("#fingering-panel, .inspector-fingering, #notation")) closeFingeringEditor();
});
$("notation").onkeydown = (event) => {
  if (event.key !== "Enter" || position.slot || !event.target.closest("[data-bar]")) return;
  event.preventDefault();
  selectFromEvent(event);
};
$("restart").onclick = () => {
  pausePlayback();
  selectNote(0, 0, score.bars[0]?.length ? "" : "tail");
};
$("play").onclick = togglePlayback;
document.addEventListener("keydown", (event) => {
  if (document.querySelector("dialog[open]")) return;
  if (event.key === "Escape" && !fingeringPanel.hidden) {
    const restoreFocus = fingeringPanel.contains(event.target);
    event.preventDefault();
    closeFingeringEditor(restoreFocus);
    return;
  }
  if (fingeringPanel.contains(event.target)) return;
  const modifier = event.ctrlKey || event.metaKey;
  const key = event.key.toLowerCase();
  if (modifier && key === "s") {
    event.preventDefault();
    save();
    return;
  }
  if (view !== "editor" || event.target.closest("input, select, textarea")) return;
  if (!modifier && event.key === "Enter" && position.slot &&
      (event.target === document.body || event.target.closest("#notation, #durations, #dot, #triplet"))) {
    event.preventDefault();
    if (!event.repeat) {
      enter(null, "rest");
      focusCursor();
    }
    return;
  }
  if (key === "escape" && !$("insert-menu").hidden) {
    $("insert-menu").hidden = true;
    focusCursor();
    return;
  }
  if (key === "escape" && selectedNotes.size) {
    selectedNotes.clear();
    renderNotation();
    renderControls();
    focusCursor();
    return;
  }
  if (modifier && (key === "z" || key === "y")) {
    event.preventDefault();
    if (key === "y" || event.shiftKey) moveHistory(redoStack, undoStack);
    else moveHistory(undoStack, redoStack);
    return;
  }
  if (["ArrowLeft", "ArrowRight", "Insert", "Delete", "Backspace"].includes(event.key) && !modifier) {
    event.preventDefault();
    if (event.key === "Insert") openInsert();
    else if (event.key === "ArrowLeft" || event.key === "ArrowRight") moveCursor(event.key === "ArrowLeft" ? -1 : 1);
    else if (!event.repeat) deleteNote();
    return;
  }
  if (event.key === " " && !modifier && !event.altKey && !event.defaultPrevented &&
      !event.target.closest("#tap-tempo, #optimize-fingering, #note-annotation, .inspector-fingering, .preferences, .site-footer") && $("insert-menu").hidden) {
    event.preventDefault();
    if (!event.repeat) togglePlayback();
  }
});
document.addEventListener("pointerdown", audioContext, { capture: true, once: true });
document.addEventListener("keydown", audioContext, { capture: true, once: true });
window.addEventListener("blur", () => setControllerPitch(null));
document.addEventListener("visibilitychange", () => {
  if (document.hidden) setControllerPitch(null);
});

function setupScoreHeight() {
  const notation = $("notation");
  const grip = $("score-resize");
  const preference = "ocarina-score-height-v1";
  const min = Number(grip.getAttribute("aria-valuemin"));
  const max = Number(grip.getAttribute("aria-valuemax"));
  let height = null;
  let drag = null;
  let width = notation.clientWidth;
  const measure = () => Math.round(notation.getBoundingClientRect().height);

  function setHeight(value) {
    height = value === null ? null : Math.max(min, Math.min(max, Math.round(value)));
    if (height === null) notation.style.removeProperty("--score-height");
    else notation.style.setProperty("--score-height", height + "px");
  }
  function saveHeight() {
    try {
      if (height === null) localStorage.removeItem(preference);
      else localStorage.setItem(preference, String(height));
    } catch { /* Resizing still works without browser preference storage. */ }
  }
  try {
    const saved = Number(localStorage.getItem(preference));
    if (Number.isFinite(saved) && saved > 0) setHeight(saved);
  } catch { /* Use the default height. */ }

  grip.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || drag) return;
    drag = { id: event.pointerId, startY: event.clientY, startHeight: measure(), changed: false };
    grip.focus({ preventScroll: true });
    grip.setPointerCapture(event.pointerId);
  });
  grip.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id || (!drag.changed && event.clientY === drag.startY)) return;
    drag.changed = true;
    grip.classList.add("dragging");
    setHeight(drag.startHeight + event.clientY - drag.startY);
  });
  grip.addEventListener("lostpointercapture", () => {
    if (drag?.changed) saveHeight();
    drag = null;
    grip.classList.remove("dragging");
  });
  grip.addEventListener("dblclick", () => {
    setHeight(null);
    saveHeight();
  });
  grip.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    setHeight(measure() + (event.key === "ArrowUp" ? -32 : 32));
    saveHeight();
  });
  new ResizeObserver(() => {
    if (measure()) grip.setAttribute("aria-valuenow", measure());
    if (notation.clientWidth !== width) {
      width = notation.clientWidth;
      renderNotation();
    } else if (playback) updatePlayhead(true);
  }).observe(notation);
}

function localizeLibraryLocation() {
  $("library-location").textContent = tr(useProjectFolder ? "保存在项目根目录的「曲谱」文件夹" : "曲谱保存在此浏览器中");
}

function setupUiPreferences() {
  const root = document.documentElement;
  const theme = $("theme-toggle");
  const language = $("language-toggle");
  const updateButtons = () => {
    const dark = root.dataset.theme === "dark";
    const label = tr(dark ? "浅色模式" : "深色模式");
    theme.title = label;
    theme.setAttribute("aria-label", label);
    theme.setAttribute("aria-pressed", dark);
    theme.innerHTML = icon(dark ? "sun" : "moon");
    language.lang = uiLanguage === "en" ? "zh-CN" : "en";
    language.textContent = uiLanguage === "en" ? "中文" : "EN";
    language.title = uiLanguage === "en" ? "切换到中文" : "Switch to English";
    language.setAttribute("aria-label", language.title);
  };
  theme.onclick = () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    writePreference(themeKey, root.dataset.theme);
    updateButtons();
  };
  language.onclick = () => {
    commitTitle();
    commitAuthor();
    uiLanguage = uiLanguage === "en" ? "zh-CN" : "en";
    writePreference(languageKey, uiLanguage);
    const url = new URL(location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.set("lang", uiLanguage);
      history.replaceState(history.state, "", url);
    }
    localizePage();
    updateButtons();
    $("title").value = $("title-width").textContent = scoreTitle(score);
    $("toast").hidden = true;
    $("tap-feedback").textContent = "";
    closeFingeringEditor();
    renderKeyOptions();
    renderSwingValue();
    renderSwingOptions();
    renderPlayButton();
    drawController();
    updateGamepadStatus(...controllerStatus);
    renderGuide();
    bindPreviewButtons();
    all("[data-duration]").forEach((button) => {
      button.title = tr(durationNames[button.dataset.duration]);
      button.setAttribute("aria-label", button.title);
    });
    renderPitchInput();
    localizeLibraryLocation();
    renderControls();
    renderNotation();
    if (view === "library") renderLibrary();
    document.dispatchEvent(new Event("ocarina-language-change"));
  };
  updateButtons();
}

setView("editor");
localizeLibraryLocation();
syncTools();
refresh();
setupVolume();
setupSwingPicker();
setupScoreHeight();
setupScoreSharing();
setupScoreRecognition();
setupMidiInput();
setupUiPreferences();
setupControllerPanel();
$("pad-device").onclick = () => $("pad-device-dialog").showModal();
readGamepad();
if (useProjectFolder) void loadScoreFolder();
