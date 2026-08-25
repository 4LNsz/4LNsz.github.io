import { SITE } from "../config.js";

/**
 * One grid, every channel.
 *
 * Section 05 used to be a bespoke Discord card — icon, note, the raw
 * 18-digit ID, an open button and a copy button — sitting above a
 * separate three-column strip of social links. Two components doing one
 * job, and the Discord card carried three competing targets inside a
 * single flex row that collapsed into each other as it narrowed.
 *
 * Now every channel is the same card. The featured one spans the full
 * grid and carries the mark and an accent edge, which is what makes it
 * read as "start here" — so the section does not need a line of prose
 * telling the reader which channel to use.
 */

/** Brand glyph, not prose — safe to keep out of the locale files. */
const DISCORD_MARK = `<svg class="card__mark" viewBox="0 0 127.14 96.36" aria-hidden="true"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>`;

export function renderContact() {
  document.getElementById("channels").innerHTML = SITE.channels
    .map((c) => {
      // mailto: must not open a tab — target=_blank on it leaves a blank
      // window behind when the mail client takes over.
      const external = c.external !== false;
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      const cls = `card${c.featured ? " card--featured" : ""}`;

      // Optional desktop-app scheme. It rides as a data attribute rather
      // than as the href on purpose — core/applink.js explains why at
      // length. Absent the attribute the card is an ordinary link, so a
      // channel without an app, or a browser where the module never
      // ran, loses nothing.
      const appAttr = c.app ? ` data-app="${c.app}"` : "";

      // The featured card's eyebrow is localised prose; the rest label
      // themselves with the channel name, which is not translated.
      const eyebrow = c.featured
        ? `<span class="card__k mono-xs" data-i18n="contact.primary"></span>`
        : `<span class="card__k mono-xs">${c.label}</span>`;

      // `value` is optional: a channel with no public handle worth
      // printing shows just its name. Nothing is filled in for it.
      const headline = c.featured ? c.label : c.value ?? c.label;
      const sub = c.featured && c.value ? `<span class="card__sub">${c.value}</span>` : "";

      return `
    <a class="${cls}" href="${c.url}"${attrs}${appAttr} aria-label="${[c.label, c.value].filter(Boolean).join(": ")}">
      ${c.featured ? DISCORD_MARK : ""}
      <span class="card__text">
        ${eyebrow}
        <span class="card__val${c.mono ? " card__val--mono" : ""}">${headline}</span>
        ${sub}
      </span>
      <span class="card__go" aria-hidden="true">&#8599;</span>
    </a>`;
    })
    .join("");
}
