import { t } from "../core/i18n.js";
import { sourceLinks } from "./source.js";

/**
 * Stack — an exploded view and its parts list.
 *
 * One plate per row of `stack.rows`, stacked on a single arbor and
 * numbered. The drawing is generated from the rows, so adding a group
 * to the locale files adds a plate; nothing here names a technology.
 *
 * A plate is as wide as its group is long: its radius comes from the
 * number of items in the row. The sizes used to be a fixed sequence
 * chosen to look varied, which made the drawing say something about the
 * groups that no data said.
 *
 * PITCH is shared with `--pitch` in stack.css: the list rows are that
 * tall, which is what makes each bubble sit beside its own line.
 *
 * Colour comes from classes in stack.css rather than from attributes, so
 * a theme switch repaints the drawing without re-rendering it.
 */
const PITCH = 104;
const W = 250;
const CX = 104;
// One item is the smallest plate; each further item adds a step, until
// the plate is as wide as its column lets it be.
const R_ONE = 56;
const R_STEP = 12;
const R_MAX = 104;

function drawing(rows) {
  const n = rows.length;
  const h = n * PITCH;
  let out = `<line class="ax" x1="${CX}" y1="6" x2="${CX}" y2="${h - 6}"/>`;

  for (let i = 0; i < n; i++) {
    const r = Math.min(R_MAX, R_ONE + R_STEP * (rows[i].items.length - 1));
    const ry = r * 0.3;
    const cy = 50 + i * PITCH;
    const by = cy - 14;

    out += `
      <path class="side" d="M${CX - r} ${cy}v14a${r} ${ry} 0 0 0 ${2 * r} 0v-14"/>
      <ellipse class="top" cx="${CX}" cy="${cy}" rx="${r}" ry="${ry}"/>
      <ellipse class="hole" cx="${CX}" cy="${cy}" rx="9" ry="3"/>
      <line class="lead" x1="${CX + r * 0.72}" y1="${cy - ry * 0.3}" x2="214" y2="${by}"/>
      <circle class="bub" cx="228" cy="${by}" r="13"/>
      <text x="228" y="${by + 5.5}" text-anchor="middle">${i + 1}</text>`;
  }

  return `<svg class="parts__fig" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" aria-hidden="true">${out}</svg>`;
}

export function renderStack() {
  const rows = t("stack.rows") ?? [];

  const list = rows
    .map(
      (row, i) => `
    <li class="part rv">
      <div>
        <b data-i18n="stack.rows.${i}.name"></b>
        <ul>${row.items.map((_, j) => `<li data-i18n="stack.rows.${i}.items.${j}"></li>`).join("")}</ul>
      </div>
      ${sourceLinks(row.src)}
    </li>`
    )
    .join("");

  document.getElementById("stack-rows").innerHTML = `${drawing(rows)}<ol class="parts__list">${list}</ol>`;
}
