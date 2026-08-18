export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Section 03 has three layouts, and the two boundaries are not arbitrary.
 *
 * The pinned horizontal track is only worth building while the track is
 * genuinely wider than the viewport. Its width stops growing at 795px —
 * four panels at `min(78vw, 620px)`, so 2480px — which means the
 * overflow the pin scrolls through shrinks to nothing somewhere around
 * 2400px and is gone on every ultrawide display.
 *
 * Past that point ScrollTrigger was still building a pin with a travel
 * distance of zero: the section locked and released in the same frame,
 * the progress rail never left 0%, the counter never left 01/04, and the
 * four panels sat against the left edge with ~1000px of empty page
 * beside them, under a caption telling the visitor to scroll sideways.
 *
 * Above ULTRAWIDE the panels lay out as a static grid inside the normal
 * page column instead. Nothing is clipped, so nothing needs a mechanism
 * to reach it — the same reasoning that makes the stacked column the
 * default rather than the fallback.
 *
 * The three queries must stay mutually exclusive, and must match the
 * `#practice.is-grid` breakpoint in styles/practice.css.
 */
export const MOBILE = "(max-width: 860px)";
export const DESKTOP = "(min-width: 861px) and (max-width: 2199.98px)";
export const ULTRAWIDE = "(min-width: 2200px)";
