import { t } from "../core/i18n.js";
import { SITE } from "../config.js";

/**
 * Perfil — who Alan is, driven entirely by the locale data.
 *
 * It began as a first-person manifesto he had never written, then became
 * six fixed key→value rows: a shape that could not hold a second degree,
 * a new certification, or a specialism added later without someone
 * editing markup. Both `about` and `blocks` are arrays now, so the
 * section grows by growing the data.
 *
 * Everything still traces to the CV; see the source markers there.
 */
export function renderProfile() {
  const about = t("profile.about") ?? [];
  const blocks = t("profile.blocks") ?? [];

  const paras = about.map((_, i) => `<p data-i18n="profile.about.${i}"></p>`).join("");

  // The portrait, once Alan supplies one (`photo` in config.js). With no
  // photograph the column is the text alone, exactly as before; nothing
  // stands in for the picture. The name is the alt text because it is a
  // proper noun, the same in every language.
  const p = SITE.photo;
  document.getElementById("profile-about").innerHTML = p
    ? `<figure class="pf-photo"><img src="${import.meta.env.BASE_URL}${p.file}" width="${p.width}" height="${p.height}" alt="Alan Sena" loading="lazy" decoding="async"></figure><div class="pf-text">${paras}</div>`
    : paras;

  // A block carries EITHER `items` or `chips`, and the difference is
  // about length, not about kind. `items` is a line, for a fact that
  // needs a clause. `chips` is a row of fields, for facts that are two
  // words each: three languages and three working arrangements took six
  // full-width lines to say what six fields say at a glance.
  //
  // Each block is a row of one ruled table (a <dl>), its title in the
  // label column. A block with neither renders nothing at all, so
  // emptying a list in the locale file removes its row too.
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
    <div class="pf-block rv">
      <dt data-i18n="profile.blocks.${i}.title"></dt>
      <dd>${body}</dd>
    </div>`
        : "";
    })
    .join("");
}
