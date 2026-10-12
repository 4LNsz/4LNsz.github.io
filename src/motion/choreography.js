import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { reducedMotion } from "../core/env.js";

let ctx = null;

/**
 * Scroll reveals, and nothing else.
 *
 * This file used to build a pinned horizontal track, a progress rail, a
 * counter and a character-by-character headline. The sheet has none of
 * them: every section is a table or a figure that reads top to bottom,
 * so all that is left is rows settling as they come into view.
 *
 * Reduced motion gets the finished page, not a slower version of the
 * animated one.
 *
 * Every reveal uses fromTo, never from. `gsap.from` reads the element's
 * CURRENT value as the destination; .rv pre-sets opacity:0 in CSS, so
 * `from({opacity:0})` animates 0 -> 0 and the element never appears.
 * fromTo is explicit on both ends and immune to that.
 */
export function buildScroll() {
  ctx?.revert();

  if (reducedMotion) {
    gsap.set(".rv", { clearProps: "all", opacity: 1, y: 0 });
    return;
  }

  ctx = gsap.context(() => {
    // Rows that enter together settle together, in order: ScrollTrigger
    // batches whatever crosses the line in the same frame.
    ScrollTrigger.batch(".rv", {
      start: "top 90%",
      once: true,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.06, overwrite: true }),
    });
  });
}
