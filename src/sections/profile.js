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

  // A block carries EITHER `items` or `chips`, and the difference is
  // about length, not about kind. `items` is a bulleted line, for a
  // fact that needs a clause. `chips` is a row of pills, for facts that
  // are two words each — three languages and four working arrangements
  // took seven full-width lines to say what eleven pills say at a
  // glance, and that density is what made section 01 read as a wall.
  //
  // The pill reuses .chip from stack.css rather than defining a second
  // one: it is the same object, and base.css already lists .chip among
  // the elements that cross-fade on a theme change.
  //
  // A block with neither renders nothing at all, so emptying a list in
  // the locale file removes its heading too.
  document.getElementById("profile-blocks").innerHTML = blocks
    .map((b, i) => {
      const body = b.chips?.length
        ? `<div class="pf-chips">${b.chips
            .map((_, j) => `<i class="chip" data-i18n="profile.blocks.${i}.chips.${j}"></i>`)
            .join("")}</div>`
        : b.items?.length
          ? `<ul class="pf-list">${b.items
              .map((_, j) => `<li data-i18n="profile.blocks.${i}.items.${j}"></li>`)
              .join("")}</ul>`
          : "";

      return body
        ? `
    <section class="pf-block rv">
      <h3 class="pf-h mono-xs" data-i18n="profile.blocks.${i}.title"></h3>
      ${body}
    </section>`
        : "";
    })
    .join("");
}
