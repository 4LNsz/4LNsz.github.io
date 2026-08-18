import { t } from "../core/i18n.js";

/**
 * Index table, not cards.
 *
 * Each technology is its own chip. It used to be one "Lua · Node.js ·
 * TypeScript · REST" string in a right-aligned cell, which wrapped
 * wherever the column happened to run out — mid-list, with the overflow
 * landing under nothing in particular. Chips wrap as whole units and
 * stay visibly attached to their row.
 *
 * The hover fill lives entirely in stack.css, so these rows carry no
 * listeners and re-rendering on a language switch cannot leak any.
 */
export function renderStack() {
  document.getElementById("stack-rows").innerHTML = t("stack.rows")
    .map(
      (row, i) => `
    <div class="row rv">
      <div class="row__fill" aria-hidden="true"></div>
      <span class="row__n">${String(i + 1).padStart(2, "0")}</span>
      <span class="row__name" data-i18n="stack.rows.${i}.name"></span>
      <span class="row__items">${row.items
        .map((_, j) => `<i class="chip" data-i18n="stack.rows.${i}.items.${j}"></i>`)
        .join("")}</span>
    </div>`
    )
    .join("");
}
