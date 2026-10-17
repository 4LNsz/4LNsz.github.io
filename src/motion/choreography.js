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
  // A rebuild, on every language switch, must not undo reveals that have
  // already played. This used to be revert(), which put every finished
  // row back to its CSS pre-state; the new batch then replayed all of
  // them 60ms apart, so the row being read went blank for about a
  // second. kill() stops the old triggers and leaves the rows as they are.
  const rebuild = ctx !== null;
  ctx?.kill();

  if (reducedMotion) {
    gsap.set(".rv", { clearProps: "all", opacity: 1, y: 0 });
    return;
  }

  // Rows the visitor has already passed are shown as they are, not
  // animated in after the fact. On the first build that is whatever lies
  // above the viewport: a link to #path, a reload half-way down. On a
  // rebuild it is everything above the reveal line, because a language
  // switch re-renders the lists and those rows are fresh copies of ones
  // already on screen. A row a reveal has finished with keeps its place.
  const line = window.innerHeight * 0.9;
  const passed = (el) => {
    if (el.style.opacity === "1") return true;
    const r = el.getBoundingClientRect();
    return rebuild ? r.top < line : r.bottom < 0;
  };
  const rows = gsap.utils.toArray(".rv");
  gsap.set(rows.filter(passed), { opacity: 1, y: 0 });

  ctx = gsap.context(() => {
    // Rows that enter together settle together, in order: ScrollTrigger
    // batches whatever crosses the line in the same frame. However many
    // arrive at once, the last one starts within 0.3s.
    ScrollTrigger.batch(rows.filter((el) => !passed(el)), {
      start: "top 90%",
      once: true,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: Math.min(0.06, 0.3 / els.length), overwrite: true }),
    });
  });
}
