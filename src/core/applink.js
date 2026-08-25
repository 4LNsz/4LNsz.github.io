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
 * the navigation silently and Firefox raises a modal saying it does not
 * know how to open the address. Putting it in the href would turn the
 * primary contact channel — the one the section is built to push people
 * towards — into a dead click for anyone without the app.
 *
 * So the scheme is an enhancement layered on top. No browser will tell
 * a page whether a protocol is registered; every technique for finding
 * out is a heuristic. This one is built to fail towards ARRIVING
 * SOMEWHERE: worst case the visitor lands on the same web page the
 * plain link would have given them. The one outcome it must not produce
 * is a click that goes nowhere.
 */

/**
 * How long to watch before deciding nobody answered.
 *
 * Was 900ms, which was too early: a cold desktop client on Windows can
 * take longer than that to grab focus, and being early is what made the
 * first version open the app AND a browser tab behind it.
 *
 * It is also the window a visitor has to dismiss a browser's own
 * "can't open this address" modal and still be caught by the fallback —
 * see the note on handoff(). Longer would catch slower dismissals, at
 * the price of a longer dead pause for the much more common case of
 * Chrome silently swallowing the scheme. 1.5s is the compromise.
 */
const FALLBACK_MS = 1500;

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

/**
 * Try the app; navigate to the web URL only if nothing took the click.
 *
 * THE SIGNAL IS OS FOCUS, NOT PAGE VISIBILITY. document.hidden answers
 * "is this TAB backgrounded or this window minimised" — a browser
 * window that merely loses focus to another application is still, by
 * that definition, visible. Reading document.hidden is what made an
 * earlier version open the web page underneath the app that had just
 * launched. document.hasFocus() is the question actually being asked.
 *
 * ONLY THE STATE AT THE DEADLINE DECIDES. A version in between watched
 * for blur and cancelled the moment it fired, on the reasoning that
 * losing focus at all meant something had answered. That is wrong in
 * one specific and important case: a browser that does not recognise
 * the scheme puts up its OWN modal — Firefox says it "doesn't know how
 * to open this address" — and that modal takes focus too. Cancelling on
 * blur meant the visitor dismissed the dialog and then nothing at all
 * happened, which is precisely the dead click this file exists to
 * prevent, handed to the exact person who needs the fallback most: the
 * one without the app.
 *
 * Dismissing the dialog returns focus to the page, so checking once, at
 * the end, tells the two apart: the app got the focus and kept it, or
 * the page has it back and nobody answered.
 *
 * The known cost is a visitor who opens the app and returns to the
 * browser inside the window — they get sent to the web page as well.
 * That is the right way round to be wrong. It sends someone to the page
 * they were already heading for, one Back press from the portfolio,
 * whereas the other mistake breaks the contact channel outright.
 */
function handoff(app, web) {
  let aborted = false;
  const abort = () => (aborted = true);

  // pagehide, and nothing else: the document is genuinely going away,
  // so a queued navigation would be pointless at best. Deliberately NOT
  // blur or visibilitychange — see above.
  window.addEventListener("pagehide", abort, { once: true });

  // Assigning location, not window.open: a custom scheme opened in a
  // new tab leaves an empty tab behind once the OS takes over.
  window.location.href = app;

  setTimeout(() => {
    window.removeEventListener("pagehide", abort);
    if (aborted) return;

    // Something else holds the focus, or the tab is not on screen. The
    // click was answered.
    if (!document.hasFocus() || document.hidden) return;

    // Same tab, even though the link itself is target="_blank". A
    // window.open() this long after the click has lost the gesture that
    // would authorise it, so the popup blocker eats it. A same-tab
    // navigation always lands, and Back returns to the portfolio.
    window.location.href = web;
  }, FALLBACK_MS);
}
