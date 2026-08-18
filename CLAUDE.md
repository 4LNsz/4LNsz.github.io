# 4LNsz Portfolio

Single-page personal portfolio. Vanilla JS + Vite, no framework. Deployed
as a static build to GitHub Pages.

## Commands

| | |
|---|---|
| `npm run dev` | dev server on :4000 with HMR |
| `npm run build` | production build to `dist/` |
| `npm run preview` | serve the built output on :4001 |

There are no tests and no linter. Verify changes by running `npm run build`
and checking the dev server visually.

Two build-time environment variables, both set by the Pages workflow from
`actions/configure-pages` outputs, both with local fallbacks:

- `BASE_PATH` → Vite `base`. `/` for a user page, `/<repo>/` otherwise.
- `SITE_URL` → substituted into the `__SITE_URL__` token in `index.html`
  for `canonical`, `og:url` and `og:image`. Those are fetched by crawlers
  with no page context, so they cannot be relative.

## Architecture

```
index.html              static shell — semantic markup only, no text content
public/                 favicon.svg, og.jpg, apple-touch-icon.png
src/
  main.js               boot + render pipeline
  config.js             identity: contact channels, timezone, motion constants
  content/
    index.js            locale registry (import.meta.glob — automatic)
    locales/*.js        ALL user-facing prose
  core/
    i18n.js             t(), applyI18n(), setLang(), onLangChange()
    theme.js            dark/light, persisted to localStorage
    nav.js              mobile drawer, header scrim/auto-hide, active section
    split.js            char/word splitting for text animations
    smooth-scroll.js    Lenis + ScrollTrigger wiring, getLenis()
    env.js              reduced-motion flag, breakpoint constants
  sections/*.js         render functions — build DOM, emit data-i18n keys
  motion/
    intro.js            preloader timeline
    choreography.js     all ScrollTrigger work
    field.js            the hero simulation + its instrument readout
  styles/
    main.css            @import manifest
    tokens.css          ALL colour and theme definitions
    *.css               one file per section
```

## The design system

`tokens.css` is two layers:

1. **Primitives** — two tonal ramps (`--ink-*`, teal-cast dark;
   `--paper-*`, warm sand light) plus two accents (`--aqua` for ink
   surfaces, `--teal` for paper). Neither ramp contains pure black or
   white.
2. **Semantics** — each theme maps **one** ramp onto roles: `--bg`,
   `--bg-sunken`, `--surface`, `--surface-2`, `--line`, `--line-strong`,
   `--fg`, `--fg-muted`, `--fg-subtle`, `--fg-faint`, `--signal`.

Text tone targets, measured against their own surface, roughly equal in
both themes: `--fg` ~15.8:1, `--fg-muted` ~7.9:1, `--fg-subtle` ~5.0:1.
`--fg-faint` is decorative strokes only.

Section elevation, all within the active theme:

| | |
|---|---|
| `--bg` | hero, profile, stack, path |
| `--surface` | marquee band, `#practice` |
| `--bg-sunken` | `#contact`, hero meta strip |
| `--surface-2` | chips, hovered rows, hovered cards |

## Hard rules

**A theme never mixes ramps.** Dark mode is INK from top to bottom;
light mode is PAPER from top to bottom. `#practice` and `#contact` used
to flip to the opposite ramp mid-page, so dark mode served two
full-width slabs of light paper. Sections separate by *elevation* — the
table above — never by inversion. There is no `--inv-*` set any more;
do not reintroduce one.

**Never hardcode a colour outside `styles/tokens.css`.** Every component
reads `var(--fg)`, `var(--signal)`, etc. Adding a colour means adding a
token — a primitive if it is a new tone, a semantic if it is a new role.

**Never dim text with `opacity`.** `opacity: 0.4` is a colour decision
written where this file cannot see it: it can't be contrast-checked, and
it fades the element's borders and children along with its text. Use
`--fg-muted` / `--fg-subtle`. Opacity is for animation state only (the
`.rv` pre-states, `.w-i` before its scrub).

Every text style is currently at or above WCAG AA in both themes, lowest
4.58:1. Re-measure if you touch a tone.

**Never use `gsap.from()`.** Use `gsap.fromTo()` with explicit start and
end values. `from` reads the element's current value as the destination —
and `.rv` / `.rv-x` pre-set `opacity: 0` in CSS, so `from({opacity: 0})`
silently animates 0 → 0 and the element never appears. This bug already
shipped once.

**Never write a fact Alan did not supply.** Every claim in
`content/locales/*.js` — a technology, a job title, a date, a
capability, a sentence in his voice — must trace to the LinkedIn CV,
to github.com/4LNsz, or to something Alan stated directly. The locale
files carry `[CV]` / `[GH]` / `[AL]` markers saying which. Do not add
something because it sounds plausible, because the CV implies it, or
because a row looks short without it.

This has gone wrong three times: a first-person manifesto signed with
his name, a hero bio written for him, and a stack listing Redis,
Docker, Linux, CI/CD, Turborepo, pnpm, Vite and REST — none of which
appear in either source. A portfolio is evidence someone is asked about
in an interview; an invented line is a question they cannot answer.
If a fact is missing, ask for it or leave the space out.

**Never put user-facing text in HTML or JS.** It goes in
`content/locales/*.js` and reaches the DOM through a `data-i18n`
attribute (or `data-i18n-attr="attr:key"` for attributes like
`aria-label`). `applyI18n()` only sets `textContent`; it never rebuilds
the DOM, which is what lets GSAP survive a language switch. Identity
data that isn't prose — contact channels, handles, URLs — lives in
`config.js`.

**Never make the clipping layout the default.** `#practice` defaults to a
readable vertical column; `choreography.js` adds `.is-horizontal` only
when it also builds the pin that scrolls the track. The polarity used to
be reversed (`.is-stacked` opting *out* of a clipped horizontal default),
which meant any failure to build the pin hid panels 02–04 with no way to
reach them.

**Nothing may move an interactive element out from under the pointer.**
The social links used to slide on hover while a `[data-magnetic]` script
dragged them toward the cursor; adjacent targets overlapped each other
and the brand drifted around its own box. The magnetic module is gone.
Hover feedback is background, border and colour — plus, at most, a small
travel on a decorative glyph inside its own reserved lane.

## Privacy

Section 03 (`practice`) describes **capability domains, not projects**.
The underlying work is under NDA. Do not add client names, server names,
repository names, or details specific enough to identify a system. If asked
to add a project, ask which one is public first.

## Common tasks

**Add a language.** Copy `src/content/locales/pt.js` to `es.js`, translate,
set `__meta.order`. The registry globs the folder and the switcher builds
itself from `Object.keys(CONTENT)`. No other file changes.

**Add a stack row or practice panel.** Add the object to *every* locale
file. Renderers derive indices from array length, so the counters and
`data-i18n` keys follow automatically. `stack.rows[].items` is an array —
one chip per entry.

**Add a contact channel.** One object in `SITE.channels` in `config.js`.
The grid is `auto-fit`, so the column count absorbs it with no CSS
change. Set `mono: true` for machine-ish values (addresses), and
`external: false` for anything that must not open a tab (`mailto:`).

**Change the accent colour.** `--aqua` and `--teal` in the primitives
block of `tokens.css`. They are not interchangeable: `--aqua` is sized to
carry small text on `--ink-900`, `--teal` to carry it on `--paper-100`.
Replacing one means re-checking the other.

**Retune motion.** Durations and easings live in `motion/`. Global
constants (Lenis lerp, marquee speed) live in `config.js` under `MOTION`.

**Regenerate `og.jpg`.** It is a canvas render, committed as a static
asset. There is no build step for it — redraw and replace the file.

## The hero simulation

`motion/field.js` runs a real simulation in section 00: each dot is a
session, and the readout beneath reports what stepping them costs.
Every figure on it is measured at runtime — sessions is the array
length, tick is `performance.now()` around step+draw, and the bar is
that tick against the 16.7ms of a 60Hz frame. Nothing there is a
decorative number, and nothing may become one.

Two attempts at this screen failed before it: "ALAN" at up to 330px,
then the statement at up to 76px. Both were a single element scaled up
until it filled the fold. Nothing in the hero is oversized now — the
name is the largest thing at a size a person would actually set.

Constraints the file has to keep, because a slow hero on a performance
engineer's site argues against him:

- Neighbour search runs on a spatial grid, never all-pairs. Measured at
  the 1600-session ceiling: 1.76ms vs 7.24ms, identical pair count.
- Link radius derives from the resting density, not a fixed px value —
  a constant looked right full-bleed and became a hairball once the
  canvas moved into a 380×300 box.
- The loop stops when the hero leaves the viewport or the tab is
  hidden; the readout writes 5×/s, not per frame; DPR is capped at 2.
- `prefers-reduced-motion` draws one frame and never starts a loop.

## Gotchas

- The render pipeline order in `main.js` is load-bearing:
  render lists → `applyI18n()` → `resplitAll()`. Splitting before the text
  is final splits the wrong string.
- `splitChars()` groups characters into `.wd` word wrappers separated by
  real text nodes. Without them a split headline has no whitespace
  anywhere and cannot wrap at all — it just overflows the viewport.
  Anything styling `.ch` inside a flex parent must account for `.wd`
  sitting between them (see `.hero-name h1 .wd`).
- The header is fixed and floats over content. It takes a scrim
  (`.is-stuck`) once scrolled and leaves entirely (`.is-hidden`) while
  scrolling down, both driven from `mountHeaderChrome()` in `nav.js`.
  `--header-h` feeds the hero's top padding and every section's
  `scroll-margin-top`; change it there, not per component.
- `ScrollTrigger.refresh()` must follow any DOM change that alters height.
  The resize handler debounces it and ignores height-only changes on
  touch, where the collapsing address bar fires resize mid-scroll.
- The pinned horizontal scroll recomputes its distance on every refresh
  via `invalidateOnRefresh` — do not cache `scrollWidth` in a variable.
- Hover styling is wrapped in `@media (hover: hover)`. On touch, `:hover`
  latches after a tap and the element stays lit until you tap elsewhere.
- The intro is gated on `window.load` *plus* a 2.5s watchdog, because
  `load` waits on the Google Fonts stylesheet. Without the watchdog a
  slow or blocked font CDN holds the preloader over the whole page.
