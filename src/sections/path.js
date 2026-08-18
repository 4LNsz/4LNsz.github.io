import { SITE } from "../config.js";
import { t, lang } from "../core/i18n.js";

export function renderPath() {
  // `note` is optional: an entry that needs no description emits no
  // element rather than an empty one, which would otherwise leave a
  // stray box holding a column open in the subgrid.
  document.getElementById("path-rows").innerHTML = t("path.rows")
    .map(
      (row, i) => `
    <div class="path-row rv-x">
      <span class="when" data-i18n="path.rows.${i}.when"></span>
      <span class="role">
        <span data-i18n="path.rows.${i}.role"></span>
        <small data-i18n="path.rows.${i}.org"></small>
      </span>
      ${row.note ? `<span class="note" data-i18n="path.rows.${i}.note"></span>` : ""}
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
 * Both files used to be listed side by side with the matching one
 * merely outlined, which made the reader choose between two things that
 * are the same document. The language switch in the header already
 * expresses that choice, so this follows it: switch to EN and the
 * English PDF is what is on offer.
 *
 * Two actions rather than one. "View" opens in a new tab and hands the
 * PDF to the browser's own viewer, which every platform has; embedding
 * it in an iframe would have looked tidier but iOS Safari renders only
 * the first page of a framed PDF, so the preview would silently break
 * on a large slice of mobile traffic. Downloading stays a deliberate
 * second click.
 *
 * Hrefs are built from BASE_URL rather than written as "/file.pdf":
 * a root-relative path breaks on a project-page deploy, where the site
 * is served from /<repo>/ and not from the domain root.
 */
function renderCV() {
  const host = document.getElementById("cv-row");
  if (!host) return;

  const base = import.meta.env.BASE_URL;
  const active = lang().toUpperCase();
  // Falls back to the first entry so a locale with no CV of its own
  // still offers something rather than rendering an empty row.
  const c = SITE.cv.find((x) => x.code === active) ?? SITE.cv[0];

  // No language name on the pill: the file already follows the page, so
  // printing "Português" next to Portuguese labels states the obvious.
  host.innerHTML = `
    <span class="cv-label mono-xs" data-i18n="path.cv"></span>
    <span class="cv-item">
      <span class="cv-item__type mono-xs">PDF</span>
      <a class="cv-act" href="${base}${c.file}" target="_blank" rel="noopener">
        ${EYE}<span data-i18n="path.cvView"></span>
      </a>
      <a class="cv-act" href="${base}${c.file}" download>
        ${ARROW}<span data-i18n="path.cvGet"></span>
      </a>
    </span>`;
}
