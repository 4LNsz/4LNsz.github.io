import { t, onLangChange } from "./i18n.js";

const MOBILE_Q = "(min-width: 901px)";

let drawerOpen = false;

/**
 * Mobile navigation.
 *
 * Below the breakpoint the desktop nav is display:none. It previously
 * had no replacement, which left phones — most of the traffic a
 * portfolio gets — with five sections and no way to reach any of them
 * except scrolling the whole page.
 *
 * The drawer's links are CLONED from the header nav rather than written
 * out a second time in index.html. They carry the same data-i18n keys,
 * so applyI18n() paints both copies on every language switch and the two
 * menus cannot drift apart.
 */
export function mountNav() {
  const toggle = document.getElementById("nav-toggle");
  const drawer = document.getElementById("nav-drawer");
  const source = document.querySelector("header .nav");
  if (!toggle || !drawer || !source) return;

  drawer.append(...[...source.children].map((a) => a.cloneNode(true)));

  const root = document.documentElement;
  let lastFocus = null;

  // The button is the same control in both states, so its name has to
  // track the action it performs.
  const label = () => toggle.setAttribute("aria-label", t(drawerOpen ? "ui.menuClose" : "ui.menu"));
  onLangChange(label);

  const setOpen = (next) => {
    if (next === drawerOpen) return;
    drawerOpen = next;

    drawer.classList.toggle("open", drawerOpen);
    // The lock is `html.nav-open { overflow: hidden }` in header.css and
    // nothing else. It used to need a lenis.stop() beside it, because
    // the library kept its own scroll loop running behind the overlay.
    root.classList.toggle("nav-open", drawerOpen);
    toggle.setAttribute("aria-expanded", String(drawerOpen));
    drawer.setAttribute("aria-hidden", String(!drawerOpen));
    label();

    if (drawerOpen) {
      lastFocus = document.activeElement;
      drawer.querySelector("a")?.focus();
    } else {
      lastFocus?.focus?.();
      lastFocus = null;
    }
  };

  toggle.addEventListener("click", () => setOpen(!drawerOpen));
  drawer.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawerOpen) setOpen(false);
  });

  // Crossing the breakpoint with the drawer open would leave the scroll
  // lock on a page whose drawer is now display:none — unscrollable.
  window.matchMedia(MOBILE_Q).addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });

  trackActiveSection();
}

/**
 * Header scrim + auto-hide.
 *
 * Two independent states driven off one scroll listener:
 *   is-stuck   past the top, so the bar reads as sitting ON the page
 *              rather than printed into it.
 *   is-hidden  moving down the page, so nothing overlaps what is being
 *              read. Any upward gesture brings it straight back.
 *
 * The DELTA gate matters: reacting to every pixel makes the bar flicker
 * on trackpads and on the rubber-band at the ends of the document.
 */
export function mountHeaderChrome() {
  const header = document.querySelector("header");
  if (!header) return;

  const STUCK_AT = 24;   // px scrolled before the scrim appears
  const HIDE_AFTER = 180; // never hide while the hero is still in view
  const DELTA = 6;        // ignore jitter smaller than this

  let last = window.scrollY;
  let queued = false;

  const update = () => {
    queued = false;
    const y = Math.max(0, window.scrollY);
    const moved = y - last;

    header.classList.toggle("is-stuck", y > STUCK_AT);

    // The drawer is a full-page overlay whose only close affordance is
    // the toggle inside this bar. Hiding it would strand the visitor.
    if (drawerOpen) {
      header.classList.remove("is-hidden");
    } else if (Math.abs(moved) > DELTA) {
      header.classList.toggle("is-hidden", moved > 0 && y > HIDE_AFTER);
    }

    last = y;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );

  update();
}

/**
 * Marks the section currently in view on both menus. Uses an
 * IntersectionObserver rather than a ScrollTrigger so it survives the
 * gsap.context().revert() that buildScroll() performs on every language
 * switch and breakpoint change.
 */
function trackActiveSection() {
  const links = [...document.querySelectorAll('header .nav a[href^="#"], #nav-drawer a[href^="#"]')];
  const ids = [...new Set(links.map((a) => a.getAttribute("href").slice(1)))];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  const visible = new Set();

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
      // Several sections can straddle the band at once; the first in
      // document order is the one the visitor has arrived at.
      const active = ids.find((id) => visible.has(id));
      links.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === `#${active}`)));
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  sections.forEach((s) => io.observe(s));
}
