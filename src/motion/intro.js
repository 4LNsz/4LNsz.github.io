import gsap from "gsap";
import { reducedMotion } from "../core/env.js";
import { buildScroll } from "./choreography.js";

/**
 * Preloader: counter 000 -> 100, then the curtain wipes up and hands off
 * to the hero reveal. buildScroll() runs at the end so ScrollTrigger
 * measures a settled layout.
 */
export function playIntro() {
  const loader = document.getElementById("loader");
  const count = document.getElementById("loader-count");
  const fill = document.getElementById("loader-fill");

  if (reducedMotion) {
    loader.style.display = "none";
    gsap.set(".hero-eyebrow, .hero-name, .hero-statement, .hero-rig", { opacity: 1, y: 0 });
    gsap.set(".rv", { opacity: 1, y: 0 });
    gsap.set(".rv-x", { opacity: 1, x: 0 });
    buildScroll();
    return;
  }

  const n = { v: 0 };

  gsap
    .timeline()
    .to("#loader-word", { y: "0%", duration: 0.9, ease: "power4.out" }, 0)
    .to(
      n,
      {
        v: 100,
        duration: 1.9,
        ease: "power2.inOut",
        onUpdate: () => (count.textContent = String(Math.round(n.v)).padStart(3, "0")),
      },
      0.15
    )
    .to(fill, { width: "100%", duration: 1.9, ease: "power2.inOut" }, 0.15)
    .to("#loader-word", { y: "-105%", duration: 0.6, ease: "power3.in" }, "+=0.15")
    .to(count, { opacity: 0, duration: 0.4 }, "<")
    .to(loader, { yPercent: -100, duration: 1, ease: "expo.inOut", onStart: () => loader.classList.add("done") }, "-=0.2")
    /* The name used to arrive character by character, back when it was
       the only thing on the screen. It is one element among several
       now, so the block lifts in reading order instead. */
    .fromTo(
      ".hero-eyebrow, .hero-name, .hero-statement, .hero-rig",
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, stagger: 0.09, duration: 0.9, ease: "power3.out" },
      "-=0.65"
    )
    .fromTo(
      ".hero-strip > div",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.06, duration: 0.7, ease: "power3.out" },
      "-=0.7"
    )
    .fromTo(".marquee", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.6")
    .add(() => {
      loader.style.display = "none";
      buildScroll();
    });
}
