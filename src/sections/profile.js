import { t } from "../core/i18n.js";

/**
 * Section 01 — who Alan is, driven entirely by the locale data.
 *
 * It began as a first-person manifesto he had never written, then became
 * six fixed key→value rows: a shape that could not hold a second degree,
 * a new certification, or a specialism added later without someone
 * editing markup. Both `about` and `blocks` are arrays now — the section
 * grows by growing the data.
 *
 * Everything still traces to the CV; see the source markers there.
 */
export function renderProfile() {
  const about = t("profile.about") ?? [];
  const blocks = t("profile.blocks") ?? [];

  document.getElementById("profile-about").innerHTML = `
    <h3 class="pf-h mono-xs" data-i18n="profile.aboutTitle"></h3>
    <div class="pf-prose">
      ${about.map((_, i) => `<p data-i18n="profile.about.${i}"></p>`).join("")}
    </div>`;

  // A block with no items renders nothing at all, so emptying a list in
  // the locale file removes its heading too.
  document.getElementById("profile-blocks").innerHTML = blocks
    .map((b, i) =>
      b.items?.length
        ? `
    <section class="pf-block rv">
      <h3 class="pf-h mono-xs" data-i18n="profile.blocks.${i}.title"></h3>
      <ul class="pf-list">
        ${b.items.map((_, j) => `<li data-i18n="profile.blocks.${i}.items.${j}"></li>`).join("")}
      </ul>
    </section>`
        : ""
    )
    .join("");
}
