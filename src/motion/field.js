import { t, meta } from "../core/i18n.js";
import { reducedMotion } from "../core/env.js";

/**
 * The hero runs an actual simulation, and the sheet is drawn around it.
 *
 * Alan's work is keeping real-time environments stable for hundreds of
 * concurrent sessions, and cutting what they cost to run. A hero that
 * *states* that is a sentence; this one demonstrates it. Each dot is a
 * session, and three instruments report what stepping them costs:
 *
 *   the ring     one lap is one 16.7ms frame; the ruby arc is the tick
 *   the record   one dot per frame, so load shows up as a step
 *   the readout  the same numbers, as numbers
 *
 * Every figure is measured, not decorative:
 *   SESSIONS   agents actually being stepped
 *   TICK       performance.now() around step + draw, averaged over the
 *              last half-second so the digits can be read
 *   DEVIATION  the standard deviation of the last two seconds of ticks
 *   BUDGET     that tick as a share of a 60Hz frame
 *
 * Performance discipline is the whole point, so this file has to hold
 * to it: the neighbour search runs on a spatial grid rather than the
 * naive O(n²) sweep, the readout, the ring and the leader lines are
 * written 5×/s rather than every frame, the loop stops entirely when
 * the hero leaves the viewport or the tab is hidden, and device pixel
 * ratio is capped at 2.
 *
 * It is the same instrument on every device. Links used to be skipped
 * on touch, which left a phone showing a callout about a neighbour
 * search that was not running, beside a tick that cost nothing.
 *
 * The run is seeded. The same seed draws the same field, so what a
 * visitor sees is reproducible rather than a lucky frame.
 */

const BUDGET_MS = 1000 / 60;   // one frame at 60Hz
/* Load comes in steps of two fifths of the resting count, up to four
   times it. Both follow the resting count rather than fixed numbers so
   the demo is the same demo on a phone-sized dial, where 150 sessions in
   one press would more than double the field. */
const LOAD_STEP = 0.4;
const LOAD_CEIL = 4;
const MAX_AGENTS = 1600;       // hard ceiling: the demo must never truly jank
const SEED = 40426;

/* One session per ~450px² of the disc. Fixing the count instead let a
   large dial look sparse and a phone-sized one look packed. */
const AREA_PER_AGENT = 450;
const MIN_AGENTS = 90;
const MAX_BASE = 380;

/**
 * Link radius as a multiple of the mean spacing at rest, so each session
 * has a handful of neighbours whatever the dial measures.
 *
 * Note it is pinned to the RESTING count, not the live one. Recomputing
 * as load is added would hold the pair count flat, and the whole point
 * of adding load is that the cost rises.
 */
const LINK_SPACING_FACTOR = 1.3;
const LINK_MIN = 16;
const LINK_MAX = 90;

/* The record's scale is fixed, so a step up is a step up at any load.
   `hero.strip.scale` in the locale files states the ratio between this
   and the frame budget in words; change one, change the other.

   It is a square-root scale, and the unevenly spaced rules say so. At
   rest a tick is a fifth of a millisecond: on a linear 0–2 the whole
   record would sit in the bottom tenth, which is true and unreadable.
   The root gives the low end the room it lives in and still shows the
   ceiling. */
const TRACE_MAX_MS = 2;
const TRACE_RULES = [0, 0.25, 0.5, 1, 2];
const TRACE_STEP = 2;          // css px the record travels per frame
/* A browser reports time in 0.1ms steps unless the page is isolated, and
   a 0.2ms tick read through a 0.1ms clock lands on three values. Each
   dot is the mean of the last few frames, so the record is a line
   rather than three stripes. It is still one dot per frame. */
const TRACE_SMOOTH = 8;
const MEAN_FRAMES = 30;
const DEV_FRAMES = 120;
const WARM_FRAMES = 30;

/* Where callouts 1 and 2 look for something to point at, in radii from
   the centre of the field, and how far a session may wander from that
   spot before the leader lets go of it and takes the nearest one. */
const PIN_AT = [[-0.62, -0.2], [-0.48, 0.3]];
const PIN_REACH = 0.3;
/* Callout 3's leader follows the live end of the arc for the first
   eighth of a lap. Past that the end has gone round the dial, away from
   the callout, and a line chasing it would cut across the figure; it
   stays on the arc's body instead. */
const ARC_REACH_MS = BUDGET_MS / 8;

const TAU = Math.PI * 2;
const NS = "http://www.w3.org/2000/svg";

/** mulberry32: small, fast, and good enough to place dots. */
function prng(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function svgEl(parent, name, attrs) {
  const el = document.createElementNS(NS, name);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  parent.appendChild(el);
  return el;
}

export function initField() {
  const canvas = document.getElementById("field");
  const panel = document.getElementById("hero-instr");
  const dial = document.getElementById("dial");
  const ring = document.getElementById("ring");
  const trace = document.getElementById("trace");
  const leaders = document.getElementById("leaders");
  const sheet = document.getElementById("sheet");
  if (!canvas || !panel || !dial || !ring || !trace) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  const tctx = trace.getContext("2d", { alpha: true });
  if (!ctx || !tctx) return;

  let rand = prng(SEED);
  let agents = [];
  let baseCount = MIN_AGENTS;
  let loadStep = LOAD_STEP * MIN_AGENTS;
  let ceiling = MAX_AGENTS;
  let linkDist = 32;
  // Whether the visitor has added load. Their population is theirs to
  // keep; an untouched one is just a default and may be re-derived.
  let userLoaded = false;
  let R = 0;          // the field's radius, in css px
  let dpr = 1;
  let raf = 0;
  let running = false;

  // measurements. `hist` is what the record draws: one entry per frame.
  let hist = [];
  let histMax = 400;
  let frameNo = 0;
  let lastPaint = 0;
  let shown = { tick: 0, dev: 0 };

  // the record's own box
  let tw = 0;
  let th = 0;

  /* ── palette, read from the theme rather than hardcoded ── */
  const ink = {};
  const readPalette = () => {
    const s = getComputedStyle(document.documentElement);
    for (const k of ["fg", "fg-muted", "fg-subtle", "line", "line-strong", "signal", "measure", "bg-sunken"]) {
      ink[k] = s.getPropertyValue("--" + k).trim() || "#888";
    }
  };

  /* ── number formats follow the page language ───────────── */
  let nf0, nf1, nf2, nfr;
  const readFormats = () => {
    const loc = meta().locale;
    nf0 = new Intl.NumberFormat(loc);
    nf1 = new Intl.NumberFormat(loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    nf2 = new Intl.NumberFormat(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    nfr = new Intl.NumberFormat(loc, { maximumFractionDigits: 2 });
  };

  /* ── sizing ─────────────────────────────────────────────── */
  function resize() {
    const r = canvas.getBoundingClientRect();
    // Cap DPR at 2: beyond that the pixel count doubles again for a
    // difference nobody sees on a field of small dots.
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = Math.max(2, Math.round(r.width));
    R = size / 2;
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const area = Math.PI * R * R;
    baseCount = Math.min(MAX_BASE, Math.max(MIN_AGENTS, Math.round(area / AREA_PER_AGENT)));
    loadStep = Math.round(baseCount * LOAD_STEP);
    ceiling = Math.min(MAX_AGENTS, baseCount * LOAD_CEIL);
    const spacing = Math.sqrt(area / baseCount);
    linkDist = Math.min(LINK_MAX, Math.max(LINK_MIN, spacing * LINK_SPACING_FACTOR));

    const tr = trace.getBoundingClientRect();
    tw = Math.max(2, Math.round(tr.width));
    th = Math.max(2, Math.round(tr.height));
    trace.width = Math.round(tw * dpr);
    trace.height = Math.round(th * dpr);
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    histMax = Math.ceil(tw / TRACE_STEP) + 2;

    buildRing();
  }

  /**
   * Sessions are spread evenly over the disc, or, when the visitor
   * presses the field, dropped around the point they pressed.
   */
  function spawn(n, near) {
    for (let i = 0; i < n && agents.length < ceiling; i++) {
      const a = rand() * TAU;
      let x, y;
      if (near) {
        const d = Math.sqrt(rand()) * R * 0.3;
        x = near.x + Math.cos(a) * d;
        y = near.y + Math.sin(a) * d;
        const dx = x - R, dy = y - R, m = Math.hypot(dx, dy), lim = R - 2;
        if (m > lim) { x = R + (dx / m) * lim; y = R + (dy / m) * lim; }
      } else {
        const d = Math.sqrt(rand()) * (R - 2);
        x = R + Math.cos(a) * d;
        y = R + Math.sin(a) * d;
      }
      agents.push({ x, y, vx: (rand() - 0.5) * 0.32, vy: (rand() - 0.5) * 0.32 });
    }
  }

  /* ── the tick being measured ────────────────────────────── */
  function step() {
    const lim = R - 1.5, lim2 = lim * lim;
    for (const a of agents) {
      a.x += a.vx;
      a.y += a.vy;
      // Reflect off the rim. A specular bounce keeps a uniform field
      // uniform, so sessions do not pile up along the edge the way they
      // would against the walls of a box.
      const dx = a.x - R, dy = a.y - R, d2 = dx * dx + dy * dy;
      if (d2 > lim2) {
        const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
        const dot = a.vx * nx + a.vy * ny;
        if (dot > 0) { a.vx -= 2 * dot * nx; a.vy -= 2 * dot * ny; }
        a.x = R + nx * lim;
        a.y = R + ny * lim;
      }
    }
  }

  /**
   * Neighbour links via a uniform grid. At 1600 agents the naive
   * all-pairs sweep is 1.28M comparisons a frame; bucketing by the link
   * radius and testing only the surrounding cells keeps it proportional
   * to the agent count instead of its square.
   */
  function drawLinks() {
    const cell = linkDist;
    const side = R * 2;
    const cols = Math.max(1, Math.ceil(side / cell));
    const grid = new Array(cols * cols);

    for (const a of agents) {
      const cx = Math.min(cols - 1, Math.max(0, (a.x / cell) | 0));
      const cy = Math.min(cols - 1, Math.max(0, (a.y / cell) | 0));
      (grid[cy * cols + cx] ??= []).push(a);
    }

    ctx.lineWidth = 1;
    ctx.beginPath();
    const maxSq = linkDist * linkDist;

    for (let cy = 0; cy < cols; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const bucket = grid[cy * cols + cx];
        if (!bucket) continue;
        // Only forward neighbours, so each pair is visited once.
        for (let oy = 0; oy <= 1; oy++) {
          for (let ox = oy === 0 ? 0 : -1; ox <= 1; ox++) {
            const nx = cx + ox, ny = cy + oy;
            if (nx < 0 || nx >= cols || ny >= cols) continue;
            const other = grid[ny * cols + nx];
            if (!other) continue;
            const same = ox === 0 && oy === 0;
            for (let i = 0; i < bucket.length; i++) {
              for (let j = same ? i + 1 : 0; j < other.length; j++) {
                const a = bucket[i], b = other[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                if (dx * dx + dy * dy > maxSq) continue;
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
    // overloaded field legible as congestion rather than a solid disc,
    // which is the honest picture: same space, more contention.
    ctx.strokeStyle = ink["fg-subtle"];
    ctx.globalAlpha = Math.max(0.14, Math.min(0.8, (0.8 * baseCount) / agents.length));
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.clearRect(0, 0, R * 2, R * 2);
    drawLinks();
    ctx.fillStyle = ink.fg;
    ctx.beginPath();
    for (const a of agents) {
      ctx.moveTo(a.x + 1.6, a.y);
      ctx.arc(a.x, a.y, 1.6, 0, TAU);
    }
    ctx.fill();
  }

  /**
   * Measures step AND draw, the whole cost of advancing one frame.
   * Timing step() alone would be honest but useless: moving 1600 points
   * is ~0.05ms. The neighbour search is where the cost lives, and that
   * is what a visitor adding load needs to see respond. The step is
   * recorded on its own as well, so the record can show how little of
   * the tick it is.
   */
  function measure(mark) {
    const t0 = performance.now();
    step();
    const t1 = performance.now();
    draw();
    const t2 = performance.now();
    const h = { tick: t2 - t0, step: t1 - t0, n: frameNo++, mark };
    hist.push(h);
    if (hist.length > histMax) hist.splice(0, hist.length - histMax);
    const tail = hist.slice(-TRACE_SMOOTH);
    h.pt = tail.reduce((s, x) => s + x.tick, 0) / tail.length;
    h.ps = tail.reduce((s, x) => s + x.step, 0) / tail.length;
  }

  function frame(now) {
    raf = 0;
    if (!running) return;

    measure();
    drawTrace();

    if (now - lastPaint >= 200) {
      paintPanel();
      lastPaint = now;
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reducedMotion) return;
    running = true;
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  /* ── the ring ───────────────────────────────────────────── */
  let arc = null;
  let hand = null;
  let geo = null;   // shared with the leaders, which point at the ring

  const angle = (ms) => (ms / BUDGET_MS) * TAU - Math.PI / 2;

  function buildRing() {
    const S = Math.round(dial.getBoundingClientRect().width);
    const band = (S - R * 2) / 2;
    // Everything in the ring scales with the band the stylesheet gives
    // it, so the phone-sized dial is the same drawing, not a cropped one.
    const k = Math.max(0.6, band / 46);
    const c = S / 2;
    const ri = R + 12 * k;
    geo = { S, c, ri, rt: R + 6 * k, k };

    ring.textContent = "";
    ring.setAttribute("viewBox", `0 0 ${S} ${S}`);

    const ticks = svgEl(ring, "g", { class: "tk" });
    for (let ms = 0; ms < BUDGET_MS; ms += 0.5) {
      const major = Math.abs(ms - Math.round(ms)) < 1e-6;
      const a = angle(ms);
      const r1 = ri + (major ? 17 : 9) * k;
      svgEl(ticks, "line", {
        x1: c + Math.cos(a) * ri, y1: c + Math.sin(a) * ri,
        x2: c + Math.cos(a) * r1, y2: c + Math.sin(a) * r1,
        "stroke-width": major ? 1.8 : 1,
      });
    }
    svgEl(ticks, "circle", { cx: c, cy: c, r: ri, fill: "none", "stroke-width": 1 });

    const every = k < 0.85 ? 4 : 2;
    for (let ms = 0; ms <= 16; ms += every) {
      const a = angle(ms), rr = ri + 17 * k + 14;
      const el = svgEl(ring, "text", { x: c + Math.cos(a) * rr, y: c + Math.sin(a) * rr + 6, "text-anchor": "middle" });
      el.textContent = ms;
    }

    arc = svgEl(ring, "path", { class: "arc", "stroke-width": 8 * k });
    hand = svgEl(ring, "circle", { class: "hand", r: 3.4 });
    paintRing();
  }

  /** The tick, as an arc of the lap it is a share of. */
  function paintRing() {
    if (!arc || !geo) return;
    const { c, rt } = geo;
    const ms = Math.min(shown.tick, BUDGET_MS * 0.999);
    const a0 = angle(0), a1 = angle(ms);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    arc.setAttribute("d", `M${c + Math.cos(a0) * rt} ${c + Math.sin(a0) * rt}A${rt} ${rt} 0 ${large} 1 ${c + Math.cos(a1) * rt} ${c + Math.sin(a1) * rt}`);
    hand.setAttribute("cx", c + Math.cos(a1) * rt);
    hand.setAttribute("cy", c + Math.sin(a1) * rt);
    // State by form: a tick that has eaten the whole frame is a closed
    // lap, and the arc is clamped just short of one so it still draws.
  }

  /* ── the record ─────────────────────────────────────────── */
  function drawTrace() {
    const top = 20, bot = th - 8, left = 46;
    const y = (ms) => bot - Math.sqrt(Math.min(ms, TRACE_MAX_MS) / TRACE_MAX_MS) * (bot - top);

    tctx.clearRect(0, 0, tw, th);
    tctx.lineWidth = 1;
    tctx.textBaseline = "alphabetic";

    // The two traces are named in a gutter to the right of the plot, at
    // the height each one ends. Inside the plot the names sat on the
    // very dots they were naming.
    const names = [t("hero.strip.total").toUpperCase(), t("hero.strip.step").toUpperCase()];
    tctx.font = `700 13px "Sofia Sans Condensed", sans-serif`;
    const gutter = Math.ceil(Math.max(...names.map((s) => tctx.measureText(s).width))) + 20;
    const right = tw - gutter;
    const x = (i) => right - (hist.length - 1 - i) * TRACE_STEP;

    tctx.font = `600 13px "Sofia Sans Condensed", sans-serif`;

    // the scale
    for (const ms of TRACE_RULES) {
      tctx.strokeStyle = ms === 0 ? ink["line-strong"] : ink.line;
      tctx.beginPath();
      tctx.moveTo(left, Math.round(y(ms)) + 0.5);
      tctx.lineTo(right, Math.round(y(ms)) + 0.5);
      tctx.stroke();
      tctx.fillStyle = ink["fg-subtle"];
      tctx.textAlign = "left";
      tctx.fillText(nfr.format(ms), 0, y(ms) + 4);
    }

    // a rule every sixty frames, travelling with the dots
    tctx.strokeStyle = ink.line;
    tctx.beginPath();
    for (let i = 0; i < hist.length; i++) {
      if (hist[i].n % 60 !== 0) continue;
      const xx = Math.round(x(i)) + 0.5;
      if (xx < left) continue;
      tctx.moveTo(xx, top);
      tctx.lineTo(xx, bot);
    }
    tctx.stroke();

    // the step alone, then the whole tick
    tctx.fillStyle = ink.signal;
    for (let i = 0; i < hist.length; i++) {
      const xx = x(i);
      if (xx >= left) tctx.fillRect(xx - 1, y(hist[i].ps) - 1, 2, 2);
    }
    tctx.fillStyle = ink.fg;
    for (let i = 0; i < hist.length; i++) {
      const xx = x(i);
      if (xx >= left) tctx.fillRect(xx - 1.2, y(hist[i].pt) - 1.2, 2.4, 2.4);
    }

    // where load came in
    tctx.textAlign = "left";
    tctx.font = `700 13px "Sofia Sans Condensed", sans-serif`;
    for (let i = 0; i < hist.length; i++) {
      const m = hist[i].mark;
      if (!m) continue;
      const xx = Math.round(x(i)) + 0.5;
      if (xx < left) continue;
      tctx.strokeStyle = ink.signal;
      tctx.setLineDash([3, 4]);
      tctx.beginPath();
      tctx.moveTo(xx, top - 8);
      tctx.lineTo(xx, bot);
      tctx.stroke();
      tctx.setLineDash([]);
      tctx.fillStyle = ink.signal;
      const label = `+ ${t("hero.strip.mark")} · ${nf0.format(m)}`.toUpperCase();
      if (xx + 8 + tctx.measureText(label).width < right) tctx.fillText(label, xx + 8, top - 6);
    }

    // the head: where the record is being written
    const last = hist[hist.length - 1];
    if (last) {
      const hx = x(hist.length - 1), hy = y(last.pt);
      tctx.strokeStyle = ink.measure;
      tctx.lineWidth = 1.6;
      tctx.beginPath();
      tctx.arc(hx, hy, 5, 0, TAU);
      tctx.stroke();
      tctx.fillStyle = ink.measure;
      tctx.beginPath();
      tctx.arc(hx, hy, 2, 0, TAU);
      tctx.fill();

      // Each name level with its own trace; if the two are closer than
      // a line of type, the lower one gives way.
      const ty = Math.min(hy + 4, bot - 16);
      const sy = Math.min(bot + 3, Math.max(y(last.ps) + 4, ty + 15));
      tctx.font = `700 13px "Sofia Sans Condensed", sans-serif`;
      tctx.textAlign = "left";
      tctx.fillStyle = ink.fg;
      tctx.fillText(names[0], hx + 12, ty);
      tctx.fillStyle = ink.signal;
      tctx.fillText(names[1], hx + 12, sy);
    }
  }

  /* ── the readout ────────────────────────────────────────── */
  let els = null;

  function buildPanel() {
    panel.innerHTML = `
      <div class="instr">
        <dl>
          <div><dt data-i18n="hero.hud.sessions"></dt><dd data-role="sessions">0</dd></div>
          <div><dt data-i18n="hero.hud.tick"></dt><dd><span data-role="tick">0</span><small>ms</small></dd></div>
          <div><dt data-i18n="hero.hud.jitter"></dt><dd><span data-role="dev">0</span><small>ms</small></dd></div>
          <div><dt data-i18n="hero.hud.budget"></dt><dd><span data-role="budget">0</span><small>%</small></dd></div>
        </dl>
        <div class="instr__btns">
          <button class="go" type="button" data-role="load" data-i18n="hero.hud.load"></button>
          <button type="button" data-role="reset" data-i18n="hero.hud.reset"></button>
        </div>
      </div>`;

    els = Object.fromEntries(
      ["sessions", "tick", "dev", "budget", "load", "reset"].map((k) => [k, panel.querySelector(`[data-role="${k}"]`)])
    );

    els.load.addEventListener("click", () => addLoad());
    els.reset.addEventListener("click", () => {
      reseed();
      userLoaded = false;
      answer();
    });
  }

  /** Back to the resting field the seed draws. */
  function reseed() {
    rand = prng(SEED);
    agents = [];
    pinA = pinL = null;
    spawn(baseCount);
  }

  /**
   * Run one measured frame now rather than waiting for the loop. Under
   * reduced motion there is no loop at all, and even with one it would
   * be up to 200ms before the readout caught up: the press has to
   * answer immediately or the control feels dead.
   */
  function answer(mark) {
    measure(mark);
    drawTrace();
    paintPanel();
  }

  function addLoad(near) {
    if (agents.length >= ceiling) return;
    spawn(loadStep, near);
    userLoaded = true;
    answer(agents.length);
  }

  function paintPanel() {
    if (!els) return;

    // Reduced motion has only its warm-up run to go on, and the front of
    // that run is the cold part; it reads the back third.
    const tail = hist.slice(reducedMotion ? -10 : -DEV_FRAMES);
    const recent = hist.slice(reducedMotion ? -10 : -MEAN_FRAMES);
    const mean = recent.length ? recent.reduce((s, h) => s + h.tick, 0) / recent.length : 0;
    const m2 = tail.length ? tail.reduce((s, h) => s + h.tick, 0) / tail.length : 0;
    const dev = tail.length > 1 ? Math.sqrt(tail.reduce((s, h) => s + (h.tick - m2) ** 2, 0) / (tail.length - 1)) : 0;
    shown = { tick: mean, dev };

    els.sessions.textContent = nf0.format(agents.length);
    els.tick.textContent = nf2.format(mean);
    els.dev.textContent = "± " + nf2.format(dev);
    els.budget.textContent = nf1.format((mean / BUDGET_MS) * 100);
    els.load.disabled = agents.length >= ceiling;

    // The short readout under the dial on a phone: the same three
    // figures, from the same variables.
    if (mini.sessions) mini.sessions.textContent = els.sessions.textContent;
    if (mini.tick) mini.tick.textContent = els.tick.textContent;
    if (mini.budget) mini.budget.textContent = els.budget.textContent;

    paintRing();
    paintLeaders();
  }

  /* ── what the leaders point at ──────────────────────────
     Callouts 1 and 2 name a session and a neighbourhood, so their
     leaders end on a real one of each: an agent, and two agents that
     are linked right now. Each is let go when it wanders out of reach
     of its callout or its link breaks, and the nearest one is taken. */
  let pinA = null;   // the session
  let pinL = null;   // the link, as its two ends

  function pick() {
    const from = (k) => {
      const px = R + k[0] * R, py = R + k[1] * R;
      return (a) => (a.x - px) ** 2 + (a.y - py) ** 2;
    };
    const reach = (PIN_REACH * R) ** 2;

    const dA = from(PIN_AT[0]);
    if (!pinA || dA(pinA) > reach) {
      pinA = null;
      let best = Infinity;
      for (const a of agents) {
        const d = dA(a);
        if (d < best) { best = d; pinA = a; }
      }
    }

    const dL = from(PIN_AT[1]);
    const max = linkDist * linkDist;
    const gap = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
    if (!pinL || gap(pinL[0], pinL[1]) > max || dL(pinL[0]) > reach) {
      pinL = null;
      let best = Infinity;
      for (const a of agents) {
        const d = dL(a);
        if (d >= best) continue;
        // its nearest neighbour, if one is in range
        let nb = null, nd = max;
        for (const b of agents) {
          if (b === a) continue;
          const q = gap(a, b);
          if (q <= nd) { nd = q; nb = b; }
        }
        if (nb) { best = d; pinL = [a, nb]; }
      }
    }
  }

  /* ── leaders ────────────────────────────────────────────
     The callouts are HTML, laid out by the stylesheet; the lines that
     tie each bubble to the thing it names are drawn afterwards, from
     where the bubbles and the dial actually ended up.

     layoutLeaders() measures the bubbles and builds one line each;
     paintLeaders() moves the far ends, at the readout's cadence, to
     where the things they name are now. */
  let lead = null;

  function layoutLeaders() {
    lead = null;
    if (!leaders || !sheet || !geo) return;
    leaders.textContent = "";
    if (getComputedStyle(leaders).display === "none") return;

    const sr = sheet.getBoundingClientRect();
    const dr = dial.getBoundingClientRect();
    leaders.setAttribute("viewBox", `0 0 ${sr.width} ${sr.height}`);

    const bubbles = [...sheet.querySelectorAll(".callouts .n")];
    const half = Math.ceil(bubbles.length / 2);

    lead = {
      cx: dr.left - sr.left + dr.width / 2,
      cy: dr.top - sr.top + dr.height / 2,
      rows: bubbles.map((b, i) => {
        const br = b.getBoundingClientRect();
        const left = i < half;
        // Left of the dial: a session, then a link. Right of it: the
        // arc, then the ring.
        const kind = left ? (i === 0 ? "session" : "link") : i === half ? "arc" : "ring";
        return {
          kind,
          bx: (left ? br.right : br.left) - sr.left,
          by: br.top - sr.top + br.height / 2,
          path: svgEl(leaders, "path", {}),
          // The arc needs no terminal of its own: the hollow dot at its
          // live end, drawn with the ring, is the terminal.
          end: kind === "arc" ? null : svgEl(leaders, "circle", { class: kind === "ring" ? "on" : "at", r: kind === "session" ? 5.5 : kind === "link" ? 4 : 3.2 }),
        };
      }),
    };
    paintLeaders();
  }

  function paintLeaders() {
    if (!lead || !geo) return;
    pick();

    const { cx, cy } = lead;
    const { ri, rt } = geo;
    const fx = cx - R, fy = cy - R;   // the field's corner, in the sheet's box
    const n = (v) => Math.round(v * 10) / 10;

    for (const r of lead.rows) {
      let tx, ty, elbow, clear = 0;

      if (r.kind === "session" || r.kind === "link") {
        const p = r.kind === "session"
          ? pinA && [pinA.x, pinA.y]
          : pinL && [(pinL[0].x + pinL[1].x) / 2, (pinL[0].y + pinL[1].y) / 2];
        r.path.style.display = r.end.style.display = p ? "" : "none";
        if (!p) continue;
        tx = fx + p[0];
        ty = fy + p[1];
        clear = r.kind === "session" ? 5.5 : 4;
        elbow = [Math.min(r.bx + 46, cx - ri - 26), r.by];
      } else if (r.kind === "arc") {
        const a = angle(Math.min(shown.tick, ARC_REACH_MS));
        tx = cx + Math.cos(a) * rt;
        ty = cy + Math.sin(a) * rt;
        clear = shown.tick <= ARC_REACH_MS ? 4.4 : 0;
        elbow = [Math.min(tx + Math.abs(ty - r.by), r.bx - 14), r.by];
      } else {
        // Onto the ring, dead level with the bubble when it can be.
        const dy = r.by - cy;
        if (Math.abs(dy) < ri * 0.94) {
          tx = cx + Math.sqrt(ri * ri - dy * dy);
          ty = r.by;
        } else {
          const a = angle(3);
          tx = cx + Math.cos(a) * ri;
          ty = cy + Math.sin(a) * ri;
        }
        elbow = [Math.min(tx + Math.abs(ty - r.by), r.bx - 14), r.by];
      }

      // Stop short of a hollow terminal, so it stays hollow.
      const dx = elbow[0] - tx, dy = elbow[1] - ty, m = Math.hypot(dx, dy) || 1;
      r.path.setAttribute("d", `M${n(tx + (dx / m) * clear)} ${n(ty + (dy / m) * clear)}L${n(elbow[0])} ${n(elbow[1])}L${n(r.bx)} ${n(r.by)}`);
      if (r.end) {
        r.end.setAttribute("cx", n(tx));
        r.end.setAttribute("cy", n(ty));
      }
    }
  }

  /* ── wiring ─────────────────────────────────────────────── */
  const mini = Object.fromEntries(
    [...document.querySelectorAll("#hero-mini [data-mini]")].map((el) => [el.dataset.mini, el])
  );

  readPalette();
  readFormats();
  buildPanel();
  resize();
  spawn(baseCount);
  // With no loop to settle it, a single measured frame would be the
  // first one the engine ever ran: cold, and several times the cost of
  // every frame after it. Under reduced motion a short run is measured
  // before anything is shown, so the one frame that is drawn is drawn
  // warm and the figure beside it is a fair one.
  if (reducedMotion) for (let i = 0; i < WARM_FRAMES; i++) measure();
  answer();
  layoutLeaders();

  // Pressing the field adds load where it is pressed. The button does
  // the same for anyone not using a pointer. It listens for a click and
  // not for pointerdown: on a phone the dial is as wide as the screen,
  // and every scroll that began on it used to add load on the way past.
  canvas.addEventListener("click", (e) => {
    const r = canvas.getBoundingClientRect();
    addLoad({ x: e.clientX - r.left, y: e.clientY - r.top });
  });

  if (reducedMotion) {
    // One frame, no loop. The readout still reports the real cost.
    panel.dataset.static = "true";
  } else {
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 }).observe(dial);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else if (dial.getBoundingClientRect().bottom > 0) start();
    });
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const before = R;
      resize();

      if (userLoaded && before > 0) {
        // Their load stays; it is scaled with the dial so nobody ends up
        // outside the new rim.
        const s = R / before;
        for (const a of agents) { a.x *= s; a.y *= s; }
      } else {
        // Re-seed to the density the new size calls for.
        reseed();
      }

      draw();
      drawTrace();
      paintPanel();
      layoutLeaders();
    }, 150);
  });

  // Colours are theme tokens; re-read them when the theme flips, or the
  // canvases keep the old palette until something else redraws them.
  new MutationObserver(() => {
    readPalette();
    draw();
    drawTrace();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  return {
    /** A language switch changes the labels the record writes and the number formats. */
    repaint() {
      readFormats();
      drawTrace();
      paintPanel();
    },
    /** Callouts are re-rendered and re-flowed on a language switch and when the fonts land. */
    layout() {
      resize();
      draw();
      drawTrace();
      layoutLeaders();
    },
  };
}
