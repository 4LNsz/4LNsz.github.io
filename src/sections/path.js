import { t } from "../core/i18n.js";
import { cvHref, sourceLinks } from "./source.js";

/**
 * Trajetória — the same dates, read twice.
 *
 * The record under the diagram is the table it always was. The diagram
 * above it is a train graph: years along the top, one line per house, a
 * level run for a stay and a slope for a move. Drawn that way, two
 * things show that a table hides: the degree and the jobs overlap for
 * years, and there is a stretch before the first job that the CV does
 * not name. That stretch is drawn dashed, not left out.
 *
 * Nothing in the diagram is written here. Every run comes from a row's
 * `from` / `to`, and the dashed one from `path.sinceYear`.
 */

const NS = "http://www.w3.org/2000/svg";
/** [year, month] to a fraction of a year; `end` lands on the month's last day. */
const at = ([y, m], end) => y + (end ? m : m - 1) / 12;

function svgEl(parent, name, attrs, text) {
  const el = document.createElementNS(NS, name);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  if (text != null) el.textContent = text;
  parent.appendChild(el);
  return el;
}

/**
 * Laid out for the width it is given rather than scaled into it, so the
 * lettering stays the size it was set at. Called again on resize, and
 * once more when the fonts land, because the plates under the labels
 * are cut to the measured width of the words.
 */
export function drawGraph() {
  const host = document.getElementById("path-graph");
  if (!host) return;

  const rows = (t("path.rows") ?? []).filter((r) => r.from && r.to);
  host.textContent = "";
  if (!rows.length) return;

  const W = Math.max(280, Math.round(host.clientWidth));
  const narrow = W < 720;
  const PAD_L = narrow ? 14 : 190;
  const PAD_R = narrow ? 14 : 22;
  const TOP = 44;
  const RH = narrow ? 58 : 62;

  const since = t("path.sinceYear");
  const work = rows.filter((r) => r.kind !== "study").sort((a, b) => at(a.from) - at(b.from));
  const A = Math.min(since ?? Infinity, ...rows.map((r) => r.from[0]));
  const B = Math.ceil(Math.max(...rows.map((r) => at(r.to, true))) * 4 + 1) / 4;
  const x = (v) => PAD_L + ((v - A) / (B - A)) * (W - PAD_L - PAD_R);
  // One row per house, in the order the record lists them, and one more
  // underneath for the stretch that has no house.
  const n = rows.length + (since != null ? 1 : 0);
  const y = (i) => TOP + i * RH + RH / 2;
  const foot = TOP + n * RH;

  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", t("path.fig"));
  host.appendChild(svg);

  /**
   * A label inside the plot. It stands on a plate of the ground colour
   * cut to its own box, so no rule runs through a word.
   */
  const label = (cls, attrs, text) => {
    const el = svgEl(svg, "text", { class: cls, ...attrs }, text);
    const b = el.getBBox();
    const plate = document.createElementNS(NS, "rect");
    const box = { class: "ko", x: b.x - 5, y: b.y - 1, width: b.width + 10, height: b.height + 2 };
    for (const k in box) plate.setAttribute(k, box[k]);
    svg.insertBefore(plate, el);
  };

  // On a narrow sheet the two notes will not fit beside the runs they
  // explain without lying across them, so they are set under the plot
  // as a key, each next to a sample of its mark.
  const key = [];

  // the grid: a fine rule each quarter, a heavier one each year
  for (let q = A; q <= B + 1e-6; q += 0.25) {
    const year = Math.abs(q - Math.round(q)) < 1e-6;
    svgEl(svg, "line", { class: year ? "r2" : "r1", x1: x(q), y1: TOP, x2: x(q), y2: foot });
    if (year && (!narrow || Math.round(q) % 2 === 0)) svgEl(svg, "text", { class: "yr", x: x(q), y: TOP - 14, "text-anchor": "middle" }, Math.round(q));
  }
  for (let i = 0; i <= n; i++) svgEl(svg, "line", { class: i === 0 || i === n ? "ax" : "r2", x1: PAD_L, y1: TOP + i * RH, x2: W - PAD_R, y2: TOP + i * RH });

  // the houses. On a narrow sheet there is no margin to hang the names
  // in, so each sits inside its own row.
  rows.forEach((r, i) => {
    const name = String(r.org).split(" — ")[0].toUpperCase();
    if (narrow) label("st", { x: PAD_L + 8, y: TOP + i * RH + 19 }, name);
    else svgEl(svg, "text", { class: "st", x: PAD_L - 14, y: y(i) + 5, "text-anchor": "end" }, name);
  });

  const row = (r) => rows.indexOf(r);
  const yRun = (r) => y(row(r)) + (narrow ? 9 : 0);

  // before the first house
  if (since != null && work.length) {
    const yy = y(rows.length) + (narrow ? 9 : 0);
    const first = work[0];
    svgEl(svg, "path", { class: "pre", d: `M${x(since)} ${yy}H${x(at(first.from))}V${yRun(first)}` });
    const text = t("path.since").toUpperCase();
    if (narrow) key.push({ mark: "pre", lines: text.split(" · ") });
    else label("note", { x: x(since) + 8, y: yy - 12 }, text);
  }

  // study: a hollow run
  for (const r of rows.filter((r) => r.kind === "study")) {
    const a = x(at(r.from)), b = x(at(r.to, true)), yy = yRun(r);
    svgEl(svg, "line", { class: "study", x1: a, y1: yy, x2: b, y2: yy });
    svgEl(svg, "line", { class: "study-in", x1: a + 2, y1: yy, x2: b - 2, y2: yy });

    // where it overlaps the work
    if (work.length) {
      const o0 = Math.max(at(r.from), at(work[0].from));
      const o1 = Math.min(at(r.to, true), at(work[work.length - 1].to, true));
      if (o1 - o0 > 0.4) {
        svgEl(svg, "path", { class: "brk", d: `M${x(o0)} ${yy + 9}v8M${x(o1)} ${yy + 9}v8` });
        const text = t("path.together").toUpperCase();
        if (narrow) key.push({ mark: "brk", lines: [text] });
        else label("note", { x: x(o0) + 10, y: yy + 23 }, text);
      }
    }
  }

  // work: solid runs, and the moves between them
  work.forEach((r, i) => {
    const next = work[i + 1];
    if (next) svgEl(svg, "line", { class: "hop", x1: x(at(r.to, true)), y1: yRun(r), x2: x(at(next.from)), y2: yRun(next) });
  });
  for (const r of work) svgEl(svg, "line", { class: "work", x1: x(at(r.from)), y1: yRun(r), x2: x(at(r.to, true)), y2: yRun(r) });
  for (const r of work) for (const v of [at(r.from), at(r.to, true)]) svgEl(svg, "circle", { class: "node", cx: x(v), cy: yRun(r), r: 5.5 });

  // the key
  let H = foot + 16;
  if (key.length) {
    let base = foot + 30;
    for (const item of key) {
      const mid = base - 5;
      if (item.mark === "pre") {
        svgEl(svg, "path", { class: "pre", d: `M${PAD_L} ${mid}h28` });
      } else {
        // a length of the hollow run, with the two ticks under it
        svgEl(svg, "line", { class: "study", x1: PAD_L, y1: mid - 3, x2: PAD_L + 28, y2: mid - 3 });
        svgEl(svg, "line", { class: "study-in", x1: PAD_L + 2, y1: mid - 3, x2: PAD_L + 26, y2: mid - 3 });
        svgEl(svg, "path", { class: "brk", d: `M${PAD_L + 1} ${mid + 3}v6M${PAD_L + 27} ${mid + 3}v6` });
      }
      for (const line of item.lines) {
        svgEl(svg, "text", { class: "note", x: PAD_L + 40, y: base }, line);
        base += 18;
      }
      base += 8;
    }
    H = base - 12;
  }

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("height", H);
}

export function renderPath() {
  drawGraph();

  // `note` is optional: an entry that needs no description leaves its
  // cell empty rather than inventing a line to fill it.
  const head = `
    <div class="rec__h">
      <span class="lab" data-i18n="path.cols.when"></span>
      <span class="lab" data-i18n="path.cols.who"></span>
      <span class="lab" data-i18n="path.cols.what"></span>
      <span></span>
    </div>`;

  document.getElementById("path-rows").innerHTML =
    head +
    (t("path.rows") ?? [])
      .map(
        (r, i) => `
    <div class="rec__r rv">
      <p class="rec__when" data-i18n="path.rows.${i}.when"></p>
      <p class="rec__who"><b data-i18n="path.rows.${i}.role"></b><small data-i18n="path.rows.${i}.org"></small></p>
      <p class="rec__note"${r.note ? ` data-i18n="path.rows.${i}.note"` : ""}></p>
      ${sourceLinks(["cv"])}
    </div>`
      )
      .join("");

  renderCV();
}

const EYE = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
const ARROW = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1v9M4.5 6.5 8 10l3.5-3.5M2 13h12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/**
 * The CV for the language the page is currently in.
 *
 * Both files used to be listed side by side, which made the reader
 * choose between two things that are the same document. The language
 * switch in the header already expresses that choice, so this follows
 * it: switch to EN and the English PDF is what is on offer.
 *
 * Two actions rather than one. "View" opens in a new tab and hands the
 * PDF to the browser's own viewer, which every platform has; embedding
 * it in an iframe would have looked tidier, but iOS Safari renders only
 * the first page of a framed PDF. Downloading stays a deliberate second
 * click.
 */
function renderCV() {
  const host = document.getElementById("cv-row");
  if (!host) return;
  const href = cvHref();

  host.innerHTML = `
    <span class="cv-label" data-i18n="path.cv"></span>
    <a class="cv-act cv-act--pri" href="${href}" target="_blank" rel="noopener">
      ${EYE}<span data-i18n="path.cvView"></span>
    </a>
    <a class="cv-act" href="${href}" download>
      ${ARROW}<span data-i18n="path.cvGet"></span>
    </a>`;
}
