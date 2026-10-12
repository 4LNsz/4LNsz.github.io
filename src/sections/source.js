import { SITE } from "../config.js";
import { lang } from "../core/i18n.js";

/**
 * "Where does this row come from?", answered on the row.
 *
 * The locale files mark every fact [CV] or [GH] in a comment, which only
 * someone reading the source ever sees. Rows that can be checked against
 * a public document now carry the same marker as data, `src: ["cv",
 * "gh"]`, and this turns each key into a link to the document itself.
 *
 * There is deliberately no key for "Alan said so". A fact with no public
 * source simply has no link; inventing a badge for it would be decoration.
 */

/** The CV for the language the page is in, falling back to the first. */
export function cvHref() {
  const active = lang().toUpperCase();
  const c = SITE.cv.find((x) => x.code === active) ?? SITE.cv[0];
  // Built from BASE_URL: a root-relative path breaks on a project-page
  // deploy, where the site is served from /<repo>/.
  return `${import.meta.env.BASE_URL}${c.file}`;
}

const LINKS = {
  // Proper nouns, not prose: the same in every language.
  cv: () => `<a href="${cvHref()}" target="_blank" rel="noopener">CV</a>`,
  gh: () => `<a href="${SITE.github}" target="_blank" rel="noopener noreferrer">GitHub</a>`,
};

export function sourceLinks(src = []) {
  const links = src.map((k) => LINKS[k]?.()).filter(Boolean);
  if (!links.length) return "";
  return `<span class="src"><span data-i18n="ui.source"></span>${links.join("")}</span>`;
}
