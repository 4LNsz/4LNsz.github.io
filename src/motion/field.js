import { t } from "../core/i18n.js";
import { reducedMotion } from "../core/env.js";

/**
 * The hero runs an actual simulation.
 *
 * Alan's work is keeping real-time environments stable for hundreds of
 * concurrent sessions, and cutting what they cost to run. A hero that
 * *states* that is a sentence; this one demonstrates it. Each dot is a
 * session, the panel reports the real cost of stepping them, and the
 * load control lets a visitor push the system and watch the tick time
 * answer. It is the portfolio's claim, executable.
 *
 * Every number on the panel is measured, not decorative:
 *   SESSIONS  agents actually being stepped
 *   TICK      performance.now() around the update, not the paint
 *   the bar   that tick against the 16.7ms budget of a 60Hz frame
 *
 * Performance discipline is the whole point, so this file has to hold
 * to it: a neighbour search is done on a spatial grid rather than the
 * naive O(n²) sweep, the panel is written 5×/s rather than every frame,
 * the loop stops entirely when the hero leaves the viewport or the tab
 * is hidden, and device pixel ratio is capped at 2.
 */

const BUDGET_MS = 1000 / 60;   // one frame at 60Hz
const LOAD_STEP = 150;
const MAX_AGENTS = 1600;       // hard ceiling: the demo must never truly jank

/* One session per ~450px². Fixing the count instead let a wide desktop
   rig look sparse and a narrow one look packed. */
const AREA_PER_AGENT = 450;
const MIN_AGENTS = 90;
const MAX_BASE = 380;

/**
 * Link radius as a multiple of the mean spacing at rest, so each session
 * has a handful of neighbours whatever the rig measures.
 *
 * A fixed 78px looked right while the canvas was full-bleed and became a
 * hairball once it moved into a 380×300 box: at that density every
 * session was inside 78px of nearly every other, and the mesh filled
 * ~90% of the pixels. Deriving it from spacing keeps the resting picture
 * identical at any size.
 *
 * Note it is pinned to the RESTING count, not the live one. Recomputing
 * as load is added would hold the pair count flat, and the whole point
 * of "+ Load" is that the cost rises.
 */
const LINK_SPACING_FACTOR = 1.3;
const LINK_MIN = 16;
const LINK_MAX = 90;

export function initField() {
  const canvas = document.getElementById("field");
  const panel = document.getElementById("hero-instr");
  if (!canvas || !panel) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const coarse = window.matchMedia("(pointer: coarse)").matches;

  let agents = [];
  let baseCount = MIN_AGENTS;
  let linkDist = 32;
  // Whether the visitor has pressed "+ Load". Their population is theirs
  // to keep; an untouched one is just a default and may be re-derived.
  let userLoaded = false;
  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;
  let running = false;

  // rolling measurements
  let tickMs = 0;
  let fps = 0;
  let frames = 0;
  let fpsSince = 0;
  let lastPanel = 0;

  /* ── palette, read from the theme rather than hardcoded ── */
  let dot = "#888";
  let link = "#888";
  const readPalette = () => {
    const s = getComputedStyle(document.documentElement);
    dot = s.getPropertyValue("--fg-faint").trim() || dot;
    link = s.getPropertyValue("--line-strong").trim() || link;
  };

  /* ── sizing ─────────────────────────────────────────────── */
  function resize() {
    const r = canvas.getBoundingClientRect();
    // Cap DPR at 2: beyond that the pixel count doubles again for a
    // difference nobody sees on a field of 1px dots.
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    baseCount = Math.min(MAX_BASE, Math.max(MIN_AGENTS, Math.round((w * h) / AREA_PER_AGENT)));
    const spacing = Math.sqrt((w * h) / baseCount);
    linkDist = Math.min(LINK_MAX, Math.max(LINK_MIN, spacing * LINK_SPACING_FACTOR));
  }

  function spawn(n) {
    for (let i = 0; i < n && agents.length < MAX_AGENTS; i++) {
      agents.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
      });
    }
  }

  /* ── the tick being measured ────────────────────────────── */
  function step() {
    for (const a of agents) {
      a.x += a.vx;
      a.y += a.vy;
      // Wrap rather than bounce: a bounded box would pile sessions up
      // along the edges and skew the neighbour counts.
      if (a.x < 0) a.x += w;
      else if (a.x > w) a.x -= w;
      if (a.y < 0) a.y += h;
      else if (a.y > h) a.y -= h;
    }
  }

  /**
   * Neighbour links via a uniform grid. At 1600 agents the naive
   * all-pairs sweep is 1.28M comparisons a frame; bucketing by
   * LINK_DIST and testing only the 9 surrounding cells keeps it
   * proportional to the agent count instead of its square.
   */
  function drawLinks() {
    const cell = linkDist;
    const cols = Math.max(1, Math.ceil(w / cell));
    const rows = Math.max(1, Math.ceil(h / cell));
    const grid = new Array(cols * rows);

    for (const a of agents) {
      const cx = Math.min(cols - 1, (a.x / cell) | 0);
      const cy = Math.min(rows - 1, (a.y / cell) | 0);
      const k = cy * cols + cx;
      (grid[k] ??= []).push(a);
    }

    ctx.lineWidth = 1;
    ctx.beginPath();
    const maxSq = linkDist * linkDist;

    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const bucket = grid[cy * cols + cx];
        if (!bucket) continue;
        // Only forward neighbours, so each pair is visited once.
        for (let oy = 0; oy <= 1; oy++) {
          for (let ox = oy === 0 ? 0 : -1; ox <= 1; ox++) {
            const nx = cx + ox;
            const ny = cy + oy;
            if (nx < 0 || nx >= cols || ny >= rows) continue;
            const other = grid[ny * cols + nx];
            if (!other) continue;
            const same = ox === 0 && oy === 0;
            for (let i = 0; i < bucket.length; i++) {
              for (let j = same ? i + 1 : 0; j < other.length; j++) {
                const a = bucket[i];
                const b = other[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d2 = dx * dx + dy * dy;
                if (d2 > maxSq) continue;
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
              }
            }
          }
        }
      }
    }

    // Link radius is pinned to the resting density, so adding sessions
    // multiplies the lines through the same area. Fading them keeps an
    // overloaded field legible as congestion rather than a solid block —
    // which is the honest picture: same space, more contention.
    ctx.strokeStyle = link;
    ctx.globalAlpha = Math.max(0.1, Math.min(0.5, (0.5 * baseCount) / agents.length));
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    if (!coarse) drawLinks();
    ctx.fillStyle = dot;
    for (const a of agents) ctx.fillRect(a.x - 1, a.y - 1, 2, 2);
  }

  function frame(now) {
    raf = 0;
    if (!running) return;

    // Measures step AND draw — the whole cost of advancing one frame.
    // Timing step() alone was honest but useless: moving 1600 points is
    // ~0.05ms, so the budget bar never moved and "+ Load" demonstrated
    // nothing. The neighbour search is where the cost actually lives,
    // and that is what a visitor adding load needs to see respond.
    const t0 = performance.now();
    step();
    draw();
    tickMs = performance.now() - t0;

    frames++;
    if (now - fpsSince >= 500) {
      fps = Math.round((frames * 1000) / (now - fpsSince));
      frames = 0;
      fpsSince = now;
    }
    if (now - lastPanel >= 200) {
      paintPanel();
      lastPanel = now;
    }

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reducedMotion) return;
    running = true;
    fpsSince = performance.now();
    frames = 0;
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  /* ── instrument panel ───────────────────────────────────── */
  let els = null;

  function buildPanel() {
    panel.innerHTML = `
      <div class="instr">
        <div class="instr__stat">
          <span class="instr__k mono-xs" data-i18n="hero.hud.sessions"></span>
          <span class="instr__v" data-role="sessions">0</span>
        </div>
        <div class="instr__stat">
          <span class="instr__k mono-xs" data-i18n="hero.hud.tick"></span>
          <span class="instr__v" data-role="tick">0.00</span>
          <!-- The budget printed next to the value, because the bar alone
               misleads: even at the 1600-session ceiling a frame costs
               about 1ms of the 16.7ms available, so the fill sits near
               empty. That is the true picture — plenty of headroom — but
               an almost-empty bar with no scale beside it reads as a
               broken widget rather than as a healthy system. -->
          <span class="instr__budget-label">/ ${BUDGET_MS.toFixed(1)}</span>
        </div>
        <div class="instr__budget" role="presentation">
          <i data-role="bar"></i>
        </div>
        <button class="instr__load" type="button" data-role="load">
          <span data-i18n="hero.hud.load"></span>
        </button>
      </div>`;

    els = {
      sessions: panel.querySelector('[data-role="sessions"]'),
      tick: panel.querySelector('[data-role="tick"]'),
      bar: panel.querySelector('[data-role="bar"]'),
      load: panel.querySelector('[data-role="load"]'),
    };

    els.load.addEventListener("click", () => {
      if (agents.length >= MAX_AGENTS) {
        agents = [];
        spawn(baseCount);
        userLoaded = false;
      } else {
        spawn(LOAD_STEP);
        userLoaded = true;
      }
      // Run one measured frame here rather than waiting for the loop.
      // Under reduced motion there is no loop at all, and even with one
      // it would be up to 200ms before the readout caught up — the press
      // has to answer immediately or the control feels dead.
      const t0 = performance.now();
      step();
      draw();
      tickMs = performance.now() - t0;
      paintPanel();
    });
  }

  function paintPanel() {
    if (!els) return;
    els.sessions.textContent = agents.length;
    els.tick.textContent = tickMs.toFixed(2);

    const used = Math.min(1, tickMs / BUDGET_MS);
    els.bar.style.transform = `scaleX(${used})`;
    panel.classList.toggle("is-over", tickMs > BUDGET_MS);

    els.load.textContent = "";
    const label = document.createElement("span");
    label.dataset.i18n = agents.length >= MAX_AGENTS ? "hero.hud.reset" : "hero.hud.load";
    label.textContent = t(label.dataset.i18n);
    els.load.appendChild(label);

    els.load.setAttribute("aria-label", `${t("hero.hud.sessions")}: ${agents.length}`);
  }

  /* ── wiring ─────────────────────────────────────────────── */
  readPalette();
  buildPanel();
  resize();
  spawn(baseCount);
  draw();
  paintPanel();

  if (reducedMotion) {
    // One frame, no loop. The panel still reports the real step cost.
    panel.dataset.static = "true";
  } else {
    new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0 }
    ).observe(canvas);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else if (canvas.getBoundingClientRect().bottom > 0) start();
    });
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();

      if (userLoaded) {
        // Their load stays; just pull strays back inside the new bounds.
        for (const a of agents) {
          if (a.x > w) a.x = Math.random() * w;
          if (a.y > h) a.y = Math.random() * h;
        }
      } else {
        // Re-seed to the density the new size calls for. Keeping the old
        // population left a page opened narrow and then widened — or
        // simply rotated — showing a field far too sparse for its box.
        agents = [];
        spawn(baseCount);
      }

      draw();
      paintPanel();
    }, 150);
  });

  // The dot and link colours are theme tokens; re-read them when the
  // theme flips, or the field keeps the old palette until it redraws.
  new MutationObserver(() => {
    readPalette();
    draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  return { repaintPanel: paintPanel };
}
