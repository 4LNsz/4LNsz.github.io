import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import "./styles/main.css";

import { applyI18n, mountLangSwitch, onLangChange } from "./core/i18n.js";
import { mountThemeToggle } from "./core/theme.js";
import { resplitAll } from "./core/split.js";
import { initSmoothScroll, initAnchors } from "./core/smooth-scroll.js";
import { mountNav, mountHeaderChrome } from "./core/nav.js";
import { reducedMotion } from "./core/env.js";

import { renderProfile } from "./sections/profile.js";
import { renderStack } from "./sections/stack.js";
import { renderPractice } from "./sections/practice.js";
import { renderPath } from "./sections/path.js";
import { renderMarquee, startMarquee } from "./sections/marquee.js";
import { renderContact } from "./sections/contact.js";
import { startClock } from "./sections/clock.js";

import { playIntro } from "./motion/intro.js";
import { buildScroll } from "./motion/choreography.js";
import { initField } from "./motion/field.js";

gsap.registerPlugin(ScrollTrigger);

document.documentElement.classList.add("js");
if (reducedMotion) document.documentElement.classList.add("reduced");

let booted = false;

/**
 * Rebuilds all localised markup. Runs once at boot and again on every
 * language switch. Order is load-bearing:
 *   render lists -> applyI18n (fills the text) -> resplit (needs final text)
 */
function render() {
  renderProfile();
  renderStack();
  renderPractice();
  renderPath();
  renderMarquee();
  renderContact();

  applyI18n();
  resplitAll();
  startMarquee();

  if (booted) {
    // Already-revealed elements must not snap back to their pre-animation state.
    gsap.set(".rv", { opacity: 1, y: 0 });
    gsap.set(".rv-x", { opacity: 1, x: 0 });
    ScrollTrigger.refresh();
    buildScroll();
  }
}

/* ── boot ────────────────────────────────────────────────── */

render();
onLangChange(render);

mountLangSwitch();
mountThemeToggle();
mountNav();
mountHeaderChrome();
initSmoothScroll();
initAnchors();
startClock();

/**
 * The hero simulation builds its own panel markup, which carries
 * data-i18n labels — render() already ran its applyI18n() pass before
 * that markup existed, so the panel needs one of its own.
 *
 * The button's label is set imperatively (it flips between "+ Load" and
 * "Reset" at the ceiling), so a language switch has to reach it too.
 * render() is registered on onLangChange first, so applyI18n has always
 * run by the time repaintPanel reads t().
 */
const field = initField();
applyI18n();
onLangChange(() => field?.repaintPanel());

document.getElementById("year").textContent = new Date().getFullYear();

/**
 * Curtain-up, guarded three ways.
 *
 * The reveal used to hang off a bare `window.addEventListener("load")`,
 * and everything the visitor reads — buildScroll, the .rv reveals, the
 * whole page behind the preloader — waited on that one event.
 *
 * The guard that matters is the watchdog. `load` does not fire until
 * every subresource has settled, and that includes the Google Fonts
 * stylesheet in index.html. If fonts.googleapis.com is slow, proxied,
 * or blocked outright, `load` is delayed by exactly that much and the
 * visitor stares at the preloader the whole time. Nothing in the intro
 * depends on those fonts arriving, so after 2.5s it starts regardless.
 *
 *   1. readyState — belt and braces if `load` has already gone by.
 *   2. the listener — the normal path.
 *   3. the watchdog — the one that changes behaviour in the field.
 *
 * `once` plus the `started` flag make the three paths idempotent:
 * whichever wins, the other two are no-ops.
 */
let started = false;

function start() {
  if (started) return;
  started = true;
  clearTimeout(watchdog);
  booted = true;
  playIntro();
}

const watchdog = setTimeout(start, 2500);

if (document.readyState === "complete") start();
else window.addEventListener("load", start, { once: true });

/**
 * ScrollTrigger.refresh() is expensive — it re-measures every trigger and
 * re-lays out the pinned track. Unthrottled it fired on every resize
 * event, and on mobile the address bar collapsing counts as a resize:
 * scrolling the page reflowed the pin mid-scroll, which reads as a jump.
 *
 * So: debounce, and ignore height-only changes on touch, where they are
 * almost always browser chrome rather than a real layout change.
 */
let resizeTimer;
let lastWidth = window.innerWidth;
let lastHeight = window.innerHeight;
const coarse = window.matchMedia("(pointer: coarse)").matches;

window.addEventListener("resize", () => {
  const widthChanged = window.innerWidth !== lastWidth;
  const heightChanged = window.innerHeight !== lastHeight;
  if (coarse && !widthChanged && heightChanged) {
    lastHeight = window.innerHeight;
    return;
  }
  lastWidth = window.innerWidth;
  lastHeight = window.innerHeight;

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 180);
});
