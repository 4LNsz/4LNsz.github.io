/**
 * "Open in the desktop app, fall back to the web."
 *
 * A channel in config.js may carry an `app` URL beside its `url` — a
 * custom scheme like discord://-/users/<id> that the desktop client
 * registers with the OS. renderContact() puts it on the anchor as
 * data-app. The href stays the https one.
 *
 * THAT ORDER IS THE WHOLE DESIGN, and it must not be swapped. The href
 * is what works with JavaScript off, what the status bar shows on
 * hover, what a middle-click or "copy link address" yields, and what a
 * visitor who does not have the app installed gets. A custom scheme has
 * none of those properties: with no handler registered, Chrome drops
 * the navigation silently and Firefox raises "doesn't know how to open
 * this address". Putting it in the href would turn the primary contact
 * channel — the one the section is built to push people towards — into
 * a dead click for anyone without the app.
 *
 * So the scheme is an enhancement layered on top. No browser will tell
 * a page whether a protocol is registered; every technique for finding
 * out is a heuristic, and the ones that guess wrong either open a tab
 * nobody asked for or do nothing at all. This one is built to fail
 * towards ARRIVING SOMEWHERE: in the worst case the visitor lands on
 * the same web page the plain link would have given them, plus, on
 * Firefox, a dialog to dismiss. The one outcome it will not produce is
 * a click that goes nowhere.
 */

/** How long to wait for the OS to take the handoff before giving up. */
const FALLBACK_MS = 900;

/**
 * A wall-clock gap this much larger than FALLBACK_MS means our timer
 * was frozen, not that the handoff failed — see the note at its use.
 */
const STALL_MS = 2500;

export function mountAppLinks() {
  document.addEventListener("click", (e) => {
    // Modified clicks belong to the browser: ctrl/cmd opens a tab,
    // shift a window. Hijacking those breaks a habit the visitor
    // already has, and the href is the correct target for all of them.
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const a = e.target.closest("a[data-app]");
    if (!a?.dataset.app || !a.href) return;

    e.preventDefault();
    handoff(a.dataset.app, a.href);
  });
}

function handoff(app, web) {
  const started = Date.now();
  let handedOff = false;

  // The tab losing visibility is the one honest signal that the OS
  // switched to the app. It is not guaranteed to fire — hence the
  // timeout below rather than a promise on this alone.
  const onHide = () => {
    if (document.hidden) handedOff = true;
  };
  document.addEventListener("visibilitychange", onHide);

  // Assigning location, not window.open: a custom scheme opened in a
  // new tab leaves an empty tab behind once the OS takes over.
  window.location.href = app;

  setTimeout(() => {
    document.removeEventListener("visibilitychange", onHide);

    // The app has focus. Nothing left to do.
    if (handedOff || document.hidden) return;

    // Chrome and Safari can stop timers while their own "Open Discord?"
    // permission prompt is up. A gap far longer than the delay we asked
    // for means the visitor was reading that prompt — sending them to
    // the web page on top of it would navigate away from a decision
    // they were in the middle of making.
    if (Date.now() - started > STALL_MS) return;

    // Same tab, even though the link itself is target="_blank". A
    // window.open() here fires roughly a second after the click, so the
    // gesture that would have authorised it has expired and the popup
    // blocker eats it. A same-tab navigation always lands, and Back
    // returns to the portfolio.
    window.location.href = web;
  }, FALLBACK_MS);
}
