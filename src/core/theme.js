import gsap from "gsap";
import { THEME } from "../config.js";
import { t, onLangChange } from "./i18n.js";

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

  document.documentElement.setAttribute("data-theme", current);
  document.getElementById("meta-theme")?.setAttribute("content", THEME.browserColor[current]);

  try {
    localStorage.setItem(STORAGE_KEY, current);
  } catch {
    /* private mode */
  }

  updateLabel();
  gsap.to("#theme svg", {
    rotate: current === THEME.default ? 0 : 180,
    duration: animate ? 0.6 : 0,
    ease: "power3.inOut",
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
