/* Converts the lettering of the two lockups to outlines.
 *
 *   npm ci
 *   node brand/src/letters.mjs
 *
 * The lockups set a word beside the mark in Sofia Sans Condensed: LNsz
 * beside the A-quatro, Alan Sena beside the AS. On a web page that is
 * type. A lockup that has to travel as one SVG cannot carry a font, so
 * this script reads the same font files the site serves, lays the words
 * out exactly as the page's CSS does, and writes their outlines to
 * brand/src/letters.json. build.mjs reads that file; nothing else does.
 *
 * Run it again only if the lettering changes. The JSON is committed, so
 * build.mjs needs neither the fonts nor opentype.js.
 *
 * Sofia Sans Condensed is licensed OFL-1.1, which permits converting it
 * to outlines and shipping the result.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const pkg = "@fontsource/sofia-sans-condensed";
const load = (weight) => {
  // The .woff, not the .woff2 the site serves: same outlines, and a
  // container opentype.js can open without a Brotli decoder.
  const buf = readFileSync(join(root, "node_modules", pkg, "files", `sofia-sans-condensed-latin-${weight}-normal.woff`));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const face = { 500: load(500), 600: load(600), 700: load(700) };

/* Everything below is in the mark's own units: hundredths of its
   height, origin at its top-left corner. */
const r2 = (n) => Math.round(n * 100) / 100;

/**
 * Where CSS puts the baseline of a single line of type, measured down
 * from the top of its line box: half the leading, then the ascent.
 */
function baseline(font, size, lineHeight) {
  const asc = font.ascender / font.unitsPerEm;
  const desc = -font.descender / font.unitsPerEm;
  return size * ((lineHeight - (asc + desc)) / 2 + asc);
}

/**
 * Kerning, in font units, for the pairs in these words that have any.
 *
 * It is written out because opentype.js 2.0 cannot read it: this font
 * keeps its kerning in a GPOS extension lookup (type 9), which the
 * parser reports as unsupported, so font.getKerningValue() answers 0
 * for every pair. The two values are what the browser applies, read
 * off its layout of the same words: every other neighbouring pair in
 * "LN", "sz" and "Alan Sena" measures zero. The check at the foot of
 * this file compares where each run ends with where the browser ends
 * it, and fails if a value here is wrong or one is missing.
 */
const KERN = { 600: { "A,l": 10 }, 500: { "s,z": -13 } };

/**
 * One run of one weight, as a path, and where the next run starts.
 *
 * Glyph by glyph rather than through font.getPath(text): opentype.js
 * 2.0 runs the font's `ccmp` feature on a whole string and stops on a
 * lookup format it does not implement. These words need no
 * substitution, only what is done here: the advance of each glyph, the
 * kerning between neighbours, and the tracking CSS adds after every
 * glyph, the last one included.
 */
function run(text, weight, x, y, size, tracking) {
  const font = face[weight];
  const scale = size / font.unitsPerEm;
  const chars = [...text];
  let d = "";
  let right = -Infinity;
  let pen = x;
  chars.forEach((ch, i) => {
    const g = font.charToGlyph(ch);
    const p = g.getPath(pen, y, size);
    if (p.commands.length) {
      d += p.commands.map(segment).join("");
      right = Math.max(right, p.getBoundingBox().x2);
    }
    pen += g.advanceWidth * scale + tracking * size;
    if (i + 1 < chars.length) pen += (KERN[weight]?.[`${ch},${chars[i + 1]}`] ?? 0) * scale;
  });
  if (/NaN|undefined|Infinity/.test(d)) throw new Error(`"${text}" at ${weight}: the outline has a coordinate that is not a number`);
  return { text, weight, d, box: { x2: right }, next: pen };
}

/**
 * One path command as SVG path data.
 *
 * Written here rather than left to Path.toPathData(): opentype.js 2.0
 * prints some perfectly good coordinates as "NaN" (254.00000000000003
 * is one), and a renderer stops drawing a path at the first of those.
 * "Alan Sena" came out as "Al".
 */
function segment(c) {
  const n = (v) => String(r2(v));
  switch (c.type) {
    case "M": return `M${n(c.x)} ${n(c.y)}`;
    case "L": return `L${n(c.x)} ${n(c.y)}`;
    case "Q": return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
    case "C": return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
    case "Z": return "Z";
    default: throw new Error(`unknown path command ${c.type}`);
  }
}

/* ── the handle ──────────────────────────────────────────
   The page header, in src/styles/header.css: the A-quatro 27px high in
   a 25px box, 2px of margin, then type at 24px/0.86 tracked 0.05em,
   with both aligned to the bottom. LN is weight 700 and sz 500. */
const HANDLE = (() => {
  const size = (100 * 24) / 27;
  // The drawing is 92 wide and sits centred in a box a hair wider, so
  // half of that slack is on its left. Measured from the drawing's own
  // left edge, the type starts at the box's width, plus the margin,
  // less that half.
  const box = (100 * 25) / 27;
  const x0 = box + (100 * 2) / 27 - (box - 92) / 2;
  const lineH = 0.86;
  const y = 100 - size * lineH + baseline(face[700], size, lineH);
  const ln = run("LN", 700, x0, y, size, 0.05);
  const sz = run("sz", 500, ln.next, y, size, 0.05);
  return { size: r2(size), baseline: r2(y), start: r2(x0), runs: [ln, sz] };
})();

/* ── the name ────────────────────────────────────────────
   As Alan chose it on the mark sheet: the AS 34px high, a 12px gap,
   then type at 28px/1 in weight 600 tracked 0.02em, centred on it. */
const NAME = (() => {
  const size = (100 * 28) / 34;
  const x0 = 138 + (100 * 12) / 34;
  const y = 50 - size / 2 + baseline(face[600], size, 1);
  return { size: r2(size), baseline: r2(y), start: r2(x0), runs: [run("Alan Sena", 600, x0, y, size, 0.02)] };
})();

/* The browser's own layout of the same CSS, measured at 1000px of mark
   height on 2026-10-11 and scaled to these units. If the numbers above
   ever stop agreeing with these, the script is wrong, not the page.

   The baselines are allowed a tenth of a unit: a browser rounds the
   ascent, the descent and the half-leading to whole pixels, so where it
   puts a baseline shifts by a few hundredths with the size it is
   measured at. The figures computed above are the unrounded ones. */
const MEASURED = { handle: { start: 99.701, baseline: 88.356, end: 263.879 }, name: { start: 173.294, baseline: 74.623, end: 464.163 } };
const check = (label, got, want, tol) => {
  const ok = Math.abs(got - want) <= tol;
  console.log(`${ok ? "ok " : "OFF"} ${label}: ${r2(got)} (browser ${want})`);
  if (!ok) process.exitCode = 1;
};
check("handle start", HANDLE.start, MEASURED.handle.start, 0.05);
check("handle baseline", HANDLE.baseline, MEASURED.handle.baseline, 0.1);
check("handle end", HANDLE.runs[1].next, MEASURED.handle.end, 0.05);
check("name start", NAME.start, MEASURED.name.start, 0.05);
check("name baseline", NAME.baseline, MEASURED.name.baseline, 0.1);
check("name end", NAME.runs[0].next, MEASURED.name.end, 0.05);

const tidy = (lock) => ({
  size: lock.size,
  baseline: lock.baseline,
  start: lock.start,
  // the right edge of the ink, which is where the lockup ends
  right: r2(Math.max(...lock.runs.map((r) => r.box.x2))),
  runs: lock.runs.map(({ text, weight, d }) => ({ text, weight, d })),
});

const version = (name) => JSON.parse(readFileSync(join(root, "node_modules", name, "package.json"), "utf8")).version;
const out = {
  note: "Written by brand/src/letters.mjs. Outlines of Sofia Sans Condensed (OFL-1.1), laid out as the page sets them. Do not edit by hand.",
  source: { [pkg]: version(pkg), "opentype.js": version("opentype.js") },
  handle: tidy(HANDLE),
  name: tidy(NAME),
};
writeFileSync(join(here, "letters.json"), JSON.stringify(out, null, 2) + "\n");
console.log("wrote brand/src/letters.json");
