import { SITE } from "../config.js";

/**
 * One table, every channel.
 *
 * Each channel is a cell of the same ruled table. The featured one spans
 * the full width and is the only filled cell, which is what makes it
 * read as "start here". Its one line of prose sits under the name, as
 * a sentence, the way the door on the first screen sets it; over the
 * name it was a kicker, and this sheet has none.
 */

/** Brand glyph, not prose — safe to keep out of the locale files. */
const DISCORD_MARK = `<svg class="chan__mark" viewBox="0 0 127.14 96.36" aria-hidden="true"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>`;

const GO = `<svg class="chan__go" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M8.5 6H18v9.5"/></svg>`;

/**
 * One channel as a cell of the table.
 *
 * Pure: it builds a string and touches no DOM, because vite.config.js
 * calls it as well, to write the static card that stands in for the
 * page when the bundle never runs. `note: false` leaves out the one
 * line of localised prose, which only a running script can fill.
 */
export function channelCell(c, { note = true } = {}) {
  // mailto: must not open a tab: target=_blank on it leaves a blank
  // window behind when the mail client takes over.
  const external = c.external !== false;
  const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
  const cls = `chan${c.featured ? " chan--featured" : ""}`;

  // Optional desktop-app scheme. It rides as a data attribute rather
  // than as the href on purpose; core/applink.js explains why at
  // length. Absent the attribute the cell is an ordinary link, so a
  // channel without an app, or a browser where the module never
  // ran, loses nothing.
  const appAttr = c.app ? ` data-app="${c.app}"` : "";

  // The featured cell is its name and one line of localised prose
  // under it. The rest are a label and a value: the channel name,
  // which is not translated, over the handle. `value` is optional:
  // a channel with no public handle worth printing shows just its
  // name, and nothing is filled in for it.
  const body = c.featured
    ? `<span class="chan__v">${c.label}</span>${note ? `<span class="chan__d" data-i18n="contact.primary"></span>` : ""}`
    : `<span class="chan__k">${c.label}</span><span class="chan__v${c.mono ? " chan__v--long" : ""}">${c.value ?? c.label}</span>`;

  return `
    <a class="${cls}" href="${c.url}"${attrs}${appAttr} aria-label="${[c.label, c.value].filter(Boolean).join(": ")}">
      ${c.featured ? DISCORD_MARK : ""}
      <span>${body}</span>
      ${GO}
    </a>`;
}

export function renderContact() {
  document.getElementById("channels").innerHTML = SITE.channels.map((c) => channelCell(c)).join("");
}
