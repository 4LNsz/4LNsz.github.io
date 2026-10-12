/* Builds every vector file in brand/ from one description of the mark.
 *
 *   node brand/src/build.mjs
 *
 * Units are hundredths of the mark's height. Every stroke is 13 thick,
 * every corner is 90° or a 45° chamfer, and nothing here is a font, so
 * the files work anywhere an SVG does, with nothing to install.
 *
 * The same polygons are inline in index.html, as the A-quatro in the
 * header and the rubric in the footer. This script prints both at the
 * end; paste them there if the drawing changes. It also writes
 * brand/src/sheet.html, the source of sheet.png; brand/README.md says
 * how the rasters are rendered.
 *
 * The two lockups set a word beside the mark in Sofia Sans Condensed,
 * as the page header does. Their letters are not drawn here: they are
 * the font's own outlines, laid out by brand/src/letters.mjs and kept
 * in brand/src/letters.json, which this script reads. Never redraw
 * them; that was tried once and was a different logo.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..");

// The same values as the primitives in src/styles/tokens.css.
const C = {
  graphite950: "#110e09", graphite900: "#18150f", graphite800: "#1f1c17", graphite600: "#433f39",
  graphite300: "#9f9b92", graphite200: "#c2bdb4", graphite100: "#efebe2",
  steel: "#101b50", rhodium100: "#e6e9ef", rhodium800: "#3a4885",
  brass: "#d6ae55", brassDeep: "#73550f",
};
const W = 13;

const r2 = (n) => Math.round(n * 100) / 100;
const poly = (pts) => `<polygon points="${pts.map((p) => `${r2(p[0])},${r2(p[1])}`).join(" ")}"/>`;
const move = (pts, dx, dy = 0, s = 1) => pts.map((p) => [p[0] * s + dx, p[1] * s + dy]);

/** An open centre line to a filled outline: mitred joins, square ends. */
function outline(pts, w = W) {
  const h = w / 2, left = [], right = [];
  const dir = (u, v) => { const dx = v[0] - u[0], dy = v[1] - u[1], m = Math.hypot(dx, dy); return [dx / m, dy / m]; };
  pts.forEach((p, i) => {
    const a = pts[i - 1], b = pts[i + 1];
    let n, k = h;
    if (!a || !b) { const d = a ? dir(a, p) : dir(p, b); n = [-d[1], d[0]]; }
    else {
      const d1 = dir(a, p), d2 = dir(p, b), n1 = [-d1[1], d1[0]], n2 = [-d2[1], d2[0]];
      const m = [n1[0] + n2[0], n1[1] + n2[1]], ml = Math.hypot(m[0], m[1]);
      n = [m[0] / ml, m[1] / ml];
      k = h / (n[0] * n1[0] + n[1] * n1[1]);
    }
    left.push([p[0] + n[0] * k, p[1] + n[1] * k]);
    right.push([p[0] - n[0] * k, p[1] - n[1] * k]);
  });
  return [...left, ...right.reverse()];
}

/* ── the drawings ────────────────────────────────────────── */

// A-quatro: a diagonal, an upright, and a bar that overhangs. Take the
// overhang off and it is an A; take the left foot off and it is a 4.
const A4 = [[[72, 0], [0, 100], [16, 100], [58, 41.7], [58, 100], [72, 100]], [[27.4, 62], [92, 62], [92, 75], [18, 75]]];
// The same, heavier and with no counter, for anything under 24px.
const A4S = [[[74, 0], [0, 100], [21, 100], [55, 49], [55, 100], [74, 100]], [[31, 58], [96, 58], [96, 77], [17, 77]]];

// AS: the A-quatro with its bar a little lower and longer, and an S
// whose open side the bar runs into. They interlock; they do not touch.
const S_LINE = [[54, 6.5], [13, 6.5], [6.5, 13], [6.5, 43.5], [13, 50], [39, 50], [45.5, 56.5], [45.5, 87], [39, 93.5], [0, 93.5]];
const AS = [A4[0], [[25.2, 65], [112, 65], [112, 78], [15.8, 78]], move(outline(S_LINE), 84)];
const AS_W = 138;

// The avatar is a full square, because every platform crops its own
// circle. The mark stays inside that circle with room to spare, and sits
// a little left of centre because its weight is on the right.
const AVATAR = A4.map((p) => move(p, 28, 27, 0.74));
const ICON_MARK = A4S.map((p) => move(p, 14, 11, 0.42));

// The seal borrows the one device the page is built round: the ring
// whose lap is one 16.7ms frame. The uneven gap at the top is that
// scale closing on itself, and is meant.
const SEAL = (() => {
  const c = 100, B = 1000 / 60, ang = (ms) => (ms / B) * Math.PI * 2 - Math.PI / 2;
  let ticks = "";
  for (let ms = 0; ms < B; ms += 0.5) {
    const major = Math.abs(ms - Math.round(ms)) < 1e-6, a = ang(ms), r0 = 86, r1 = major ? 76 : 81;
    ticks += `<line x1="${r2(c + Math.cos(a) * r0)}" y1="${r2(c + Math.sin(a) * r0)}" x2="${r2(c + Math.cos(a) * r1)}" y2="${r2(c + Math.sin(a) * r1)}" stroke-width="${major ? 2 : 1.1}"/>`;
  }
  const rings = `<g fill="none" stroke="currentColor"><circle cx="100" cy="100" r="97" stroke-width="3"/><circle cx="100" cy="100" r="86" stroke-width="1.2"/>${ticks}</g>`;
  return rings + A4.map((p) => poly(move(p, 60, 55, 0.9))).join("");
})();

/* ── the files ───────────────────────────────────────────── */
const svg = (vb, body, comment, attrs = ' fill="currentColor"') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${attrs}>\n  <!-- ${comment} -->\n${body}\n</svg>\n`;
const lines = (polys, ind = "  ") => polys.map((p) => ind + poly(p)).join("\n");
const save = (name, content) => { writeFileSync(join(OUT, name), content); console.log("wrote brand/" + name); };

save("a-quatro.svg", svg("0 0 92 100", lines(A4),
  `A-quatro, the isotype. An A whose right leg stands upright, which is
       what makes it a 4 as well. One colour, any colour: it draws in
       currentColor. Under 24px use a-quatro-small.svg.`));

save("a-quatro-small.svg", svg("0 0 96 100", lines(A4S),
  `A-quatro, cut for small sizes: heavier strokes and no counter, so it
       survives at 16px. Use it under 24px and nowhere else.`));

save("as.svg", svg(`0 0 ${AS_W} 100`, lines(AS),
  `AS, the rubric: Alan's initials. The A-quatro and an S whose open side
       takes the 4's bar. It goes with the name; the A-quatro goes with
       the handle.`));

// The plate does not follow the OS colour scheme: the mark's colours are
// the brand, not a theme. The site's favicon is this same file.
const ICON = svg("0 0 64 64",
  `  <rect width="64" height="64" rx="13" fill="${C.graphite800}"/>\n  <g fill="${C.brass}">\n${lines(ICON_MARK, "    ")}\n  </g>`,
  `The app icon: the small cut of the A-quatro in brass on a graphite
       plate. Written twice by brand/src/build.mjs, as brand/icon.svg and
       as public/favicon.svg.`, "");
save("icon.svg", ICON);
save("../public/favicon.svg", ICON);

save("avatar.svg", svg("0 0 128 128",
  `  <rect width="128" height="128" fill="${C.graphite800}"/>\n  <g fill="${C.brass}">\n${lines(AVATAR, "    ")}\n  </g>`,
  `The avatar. A full square, because GitHub, Discord, LinkedIn and X
       each crop their own circle; the mark stays inside it. Platforms
       that refuse an SVG take avatar.png, rendered from this file.`, ""));

save("seal.svg", svg("0 0 200 200", "  " + SEAL,
  `The seal, for work that ships under the mark: the A-quatro inside the
       dial's own ring. One colour. Minimum 48px.`));

/* ── the lockups ─────────────────────────────────────────
   The mark, then its word. Each comes in one colour, which takes the
   colour of whatever it is inlined into, and in the two colourways the
   site uses, for anywhere an <img> has to carry its own. */
const LETTERS = JSON.parse(readFileSync(join(OUT, "src", "letters.json"), "utf8"));
const glyphs = (lock, i) => `<path d="${lock.runs[i].d}"/>`;
const tone = (fill, body, ind = "  ") => `${ind}<g fill="${fill}">\n${body}\n${ind}</g>`;

// 4LNsz: the A-quatro stands where the 4 is, then LN, then sz a weight lighter.
const WM_W = LETTERS.handle.right;
const WM = { mark: A4, ln: glyphs(LETTERS.handle, 0), sz: glyphs(LETTERS.handle, 1) };
const wordmark = (a, ln, sz) => [tone(a, lines(WM.mark, "    ")), tone(ln, "    " + WM.ln), tone(sz, "    " + WM.sz)].join("\n");

save("wordmark.svg", svg(`0 0 ${WM_W} 100`, `${lines(WM.mark)}\n  ${WM.ln}\n  ${WM.sz}`,
  `4LNsz, the wordmark, in one colour. The A-quatro stands where the 4
       is; LNsz is Sofia Sans Condensed (OFL-1.1) converted to outlines,
       so there is no font to install.`));
save("wordmark-on-dark.svg", svg(`0 0 ${WM_W} 100`, wordmark(C.brass, C.graphite100, C.graphite200),
  `4LNsz for a dark ground: brass, then the two text tones of the graphite.`, ""));
save("wordmark-on-light.svg", svg(`0 0 ${WM_W} 100`, wordmark(C.brassDeep, C.steel, C.rhodium800),
  `4LNsz for a light ground: deep brass, then the two tones the light
       theme sets text in.`, ""));

// The rubric with the name, centred on it.
const NM_W = LETTERS.name.right;
const NM = glyphs(LETTERS.name, 0);
const named = (mark, text) => [tone(mark, lines(AS, "    ")), tone(text, "    " + NM)].join("\n");

save("name.svg", svg(`0 0 ${NM_W} 100`, `${lines(AS)}\n  ${NM}`,
  `The rubric with the name, in one colour: AS, then Alan Sena in Sofia
       Sans Condensed (OFL-1.1) converted to outlines.`));
save("name-on-dark.svg", svg(`0 0 ${NM_W} 100`, named(C.brass, C.graphite100),
  `The rubric with the name, for a dark ground.`, ""));
save("name-on-light.svg", svg(`0 0 ${NM_W} 100`, named(C.brassDeep, C.steel),
  `The rubric with the name, for a light ground.`, ""));

/* ── the usage sheet ─────────────────────────────────────── */
const fig = (polys, w, extra = "") => `<svg viewBox="0 0 ${w} 100" fill="currentColor"${extra}>${polys.map(poly).join("")}</svg>`;
const M = {
  a4: (x = "") => fig(A4, 92, x),
  a4s: (x = "") => fig(A4S, 96, x),
  as: (x = "") => fig(AS, AS_W, x),
  seal: (x = "") => `<svg viewBox="0 0 200 200" fill="currentColor"${x}>${SEAL}</svg>`,
  avatar: (x = "") => `<svg viewBox="0 0 128 128"${x}><rect width="128" height="128" fill="${C.graphite800}"/><g fill="${C.brass}">${AVATAR.map(poly).join("")}</g></svg>`,
  icon: (x = "") => `<svg viewBox="0 0 64 64"${x}><rect width="64" height="64" rx="13" fill="${C.graphite800}"/><g fill="${C.brass}">${ICON_MARK.map(poly).join("")}</g></svg>`,
};

const size = (px, small) => `<div><span class="px" style="height:${px}px">${(small ? M.a4s : M.a4)(` style="height:${px}px"`)}</span><b>${px}</b><i>${small ? "small cut" : "regular"}</i></div>`;
const use = (where, file, min) => `<tr><th>${where}</th><td>${file}</td><td>${min}</td></tr>`;
// The two lockups, from the same outlines as the files.
const lockWm = `<svg class="lock lock--h" viewBox="0 0 ${WM_W} 100"><g class="lk-m">${WM.mark.map(poly).join("")}</g><g class="lk-t">${WM.ln}</g><g class="lk-u">${WM.sz}</g></svg>`;
const lockNm = `<svg class="lock lock--n" viewBox="0 0 ${NM_W} 100"><g class="lk-m">${AS.map(poly).join("")}</g><g class="lk-t">${NM}</g></svg>`;

const sheet = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>sheet.png — source</title>
<!-- The usage sheet, 1680×1484. Written by build.mjs: edit that, not this.
     Render this page at that size with a headless browser and save the
     capture as brand/sheet.png. -->
<style>
  /* The site's own font files, read from node_modules: run npm ci first. */
  @font-face { font-family: "Sofia Sans Condensed"; font-weight: 500; src: url("../../node_modules/@fontsource/sofia-sans-condensed/files/sofia-sans-condensed-latin-500-normal.woff2") format("woff2"); }
  @font-face { font-family: "Sofia Sans Condensed"; font-weight: 600; src: url("../../node_modules/@fontsource/sofia-sans-condensed/files/sofia-sans-condensed-latin-600-normal.woff2") format("woff2"); }
  @font-face { font-family: "Sofia Sans Condensed"; font-weight: 700; src: url("../../node_modules/@fontsource/sofia-sans-condensed/files/sofia-sans-condensed-latin-700-normal.woff2") format("woff2"); }
  @font-face { font-family: "Sofia Sans Extra Condensed"; font-weight: 800; src: url("../../node_modules/@fontsource/sofia-sans-extra-condensed/files/sofia-sans-extra-condensed-latin-800-normal.woff2") format("woff2"); }
  @font-face { font-family: "STIX Two Text"; font-weight: 400; src: url("../../node_modules/@fontsource/stix-two-text/files/stix-two-text-latin-400-normal.woff2") format("woff2"); }
  /* The three faces, named once, as src/styles/tokens.css names them. */
  :root { --f-display: "Sofia Sans Extra Condensed", "Arial Narrow", sans-serif; --f-label: "Sofia Sans Condensed", "Arial Narrow", sans-serif; --f-text: "STIX Two Text", Georgia, serif; }
  :root { --bg: ${C.graphite900}; --sunken: ${C.graphite950}; --line: ${C.graphite600}; --fg: ${C.graphite100}; --muted: ${C.graphite200}; --subtle: ${C.graphite300}; --brass: ${C.brass}; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1680px; height: 1484px; overflow: hidden; }
  body { background: var(--bg); color: var(--fg); font: 400 17px/1.4 var(--f-text); -webkit-font-smoothing: antialiased; padding: 44px 56px 0; }
  svg { display: block; }
  h1 { font: 800 54px/0.9 var(--f-display); letter-spacing: 0.014em; text-transform: uppercase; }
  .lab, th, .n + b, .sizes b, .chips b { font: 700 15px/1.2 var(--f-label); letter-spacing: 0.12em; text-transform: uppercase; }
  code { font: 600 15px/1.35 var(--f-label); letter-spacing: 0.05em; color: var(--brass); }
  p, td, i { color: var(--muted); font-style: normal; }

  .top { display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; padding-bottom: 18px; border-bottom: 1.5px solid var(--brass); }
  .top p { max-width: 46em; text-align: right; }

  .marks { display: grid; grid-template-columns: 1fr 1.25fr 1.7fr 2.3fr; border-bottom: 1px solid var(--line); }
  .marks > div, .more > div { padding: 22px 26px 20px 0; }
  .marks > div + div, .more > div + div { padding-left: 26px; border-left: 1px solid var(--line); }
  .plate { height: 132px; display: flex; align-items: center; color: var(--brass); }
  .plate > svg { height: 96px; }
  .cap { display: grid; grid-template-columns: 30px 1fr; column-gap: 12px; margin-top: 14px; }
  .n { width: 28px; height: 28px; display: grid; place-items: center; border: 1.5px solid var(--brass); border-radius: 50%; color: var(--brass); font: 700 16px/1 var(--f-label); }
  .cap p { grid-column: 2; margin-top: 3px; }
  .cap code { grid-column: 2; margin-top: 6px; }

  /* The lockups: the drawing in brass, its word in the text tones. */
  .plate > .lock--h { height: 84px; }
  .plate > .lock--n { height: 70px; }
  .lk-m { fill: var(--brass); }
  .lk-t { fill: var(--fg); }
  .lk-u { fill: var(--muted); }

  .more { display: grid; grid-template-columns: 1fr 1fr 1fr 2.6fr; border-bottom: 1px solid var(--line); }
  .more .plate > svg { height: 104px; }
  .round { border-radius: 50%; }
  .light { background: ${C.rhodium100}; padding: 22px 26px 20px !important; display: grid; grid-template-columns: auto auto auto 1fr; column-gap: 36px; align-items: center; }
  .light > svg { height: 64px; color: ${C.brassDeep}; }
  .light .lk-m { fill: ${C.brassDeep}; }
  .light .lk-t { fill: ${C.steel}; }
  .light .lk-u { fill: ${C.rhodium800}; }
  .light > .lock--h { height: 58px; }
  .light > .lock--n { height: 50px; justify-self: start; }
  .light p { grid-column: 1 / -1; margin-top: 16px; color: ${C.rhodium800}; }

  .rules { display: grid; grid-template-columns: 1.5fr 1fr 1.15fr; }
  .rules > div { padding: 20px 26px 0 0; }
  .rules > div + div { padding-left: 26px; border-left: 1px solid var(--line); }
  .rules .lab { display: block; margin-bottom: 12px; color: var(--subtle); }
  .sizes { display: flex; align-items: flex-end; gap: 26px; color: var(--brass); }
  .sizes div { display: grid; justify-items: start; }
  .sizes .px { display: flex; align-items: flex-end; }
  .sizes b { margin-top: 8px; color: var(--fg); }
  .sizes i { font: 500 13px/1.3 var(--f-label); letter-spacing: 0.08em; text-transform: uppercase; color: var(--subtle); }
  .sizes .cut { align-self: stretch; border-left: 1px dashed var(--subtle); }
  .rules p { margin-top: 12px; max-width: 34em; }
  .clear { display: flex; align-items: center; gap: 22px; }
  .clear .box { position: relative; padding: 24px; border: 1px dashed var(--subtle); color: var(--brass); }
  .clear .box svg { height: 96px; }
  .clear .box::after { content: "x"; position: absolute; left: 6px; top: 0; font: 600 15px/24px var(--f-label); color: var(--subtle); }
  .chips { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
  .chips span { display: block; height: 52px; border: 1px solid var(--line); }
  .chips b { display: block; margin-top: 7px; font-size: 13px; letter-spacing: 0.08em; }
  .chips code { font-size: 13px; color: var(--muted); }

  table { width: 100%; margin-top: 18px; border-collapse: collapse; border-top: 1.5px solid var(--brass); }
  th, td { text-align: left; padding: 7px 18px 6px 0; border-bottom: 1px solid var(--line); vertical-align: baseline; }
  thead th { color: var(--subtle); font-size: 13px; letter-spacing: 0.16em; }
  /* Row heads are phrases, not labels: set as words, not in capitals. */
  tbody th { width: 30%; font: 600 17px/1.35 var(--f-label); letter-spacing: 0.03em; text-transform: none; color: var(--fg); }
  td:last-child { width: 15%; white-space: nowrap; }
</style>
</head>
<body>

<div class="top">
  <h1>Alan Sena · 4LNsz · the mark</h1>
  <p>Two names for one person, so two marks. The A-quatro goes with the handle, the AS with the name. They are never set side by side; a page may carry one at its head and the other at its foot, as the site does.</p>
</div>

<div class="marks">
  <div><div class="plate">${M.a4()}</div><div class="cap"><span class="n">1</span><b>A-quatro</b><p>The isotype. An A whose right leg stands upright, which makes it a 4 as well.</p><code>a-quatro.svg · a-quatro-small.svg</code></div></div>
  <div><div class="plate">${M.as()}</div><div class="cap"><span class="n">2</span><b>AS</b><p>The rubric. The bar of the 4 runs into the open side of the S.</p><code>as.svg</code></div></div>
  <div><div class="plate">${lockWm}</div><div class="cap"><span class="n">3</span><b>4LNsz</b><p>The wordmark. The A-quatro stands where the 4 is; LNsz is Sofia Sans Condensed, outlined.</p><code>wordmark.svg · wordmark-on-dark.svg · wordmark-on-light.svg</code></div></div>
  <div><div class="plate">${lockNm}</div><div class="cap"><span class="n">4</span><b>Name</b><p>The rubric, then the name in the same face, centred on it and outlined.</p><code>name.svg · name-on-dark.svg · name-on-light.svg</code></div></div>
</div>

<div class="more">
  <div><div class="plate">${M.avatar(' class="round"')}</div><div class="cap"><span class="n">5</span><b>Avatar</b><p>Shown cropped. The file is a full square.</p><code>avatar.svg · avatar.png</code></div></div>
  <div><div class="plate">${M.seal()}</div><div class="cap"><span class="n">6</span><b>Seal</b><p>The A-quatro in the dial's own ring.</p><code>seal.svg</code></div></div>
  <div><div class="plate">${M.icon()}</div><div class="cap"><span class="n">7</span><b>Icon</b><p>The small cut on a graphite plate.</p><code>icon.svg</code></div></div>
  <div class="light">${M.a4()}${M.as()}${lockWm}${lockNm}<p>On a light ground the brass deepens to ${C.brassDeep}; the form does not change. The drawing is one colour; its word takes the tones the theme sets text in. Ruby is for measurements and never touches the mark.</p></div>
</div>

<div class="rules">
  <div>
    <span class="lab">Minimum size</span>
    <div class="sizes">${size(16, true)}${size(20, true)}<span class="cut"></span>${size(24)}${size(32)}${size(48)}${size(72)}</div>
    <p>Shown at actual size; the figures are px of height. Under 24 px the counter of the regular cut closes, so the small cut takes over: heavier, and with no counter to lose. Nothing is drawn below 16 px.</p>
  </div>
  <div>
    <span class="lab">Clear space</span>
    <div class="clear"><div class="box">${M.a4()}</div><p>x is a quarter of the mark's height, kept clear on every side. The plate of the icon and the ring of the seal already include it.</p></div>
  </div>
  <div>
    <span class="lab">Colour</span>
    <div class="chips">
      <div><span style="background:${C.graphite900}"></span><b>Graphite 900</b><code>${C.graphite900}</code></div>
      <div><span style="background:${C.graphite800}"></span><b>Graphite 800</b><code>${C.graphite800}</code></div>
      <div><span style="background:${C.brass}"></span><b>Brass</b><code>${C.brass}</code></div>
      <div><span style="background:${C.rhodium100}"></span><b>Rhodium</b><code>${C.rhodium100}</code></div>
      <div><span style="background:${C.brassDeep}"></span><b>Deep brass</b><code>${C.brassDeep}</code></div>
      <div><span style="background:${C.steel}"></span><b>Steel</b><code>${C.steel}</code></div>
    </div>
    <p>Do not redraw, outline, slant, round or pixel it.</p>
  </div>
</div>

<table>
  <thead><tr><th>Where</th><th>File</th><th>Minimum</th></tr></thead>
  <tbody>
    ${use("Profile pictures: GitHub, Discord, LinkedIn, X", "avatar.png, or avatar.svg where an SVG is accepted", "any")}
    ${use("Profile covers: LinkedIn, X, Discord", "social/cover-linkedin.png, cover-x.png, cover-discord.png", "full size")}
    ${use("Link cards, repository preview", "social/card-github.png, card-square.png", "full size")}
    ${use("Where an SVG is refused", "png/, the marks and lockups on a transparent ground", "as the SVG")}
    ${use("Favicon, app icon, home screen", "icon.svg", "16 px")}
    ${use("Credit inside a resource: NUI, HUD corner", "a-quatro.svg; under 24 px, a-quatro-small.svg", "16 px high")}
    ${use("Loading screen", "wordmark.svg, or seal.svg when it stands alone", "20 px high · 48 px")}
    ${use("Console boot print", "console.txt", "six lines")}
    ${use("README and docs header", "wordmark-on-dark.svg with wordmark-on-light.svg", "20 px high")}
    ${use("Signed work: CV, proposals, footers", "name.svg, or as.svg alone", "24 px high")}
    ${use("Products that ship under the mark", "seal.svg", "48 px")}
  </tbody>
</table>

</body>
</html>
`;
writeFileSync(join(OUT, "src", "sheet.html"), sheet);
console.log("wrote brand/src/sheet.html");

/* ── what index.html needs ───────────────────────────────── */
const say = (title, text) => console.log(`\n── ${title} ──\n\n${text}`);
say("the A-quatro in the header (also in src/og.html and src/social.html)", `<svg viewBox="0 0 92 100" fill="currentColor" aria-hidden="true">${A4.map(poly).join("")}</svg>`);
say("the rubric in the footer", `<svg viewBox="0 0 ${AS_W} 100" fill="currentColor" aria-hidden="true">${AS.map(poly).join("")}</svg>`);
