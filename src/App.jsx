import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// ---- Data: the 40 PAS International Drum Rudiments ----
const RUDIMENTS = [
  { id: "r01", name: "Single Stroke Roll", fam: "ROLL" },
  { id: "r02", name: "Single Stroke Four", fam: "ROLL" },
  { id: "r03", name: "Single Stroke Seven", fam: "ROLL" },
  { id: "r04", name: "Multiple Bounce Roll", fam: "ROLL" },
  { id: "r05", name: "Triple Stroke Roll", fam: "ROLL" },
  { id: "r06", name: "Double Stroke Open Roll", fam: "ROLL" },
  { id: "r07", name: "Five Stroke Roll", fam: "ROLL" },
  { id: "r08", name: "Six Stroke Roll", fam: "ROLL" },
  { id: "r09", name: "Seven Stroke Roll", fam: "ROLL" },
  { id: "r10", name: "Nine Stroke Roll", fam: "ROLL" },
  { id: "r11", name: "Ten Stroke Roll", fam: "ROLL" },
  { id: "r12", name: "Eleven Stroke Roll", fam: "ROLL" },
  { id: "r13", name: "Thirteen Stroke Roll", fam: "ROLL" },
  { id: "r14", name: "Fifteen Stroke Roll", fam: "ROLL" },
  { id: "r15", name: "Seventeen Stroke Roll", fam: "ROLL" },
  { id: "d01", name: "Single Paradiddle", fam: "DIDDLE" },
  { id: "d02", name: "Double Paradiddle", fam: "DIDDLE" },
  { id: "d03", name: "Triple Paradiddle", fam: "DIDDLE" },
  { id: "d04", name: "Single Paradiddle-Diddle", fam: "DIDDLE" },
  { id: "f01", name: "Flam", fam: "FLAM" },
  { id: "f02", name: "Flam Accent", fam: "FLAM" },
  { id: "f03", name: "Flam Tap", fam: "FLAM" },
  { id: "f04", name: "Flamacue", fam: "FLAM" },
  { id: "f05", name: "Flam Paradiddle", fam: "FLAM" },
  { id: "f06", name: "Single Flammed Mill", fam: "FLAM" },
  { id: "f07", name: "Flam Paradiddle-Diddle", fam: "FLAM" },
  { id: "f08", name: "Pataflafla", fam: "FLAM" },
  { id: "f09", name: "Swiss Army Triplet", fam: "FLAM" },
  { id: "f10", name: "Inverted Flam Tap", fam: "FLAM" },
  { id: "f11", name: "Flam Drag", fam: "FLAM" },
  { id: "g01", name: "Drag", fam: "DRAG" },
  { id: "g02", name: "Single Drag Tap", fam: "DRAG" },
  { id: "g03", name: "Double Drag Tap", fam: "DRAG" },
  { id: "g04", name: "Lesson 25", fam: "DRAG" },
  { id: "g05", name: "Single Dragadiddle", fam: "DRAG" },
  { id: "g06", name: "Drag Paradiddle #1", fam: "DRAG" },
  { id: "g07", name: "Drag Paradiddle #2", fam: "DRAG" },
  { id: "g08", name: "Single Ratamacue", fam: "DRAG" },
  { id: "g09", name: "Double Ratamacue", fam: "DRAG" },
  { id: "g10", name: "Triple Ratamacue", fam: "DRAG" },
];

const FAMILIES = [
  { key: "ROLL", label: "I. Roll Rudiments" },
  { key: "DIDDLE", label: "II. Diddle Rudiments" },
  { key: "FLAM", label: "III. Flam Rudiments" },
  { key: "DRAG", label: "IV. Drag Rudiments" },
];

// Sticking notation: uppercase R/L = main stroke. Lowercase r/l prefix = grace note(s)
// (flam = one grace letter, drag = two). "!" prefix on a token marks an accented main stroke.
const RUDIMENT_INFO = {
  r01: { desc: "The foundation of every rudiment — one clean stroke per hand, alternating evenly forever.", sticking: "R L R L R L R L" },
  r02: { desc: "Four alternating strokes played as a single rhythmic unit, usually with an accent on the first note.", sticking: "!R L R L" },
  r03: { desc: "Seven alternating strokes ending on an accent — a classic one-bar fill.", sticking: "R L R L R L !R" },
  r04: { desc: "Each stroke is pressed into the head to create a controlled, sustained buzz rather than a single clean hit.", sticking: null },
  r05: { desc: "Three controlled strokes per hand, alternating — a bridge between the double stroke roll and a full buzz roll.", sticking: "R R R L L L" },
  r06: { desc: "Two clean, even strokes per hand, alternating — the \"long roll,\" and the base every numbered roll below is built from.", sticking: "R R L L R R L L" },
  r07: { desc: "Two doubles finished with an accented single.", sticking: "R R L L !R" },
  r08: { desc: "A single, a double, a double, and an accented single across the hands.", sticking: "R L L R R !L" },
  r09: { desc: "Three doubles finished with an accented single.", sticking: "R R L L R R !L" },
  r10: { desc: "Four doubles finished with an accented single.", sticking: "R R L L R R L L !R" },
  r11: { desc: "Four doubles finished with two accented alternating singles.", sticking: "R R L L R R L L !R !L" },
  r12: { desc: "Five doubles finished with an accented single.", sticking: "R R L L R R L L R R !L" },
  r13: { desc: "Six doubles finished with an accented single.", sticking: "R R L L R R L L R R L L !R" },
  r14: { desc: "Seven doubles finished with an accented single.", sticking: "R R L L R R L L R R L L R R !L" },
  r15: { desc: "Eight doubles finished with an accented single.", sticking: "R R L L R R L L R R L L R R L L !R" },
  d01: { desc: "Two alternating strokes finished with a same-hand double — hands literally spell out \"para-diddle.\"", sticking: "R L R R L R L L" },
  d02: { desc: "Two pairs of alternating strokes finished with a same-hand double.", sticking: "R L R L R R L R L R L L" },
  d03: { desc: "Three pairs of alternating strokes finished with a same-hand double.", sticking: "R L R L R L R R L R L R L R L L" },
  d04: { desc: "A paradiddle's opening, followed by two doubles instead of one.", sticking: "R L R R L L" },
  f01: { desc: "A soft grace note struck just before the main stroke by the opposite hand, so the two blend into one thick sound.", sticking: "lR rL" },
  f02: { desc: "An accented flam followed by two unaccented taps, in a three-note group that alternates lead hand.", sticking: "lR L R" },
  f03: { desc: "A flam immediately followed by a tap from the same hand.", sticking: "lR R rL L" },
  f04: { desc: "A five-note phrase that opens and closes with an unaccented flam, with the accent landing on the note just before that closing flam.", sticking: "lR L R !L lR" },
  f05: { desc: "A standard paradiddle with a grace note added to its very first stroke.", sticking: "lR L R R L R L L" },
  f06: { desc: "An inverted paradiddle — doubles before singles — with a flam added to the start of each double.", sticking: "lR R L R rL L R L" },
  f07: { desc: "A paradiddle-diddle with a grace note added to its first stroke.", sticking: "lR L R R L L" },
  f08: { desc: "A four-note pattern of alternating strokes with flams bookending the first and last notes.", sticking: "lR L R rL" },
  f09: { desc: "A three-note triplet — flam, tap, tap — with the lead hand flipping each repetition.", sticking: "lR R L" },
  f10: { desc: "A flam tap with the grace note placed on the opposite hand from where you'd expect — genuinely inverted from the standard version.", sticking: null },
  f11: { desc: "A flam leading into a drag: one clear stroke, then two fast grace taps into a closing stroke.", sticking: "lR llR" },
  g01: { desc: "Two soft grace notes (a \"ruff\") from one hand, landing just before the main stroke of the other.", sticking: "rrL llR" },
  g02: { desc: "A drag followed by two taps from the same hand.", sticking: "rrL R R" },
  g03: { desc: "Two drags in a row, followed by two taps.", sticking: null },
  g04: { desc: "A classic alternating drag pattern — drag, tap, tap — that trades lead hands every group. Also called \"Lesson 25.\"", sticking: "rrL R R llR L L" },
  g05: { desc: "A paradiddle whose very first stroke is bounced as a drag instead of played clean — same shape as a paradiddle, different articulation on note one.", sticking: "rrR L R R" },
  g06: { desc: "A paradiddle with a drag added before the first note as its own distinct ornament, rather than bounced into it like the dragadiddle. Exact placement varies a little between method books.", sticking: null },
  g07: { desc: "Drag Paradiddle #1 with a second drag added. Placement varies between teaching traditions — check your method book for the exact version you're learning.", sticking: null },
  g08: { desc: "A single stroke four with a drag added to the very first note and an accent on the last.", sticking: "llR L R !L" },
  g09: { desc: "Builds on the single ratamacue by stacking an extra drag at the front.", sticking: null },
  g10: { desc: "Builds on the single ratamacue by stacking two extra drags at the front — the most demanding of the ratamacue family.", sticking: null },
};

const STORAGE_KEY = "rudiment-practice-log";
const THEME_KEY = "rudiment-theme-pref";
const DEFAULT_BPM = 80;
const MIN_BPM = 40;
const MAX_BPM = 200;
const HISTORY_CAP = 30;
const BPM_STEP = 5;

// COLORS values are CSS custom-property references so the whole app can retheme
// by just changing the variables set on the root element — no component changes needed.
const COLORS = {
  bg: "var(--bg)",
  surface: "var(--surface)",
  surfaceRaised: "var(--surface-raised)",
  hairline: "var(--hairline)",
  parchment: "var(--text)",
  muted: "var(--muted)",
  mutedDim: "var(--muted-dim)",
  brass: "var(--accent)",
  brassDim: "var(--accent-dim)",
  fresh: "var(--fresh)",
  due: "var(--due)",
  overdue: "var(--overdue)",
  neverRing: "var(--never-ring)",
};

const STATUS = {
  dark: { fresh: "#4FAE72", due: "#E0A83E", overdue: "#E15A3E", neverRing: "#5B6472" },
  light: { fresh: "#2F8F52", due: "#B8791F", overdue: "#B0392C", neverRing: "#9CA7B5" },
};

const THEMES = {
  walnut: {
    label: "Walnut", mode: "dark",
    bg: "#0A0908", surface: "#17140F", surfaceRaised: "#1F1A14", hairline: "#332C22",
    text: "#F5EEDD", muted: "#9C8F79", mutedDim: "#655A48", accent: "#D9AE54", accentDim: "#8A733B",
  },
  midnight: {
    label: "Midnight", mode: "dark",
    bg: "#0A0D13", surface: "#12161F", surfaceRaised: "#1A202B", hairline: "#2A3140",
    text: "#E7ECF2", muted: "#8B96A8", mutedDim: "#57616F", accent: "#6FA8D9", accentDim: "#3E6E96",
  },
  crimson: {
    label: "Crimson", mode: "dark",
    bg: "#100B0A", surface: "#1B1211", surfaceRaised: "#241816", hairline: "#3A2623",
    text: "#F2E8E4", muted: "#A38F89", mutedDim: "#6E5C57", accent: "#C1443A", accentDim: "#7E2E28",
  },
  parchment: {
    label: "Parchment", mode: "light",
    bg: "#F1EAD9", surface: "#FFFFFF", surfaceRaised: "#F4EEDF", hairline: "#DCD3BE",
    text: "#2B2620", muted: "#6B6252", mutedDim: "#8F866F", accent: "#3A5A6B", accentDim: "#547082",
  },
};

function cssVarsForTheme(themeKey) {
  const t = THEMES[themeKey] || THEMES.walnut;
  const s = STATUS[t.mode] || STATUS.dark;
  return {
    "--bg": t.bg, "--surface": t.surface, "--surface-raised": t.surfaceRaised, "--hairline": t.hairline,
    "--text": t.text, "--muted": t.muted, "--muted-dim": t.mutedDim, "--accent": t.accent, "--accent-dim": t.accentDim,
    "--fresh": s.fresh, "--due": s.due, "--overdue": s.overdue, "--never-ring": s.neverRing,
  };
}

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
function daysSince(iso) {
  if (!iso) return null;
  const then = new Date(iso);
  const now = new Date();
  const ms = now.setHours(0, 0, 0, 0) - new Date(then).setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}
function relativeLabel(iso) {
  const d = daysSince(iso);
  if (d === null) return "Never logged";
  if (d <= 0) return "Practiced today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 14) return "Last week";
  const weeks = Math.floor(d / 7);
  if (d < 60) return `${weeks} weeks ago`;
  return `${Math.floor(d / 30)} months ago`;
}
function statusFor(iso) {
  const d = daysSince(iso);
  if (d === null) return { color: COLORS.neverRing, label: "new" };
  if (d <= 3) return { color: COLORS.fresh, label: "fresh" };
  if (d <= 14) return { color: COLORS.due, label: "due soon" };
  return { color: COLORS.overdue, label: "overdue" };
}

function useGoogleFonts() {
  useEffect(() => {
    const id = "rudiment-tracker-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function GlobalStyle() {
  return (
    <style>{`
      @keyframes padPop { 0% { transform: scale(1);} 35% { transform: scale(1.05);} 100% { transform: scale(1);} }
      @keyframes checkIn { 0% { opacity:0; transform: scale(0.6);} 40% { opacity:1; transform: scale(1.1);} 100% { opacity:1; transform: scale(1);} }
      @keyframes checkOut { 0% { opacity:1;} 100% { opacity:0;} }
      .rud-card { transition: transform 0.16s ease, border-color 0.2s ease; }
      .rud-card:hover { transform: translateY(-2px); border-color: ${COLORS.brassDim}; }
      .rud-card:active { transform: translateY(0px) scale(0.99); }
      .rud-expand { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.28s ease; width: 100%; }
      .rud-expand.open { grid-template-rows: 1fr; }
      .rud-expand > div { overflow: hidden; min-height: 0; }
      .rud-pop { animation: padPop 0.35s ease; }
      .tab-btn { transition: color 0.15s ease, border-color 0.15s ease; }
      .stat-tile { transition: border-color 0.2s ease; }
      .stat-tile:hover { border-color: ${COLORS.brassDim}; }
      .prog-row { transition: border-color 0.2s ease, background 0.2s ease; }
      .prog-row:hover { border-color: ${COLORS.brassDim}; background: ${COLORS.surfaceRaised}; }
      .theme-swatch { transition: transform 0.15s ease, box-shadow 0.15s ease; cursor: pointer; }
      .theme-swatch:hover { transform: translateY(-1px); }
      @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
      .skeleton { background: linear-gradient(90deg, ${COLORS.surface} 25%, ${COLORS.surfaceRaised} 37%, ${COLORS.surface} 63%); background-size: 400px 100%; animation: shimmer 1.4s ease infinite; }
      @keyframes toastIn { 0% { opacity: 0; transform: translate(-50%, 12px); } 100% { opacity: 1; transform: translate(-50%, 0); } }
      .toast { animation: toastIn 0.22s ease; }
      button:disabled { opacity: 0.35; cursor: not-allowed !important; }
      input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
      ::selection { background: ${COLORS.brass}; color: ${COLORS.bg}; }
    `}</style>
  );
}

function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  return (
    <div
      className="toast"
      style={{
        position: "fixed", left: "50%", bottom: 24, transform: "translateX(-50%)", zIndex: 60,
        background: COLORS.surfaceRaised, border: `1px solid ${COLORS.hairline}`, borderRadius: 10,
        padding: "10px 12px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      <span style={{ fontSize: 13, color: COLORS.parchment, fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {toast.msg}
      </span>
      {toast.actionLabel && (
        <button
          onClick={() => { toast.onAction && toast.onAction(); onDismiss(); }}
          style={{ background: "none", border: "none", color: COLORS.brass, fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0 }}
        >
          {toast.actionLabel}
        </button>
      )}
    </div>
  );
}

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 70 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.surface, border: `1px solid ${COLORS.hairline}`, borderRadius: 14, padding: "20px", maxWidth: 340, width: "100%" }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 17, color: COLORS.parchment, marginBottom: 8, textTransform: "uppercase" }}>{title}</div>
        <div style={{ fontSize: 13.5, color: COLORS.muted, lineHeight: 1.5, marginBottom: 18 }}>{message}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ background: "none", border: `1px solid ${COLORS.hairline}`, color: COLORS.muted, borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ background: COLORS.overdue, border: "none", color: "#fff", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.hairline}`, borderRadius: 12, padding: "16px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div className="skeleton" style={{ width: 100, height: 100, borderRadius: "50%" }} />
      <div className="skeleton" style={{ width: "70%", height: 12, borderRadius: 4 }} />
      <div className="skeleton" style={{ width: "40%", height: 10, borderRadius: 4 }} />
    </div>
  );
}

// ---- Clean arc gauge with tick marks: showing bpm position within 40-200, like a metronome dial ----
function TempoGauge({ bpm, status, size = 100, pop }) {
  const stroke = 6;
  const r = size / 2 - stroke;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, Math.max(0, (bpm - MIN_BPM) / (MAX_BPM - MIN_BPM)));
  const offset = c * (1 - pct);
  const cx = size / 2;
  const cy = size / 2;
  const ticks = [40, 60, 80, 100, 120, 140, 160, 180, 200];

  return (
    <svg className={pop ? "rud-pop" : ""} width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <circle cx={cx} cy={cy} r={r} fill={COLORS.surfaceRaised} />
      {ticks.map((v) => {
        const tPct = (v - MIN_BPM) / (MAX_BPM - MIN_BPM);
        const angle = -90 + tPct * 360;
        const rad = (angle * Math.PI) / 180;
        const inner = r + stroke / 2 + 1;
        const outer = r + stroke / 2 + (v % 40 === 0 ? 5.5 : 3);
        const x1 = cx + inner * Math.cos(rad), y1 = cy + inner * Math.sin(rad);
        const x2 = cx + outer * Math.cos(rad), y2 = cy + outer * Math.sin(rad);
        return <line key={v} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.hairline} strokeWidth="1.4" />;
      })}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.hairline} strokeWidth={stroke} />
      <circle
        cx={cx} cy={cy} r={r} fill="none" stroke={status.color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.4s ease" }}
      />
      {(() => {
        const needleAngle = -90 + pct * 360;
        const rad = (needleAngle * Math.PI) / 180;
        const tipX = cx + r * Math.cos(rad), tipY = cy + r * Math.sin(rad);
        return <circle cx={tipX} cy={tipY} r="2.6" fill={COLORS.bg} stroke={status.color} strokeWidth="1.5" />;
      })()}
      <text x={cx} y={cy - 1} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontWeight="600" fontSize={size * 0.26} fill={COLORS.parchment}>
        {bpm}
      </text>
      <text x={cx} y={cy + size * 0.17} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="600" fontSize={size * 0.09} letterSpacing="1.5" fill={COLORS.muted}>
        BPM
      </text>
    </svg>
  );
}

function Sparkline({ history, width = 220, height = 56, fullWidth = false }) {
  if (!history || history.length < 2) {
    return (
      <div style={{ fontSize: 12, color: COLORS.mutedDim, textAlign: "center", padding: "10px 4px", fontStyle: "italic" }}>
        Log a few sessions to see your tempo progress here.
      </div>
    );
  }
  const pts = history.slice(-12);
  const bpms = pts.map((p) => p.bpm);
  const min = Math.min(...bpms);
  const max = Math.max(...bpms);
  const span = max - min || 1;
  const padX = 6, padY = 8;
  const w = width - padX * 2, h = height - padY * 2;
  const coords = pts.map((p, i) => {
    const x = padX + (i / (pts.length - 1)) * w;
    const y = padY + h - ((p.bpm - min) / span) * h;
    return [x, y];
  });
  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = coords[coords.length - 1];
  const first = pts[0].bpm;
  const lastBpm = pts[pts.length - 1].bpm;
  const trendColor = lastBpm > first ? COLORS.fresh : lastBpm < first ? COLORS.overdue : COLORS.muted;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: fullWidth ? "stretch" : "center", gap: 4, width: fullWidth ? "100%" : "auto" }}>
      <svg width={fullWidth ? "100%" : width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <path d={path} fill="none" stroke={trendColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last[0]} cy={last[1]} r="3.2" fill={trendColor} />
      </svg>
      <div style={{ fontSize: 11, color: COLORS.mutedDim, fontFamily: "'Inter', sans-serif", textAlign: fullWidth ? "left" : "center" }}>
        {first} → {lastBpm} BPM over last {pts.length} sessions
      </div>
    </div>
  );
}

// ---- Parse a sticking string into tokens: { accent, grace: 'l'|'r'|'ll'|'rr'|'', main: 'R'|'L' } ----
function parseSticking(sticking) {
  return sticking.split(" ").map((raw) => {
    const m = raw.match(/^(!?)([lr]*)([RL])$/);
    if (!m) return null;
    const [, bang, grace, main] = m;
    return { accent: bang === "!" || grace.length > 0, grace, main };
  }).filter(Boolean);
}

// ---- Simplified single-line staff notation for a sticking pattern ----
function StaffNotation({ sticking }) {
  const tokens = parseSticking(sticking);
  const noteSpacing = 44;
  const marginX = 26;
  const width = marginX * 2 + (tokens.length - 1) * noteSpacing;
  const height = 118;
  const staffY = 62;
  const stemTop = staffY - 34;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: width }}>
      <line x1={4} y1={staffY} x2={width - 4} y2={staffY} stroke={COLORS.hairline} strokeWidth="1.5" />
      {tokens.map((t, i) => {
        const x = marginX + i * noteSpacing;
        const isR = t.main === "R";
        const graceCount = t.grace.length;
        return (
          <g key={i}>
            {/* grace notes (flam/drag) */}
            {Array.from({ length: graceCount }).map((_, gi) => {
              const gx = x - 15 - (graceCount - 1 - gi) * 7;
              const gy = staffY - 14;
              const graceHand = t.grace[gi].toUpperCase();
              return (
                <g key={gi}>
                  <text x={gx} y={gy - 19} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="7.5" fill={COLORS.mutedDim}>
                    {graceHand}
                  </text>
                  <line x1={gx} y1={gy} x2={gx} y2={gy - 14} stroke={COLORS.muted} strokeWidth="1.3" />
                  <line x1={gx} y1={gy - 14} x2={gx + 6} y2={gy - 10} stroke={COLORS.muted} strokeWidth="1.3" />
                  <circle cx={gx} cy={gy} r="3.2" fill={COLORS.muted} />
                </g>
              );
            })}
            {/* accent mark */}
            {t.accent && (
              <text x={x} y={stemTop - 8} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontWeight="700" fontSize="15" fill={COLORS.overdue}>
                &gt;
              </text>
            )}
            {/* stem */}
            <line x1={x} y1={staffY} x2={x} y2={stemTop} stroke={isR ? COLORS.brass : COLORS.parchment} strokeWidth="1.6" />
            {/* notehead */}
            <circle cx={x} cy={staffY} r="6" fill={isR ? COLORS.brass : "transparent"} stroke={isR ? "none" : COLORS.parchment} strokeWidth="1.6" />
            {/* R/L label */}
            <text x={x} y={staffY + 22} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="11" fill={COLORS.muted}>
              {t.main}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function RudimentInfoModal({ item, onClose }) {
  const info = RUDIMENT_INFO[item.id];
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: COLORS.surface, border: `1px solid ${COLORS.hairline}`, borderRadius: 16, padding: "24px 22px", maxWidth: 440, width: "100%", maxHeight: "82vh", overflowY: "auto" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div style={{ fontSize: 11, color: COLORS.brass, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase" }}>
            {item.fam.charAt(0) + item.fam.slice(1).toLowerCase()} rudiment
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.muted, fontSize: 20, cursor: "pointer", lineHeight: 1, padding: 0 }} aria-label="Close">×</button>
        </div>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 24, color: COLORS.parchment, marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.3 }}>
          {item.name}
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: COLORS.muted, lineHeight: 1.55, marginBottom: 20 }}>
          {info.desc}
        </div>
        <div style={{ fontSize: 11.5, color: COLORS.brass, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 }}>
          Notation
        </div>
        {info.sticking ? (
          <>
            <div style={{ background: COLORS.bg, borderRadius: 10, padding: "12px 8px", display: "flex", justifyContent: "center", overflowX: "auto" }}>
              <StaffNotation sticking={info.sticking} />
            </div>
            <div style={{ fontSize: 11, color: COLORS.mutedDim, marginTop: 10, lineHeight: 1.5 }}>
              Filled note = right hand · Outline note = left hand · small note before = grace note (flam/drag) · <span style={{ color: COLORS.overdue, fontWeight: 700 }}>&gt;</span> = accent.
              Spacing here is even for readability — it's a sticking guide, not exact rhythmic note values. Pair it with a metronome for timing.
            </div>
          </>
        ) : (
          <div style={{ fontSize: 13, color: COLORS.mutedDim, fontStyle: "italic", background: COLORS.bg, borderRadius: 10, padding: "14px 12px" }}>
            This one's exact sticking varies a bit between method books — check your teacher's notation or the official PAS rudiment sheet for the precise pattern.
          </div>
        )}
      </div>
    </div>
  );
}

function RudimentCard({ item, data, onChangeBpm, onLogToday, onShowInfo }) {
  const [open, setOpen] = useState(false);
  const [justLogged, setJustLogged] = useState(false);
  const [pop, setPop] = useState(false);
  const bpm = data.bpm ?? DEFAULT_BPM;
  const status = statusFor(data.lastPracticed);

  const handleLog = (e) => {
    e.stopPropagation();
    onLogToday(item.id);
    setJustLogged(true);
    setPop(true);
    setTimeout(() => setJustLogged(false), 1100);
    setTimeout(() => setPop(false), 400);
    setTimeout(() => setOpen(false), 550);
  };

  return (
    <div
      className="rud-card"
      style={{ background: COLORS.surface, border: `1px solid ${COLORS.hairline}`, borderRadius: 12, padding: "16px 14px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer", position: "relative", overflow: "hidden" }}
      onClick={() => setOpen((o) => !o)}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: status.color, transition: "background 0.4s ease" }} />
      <button
        onClick={(e) => { e.stopPropagation(); onShowInfo(item); }}
        aria-label={`About ${item.name}`}
        style={{ position: "absolute", top: 4, right: 4, width: 36, height: 36, borderRadius: "50%", border: `1px solid ${COLORS.hairline}`, background: COLORS.surfaceRaised, color: COLORS.muted, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
      >
        i
      </button>
      <div style={{ position: "relative" }}>
        <TempoGauge bpm={bpm} status={status} pop={pop} />
        {justLogged && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", animation: "checkIn 0.3s ease, checkOut 0.3s ease 0.8s forwards", pointerEvents: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.fresh, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.bg, fontWeight: 800, fontSize: 17, boxShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>✓</div>
          </div>
        )}
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14.5, color: COLORS.parchment, lineHeight: 1.25 }}>{item.name}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: status.color }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: COLORS.muted, fontWeight: 500 }}>{relativeLabel(data.lastPracticed)}</span>
        </div>
      </div>

      <div className={`rud-expand ${open ? "open" : ""}`}>
        <div>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", marginTop: 4, paddingTop: 12, borderTop: `1px solid ${COLORS.hairline}`, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <button
                onClick={() => onChangeBpm(item.id, Math.max(MIN_BPM, bpm - BPM_STEP))}
                disabled={bpm <= MIN_BPM}
                style={stepperBtnStyle}
                aria-label="Decrease tempo"
              >
                −
              </button>
              <input
                type="number" value={bpm} step={BPM_STEP}
                onChange={(e) => { const v = parseInt(e.target.value, 10); if (!Number.isNaN(v)) onChangeBpm(item.id, Math.min(MAX_BPM, Math.max(MIN_BPM, v))); }}
                style={{ width: 58, textAlign: "center", background: COLORS.bg, border: `1px solid ${COLORS.hairline}`, borderRadius: 8, color: COLORS.parchment, fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, padding: "6px 4px" }}
              />
              <button
                onClick={() => onChangeBpm(item.id, Math.min(MAX_BPM, bpm + BPM_STEP))}
                disabled={bpm >= MAX_BPM}
                style={stepperBtnStyle}
                aria-label="Increase tempo"
              >
                +
              </button>
            </div>
            <Sparkline history={data.history} />
            <button onClick={handleLog} style={{ background: COLORS.brass, color: COLORS.bg, border: "none", borderRadius: 8, padding: "8px 10px", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: 0.3, cursor: "pointer" }}>
              Log practice today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const stepperBtnStyle = {
  width: 30, height: 30, borderRadius: 8, border: `1px solid ${COLORS.hairline}`,
  background: COLORS.surfaceRaised, color: COLORS.parchment, fontSize: 17, fontWeight: 600,
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
};

const FILTERS = ["ALL", "ROLL", "DIDDLE", "FLAM", "DRAG"];
const SORTS = [
  { key: "default", label: "List order" },
  { key: "overdue", label: "Overdue first" },
  { key: "az", label: "A–Z" },
  { key: "bpm", label: "Lowest tempo" },
];
const PROGRESS_SORTS = [
  { key: "improved", label: "Most improved" },
  { key: "sessions", label: "Most sessions" },
  { key: "attention", label: "Needs attention" },
  { key: "az", label: "A–Z" },
];

function StatTile({ label, value, sub }) {
  return (
    <div className="stat-tile" style={{ background: COLORS.surface, border: `1px solid ${COLORS.hairline}`, borderRadius: 10, padding: "12px 14px", flex: "1 1 120px", minWidth: 120 }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 22, color: COLORS.parchment }}>{value}</div>
      <div style={{ fontSize: 11.5, color: COLORS.brass, fontWeight: 600, letterSpacing: 0.4, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: COLORS.mutedDim, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Heatmap({ dailyCounts }) {
  const days = [];
  const today = new Date();
  for (let i = 41; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = todayKey(d);
    days.push({ key, count: dailyCounts[key] || 0 });
  }
  const colorFor = (c) => {
    if (c === 0) return COLORS.surfaceRaised;
    if (c === 1) return COLORS.brassDim;
    if (c <= 3) return COLORS.fresh;
    return COLORS.fresh;
  };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 4, maxWidth: 400 }}>
        {days.map((d) => (
          <div key={d.key} title={`${d.key}: ${d.count} rudiment${d.count === 1 ? "" : "s"}`} style={{ width: "100%", aspectRatio: "1", borderRadius: 3, background: colorFor(d.count) }} />
        ))}
      </div>
      <div style={{ fontSize: 11, color: COLORS.mutedDim, marginTop: 8 }}>Last 42 days — brighter means more rudiments practiced that day</div>
    </div>
  );
}

function ProgressRow({ item, entry, onLogToday, onShowInfo }) {
  const history = entry.history || [];
  const bpm = entry.bpm ?? DEFAULT_BPM;
  const status = statusFor(entry.lastPracticed);
  const delta = history.length >= 2 ? bpm - history[0].bpm : null;

  return (
    <div className="prog-row" style={{ display: "flex", gap: 12, padding: "12px 14px", background: COLORS.surface, border: `1px solid ${COLORS.hairline}`, borderRadius: 10, marginBottom: 8 }}>
      <div style={{ width: 5, alignSelf: "stretch", borderRadius: 3, background: status.color, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div style={{ minWidth: 0, cursor: "pointer" }} onClick={() => onShowInfo(item)}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13.5, color: COLORS.parchment, textDecoration: "underline", textDecorationColor: COLORS.hairline, textUnderlineOffset: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.name}
            </div>
            <div style={{ fontSize: 11, color: COLORS.mutedDim, marginTop: 2 }}>{item.fam.charAt(0) + item.fam.slice(1).toLowerCase()} · {relativeLabel(entry.lastPracticed)}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 13, color: delta === null ? COLORS.mutedDim : delta > 0 ? COLORS.fresh : delta < 0 ? COLORS.overdue : COLORS.muted }}>
                {delta === null ? "—" : delta > 0 ? `+${delta}` : delta}
              </div>
              <div style={{ fontSize: 10, color: COLORS.mutedDim, whiteSpace: "nowrap" }}>{history.length} sess.</div>
            </div>
            <button onClick={() => onLogToday(item.id)} style={{ minWidth: 44, minHeight: 34, background: COLORS.surfaceRaised, border: `1px solid ${COLORS.hairline}`, color: COLORS.brass, borderRadius: 8, padding: "6px 12px", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
              Log
            </button>
          </div>
        </div>
        <Sparkline history={history} fullWidth width={280} height={40} />
      </div>
    </div>
  );
}

function ThemePicker({ themeKey, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 11, color: COLORS.mutedDim, fontWeight: 600, letterSpacing: 0.4, marginRight: 2 }}>THEME</span>
      {Object.entries(THEMES).map(([key, t]) => (
        <button
          key={key}
          className="theme-swatch"
          onClick={() => onChange(key)}
          aria-label={t.label}
          title={t.label}
          style={{
            width: 24, height: 24, borderRadius: "50%", border: key === themeKey ? `2px solid ${COLORS.brass}` : `1px solid ${COLORS.hairline}`,
            background: t.bg, boxShadow: key === themeKey ? `0 0 0 2px ${COLORS.bg}, 0 0 0 3px ${COLORS.brass}` : "none",
            padding: 0, cursor: "pointer", position: "relative", overflow: "hidden",
          }}
        >
          <span style={{ position: "absolute", right: 0, bottom: 0, width: "60%", height: "60%", background: t.accent, borderTopLeftRadius: 8 }} />
        </button>
      ))}
    </div>
  );
}

export default function RudimentTracker() {
  useGoogleFonts();
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("practice");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState("default");
  const [progressSort, setProgressSort] = useState("improved");
  const [infoItem, setInfoItem] = useState(null);
  const [themeKey, setThemeKey] = useState("walnut");
  const [toast, setToast] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, actionLabel, onAction) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, actionLabel, onAction });
    toastTimer.current = setTimeout(() => setToast(null), 4500);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch (e) { console.error("Failed to load practice data", e); }
    try {
      const t = localStorage.getItem(THEME_KEY);
      if (t && THEMES[t]) setThemeKey(t);
    } catch (e) {}
    setLoaded(true);
  }, []);

  const persist = useCallback((next) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch (e) { console.error("Failed to save practice data", e); }
  }, []);

  const changeTheme = useCallback((key) => {
    setThemeKey(key);
    try { localStorage.setItem(THEME_KEY, key); }
    catch (e) { console.error("Failed to save theme", e); }
  }, []);

  const updateEntry = useCallback((id, patch) => {
    setData((prev) => {
      const next = { ...prev, [id]: { ...prev[id], ...patch } };
      persist(next);
      return next;
    });
  }, [persist]);

  const onChangeBpm = useCallback((id, bpm) => updateEntry(id, { bpm }), [updateEntry]);

  const onLogToday = useCallback((id) => {
    let prevEntrySnapshot = null;
    setData((prev) => {
      const entry = prev[id] || {};
      prevEntrySnapshot = entry;
      const bpm = entry.bpm ?? DEFAULT_BPM;
      const key = todayKey();
      const history = Array.isArray(entry.history) ? [...entry.history] : [];
      const idx = history.findIndex((h) => h.date === key);
      const alreadyLoggedToday = idx >= 0;
      if (idx >= 0) history[idx] = { date: key, bpm };
      else history.push({ date: key, bpm });
      const trimmed = history.slice(-HISTORY_CAP);
      const next = { ...prev, [id]: { ...entry, bpm, lastPracticed: new Date().toISOString(), history: trimmed } };
      persist(next);
      const name = RUDIMENTS.find((r) => r.id === id)?.name || "rudiment";
      showToast(alreadyLoggedToday ? `Updated today's log for ${name}` : `Logged ${name}`, "Undo", () => {
        setData((p2) => {
          const reverted = { ...p2, [id]: prevEntrySnapshot };
          persist(reverted);
          return reverted;
        });
      });
      return next;
    });
  }, [persist, showToast]);

  const resetAllProgress = useCallback(() => {
    setData({});
    persist({});
    setConfirmReset(false);
    showToast("All progress cleared", null, null);
  }, [persist, showToast]);

  const filtered = useMemo(() => {
    let list = RUDIMENTS.filter((r) => (filter === "ALL" ? true : r.fam === filter));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q));
    }
    const withData = list.map((r) => ({ r, d: data[r.id] || {} }));
    if (sort === "az") withData.sort((a, b) => a.r.name.localeCompare(b.r.name));
    if (sort === "bpm") withData.sort((a, b) => (a.d.bpm ?? DEFAULT_BPM) - (b.d.bpm ?? DEFAULT_BPM));
    if (sort === "overdue") withData.sort((a, b) => {
      const da = daysSince(a.d.lastPracticed), db = daysSince(b.d.lastPracticed);
      return (db === null ? Infinity : db) - (da === null ? Infinity : da);
    });
    return withData;
  }, [filter, query, sort, data]);

  const grouped = useMemo(() => {
    if (sort !== "default" || filter !== "ALL") return [{ key: "RESULTS", label: null, items: filtered }];
    return FAMILIES.map((f) => ({ key: f.key, label: f.label, items: filtered.filter((x) => x.r.fam === f.key) }));
  }, [filtered, sort, filter]);

  const overdueCount = useMemo(
    () => RUDIMENTS.filter((r) => (daysSince((data[r.id] || {}).lastPracticed) ?? Infinity) > 14).length,
    [data]
  );

  const stats = useMemo(() => {
    const practicedDates = new Set();
    const dailyCounts = {};
    let totalSessions = 0;
    RUDIMENTS.forEach((r) => {
      const h = (data[r.id] || {}).history || [];
      totalSessions += h.length;
      h.forEach((entry) => {
        practicedDates.add(entry.date);
        dailyCounts[entry.date] = (dailyCounts[entry.date] || 0) + 1;
      });
      const lp = (data[r.id] || {}).lastPracticed;
      if (lp) practicedDates.add(todayKey(new Date(lp)));
    });
    let streak = 0;
    let cursor = new Date();
    if (!practicedDates.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (practicedDates.has(todayKey(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
    const thisWeek = RUDIMENTS.filter((r) => {
      const d = daysSince((data[r.id] || {}).lastPracticed);
      return d !== null && d <= 6;
    }).length;
    const bpmSum = RUDIMENTS.reduce((sum, r) => sum + ((data[r.id] || {}).bpm ?? DEFAULT_BPM), 0);
    const avgBpm = Math.round(bpmSum / RUDIMENTS.length);
    return { streak, thisWeek, avgBpm, totalSessions, dailyCounts };
  }, [data]);

  const progressList = useMemo(() => {
    const list = RUDIMENTS.map((r) => ({ r, d: data[r.id] || {} }));
    if (progressSort === "az") list.sort((a, b) => a.r.name.localeCompare(b.r.name));
    if (progressSort === "sessions") list.sort((a, b) => ((b.d.history || []).length) - ((a.d.history || []).length));
    if (progressSort === "attention") list.sort((a, b) => {
      const da = daysSince(a.d.lastPracticed), db = daysSince(b.d.lastPracticed);
      return (db === null ? Infinity : db) - (da === null ? Infinity : da);
    });
    if (progressSort === "improved") list.sort((a, b) => {
      const ha = a.d.history || [], hb = b.d.history || [];
      const da = ha.length >= 2 ? (a.d.bpm ?? DEFAULT_BPM) - ha[0].bpm : -Infinity;
      const db = hb.length >= 2 ? (b.d.bpm ?? DEFAULT_BPM) - hb[0].bpm : -Infinity;
      return db - da;
    });
    return list;
  }, [data, progressSort]);

  const rootStyle = { ...cssVarsForTheme(themeKey), background: COLORS.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif" };

  if (!loaded) {
    return (
      <div style={rootStyle}>
        <GlobalStyle />
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 20px 60px" }}>
          <div className="skeleton" style={{ width: 220, height: 30, borderRadius: 6, marginBottom: 10 }} />
          <div className="skeleton" style={{ width: 300, height: 14, borderRadius: 4, marginBottom: 24 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
            {Array.from({ length: 8 }).map((_, i) => (<CardSkeleton key={i} />))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={rootStyle}>
      <GlobalStyle />
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 20px 60px" }}>
        <header style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 30, letterSpacing: 0.5, color: COLORS.parchment, textTransform: "uppercase" }}>
              40 Rudiments
            </div>
            <div style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>
              {overdueCount > 0
                ? `${overdueCount} rudiment${overdueCount === 1 ? "" : "s"} overdue — haven't touched them in 2+ weeks`
                : "Everything's been practiced recently. Nice work."}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <ThemePicker themeKey={themeKey} onChange={changeTheme} />
            {stats.totalSessions > 0 && (
              <button
                onClick={() => setConfirmReset(true)}
                style={{ background: "none", border: "none", color: COLORS.mutedDim, fontSize: 11.5, cursor: "pointer", textDecoration: "underline", padding: 0 }}
              >
                Reset all progress
              </button>
            )}
          </div>
        </header>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
          <StatTile label="STREAK" value={`${stats.streak}d`} sub={stats.streak > 0 ? "keep it going" : "practice today to start"} />
          <StatTile label="THIS WEEK" value={`${stats.thisWeek}/40`} sub="rudiments touched" />
          <StatTile label="AVG TEMPO" value={stats.avgBpm} sub="BPM across all 40" />
          <StatTile label="SESSIONS" value={stats.totalSessions} sub="logged all time" />
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 22, borderBottom: `1px solid ${COLORS.hairline}` }}>
          {[{ key: "practice", label: "Practice" }, { key: "progress", label: "Progress" }].map((t) => (
            <button
              key={t.key} className="tab-btn" onClick={() => setView(t.key)}
              style={{ background: "none", border: "none", borderBottom: view === t.key ? `2px solid ${COLORS.brass}` : "2px solid transparent", color: view === t.key ? COLORS.parchment : COLORS.muted, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, padding: "8px 4px", marginRight: 20, cursor: "pointer" }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {view === "practice" && (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
              <input
                placeholder="Search rudiments…" value={query} onChange={(e) => setQuery(e.target.value)}
                style={{ flex: "1 1 180px", background: COLORS.surface, border: `1px solid ${COLORS.hairline}`, borderRadius: 9, padding: "9px 12px", color: COLORS.parchment, fontFamily: "'Inter', sans-serif", fontSize: 13.5, outline: "none" }}
              />
              <select value={filter} onChange={(e) => setFilter(e.target.value)} style={selectStyle}>
                {FILTERS.map((f) => (<option key={f} value={f}>{f === "ALL" ? "All families" : f.charAt(0) + f.slice(1).toLowerCase()}</option>))}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={selectStyle}>
                {SORTS.map((s) => (<option key={s.key} value={s.key}>{s.label}</option>))}
              </select>
            </div>

            {grouped.map((group) => {
              if (!group.items.length) return null;
              return (
                <section key={group.key} style={{ marginBottom: 30 }}>
                  {group.label && (
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14, borderBottom: `1px solid ${COLORS.hairline}`, paddingBottom: 8 }}>
                      <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 15.5, letterSpacing: 0.6, color: COLORS.brass, textTransform: "uppercase" }}>{group.label}</span>
                      <span style={{ fontSize: 12, color: COLORS.mutedDim }}>{group.items.length}</span>
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
                    {group.items.map(({ r, d }) => (
                      <RudimentCard key={r.id} item={r} data={d} onChangeBpm={onChangeBpm} onLogToday={onLogToday} onShowInfo={setInfoItem} />
                    ))}
                  </div>
                </section>
              );
            })}

            {grouped.every((g) => !g.items.length) && (
              <div style={{ color: COLORS.muted, fontSize: 14, textAlign: "center", padding: "40px 0" }}>No rudiments match that search.</div>
            )}
          </>
        )}

        {view === "progress" && (
          <>
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.hairline}`, borderRadius: 12, padding: "16px 18px", marginBottom: 24 }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: 0.5, color: COLORS.brass, textTransform: "uppercase", marginBottom: 12 }}>
                Practice history
              </div>
              <Heatmap dailyCounts={stats.dailyCounts} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <select value={progressSort} onChange={(e) => setProgressSort(e.target.value)} style={selectStyle}>
                {PROGRESS_SORTS.map((s) => (<option key={s.key} value={s.key}>{s.label}</option>))}
              </select>
            </div>

            {progressList.map(({ r, d }) => (
              <ProgressRow key={r.id} item={r} entry={d} onLogToday={onLogToday} onShowInfo={setInfoItem} />
            ))}
          </>
        )}
      </div>
      {infoItem && <RudimentInfoModal item={infoItem} onClose={() => setInfoItem(null)} />}
      {confirmReset && (
        <ConfirmDialog
          title="Reset all progress?"
          message="This clears every tempo, log, and history entry for all 40 rudiments. This can't be undone."
          confirmLabel="Reset"
          onConfirm={resetAllProgress}
          onCancel={() => setConfirmReset(false)}
        />
      )}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

const selectStyle = {
  background: COLORS.surface, border: `1px solid ${COLORS.hairline}`, borderRadius: 9,
  padding: "9px 10px", color: COLORS.parchment, fontFamily: "'Inter', sans-serif", fontSize: 13, outline: "none",
};
