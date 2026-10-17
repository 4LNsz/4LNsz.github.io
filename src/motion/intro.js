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
 * The settle itself is CSS keyframes too, started by one class (see
 * "The first screen arriving" in base.css). It was a GSAP timeline,
 * which runs on the main thread, and the main thread is exactly what is
 * busy in that second: the bundle booting, the fonts landing, the field
 * being measured. On a slower machine the entrance stuttered through
 * all of it. Keyframes of opacity and transform run on the compositor
 * and keep their pace whatever the page is doing. Same values, same
 * order, same curve.
 *
 * buildScroll() runs first, not last: it is what arms every scroll
 * reveal on the page, and a visitor who scrolls during the entrance
 * must not out-run it.
 */
export function playIntro() {
  buildScroll();
  // Under reduced motion base.css puts everything at rest (`reduced`).
  if (!reducedMotion) document.documentElement.classList.add("intro");
}
