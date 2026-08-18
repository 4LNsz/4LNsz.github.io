import gsap from "gsap";
import { MOTION } from "../config.js";
import { t } from "../core/i18n.js";
import { reducedMotion } from "../core/env.js";

let tween = null;

export function renderMarquee() {
  const items = t("marquee");
  const row = `<div class="marquee__row">${items.map((x) => `<span>${x}</span>`).join("")}</div>`;
  document.getElementById("marquee").innerHTML = row.repeat(4);
}

/** Seamless loop: modifier wraps x by one row width, so it never resets visibly. */
export function startMarquee() {
  tween?.kill();
  if (reducedMotion) return;

  const rows = gsap.utils.toArray(".marquee__row");
  if (!rows.length) return;

  gsap.set(rows, { x: 0 });
  tween = gsap.to(rows, {
    x: () => -rows[0].offsetWidth,
    duration: MOTION.marqueeSecs,
    ease: "none",
    repeat: -1,
    modifiers: { x: gsap.utils.unitize((x) => parseFloat(x) % rows[0].offsetWidth) },
  });
}
