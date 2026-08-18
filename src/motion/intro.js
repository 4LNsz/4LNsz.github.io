import gsap from "gsap";
import { reducedMotion } from "../core/env.js";
import { buildScroll } from "./choreography.js";

/**
 * Hero reveal.
 *
 * There is no preloader any more. The page used to open on a full-screen
 * curtain counting 000 -> 100 over a fixed 1.9s tween — a progress bar
 * measuring nothing, in front of a page that was already parsed and
 * painted behind it. Worse, the whole reveal hung off `window.load`,
 * which waits on the Google Fonts stylesheet, so a slow font CDN held
 * the curtain over the site and a 2.5s watchdog existed only to cut it
 * loose. All of that is gone: the content is the first thing painted and
 * it only lifts into place.
 *
 * The pre-states live in base.css under `html.js`, the same contract
 * .rv uses — set in CSS so the first frame is already correct, and never
 * applied at all if the bundle fails to load.
 *
 * buildScroll() runs first, not last: it is what arms every scroll
 * reveal on the page, and a visitor who scrolls during the 1.2s hero
 * timeline must not out-run it.
 */
export function playIntro() {
  buildScroll();

  if (reducedMotion) {
    gsap.set(".hero-eyebrow, .hero-name, .hero-statement, .hero-rig, .hero-strip > div, .marquee", {
      opacity: 1,
      y: 0,
    });
    return;
  }

  gsap
    .timeline()
    /* The name used to arrive character by character, back when it was
       the only thing on the screen. It is one element among several
       now, so the block lifts in reading order instead. */
    .fromTo(
      ".hero-eyebrow, .hero-name, .hero-statement, .hero-rig",
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, stagger: 0.09, duration: 0.9, ease: "power3.out" },
      0
    )
    .fromTo(
      ".hero-strip > div",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.06, duration: 0.7, ease: "power3.out" },
      0.06
    )
    .fromTo(".marquee", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.2);
}
