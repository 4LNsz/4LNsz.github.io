import { reducedMotion } from "./env.js";

/**
 * Anchor navigation.
 *
 * There is no smooth-scroll library here any more. Lenis ran its own rAF
 * loop and lerped every wheel event at 0.085, so the page kept coasting
 * after the gesture stopped — the "catching up with the pointer" feel —
 * and ScrollTrigger, the header auto-hide and the drawer's scroll lock
 * all had to be routed through it. Native scrolling needs none of that.
 *
 * What is left is only the anchor jump, and only because preventDefault
 * is needed to move focus with it. `scroll-margin-top` in base.css keeps
 * the target clear of the fixed header, so no offset is computed here.
 */
export function initAnchors() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    // A click is a discrete request, not a continuous gesture: gliding
    // to the section is the browser's own behaviour and costs nothing in
    // wheel latency. Reduced motion still gets the jump.
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });

    // preventDefault stops the browser's own jump, and with it the focus
    // move that jump would have performed. Without this the skip link
    // scrolls the page but leaves a screen-reader user's focus in the
    // header — the one thing the link exists to get them past.
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });

    // Keep the URL shareable without letting the browser's own jump
    // fight the scroll that just started.
    history.replaceState(null, "", href);
  });
}
