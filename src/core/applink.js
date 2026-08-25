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
 * out is a heuristic. This one is built to fail towards ARRIVING
 * SOMEWHERE: worst case the visitor lands on the same web page the
 * plain link would have given them. The one outcome it must not produce
 * is a click that goes nowhere.
 */

/**
 * How long to keep watching before deciding nobody answered.
 *
 * Was 900ms. A cold desktop client on Windows can take longer than that
 * to grab focus, and the cost of being early is the exact bug this file
 * shipped with: the app opens AND a browser tab opens behind it. The
 * cost of being late is a slightly longer wait in the case where the
 * app is not installed at all, which is the cheaper mistake.
 */
const FALLBACK_MS = 1500;

/**
 * How often to re-check. Cheap: two property reads.
 *
 * There was a third constant here, a slack window: overshoot the
 * deadline by more than 800ms and the fallback was suppressed, on the
 * theory that our timers had been frozen by a browser modal rather than
 * merely running late. It is gone, and it should not come back.
 *
 * It could not tell "a modal froze us" from "this timer was throttled",
 * and throttling is common — measured, it swallowed the fallback
 * outright in a backgrounded tab. The two mistakes are not symmetrical:
 * guessing wrong the other way costs one browser tab the visitor can
 * close, while this guess costs them a click that does nothing, which
 * is the single outcome this whole file exists to prevent. Focus and
 * visibility already answer the question the slack window was guessing
 * at.
 */
const POLL_MS = 100;

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
 * THE SIGNAL IS OS FOCUS, NOT PAGE VISIBILITY, and getting that wrong
 * is what made the first version open the app and a browser tab at the
 * same time. document.hidden answers "is this TAB backgrounded or this
 * window minimised" — a browser window that merely loses focus to
 * another application is still, by that definition, visible. So when
 * Discord came up over the top, document.hidden stayed false, the
 * timeout concluded that nobody had answered, and it opened the web
 * page underneath the app that had just launched.
 *
 * document.hasFocus() is the question actually being asked: does this
 * document still have the input focus, or did something else take it.
 * It is checked on a poll rather than once at the deadline, so a blur
 * that happens and is undone inside the window — the visitor clicking
 * straight back to the browser — still counts as an answer.
 */
function handoff(app, web) {
  let settled = false;

  const stop = () => {
    settled = true;
    window.removeEventListener("blur", stop);
    window.removeEventListener("pagehide", stop);
    document.removeEventListener("visibilitychange", stop);
  };

  window.addEventListener("blur", stop);
  window.addEventListener("pagehide", stop);
  document.addEventListener("visibilitychange", stop);

  // Assigning location, not window.open: a custom scheme opened in a
  // new tab leaves an empty tab behind once the OS takes over.
  window.location.href = app;

  const deadline = Date.now() + FALLBACK_MS;

  const tick = () => {
    if (settled) return;

    // Something else has the focus, or the tab went away. Either way
    // the click was answered.
    if (!document.hasFocus() || document.hidden) return stop();

    if (Date.now() < deadline) {
      setTimeout(tick, POLL_MS);
      return;
    }

    stop();

    // Same tab, even though the link itself is target="_blank". A
    // window.open() this long after the click has lost the gesture that
    // would authorise it, so the popup blocker eats it. A same-tab
    // navigation always lands, and Back returns to the portfolio.
    window.location.href = web;
  };

  setTimeout(tick, POLL_MS);
}
