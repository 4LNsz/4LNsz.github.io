import { t } from "../core/i18n.js";

/**
 * Capability domains. Panels are laid out in a flex row; the horizontal
 * scroll is driven by ScrollTrigger in motion/choreography.js.
 */
export function renderPractice() {
  document.getElementById("practice-track").innerHTML = t("practice.items")
    .map(
      (item, i) => `
    <article class="panel">
      <div class="panel__top">
        <span class="panel__n">${String(i + 1).padStart(2, "0")}</span>
        <span class="panel__label" data-i18n="practice.items.${i}.label"></span>
      </div>
      <div>
        <h3 class="panel__ttl" data-i18n="practice.items.${i}.title"></h3>
        <p class="panel__desc" data-i18n="practice.items.${i}.desc"></p>
        <div class="panel__tags">${item.tags
          .map((_, j) => `<i data-i18n="practice.items.${i}.tags.${j}"></i>`)
          .join("")}</div>
      </div>
    </article>`
    )
    .join("");
}
