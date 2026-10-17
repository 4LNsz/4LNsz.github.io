import gsap from "gsap";
import { THEME } from "../config.js";
import { t, onLangChange } from "./i18n.js";
import { reducedMotion } from "./env.js";

// The inline script in index.html reads this key too, to set a saved
// theme before the first paint. Change it in both places.
const STORAGE_KEY = "4lnsz:theme";
const THEMES = Object.keys(THEME.browserColor);

let current = restore() ?? THEME.default;

function restore() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(saved) ? saved : null;
  } catch {
    return null;
  }
}

export const theme = () => current;

export function setTheme(next, animate = true) {
  if (!THEMES.includes(next)) return;
  current = next;

  // The swap is instant, in one frame, with nothing animating. It was a
  // 0.45s colour fade on every themed surface: every frame of it restyled
  // and repainted the whole page, which on a slower machine stuttered for
  // the whole half-second (with the simulation stopped as much as with it
  // running), and the surfaces turned at different speeds and passed
  // through a neutral grey. A View Transition cross-fade replaced it
  // briefly; it cost more again, and the still picture of the old dial
  // fading over the live one read as a stutter of its own.
  //
  // `theming` holds the controls' own colour transitions off while the
  // new colours land. It comes off two frames later: the first frame
  // draws the new theme, the second has nothing left to animate.
  const root = document.documentElement;
  root.classList.add("theming");
  root.setAttribute("data-theme", current);
  document.getElementById("meta-theme")?.setAttribute("content", THEME.browserColor[current]);
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theming")));

  try {
    localStorage.setItem(STORAGE_KEY, current);
  } catch {
    /* private mode */
  }

  updateLabel();
  gsap.to("#theme svg", {
    rotate: current === THEME.default ? 0 : 180,
    duration: animate && !reducedMotion ? 0.3 : 0,
    ease: "power3.inOut",
    overwrite: true,
  });
}

function updateLabel() {
  const btn = document.getElementById("theme");
  if (!btn) return;
  const label = current === "dark" ? t("ui.toLight") : t("ui.toDark");
  btn.setAttribute("aria-label", label);
  btn.title = label;
}

export function mountThemeToggle() {
  const btn = document.getElementById("theme");
  btn?.addEventListener("click", () => setTheme(current === "dark" ? "light" : "dark"));
  onLangChange(updateLabel);
  setTheme(current, false);
}
