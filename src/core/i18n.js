import { CONTENT, LANGS, DEFAULT_LANG } from "../content/index.js";

const STORAGE_KEY = "4lnsz:lang";
const listeners = new Set();

let current = restore() ?? detect();

/* ── detection & persistence ─────────────────────────────── */

function detect() {
  const prefs = (navigator.languages || [navigator.language || ""]).map((l) => l.toLowerCase());
  for (const pref of prefs) {
    const hit = LANGS.find(
      (code) =>
        pref === code ||
        pref.startsWith(code + "-") ||
        pref === CONTENT[code].__meta.htmlLang.toLowerCase()
    );
    if (hit) return hit;
  }
  return DEFAULT_LANG;
}

function restore() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return CONTENT[saved] ? saved : null;
  } catch {
    return null;
  }
}

/* ── public API ──────────────────────────────────────────── */

export const lang = () => current;
export const meta = () => CONTENT[current].__meta;

/**
 * Resolve a dotted path in the active locale, falling back to the default.
 *
 * `vars` fills `{name}` placeholders. A sentence that carries a value
 * (a channel's name, a count) is one string with the value's place
 * marked in it, never two fragments glued around the value: word order
 * and articles differ between languages ("Abrindo o Discord…",
 * "Opening Discord…", "Discord wird geöffnet…"), and only a whole
 * sentence lets each language put the value where it belongs.
 */
export function t(path, vars) {
  const dig = (obj) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  const found = dig(CONTENT[current]);
  const value = found !== undefined ? found : dig(CONTENT[DEFAULT_LANG]) ?? path;
  return vars && typeof value === "string" ? value.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : value;
}

/**
 * Paint every [data-i18n] node. Text only — no DOM rebuild, so GSAP
 * survives. A node with `data-i18n-args` (JSON) fills the string's
 * placeholders from it.
 */
export function applyI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n, el.dataset.i18nArgs ? JSON.parse(el.dataset.i18nArgs) : undefined);
  });
  root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    const [attr, key] = el.dataset.i18nAttr.split(":");
    el.setAttribute(attr, t(key));
  });
  document.documentElement.lang = meta().htmlLang;
}

export function setLang(code) {
  if (!CONTENT[code] || code === current) return;
  current = code;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* private mode — fine, just don't persist */
  }
  listeners.forEach((fn) => fn(code));
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const CHEVRON = `<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 3.5 5 7l3.5-3.5"/></svg>`;
const CHECK = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5"/></svg>`;

/**
 * The language switch: one button naming the language in use, opening
 * a list of every language the page has, each by its code and its own
 * name. It builds itself from CONTENT, so a new locale file appears in
 * the list with no other change.
 *
 * It used to be a row of codes, "PT / EN". That reads well at two and
 * would not at five: the header has no room for a sentence of codes,
 * least of all on a phone. The list holds any number.
 *
 * A disclosure, not an ARIA menu: a button that shows and hides a list
 * of buttons, which needs no roles a screen reader might get wrong. The
 * arrow keys move through the list, Escape closes it and returns to the
 * button, and it closes on its own when focus or a click goes elsewhere
 * or the page scrolls (the header it hangs from can slide away).
 */
export function mountLangSwitch(host = document.getElementById("lang")) {
  if (!host) return;
  host.innerHTML = `<button type="button" class="lang__btn" aria-expanded="false" aria-controls="lang-list"><span class="vh"></span><span class="lang__code"></span>${CHEVRON}</button><ul class="lang__list" id="lang-list" hidden></ul>`;
  const btn = host.querySelector(".lang__btn");
  const list = host.querySelector(".lang__list");

  const isOpen = () => !list.hidden;
  const setOpen = (next, returnFocus) => {
    list.hidden = !next;
    btn.setAttribute("aria-expanded", String(next));
    if (next) (list.querySelector('[aria-current="true"]') ?? list.querySelector("button"))?.focus();
    else if (returnFocus) btn.focus();
  };

  const paint = () => {
    const m = CONTENT[current].__meta;
    // The visible code stays in the button's name ("Idioma PT"), so what
    // a voice-control user reads on screen is what they can say.
    btn.querySelector(".vh").textContent = `${t("ui.language")} `;
    btn.querySelector(".lang__code").textContent = m.code;
    list.innerHTML = LANGS.map((code) => {
      const x = CONTENT[code].__meta;
      const on = code === current;
      return `<li><button type="button" data-code="${code}" lang="${x.htmlLang}" aria-current="${on}"><b>${x.code}</b><span>${x.name}</span>${on ? CHECK : ""}</button></li>`;
    }).join("");
  };

  btn.addEventListener("click", () => setOpen(!isOpen(), false));
  list.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-code]");
    if (!b) return;
    setOpen(false, true);
    setLang(b.dataset.code);
  });
  host.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false, true);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const items = [...list.querySelectorAll("button")];
      const i = items.indexOf(document.activeElement);
      items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length].focus();
    }
  });
  // Only a focus that has gone somewhere closes it: Tab out of the list.
  // Safari does not focus a button it clicks, so a click on an item
  // blurs the list with nowhere to go first; closing then would hide
  // the item before its click arrived. Clicks outside close it below.
  host.addEventListener("focusout", (e) => {
    if (isOpen() && e.relatedTarget && !host.contains(e.relatedTarget)) setOpen(false, false);
  });
  document.addEventListener("click", (e) => {
    if (isOpen() && !host.contains(e.target)) setOpen(false, false);
  });
  window.addEventListener("scroll", () => isOpen() && setOpen(false, false), { passive: true });

  paint();
  onLangChange(paint);
}
