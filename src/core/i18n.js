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

/** Resolve a dotted path in the active locale, falling back to the default. */
export function t(path) {
  const dig = (obj) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  const value = dig(CONTENT[current]);
  return value !== undefined ? value : dig(CONTENT[DEFAULT_LANG]) ?? path;
}

/** Paint every [data-i18n] node. Text only — no DOM rebuild, so GSAP survives. */
export function applyI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
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

/** The switcher builds itself from CONTENT — a new locale file appears here for free. */
export function mountLangSwitch(host = document.getElementById("lang")) {
  const paint = () => {
    host.innerHTML = "";
    LANGS.forEach((code, i) => {
      if (i) {
        const sep = document.createElement("span");
        sep.textContent = "/";
        // Purely typographic. Announced, it reads as "PT slash EN".
        sep.setAttribute("aria-hidden", "true");
        host.appendChild(sep);
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = CONTENT[code].__meta.code;
      btn.title = CONTENT[code].__meta.name;
      btn.setAttribute("aria-current", String(code === current));
      btn.addEventListener("click", () => setLang(code));
      host.appendChild(btn);
    });
  };
  paint();
  onLangChange(paint);
}
