import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// The stylesheet is not imported here: index.html links it, so it is in
// place before the first paint. See the comment beside that link.

import { applyI18n, mountLangSwitch, onLangChange } from "./core/i18n.js";
import { mountThemeToggle } from "./core/theme.js";
import { initAnchors } from "./core/anchors.js";
import { mountAppLinks } from "./core/applink.js";
import { mountNav, mountHeaderChrome } from "./core/nav.js";
import { reducedMotion } from "./core/env.js";

import { renderHero } from "./sections/hero.js";
import { renderProfile } from "./sections/profile.js";
import { renderStack } from "./sections/stack.js";
import { renderPractice } from "./sections/practice.js";
import { renderPath, drawGraph } from "./sections/path.js";
import { renderContact } from "./sections/contact.js";
import { startClock } from "./sections/clock.js";

import { playIntro } from "./motion/intro.js";
import { buildScroll } from "./motion/choreography.js";
import { initField } from "./motion/field.js";

gsap.registerPlugin(ScrollTrigger);

// Normally a no-op: the inline script in index.html set this before the
// first paint. It matters when that script gave up waiting and took the
// class off again, and the bundle has turned up after all.
document.documentElement.classList.add("js");
if (reducedMotion) document.documentElement.classList.add("reduced");

let booted = false;
let field = null;

/**
 * Rebuilds all localised markup. Runs once at boot and again on every
 * language switch. Order is load-bearing:
 *   render lists -> applyI18n (fills the text)
 * and anything that MEASURES text comes after both: the leader lines in
 * the hero are drawn from where the callouts ended up, which depends on
 * how long their words are in the language just applied.
 */
function render() {
  renderHero();
  renderProfile();
  renderStack();
  renderPractice();
  renderPath();
  renderContact();

  applyI18n();

  if (booted) {
    // Rows already revealed stay revealed: buildScroll() shows whatever
    // the visitor has passed and arms the rest, so nothing is set here.
    field?.repaint();
    field?.layout();
    ScrollTrigger.refresh();
    buildScroll();
  }
}

/* ── boot ────────────────────────────────────────────────── */

render();
// The page now has its words. From here on, if anything below throws,
// the inline script in index.html shows it at rest rather than falling
// back to the static card, which is only for a page with nothing on it.
document.documentElement.classList.add("ready");
onLangChange(render);

mountLangSwitch();
mountThemeToggle();
mountNav();
mountHeaderChrome();
initAnchors();
// Delegated on document, so it survives the re-render a language
// switch performs on the doors and the channel cells.
mountAppLinks();
startClock();

// iOS Safari only applies :active to a tap when some touch listener
// exists. This one does nothing else; the press states are in the CSS.
document.addEventListener("touchstart", () => {}, { passive: true });

/**
 * The hero simulation builds its own readout, which carries data-i18n
 * labels. render() already ran its applyI18n() pass before that markup
 * existed, so the readout needs one of its own.
 *
 * SCOPED TO THE READOUT. applyI18n writes textContent on every
 * [data-i18n] node it is handed, and a document-wide pass here would
 * repaint the whole page a second time for the sake of six labels. Any
 * applyI18n() outside render() takes a root, as this one does.
 */
field = initField();
applyI18n(document.getElementById("hero-instr"));

document.getElementById("year").textContent = new Date().getFullYear();

/**
 * Curtain-up, except there is no curtain. The page has nothing to wait
 * for: the markup is rendered, so it plays now.
 */
booted = true;
playIntro();

/**
 * Web fonts change text metrics, and text metrics change the height of
 * every section and the position of every callout. Nothing waits for
 * them, so re-measure once when they land: the scroll triggers, the
 * leader lines and the lettering the record draws on its canvas.
 */
document.fonts?.ready.then(() => {
  field?.layout();
  drawGraph();
  ScrollTrigger.refresh();
});

/**
 * ScrollTrigger.refresh() is expensive: it re-measures every trigger.
 * Unthrottled it fired on every resize event, and on mobile the address
 * bar collapsing counts as a resize.
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
  resizeTimer = setTimeout(() => {
    // The career diagram is laid out for the width it is given rather
    // than scaled into it, so a new width means a new drawing.
    if (widthChanged) drawGraph();
    ScrollTrigger.refresh();
  }, 180);
});

/**
 * Last line on purpose. The inline script in index.html hid the hero on
 * the promise that this file would bring it back, and it is waiting to
 * hear that it did. Anything above that throws never reaches this, and
 * the page is then shown at rest instead of staying hidden.
 */
window.__boot?.();
