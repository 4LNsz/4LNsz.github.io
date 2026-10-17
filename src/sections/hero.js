import { SITE } from "../config.js";
import { t } from "../core/i18n.js";
import { cvHref } from "./source.js";

/**
 * The parts of the first screen that come from data.
 *
 * Callouts: one per entry in `hero.fig`, split across the two lists that
 * flank the dial. They are two <ol>s rather than one because each column
 * has to flow with the rest of its own content; the second continues the
 * count with `start`, so a screen reader still hears one numbered list.
 * The numbers in the bubbles are hidden from it for the same reason.
 *
 * Doors: the two audiences this page serves at equal weight each get
 * their own exit. The project door is the featured channel from
 * config.js, so it inherits the desktop-app handoff in core/applink.js;
 * the role door is the CV for the language the page is in.
 */

const OUT = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M8.5 6H18v9.5"/></svg>`;

export function renderHero() {
  // The field takes load where it is pressed, and nothing on the page
  // said so. The caption under the dial does, in the verb the device
  // uses.
  const hint = document.getElementById("dial-hint");
  if (hint) hint.dataset.i18n = window.matchMedia("(pointer: coarse)").matches ? "hero.press.tap" : "hero.press.click";

  const fig = t("hero.fig") ?? [];
  const half = Math.ceil(fig.length / 2);
  const item = (i) => `
    <li>
      <i class="n" aria-hidden="true">${i + 1}</i>
      <div><b data-i18n="hero.fig.${i}.t"></b><span data-i18n="hero.fig.${i}.d"></span></div>
    </li>`;

  const a = document.getElementById("callouts-a");
  const b = document.getElementById("callouts-b");
  a.innerHTML = fig.slice(0, half).map((_, i) => item(i)).join("");
  b.innerHTML = fig.slice(half).map((_, i) => item(half + i)).join("");
  b.start = half + 1;

  const ch = SITE.channels.find((c) => c.featured) ?? SITE.channels[0];
  const appAttr = ch.app ? ` data-app="${ch.app}"` : "";
  // The handle follows Alan's sentence on the same line, so a visitor
  // can add him from their own app. While the app is being asked to
  // open, the line says so instead (see core/applink.js).
  const handle = ch.value ? `<span class="door__h">${ch.value}</span>` : "";
  const wait = ch.app ? `<span class="app-wait" data-i18n="ui.opening" data-i18n-args='${JSON.stringify({ app: ch.label })}'></span>` : "";

  document.getElementById("doors").innerHTML = `
    <a class="door door--pri" href="${ch.url}" target="_blank" rel="noopener noreferrer"${appAttr}>
      <div><b data-i18n="hero.doors.project.t"></b><span class="app-note"><span data-i18n="hero.doors.project.d"></span>${handle}</span>${wait}</div>
      ${OUT}
    </a>
    <a class="door" href="${cvHref()}" target="_blank" rel="noopener">
      <div><b data-i18n="hero.doors.role.t"></b><span data-i18n="hero.doors.role.d"></span></div>
      ${OUT}
    </a>`;
}
