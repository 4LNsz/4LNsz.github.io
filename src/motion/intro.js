import gsap from "gsap";
import { reducedMotion } from "../core/env.js";
import { buildScroll } from "./choreography.js";

/**
 * The first screen arriving.
 *
 * There is no preloader. The content is the first thing painted and it
 * only settles into place: title, then the figure, then what annotates
 * it. The dial itself needs no entrance of its own, because the arc
 * grows from nothing as the first measurements come in. That is the one
 * authored moment on the page, and it is real data.
 *
 * The pre-states live in base.css under `html.js`, the same contract
 * .rv uses: set in CSS so the first frame is already correct, and never
 * applied at all if the bundle fails to load.
 *
 * buildScroll() runs first, not last: it is what arms every scroll
 * reveal on the page, and a visitor who scrolls during the hero
 * timeline must not out-run it.
 */
const BLOCKS = ".hero-id > *, .hero-statement, .callouts, .ficha, .doors, .mini";

export function playIntro() {
  buildScroll();

  if (reducedMotion) {
    gsap.set(`${BLOCKS}, .dial, .leaders, .strip`, { opacity: 1, y: 0 });
    return;
  }

  gsap
    .timeline({ defaults: { ease: "expo.out" } })
    .fromTo(".hero-id > *", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.9 }, 0)
    .fromTo(".dial", { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 1.1 }, 0.08)
    .fromTo(".mini", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.2)
    .fromTo(".hero-statement, .ficha, .doors", { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.9 }, 0.22)
    .fromTo(".callouts", { opacity: 0 }, { opacity: 1, stagger: 0.08, duration: 0.7 }, 0.4)
    .fromTo(".leaders", { opacity: 0 }, { opacity: 1, duration: 0.7 }, 0.55)
    .fromTo(".strip", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.3);
}
