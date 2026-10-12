import { t } from "../core/i18n.js";

/**
 * Atuação — capability domains, one row each.
 *
 * These are domains, not projects: the work behind them is under NDA,
 * and CLAUDE.md says what may and may not be named here.
 */
export function renderPractice() {
  document.getElementById("practice-rows").innerHTML = (t("practice.items") ?? [])
    .map(
      (item, i) => `
    <li class="func rv">
      <h3 data-i18n="practice.items.${i}.title"></h3>
      <div>
        <p data-i18n="practice.items.${i}.desc"></p>
        <ul>${item.tags.map((_, j) => `<li data-i18n="practice.items.${i}.tags.${j}"></li>`).join("")}</ul>
      </div>
    </li>`
    )
    .join("");
}
