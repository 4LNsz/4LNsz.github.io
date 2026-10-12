# 4LNsz Portfolio

Single-page personal portfolio. Vanilla JS + Vite, no framework. Deployed
as a static build to GitHub Pages.

Three documents sit beside this one. `PRODUCT.md` is who the page is for
and what may be said on it. `DESIGN.md` is the visual system, recorded
from the built page. `.impeccable/surfaces/index-html.md` is the
direction this page was built to. This file is how the code is put
together and the mistakes not to repeat.

## Commands

| | |
|---|---|
| `npm run dev` | dev server on :4000 with HMR |
| `npm run build` | production build to `dist/` |
| `npm run preview` | serve the built output on :4001 |

There are no tests and no linter. Verify changes by running `npm run build`
and checking the dev server visually.

**npm, not pnpm.** `package-lock.json` is the lockfile the Pages workflow
installs from with `npm ci`. A `pnpm-lock.yaml` and `pnpm-workspace.yaml`
used to sit alongside it, so the versions resolved locally and the ones
CI built with could drift apart without anyone noticing. Do not
reintroduce a second lockfile.

**Actions track their current major, and `.nvmrc` tracks the Node you
develop on.** The workflow pins `checkout@v7`, `setup-node@v7`,
`configure-pages@v6`, `upload-pages-artifact@v5` and `deploy-pages@v5`.
Older majors ran on Node 20, which the runners now force onto Node 24
with a deprecation warning on every build; `upload-pages-artifact@v5` is
the one that carries `upload-artifact@v7` and clears that warning at the
source. `.nvmrc` moved 20 → 24 in the same pass, because Node 20 is past
end of life and CI building on a different major from the one Alan runs
locally is the same silent-drift trap the second lockfile was.

Two build-time environment variables, both set by the Pages workflow from
`actions/configure-pages` outputs, both with local fallbacks:

- `BASE_PATH` → Vite `base`. `/` for a user page, `/<repo>/` otherwise.
- `SITE_URL` → substituted into the `__SITE_URL__` token in `index.html`
  for `canonical`, `og:url` and `og:image`. Those are fetched by crawlers
  with no page context, so they cannot be relative.

## Architecture

```
index.html              static shell — semantic markup and the mark's two
                        drawings inline, no text content
vite.config.js          base path, SITE_URL tokens, and the static card it
                        writes into index.html from config.js
public/                 favicon.svg, og.png, apple-touch-icon.png, CVs
brand/                  the mark as files, for use outside this page;
                        README.md is the usage sheet
  social/               profile covers and link cards, as PNG
  png/                  the marks and lockups as transparent PNG
  src/build.mjs         writes every vector in brand/ from one geometry
  src/letters.mjs       outlines the lockups' lettering into letters.json
  src/*.html            the pages the rasters are captured from
src/
  main.js               boot + render pipeline
  config.js             identity: contact channels, timezone, GitHub URL
  content/
    index.js            locale registry (import.meta.glob — automatic)
    locales/*.js        ALL user-facing prose
  core/
    i18n.js             t(), applyI18n(), setLang(), onLangChange()
    theme.js            dark/light, persisted to localStorage
    nav.js              mobile drawer, header scrim/auto-hide, active section
    anchors.js          anchor jump + the focus move that goes with it
    applink.js          desktop-app handoff with a web fallback
    env.js              the reduced-motion flag
  sections/*.js         render functions — build DOM, emit data-i18n keys
    source.js           turns a row's `src` into links to the CV / GitHub
  motion/
    intro.js            the first screen settling
    choreography.js     scroll reveals
    field.js            the hero simulation and its three instruments
  styles/
    main.css            @import manifest
    fonts.css           the five font files, served from this site
    tokens.css          ALL colour and theme definitions
    *.css               one file per section
```

## The design system

The world is a movement's calibre sheet: what runs under the case-back,
regulated and measured. `DESIGN.md` describes it in full. What a change
to the code has to know:

`tokens.css` is two layers.

1. **Primitives** — two ramps (`--graphite-*`, the dark theme;
   `--rhodium-*`, the pale sheet, the light theme), one ink (`--steel`,
   the identity's second colour and the text of the light theme) and two
   accents with two tunings each (`--brass` / `--brass-deep`, `--ruby` /
   `--ruby-deep`). Neither ramp contains a neutral grey, pure black or
   pure white. The graphite is not grey: every step sits on the brass's
   own hue at a tenth of its chroma, so the ground is the accent's
   shadow.
2. **Semantics** — each theme maps **one** ramp onto roles: `--bg`,
   `--bg-sunken`, `--surface`, `--surface-2`, `--line`, `--line-strong`,
   `--fg`, `--fg-muted`, `--fg-subtle`, `--signal`, `--measure`.

`--signal` is brass: rules, numerals, the one action. `--measure` is
ruby, and it is only ever something being measured right now — the arc
on the dial, the tick in the readout, the head of the record.

Elevation, all within the active theme:

| | |
|---|---|
| `--bg` | the sheet: every section |
| `--bg-sunken` | a well below it: the dial, the tick record, the career diagram, `#contact` |
| `--surface` | raised one step: the secondary door |
| `--surface-2` | raised two steps: hover |

Three faces, three jobs: Sofia Sans Extra Condensed for titles, Sofia
Sans Condensed for labels, numerals and controls, STIX Two Text for
prose. There is no mono face, because nothing on the page is code.

**The fonts are served from this site.** `styles/fonts.css` declares
five woff2 files, Latin subset only, out of the `@fontsource` packages
in `package.json`; the page makes no request to any other host. It used
to link Google Fonts for nine files, of which it set five. Using a
weight means declaring it there first: an undeclared weight does not
fail, the browser fakes it from the nearest one. Do not reintroduce a
font link in `index.html`.

## Hard rules

**A theme never mixes ramps.** Dark mode is graphite from top to bottom;
light mode is rhodium from top to bottom. Alan's own words for it: no
light colours in dark mode. Sections separate by *elevation*, the table
above, never by inversion.

**The dark ground is graphite, and it is the Base's graphite.** Until
2026-10-12 it was blued steel. Alan changed it after seeing the Base
design system's preview (`F:/FiveM/projetos/base`, `turbo/apps/preview`),
where this same identity is brass on a graphite derived from the brass,
with steel as the second colour. The four ground tones here are that
system's four, value for value, so the two carry one identity: brass,
the graphite born from it, steel. Do not bring the blue back as a
ground. And do not put steel in the hairlines of the dark theme: thin
saturated blue lines on warm black were mocked up and read as neon on
black, which is the look this page was built to refuse. In the dark
theme steel does not appear at all; it is the ink of the light one.

**Never hardcode a colour outside `styles/tokens.css`.** Every component
reads `var(--fg)`, `var(--signal)`, etc. Adding a colour means adding a
token — a primitive if it is a new tone, a semantic if it is a new role.
The exceptions are things that cannot read a stylesheet: the icon SVGs
in `public/` and `brand/`, the pages in `brand/src/`, and the browser's
own chrome colour, which `THEME.browserColor` in `config.js` and the
`theme-color` meta in `index.html` have to state as hex. Those two
repeat `--bg` of each theme; change them with it.

**Never dim text with `opacity`.** `opacity: 0.4` is a colour decision
written where the token file cannot see it: it can't be contrast-checked,
and it fades the element's borders and children along with its text. Use
`--fg-muted` / `--fg-subtle`. Opacity is for animation state only.

Every text tone clears WCAG AA against both `--bg` and `--bg-sunken` in
both themes; the lowest is 4.8:1. The table at the top of `tokens.css`
has the figures. Re-compute it if you touch a tone: `--brass-deep` and
`--rhodium-700` were both darkened once already to clear 4.5 on the
sunken ground. `--surface-2` is not on that table: it is the hover
ground. In dark every tone still clears 4.5 on it (lowest 4.7, the
ruby); in light `--fg-subtle`, `--signal` and `--measure` fall to
4.3–4.4 there. Nothing sets any of them on it today; keep it that way.

**Ruby is never decoration.** If something is ruby, it is a live
measurement. A ruby hover state, a ruby status dot, a ruby rule: all of
them spend the one colour whose meaning the page depends on.

**State is carried by form, never by hue alone.** A control that cannot
act goes dashed. Work is a solid run in the career diagram and study a
hollow one. This is what lets the mark, and the page, work in one ink.

**Never use `gsap.from()`.** Use `gsap.fromTo()` with explicit start and
end values. `from` reads the element's current value as the destination —
and `.rv` pre-sets `opacity: 0` in CSS, so `from({opacity: 0})` silently
animates 0 → 0 and the element never appears. This bug already shipped
once.

**Never write a fact Alan did not supply.** Every claim in
`content/locales/*.js` — a technology, a job title, a date, a
capability, a sentence in his voice — must trace to the LinkedIn CV,
to github.com/4LNsz, or to something Alan stated directly. The locale
files carry `[CV]` / `[GH]` / `[AL]` markers saying which. A fourth
marker, `[SIM]`, is for captions that describe what `motion/field.js`
does: they are about the page, not about him, and they have to change
when that code does. Do not add something because it sounds plausible,
because the CV implies it, or because a row looks short without it.

This has gone wrong three times: a first-person manifesto signed with
his name, a hero bio written for him, and a stack listing Redis,
Docker, Linux, CI/CD, Turborepo, pnpm, Vite and REST — none of which
appear in either source. A portfolio is evidence someone is asked about
in an interview; an invented line is a question they cannot answer.
If a fact is missing, ask for it or leave the space out.

**A field with no data stays empty.** The sheet has tables, and tables
tempt a row to be filled. A path row with no `note` renders an empty
cell. Nothing is written to balance it.

**Never put user-facing text in HTML or JS.** It goes in
`content/locales/*.js` and reaches the DOM through a `data-i18n`
attribute (or `data-i18n-attr="attr:key"` for attributes like
`aria-label`). `applyI18n()` only sets `textContent`; it never rebuilds
the DOM, which is what lets GSAP survive a language switch. Identity
data that isn't prose — contact channels, handles, URLs — lives in
`config.js`. The exceptions are proper nouns that are the same in every
language: "Alan Sena", "CV", "GitHub", "PDF".

That rule has a consequence: with no script there are no words. So
`vite.config.js` writes a **static card** into `index.html` at build
time — the name, the channels and the CV in each language, all of it
read from `config.js`, none of it prose — and the page shows that
instead of an empty shell when scripting is off or the bundle never
arrives. Do not type anything into the card by hand, and do not add a
sentence to it: it has no locale to be translated from.

**No kicker above a heading, and no number beside one.** A section
opens on its name alone, and so does a cell: "Canal principal" sat over
"Discord" once and now sits under it, as a sentence. A number in a
bubble is a reference into a figure, so it appears only where there is
one to follow it into: the callouts on the dial at the widths where the
leader lines are drawn, the plates in the Stack drawing. Atuação was
numbered with no figure to point into; so were the phone Stack, where
the drawing is hidden, and the callouts under 1100px, where the leaders
are. All three lost their numbers.

**A brass field is Discord, and only Discord.** `--signal` as a *fill*
is the project door on the first screen and the featured cell in
Contato, which are the same channel twice. Anything else that needs to
be the first of a pair is filled with ink (`--fg`): `+ Carga`,
`Visualizar`, the skip link. Brass as a rule, a numeral or text is
unrestricted, and so is `::selection`: that field is the reader's own
mark on the sheet, not a control.

**A drawing's dimensions are data or they are equal.** The plates in the
Stack drawing are as wide as their rows are long. They used to follow a
fixed sequence chosen to look varied, which made the figure say
something about the groups that nothing in the data said.

**A label never sits on the thing it labels.** The record names its two
traces in a gutter beside the plot. In the career diagram a label
inside the plot stands on a plate of the ground colour, and under 720px
the notes leave the plot for a key beneath it.

**No gears.** The world is a calibre *sheet*: tables, callouts, a
graduated ring, a dotted record. The moment it draws a cog or a
tourbillon it is an advertisement for a watch. Nothing on the page is a
picture of a movement.

**There is no preloader and no smooth-scroll library.** The page used to
open on a full-screen curtain counting 000→100 over a fixed tween — a
progress bar measuring nothing, in front of a page already painted
behind it. Lenis lerped every wheel event at 0.085, so the page kept
coasting after the gesture stopped. Both are gone at Alan's request.
Do not reintroduce either.

**Nothing may move an interactive element out from under the pointer.**
Hover feedback is background, border and colour. No element translates,
scales or tilts on hover.

**Nothing 8-bit.** No pixel lettering, no pixel marks, no retro-game
register. Alan ruled it out.

## The mark

Two names for one person, so two marks. `brand/` holds them as files,
and `brand/README.md` is the usage sheet: which file goes where, the
minimum sizes, the clear space.

- **A-quatro** (`brand/a-quatro.svg`) — the isotype. An A whose right
  leg stands upright, which is what makes it a 4 as well. Under 24px use
  the heavier cut (`a-quatro-small.svg`). It goes with the handle.
- **AS** (`brand/as.svg`) — the rubric, Alan's initials. The A-quatro
  and an S whose open side takes the 4's bar. It goes with the name.

They are never set side by side. A page may carry one at its head and
the other at its foot, as this one does.

Do not redraw either from memory, and do not edit the files: every
vector in `brand/`, and `public/favicon.svg`, is written by
`node brand/src/build.mjs` from one description of the geometry. The
page carries both drawings inline, because their colour is a theme token
and an `<img>` cannot inherit one: the A-quatro in the header and the AS
in the footer. The script prints both; paste them into `index.html`, and
the A-quatro into `brand/src/og.html`, if the drawing changes.

**The letters beside the mark are Sofia Sans Condensed, and they are
the ones Alan chose.** In the header the A-quatro stands where the 4 is
and `LNsz` follows as type (the link has `aria-label="4LNsz"`, since the
4 is not a character there); the name lockup is the AS and "Alan Sena"
in the same face. In `brand/` the two lockups are files, `wordmark*.svg`
and `name*.svg`, and there the letters are the font's own outlines:
`brand/src/letters.mjs` lays the words out as the header's CSS does,
checks itself against the browser's layout, and writes
`brand/src/letters.json` for `build.mjs` to read. Change the lettering
in `header.css` and it has to be run again.

A version with letters redrawn in the mark's own geometry was built
once, put in the header and taken out again the same day: it was a
different logo from the one he approved, and nobody had shown it to
him. He was then shown both and chose the type. Do not redraw them.

`sz` means nothing and is pure form; do not build a meaning into it.

The rasters are captures of pages, taken with a headless browser at the
size each page states in its own comment: `public/og.png` and
`public/apple-touch-icon.png` from `brand/src/og.html` and
`touch-icon.html`, `brand/sheet.png` from `brand/src/sheet.html`, and
`brand/avatar.png` from `brand/avatar.svg`. There is no build step for
them.

`brand/social/` is the same figure and the same three lines as the
social card, cut to the sizes other platforms ask for, all drawn by
`brand/src/social.html`. A cover (LinkedIn, X, Discord) carries no
mark, because the platform lays the profile picture, which is the mark,
over its lower left corner; a card stands alone and carries the
wordmark. They say what `og.html` says and nothing more: the name, the
title and the focus, from the CV. `brand/png/` is the vectors as
transparent PNG, for where an SVG is refused. If the drawing, an accent
or the graphite changes, all of these are re-captured with the rest.

## Privacy

Atuação (`practice`) describes **capability domains, not projects**.
The underlying work is under NDA. Do not add client names, server names,
repository names, or details specific enough to identify a system. If asked
to add a project, ask which one is public first.

FiveM may be named as one context. It is never the scope: Alan works in
it today, and the page presents a developer in general.

## Common tasks

**Add a language.** Copy `src/content/locales/pt.js` to `es.js`, translate,
set `__meta.order`. The registry globs the folder and the switcher builds
itself from `Object.keys(CONTENT)`. No other file changes.

**Add a stack row or a practice row.** Add the object to *every* locale
file. The Stack drawing grows a plate per row, as wide as the row has
`items`. A stack row carries `src: ["cv", "gh"]`, the same source the
comment beside it names, in a form `sections/source.js` can turn into
links; leave a key out rather than point at a document that does not
show the fact.

**Add a path row.** One object in `path.rows` in *every* locale file,
with `when` (the words), `from` and `to` (`[year, month]`, the same
dates in a form the diagram can read) and `kind: "study"` if it is not
a job. Change `when` and `from` / `to` together.

**Add a profile block.** One object in `profile.blocks` in *every* locale
file, carrying either `items` (lines, for a fact that needs a clause) or
`chips` (fields, for facts that are two words each). This list reached
twenty items once and had to be cut back. If a fact already appears in
another section, it does not repeat here: "building since 2018" used to,
and it lives on the dashed run of the career diagram now.

**Add a contact channel.** One object in `SITE.channels` in `config.js`.
The table wraps and the last row stretches, so the count absorbs it with
no CSS change. Set `mono: true` for long, machine-ish values (an
address), and `external: false` for anything that must not open a tab
(`mailto:`). The static card picks it up as well; both are built by
`channelCell()` in `sections/contact.js`.

**Change an accent.** `--brass` / `--brass-deep` and `--ruby` /
`--ruby-deep` in the primitives block of `tokens.css`. The two tunings
of each are not interchangeable: the bright one carries small text on
graphite, the deep one on rhodium. Then re-compute the contrast table, and
update the hex values in the files that cannot read the tokens: the `C`
table in `brand/src/build.mjs` (then run it), and the hand-written
`brand/src/og.html`, `social.html` and `touch-icon.html` (then
re-capture them, and `brand/png/`).

**Retune motion.** Durations and easings live in `motion/`.

## The hero simulation

`motion/field.js` runs a real simulation in the dial: each dot is a
session, and three instruments report what stepping them costs. The ring
is one lap per 16.7ms frame, with the tick as a ruby arc of it. The
record under the fold writes one dot per frame. The readout says the
same in numbers. Every figure is measured at runtime — sessions is the
array length, tick is `performance.now()` around step + draw. Nothing
there is a decorative number, and nothing may become one.

Constraints the file has to keep, because a slow hero on a performance
engineer's site argues against him:

- Neighbour search runs on a spatial grid, never all-pairs.
- Link radius derives from the resting density, not a fixed px value.
- The loop stops when the dial leaves the viewport or the tab is hidden;
  the readout, the ring and the leader lines write 5×/s, not per frame;
  DPR is capped at 2.
- `prefers-reduced-motion` measures one frame and never starts a loop.
- The run is seeded (`SEED`), so the same seed draws the same field.
- It is the same instrument on every device. Links used to be skipped on
  touch, which left a phone showing a caption about a neighbour search
  that was not running, beside a tick that cost nothing.
- Load is relative to the resting count: a step is two fifths of it, the
  ceiling four times it, never past 1600. Fixed numbers let one press
  more than double a phone-sized field.
- The field takes load on `click`, not `pointerdown`. On a phone the
  dial is as wide as the screen, and every scroll that began on it used
  to add load on the way past.

The leader lines point at real things. Callout 1 ends on a session,
callout 2 on a link between two of them, callout 3 on the live end of
the ruby arc; each is re-aimed with the readout, and a session that
wanders out of reach of its callout is let go for the nearest one. A
leader that ended on empty field would be a caption about nothing.

On a phone `#hero-mini` repeats three figures of the readout straight
under the dial, because the readout itself is a screen and a half
further down. `paintPanel()` writes both from the same variables.

Three things in it are stated in words elsewhere and have to move
together:

- `TRACE_MAX_MS` is the top of the record's scale. `hero.strip.scale` in
  the locale files says how many times the frame budget sits above it.
- The four callouts in `hero.fig` describe the simulation. Change what
  it does and they are wrong.
- The record is on a square-root scale, on purpose: at rest a tick is a
  fifth of a millisecond, and on a linear 0–2 it would sit in the bottom
  tenth. The unevenly spaced rules are what say so. Do not "fix" them.

## Gotchas

- The render pipeline order in `main.js` is load-bearing: render lists →
  `applyI18n()`, and anything that *measures* text comes after both. The
  leader lines on the dial are drawn from where the callouts ended up,
  which depends on how long their words are in the language applied.
- The mark is inline SVG, not a `<use>` of a `<symbol>`. A use is laid
  out from 0,0 of the referencing `<svg>` whatever the symbol's own
  `viewBox` says, so a symbol with a negative origin shifts and clips.
  Each drawing is used once, so there is nothing for a sprite to save.
- A rule that sets `grid-column` on a class used in two sections gives
  one of them an implicit column. `.src` did exactly that to the
  Trajetória rows on phones; it is scoped to `.part` now.
- The career diagram is laid out for the width it is given rather than
  scaled into it, so its lettering stays the size it was set at.
  `drawGraph()` runs again on a width change and when the fonts land:
  the plates under its labels are cut to the measured box of the words
  (`getBBox`), and a fallback font measures differently.
- The header is fixed and floats over content. It takes a scrim
  (`.is-stuck`) once scrolled and leaves entirely (`.is-hidden`) while
  scrolling down, both driven from `mountHeaderChrome()` in `nav.js`.
  `--header-h` feeds the hero's top padding and every section's
  `scroll-margin-top`; change it there, not per component.
- `ScrollTrigger.refresh()` must follow any DOM change that alters height.
  The resize handler debounces it and ignores height-only changes on
  touch, where the collapsing address bar fires resize mid-scroll.
- Hover styling is wrapped in `@media (hover: hover)`. On touch, `:hover`
  latches after a tap and the element stays lit until you tap elsewhere.
- The hero's pre-animation state lives in `base.css` under `html.js`, and
  `html.js` is set by an inline script in `<head>` — not by `main.js`.
  A deferred module can run after the browser's first paint, which would
  show the hero settled for one frame before the timeline yanked it back
  down to animate it in.
- Hiding the hero on the promise of a script is only safe if the promise
  can be taken back, and for a while it could not: a bundle that failed
  to load left the first screen invisible for good. The same inline
  script now watches for that. Three classes on `<html>` carry the state:
  `js` (a script is coming; pre-states apply), `ready` (main.js has
  rendered the page; set right after the first `render()`), `settled`
  (everything at rest, whatever GSAP wrote inline). If the bundle fails
  to load, throws while starting, or is silent for four seconds, `js`
  comes off: before `ready` that shows the static card, after it the
  whole page plus `settled`. `main.js` ends with `window.__boot?.()`,
  which is how it says it made it; keep that the last line, and keep
  `ready` after `render()`. A bundle that arrives late re-adds `js` and
  starts as usual. Every branch of this was checked in dev and in the
  build: blocked bundle, scripting off, a throw after render, and a
  bundle that took a minute to arrive.
- The stylesheet is a `<link>` in the head of `index.html`, not an import
  in `main.js`. The built site looks the same either way, because Vite
  hoists an imported stylesheet into a link; the dev server does not,
  and every reload there painted the bare markup first. Alan saw it as
  "a huge 4": the header's A-quatro with no CSS to size it. The inline
  SVGs carry `width` and `height` attributes for the same reason, so a
  page that ever does paint without its stylesheet stays in proportion.
- `document.fonts.ready` triggers one re-measure: the scroll triggers,
  the leader lines, the career diagram, and the lettering the record
  draws on its canvas. Nothing waits for the font files, so everything
  is first measured against fallback metrics.
- `opentype.js` is a dev dependency for one script,
  `brand/src/letters.mjs`, and 2.0 gets three things wrong with this
  font: it cannot read its kerning (a GPOS extension lookup), it stops
  on the `ccmp` feature when handed a whole string, and it prints some
  valid coordinates as "NaN", which once shipped "Alan Sena" as "Al".
  The script works round each where it happens and proves the result
  against the browser's layout. Read those comments before simplifying
  it or upgrading the library.
- A browser reports time in 0.1ms steps unless the page is cross-origin
  isolated. A 0.2ms tick read through that clock lands on three values,
  which is why each dot of the record is a short running mean.
