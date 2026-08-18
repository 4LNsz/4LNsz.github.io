import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { DESKTOP, MOBILE, reducedMotion } from "../core/env.js";

let ctx = null;

/**
 * Reduced motion gets the finished page, not a slower version of the
 * animated one. That includes skipping the pinned horizontal track: a
 * pin converts vertical scrolling into horizontal movement, which is
 * exactly the kind of unexpected motion the preference asks us to drop.
 * practice.css already defaults to the readable column, so opting out
 * here is all it takes.
 */
function settleStatic() {
  gsap.set(".rv", { clearProps: "all", opacity: 1, y: 0 });
  gsap.set(".rv-x", { clearProps: "all", opacity: 1, x: 0 });
  gsap.set(".contact-big .ch", { yPercent: 0, opacity: 1 });
  gsap.set(".panel", { opacity: 1, y: 0 });
}

/**
 * Every reveal uses fromTo, never from.
 *
 * `gsap.from` reads the element's CURRENT value as the destination. The
 * .rv / .rv-x classes pre-set opacity:0 in CSS, so `from({opacity:0})`
 * animates 0 -> 0 and the element never appears. fromTo is explicit on
 * both ends and immune to that.
 */
export function buildScroll() {
  ctx?.revert();

  if (reducedMotion) {
    settleStatic();
    return;
  }

  ctx = gsap.context(() => {
    /* generic vertical reveal */
    gsap.utils.toArray(".rv").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }
      );
    });

    /* horizontal-slide reveal (path rows) */
    gsap.utils.toArray(".rv-x").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } }
      );
    });

    const mm = gsap.matchMedia();
    mm.add(DESKTOP, buildHorizontalPractice);
    mm.add(MOBILE, buildStackedPractice);

    /* contact headline, character by character */
    gsap.fromTo(
      ".contact-big .ch",
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.026,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: { trigger: "#contact", start: "top 65%" },
      }
    );
  });
}

/* ── practice: pinned horizontal scroll ──────────────────── */

/**
 * `.is-horizontal` is added HERE and nowhere else, and removed by the
 * cleanup gsap.matchMedia runs on revert.
 *
 * practice.css defaults the track to a vertical column, so the section
 * is fully readable with no JS at all. The horizontal track is opt-in by
 * the only code that can also build the pin that scrolls it, so the
 * clipping layout and the mechanism that scrolls it can never end up
 * out of step.
 *
 * Previously the polarity was reversed: .practice-pin clipped with
 * overflow:hidden by default and .is-stacked opted out. That makes the
 * unreachable layout the fallback — any path where the pin does not get
 * built leaves panels 02-04 clipped with no way to scroll to them.
 */
function buildHorizontalPractice() {
  const section = document.getElementById("practice");
  const track = document.getElementById("practice-track");
  const pin = document.getElementById("practice-pin");
  const fill = document.getElementById("practice-fill");
  const counter = document.getElementById("practice-counter");
  const total = track.children.length;

  section.classList.add("is-horizontal");

  // Recomputed on every refresh so resizing doesn't desync the pin length.
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);

  gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: pin,
      start: "top top",
      end: () => "+=" + distance(),
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        fill.style.width = (self.progress * 100).toFixed(1) + "%";
        const index = Math.min(total, Math.floor(self.progress * total) + 1);
        counter.textContent = `${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
      },
    },
  });

  gsap.fromTo(
    ".panel",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: pin, start: "top 80%" },
    }
  );

  // Runs on revert — i.e. when the viewport drops below the breakpoint.
  return () => {
    section.classList.remove("is-horizontal");
    track.removeAttribute("style");
  };
}

function buildStackedPractice() {
  gsap.utils.toArray(".panel").forEach((panel) => {
    gsap.fromTo(
      panel,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: panel, start: "top 88%" } }
    );
  });
}
