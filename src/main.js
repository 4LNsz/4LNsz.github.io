import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import "./styles/main.css";

import { applyI18n, mountLangSwitch, onLangChange } from "./core/i18n.js";
import { mountThemeToggle } from "./core/theme.js";
import { resplitAll } from "./core/split.js";
import { initAnchors } from "./core/anchors.js";
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
 * Curtain-up — except there is no curtain any more.
 *
 * This used to be a three-way guard (readyState, a `load` listener and a
 * 2.5s watchdog) whose only job was deciding when to lift the preloader.
 * `load` does not fire until every subresource has settled, including
 * the Google Fonts stylesheet, so a slow or blocked font CDN held a
 * full-screen curtain over a page that was already painted behind it.
 *
 * With the preloader gone the page has nothing to wait for: the markup
 * is rendered, so it plays now.
 */
booted = true;
playIntro();

/**
 * Web fonts change text metrics, and text metrics change the height of
 * every section — which is to say every ScrollTrigger start, end and pin
 * distance measured before they arrive. The intro no longer waits for
 * them, so re-measure once when they land.
 */
document.fonts?.ready.then(() => ScrollTrigger.refresh());

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
