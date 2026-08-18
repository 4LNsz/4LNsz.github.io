import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { MOTION } from "../config.js";
import { reducedMotion } from "./env.js";

let lenis = null;

/** Canonical Lenis + ScrollTrigger wiring. Order matters. */
export function initSmoothScroll() {
  if (reducedMotion) return null;

  lenis = new Lenis(MOTION.lenis);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/** null under reduced motion — callers must optional-chain. */
export const getLenis = () => lenis;

export function initAnchors() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    // Clear the fixed header, which would otherwise cover the section head.
    const offset = -(document.querySelector("header")?.offsetHeight ?? 0) - 8;

    if (lenis) lenis.scrollTo(target, { offset });
    else target.scrollIntoView({ behavior: "smooth" });

    // preventDefault stops the browser's own jump, and with it the focus
    // move that jump would have performed. Without this the skip link
    // scrolls the page but leaves a screen-reader user's focus in the
    // header — the one thing the link exists to get them past.
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });

    // Keep the URL shareable without letting the browser's own jump
    // fight the smooth scroll.
    history.replaceState(null, "", href);
  });
}
