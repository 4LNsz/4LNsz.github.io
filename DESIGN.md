---
name: 4LNsz Portfolio
description: A back-end engineer presented as a movement's calibre sheet, in graphite or rhodium.
colors:
  brass: "#d6ae55"
  brass-deep: "#73550f"
  brass-hover: "#e3c178"
  brass-deep-hover: "#5f460b"
  on-brass-muted: "#3a3216"
  on-brass-deep: "#f6f0df"
  on-brass-deep-muted: "#e8dcb9"
  ruby: "#f4577c"
  ruby-deep: "#b5173f"
  steel: "#101b50"
  graphite-950: "#110e09"
  graphite-900: "#18150f"
  graphite-800: "#1f1c17"
  graphite-700: "#28251f"
  graphite-600: "#433f39"
  graphite-500: "#5e5a54"
  graphite-300: "#9f9b92"
  graphite-200: "#c2bdb4"
  graphite-100: "#efebe2"
  rhodium-100: "#e6e9ef"
  rhodium-150: "#dde2ec"
  rhodium-200: "#d5dbe8"
  rhodium-300: "#c7cfe0"
  rhodium-400: "#a6b1cf"
  rhodium-500: "#8491bb"
  rhodium-700: "#4b5890"
  rhodium-800: "#3a4885"
  scrim-graphite: "#18150f"
  scrim-rhodium: "#e6e9ef"
typography:
  display:
    fontFamily: '"Sofia Sans Extra Condensed", "Arial Narrow", sans-serif'
    fontSize: "clamp(3.5rem, 6.2vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "0.012em"
  headline:
    fontFamily: '"Sofia Sans Extra Condensed", "Arial Narrow", sans-serif'
    fontSize: "clamp(2.75rem, 5.2vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "0.012em"
  title:
    fontFamily: '"Sofia Sans Extra Condensed", "Arial Narrow", sans-serif'
    fontSize: "clamp(1.75rem, 2.5vw, 2.375rem)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "0.014em"
  lead:
    fontFamily: '"STIX Two Text", Georgia, serif'
    fontSize: "clamp(1.1875rem, 1.6vw, 1.5625rem)"
    fontWeight: 400
    lineHeight: 1.36
    letterSpacing: "normal"
  body:
    fontFamily: '"STIX Two Text", Georgia, serif'
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  term:
    fontFamily: '"Sofia Sans Condensed", "Arial Narrow", sans-serif'
    fontSize: "1.0625rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.1em"
  label:
    fontFamily: '"Sofia Sans Condensed", "Arial Narrow", sans-serif'
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.16em"
  control:
    fontFamily: '"Sofia Sans Condensed", "Arial Narrow", sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.12em"
  field:
    fontFamily: '"Sofia Sans Condensed", "Arial Narrow", sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.04em"
  numeral:
    fontFamily: '"Sofia Sans Condensed", "Arial Narrow", sans-serif'
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
    fontFeature: '"tnum"'
rounded:
  none: "0px"
  full: "50%"
spacing:
  pad: "clamp(18px, 4vw, 64px)"
  section-y: "clamp(64px, 9vh, 120px)"
  head-gap: "clamp(22px, 3vh, 36px)"
  header-h: "64px"
  tap: "44px"
  wrap-max: "1600px"
components:
  door-project:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.graphite-950}"
    rounded: "{rounded.none}"
    padding: "11px 14px 11px 16px"
    height: "64px"
  door-project-hover:
    backgroundColor: "{colors.brass-hover}"
  door-role:
    backgroundColor: "{colors.graphite-800}"
    textColor: "{colors.graphite-100}"
    rounded: "{rounded.none}"
    padding: "11px 14px 11px 16px"
    height: "64px"
  door-role-hover:
    backgroundColor: "{colors.graphite-700}"
  button-ink:
    backgroundColor: "{colors.graphite-100}"
    textColor: "{colors.graphite-950}"
    typography: "{typography.control}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "44px"
  button-ink-hover:
    backgroundColor: "{colors.graphite-200}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-100}"
    typography: "{typography.control}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.graphite-700}"
  button-disabled:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-300}"
  chip:
    textColor: "{colors.graphite-100}"
    typography: "{typography.field}"
    rounded: "{rounded.none}"
    padding: "5px 10px 4px"
  nav-link:
    textColor: "{colors.graphite-200}"
    typography: "{typography.control}"
    padding: "10px 0 8px"
  nav-link-active:
    textColor: "{colors.graphite-100}"
  channel-cell:
    textColor: "{colors.graphite-100}"
    rounded: "{rounded.none}"
    padding: "14px 18px 13px"
    height: "84px"
  channel-cell-hover:
    backgroundColor: "{colors.graphite-800}"
  channel-featured:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.graphite-950}"
    rounded: "{rounded.none}"
    padding: "14px 18px 13px"
    height: "104px"
  channel-featured-hover:
    backgroundColor: "{colors.brass-hover}"
  callout-bubble:
    backgroundColor: "{colors.graphite-950}"
    textColor: "{colors.brass}"
    rounded: "{rounded.full}"
    size: "28px"
---

# Design System: 4LNsz Portfolio

Recorded from the built page, last on 2026-10-12: `src/styles/tokens.css` and the section stylesheets, the renderers in `src/sections/`, the hero simulation in `src/motion/field.js`, and the usage sheet in `brand/`. Where this file and the code disagree, the code is the fact and this file is stale.

## Overview

**Creative North Star: "Folha de Calibre (The Calibre Sheet)"**

The page is laid out as the technical sheet of a watch movement: what runs under the case-back, regulated and measured. It is a printed document, so it is built from the things such a sheet prints: ruled tables, numbered callouts on leader lines, a graduated ring, a dotted record, an exploded view, a train graph. Nothing on it is a picture of a movement. There are no gears and no cards.

Each theme is one material from top to bottom. Dark is graphite, a warm near-black drawn from the brass's own hue; light is a rhodium sheet with steel ink. Neither contains a neutral grey, a pure black or a pure white. Brass draws the rules, the numerals and the mark. Ruby is reserved for one meaning, a value being measured right now. Because meaning is carried by form before hue (solid, dashed, hollow), the sheet and the mark both survive in a single ink.

The density is that of a data sheet: tall condensed capitals for names, small tracked capitals for labels, a scientific serif for sentences, hairlines one pixel wide. It refuses the dark developer portfolio with one neon accent and a fake terminal, and it refuses that page's editorial-serif opposite. It is also quiet: the record of the tick is the only thing that loops, and nothing moves under the pointer.

**Key Characteristics:**
- One ramp per theme: graphite in dark, rhodium in light, never mixed.
- Brass is the signal; ruby is a live measurement and nothing else.
- Every table opens on a brass rule and closes each row on a hairline.
- Square corners on every box; circles only where the sheet draws an instrument or a reference.
- Flat. Depth is four tones of one ramp, with no shadow and no blur.
- Three faces with three jobs, and no mono face.
- State by form: solid, dashed, hollow.
- A number in a bubble always points into a figure.

## Colors

Two ramps, one ink and two accents. Graphite is the dark theme. It is not a neutral grey: every step sits near the brass's own hue (OKLCH h about 85) at about a tenth of its chroma, so the ground is the accent's shadow. Rhodium is the pale sheet of the light theme, and steel is its ink. Each accent has two tunings: a bright one that carries small text on graphite and a deep one that carries it on rhodium. The frontmatter lists the primitives. Components read roles, and each theme maps one ramp onto the same roles:

| Role | Job | Dark | Light |
|---|---|---|---|
| `--bg` | the sheet: every section | graphite-900 | rhodium-100 |
| `--bg-sunken` | a well below it | graphite-950 | rhodium-200 |
| `--surface` | raised one step | graphite-800 | rhodium-150 |
| `--surface-2` | raised two steps: hover | graphite-700 | rhodium-300 |
| `--line` | hairlines | graphite-600 | rhodium-400 |
| `--line-strong` | field borders, the zero rule | graphite-500 | rhodium-500 |
| `--fg` | ink | graphite-100 | steel |
| `--fg-muted` | the second voice | graphite-200 | rhodium-800 |
| `--fg-subtle` | labels | graphite-300 | rhodium-700 |
| `--signal` | brass | brass | brass-deep |
| `--signal-hover` | brass under the pointer | brass-hover | brass-deep-hover |
| `--on-signal` | ink on a brass fill | graphite-950 | on-brass-deep |
| `--on-signal-muted` | its second line | on-brass-muted | on-brass-deep-muted |
| `--measure` | ruby | ruby | ruby-deep |
| `--scrim` | the floating header | scrim-graphite | scrim-rhodium |

The component tokens in the frontmatter are written against the dark theme, which is the default. For light, read the same role from the right-hand column.

### Primary
- **Brass** (`brass` on graphite, `brass-deep` on rhodium): the head rule of every table, the graduations and numerals of the dial, callout bubbles and plate outlines, solid runs in the career diagram, the employer's name in the record, the mark, the focus ring, the active navigation underline, and the Discord fill. As text it is safe on the sheet and in the well in both themes (lowest 8.7:1 in dark, 5.0:1 in light).

### Secondary
- **Ruby** (`ruby` on graphite, `ruby-deep` on rhodium): a measurement in progress. The arc on the dial and its hand, the tick figure in the readout, the ringed head of the record. Lowest contrast as text is 5.6:1 in dark and 4.8:1 in light, on the light well.

### Tertiary
- **Steel** (`steel`): the identity's second colour and the full ink of the light theme: names, values, the ink-filled button, the dots and links of the field. It appears nowhere in the dark theme.

### Neutral
- **Graphite** (the nine `graphite-*` steps): the whole dark theme. 950 is the well, 900 the sheet, 800 and 700 the two raised steps, 600 and 500 the hairlines, 300, 200 and 100 the three ink voices. The four ground tones and the three ink tones are those of the owner's Base design system, value for value, so the two carry one identity.
- **Rhodium** (the eight `rhodium-*` steps): the whole light theme. 100 is the sheet, 150 raised, 200 the well, 300 hover, 400 and 500 the hairlines, 700 and 800 the two quieter ink voices.
- **Ink voices:** full ink for names and values, the second voice for captions and supporting lines, the label voice for small capitals. The lowest of the three is 6.6:1 in dark and 4.9:1 in light, against the harder ground of each.

Text selection uses the brass fill and its ink. It is the one brass field that is not Discord: the reader's own mark on the sheet, not a control.

### Named Rules
**The One Ramp Rule.** A theme is one ramp all the way down. Dark has no pale surface and light has no dark one; sections separate by elevation within the ramp, never by inversion.

**The Steel Ink Rule.** Steel is the ink of the light theme and nothing in the dark one. It is never a dark ground and never a dark hairline: thin saturated blue lines on warm black read as neon on black, which is the look this sheet refuses.

**The Measurement Rule.** Ruby is only ever a value being measured now: the arc on the dial, the tick in the readout, the head of the record. It is never a hover, a status, a rule or an ornament, and it never touches the mark.

**The Discord Fill Rule.** A door or a cell filled with brass means Discord and nothing else: the project door on the first screen and the featured cell of the contact table. Every other primary action is filled with ink.

**The Token Rule.** No colour is written outside the token file, and text is never dimmed with opacity. A quieter voice is a quieter token; opacity is for animation state only.

## Typography

**Display Font:** Sofia Sans Extra Condensed (with Arial Narrow, sans-serif), weight 800
**Body Font:** STIX Two Text (with Georgia, serif), weight 400
**Label Font:** Sofia Sans Condensed (with Arial Narrow, sans-serif), weights 500, 600 and 700

**Character:** Tall condensed capitals fit a name and a section head into a sheet's margin; the serif was drawn for scientific publishing, which is the register a calibre sheet reads in. The contrast is between a stamped title and a written sentence, with the small condensed capitals as the voice of the form itself.

The three faces are served from the site itself: five woff2 files, Latin subset, declared in `src/styles/fonts.css` out of the `@fontsource` packages. The page requests nothing from another host. Those five weights are the whole ramp, and a weight has to be declared there before a stylesheet uses it; an undeclared weight does not fail, the browser fakes it from the nearest one.

### Hierarchy
- **Display** (800, clamp(3.5rem, 6.2vw, 6rem), 0.86): the name on the first screen and the headline of the closing section. The largest type on the page, at a size a person would set it; it does not scale to fill the fold.
- **Headline** (800, clamp(2.75rem, 5.2vw, 4.5rem), 0.9, balanced): a section's name. The phone drawer sets its links in the same cut.
- **Title** (800, clamp(1.75rem, 2.5vw, 2.375rem), 0.96): the name of a row that carries a paragraph.
- **Lead** (400 serif, clamp(1.1875rem, 1.6vw, 1.5625rem), 1.36): the one statement, capped at 21em.
- **Body** (400 serif, 1.0625rem, 1.5): prose, captions and table values, all at the one size. Running paragraphs are capped at 34em to 44em; captions tighten the leading to 1.25 to 1.36 and take the second ink voice.
- **Term** (700 condensed, 1.0625rem, 0.1em, uppercase): the name of a thing a caption explains. Rows of the record set it larger, 1.3125rem at 0.04em.
- **Label** (600 condensed, 0.8125rem, 0.16em, uppercase): the label column and every table head, in the label ink.
- **Control** (700 condensed, 0.9375rem, 0.12em, uppercase): buttons, navigation (600) and the language switch.
- **Field** (600 condensed, 0.9375rem, 0.04em): a two-word fact in a bordered field.
- **Numeral** (700 condensed, 1.375rem, tabular): a measured figure, with its unit beside it at 0.875rem in the second voice.

Lettering inside a drawing is Sofia Sans Condensed 600 to 700 at 15px to 17px (13.5px to 15px on a phone), and 13px on the record's canvas, set at a fixed size and never scaled with the figure.

### Named Rules
**The Three Jobs Rule.** Extra Condensed sets titles, Condensed sets labels, numerals and controls, the serif sets sentences. None does another's job, and there is no fourth face.

**The Name Alone Rule.** A section opens on its name alone. No kicker above a heading and no number beside one.

**The Capitals Rule.** Capitals belong to the condensed faces and to names, labels and controls. A sentence is never set in capitals and the serif is never tracked.

## Layout

One column of sections inside a wrap capped at 1600px, with a side margin of clamp(18px, 4vw, 64px). Every section takes the same vertical padding, clamp(64px, 9vh, 120px), and its heading sits clamp(22px, 3vh, 36px) above its own content: more space above a heading than below it. The header is a fixed bar 64px tall that every anchor jump clears.

The unit of composition is the ruled table. A row is a grid of a narrow label column (roughly 7.5rem to 11rem) and a value column, or a name column of about 23rem beside a paragraph. Rows are separated by hairlines, never by boxes or by alternating grounds. A figure either sits in a well above its table (the career diagram) or lies over the left of it so the hairlines run under the drawing (the stack plates, at a pitch of 104px shared by drawing and rows).

The first screen is the plate of the sheet: three columns, text, the dial, text. The dial's diameter is clamp(300px, min(50vh, 33vw), 540px) with a 46px band for graduations, and everything the dial touches derives from those two values so the figure scales as one object. The tick record runs the full width along the foot in a well.

Responsive behaviour is a change of arrangement, never a scaling down:
- **Below 1100px** the callout columns have no room. The leader lines go, the numbered bubbles go with them, and the callouts become a plain list of four terms.
- **Below 900px** the navigation becomes a full-page drawer and the record's table head is dropped; each row stacks.
- **Below 860px** two-column sections become one.
- **Below 760px** the first screen is one column in this order: name, dial, a three-figure readout, the two doors, then the captions.
- **Below 700px** the stack drawing is dropped and its rows lose their fixed height.

Interactive targets are 44px or larger; a small glyph gets its hit area extended to 44px without changing the layout.

### Named Rules
**The Brass Head Rule.** Every table and list opens on a brass rule 1.5px thick and closes each row on a 1px hairline. The label sits in a narrow left column, the value beside it.

**The Reference Rule.** A number in a bubble is a reference into a figure. Where the figure or its leader lines are not drawn, the numbers go with them.

**The Empty Cell Rule.** A field with no data stays empty. Nothing is written to balance a row.

## Elevation & Depth

The system is flat and uses tonal layering only. There are four levels, all within the active ramp: the sheet, a well one step below it, and two raised steps above it. There is no shadow vocabulary. The one `box-shadow` in the build is a 1px hairline ring drawn around the circular field of the dial, which is a border, not a shadow.

The header floats over the page. At the top it is transparent on a hairline; once the page has scrolled it takes the theme's own ground, opaque, and while the page scrolls down it leaves entirely. At 92% the text passing under it showed through the wordmark.

### Named Rules
**The Printed Sheet Rule.** No shadows, no blur, no gradients. The fixed header takes a flat scrim of its own ground when it floats; a frosted bar would be the one piece of glass on a printed page.

**The Well Rule.** An instrument sits in a well, one step below the sheet: the dial, the tick record, the career diagram, the foot of the page. Raising is reserved for something to press.

## Shapes

Square corners on every box: doors, buttons, fields, table cells, the diagram's frame. No radius scale exists. Circles are drawn only by the sheet's own instruments and references: the dial and its ring, the 28px callout bubbles, the nodes of the career diagram, the terminals of the leader lines, the ellipses of the stack plates.

Line weights are few. Hairlines are 1px. The brass head rule and the outline of a bubble are 1.5px. Strokes inside a drawing run from 1px (leaders, axes, grid) to 5px (a solid run of work); a hollow run is a 7px ink stroke with a 3.6px stroke of the ground inside it. A label inside a plot stands on a plate of the ground colour cut to its own box, so no rule runs through a word.

Dashes carry meaning. A dashed border is a control that cannot act. A dashed run is time with no employer on the record. The dash-dot line through the stack plates is a drafting centre line.

Icons are drawn inline as strokes at 2px on a 24-unit grid (the arrow out, the arrow down), sized 16px to 28px, and take the colour of the text beside them.

### Named Rules
**The Square Box Rule.** Every box has square corners. A circle means an instrument or a reference: the dial, a callout bubble, a node, a leader's terminal.

**The Form First Rule.** State is carried by form, never by hue alone. A control that cannot act goes dashed; work is a solid run and study a hollow one; the stretch with no employer on the record is dashed rather than left off.

## Components

Plain, ruled and still. A component is a row of a table or a field on the sheet before it is anything else.

### Buttons
- **Shape:** square (0px), at least 44px tall, 16px side padding, Control type.
- **Primary:** filled with ink, lettered in the ground it sits on. Used for the first of a pair, adding load and viewing the CV, and for the keyboard skip link.
- **Secondary:** transparent with a 1px border in the second ink voice.
- **Hover:** the outline takes the second raised step and a full-ink border; the ink fill drops to the second ink voice. Transitions are 0.18s on background, border and colour.
- **Disabled:** dashed border and label ink on a transparent ground. Form, not a faded fill.
- **Focus:** a 2px brass outline offset 3px, on every focusable element, shown to the keyboard only.

### Doors
The two ways out of the first screen, one per audience, equal in size (64px minimum, a Term-weight name over one line of serif, an arrow at the right).
- **Project door:** brass fill with its own ink. It is the Discord channel.
- **Role door:** the first raised step with a hairline border; on hover the second raised step and the strong hairline.

### Chips
- **Style:** a bordered field (1px strong hairline, 5px 10px 4px), Field type, no fill and no radius. For facts that are two words long.
- **State:** none. A field is not a control.

### Ruled table
The system's container. A brass head rule, hairline rows, a label column in Label type and a value column in Body or Numeral type. It carries the base and local time, the profile blocks, the stack groups, the capability domains, the career record (which adds a head row of labels) and the readout.

### Readout
A ruled table whose values are Numerals. Label left, figure right with its unit. The tick figure is ruby; the others are ink. On a phone a three-cell version sits directly under the dial, divided by vertical hairlines.

### Channel table
- **Cells:** a wrapping row of cells sharing hairline borders, each at least 84px tall, a Label over a 1.375rem condensed value and an arrow. A long address is set a size down. The last row stretches, so the table never ends on an empty cell.
- **Featured cell:** full width, 104px, brass fill, the channel's mark, its name in Title type and one line of serif under it. Discord only.
- **Hover:** the cell takes the first raised step and its arrow turns brass; the featured cell takes the lit brass.

### Navigation
- **Desktop:** Control type at weight 600 in the second ink voice; full ink on hover; the current section adds a 2px brass underline. A hairline separates it from the language switch and the theme toggle.
- **Phone:** a full-page drawer on the sheet's ground, links in Headline type on hairlines under one brass head rule; the current link is brass.
- **Language switch:** two codes divided by a slash; the current one is full ink at 700.

### Numbered callout
A 28px circle, 1.5px brass outline on the well's tone, a brass numeral. A 1px leader in the second ink voice runs from it to a hollow terminal on the thing it names. Used where the leader can be drawn: the dial above 1100px and the plates of the stack drawing.

### Source link
At the right edge of a row, a Label followed by one underlined link per public document that shows the row's facts; brass on hover. Whether these links stay on the rows is an open decision of the owner's.

### The dial and the record
The signature component. A circular well holding a simulation, inside a graduated brass ring where one lap is one 16.7ms frame; a ruby arc with a hollow hand shows the cost of the last tick. Below it, a dotted record on a square-root scale travels right to left at one dot per frame, its two traces named in a gutter at the height each ends. Canvas ink is read from the theme's tokens, never hardcoded. With reduced motion it measures one frame and draws it still.

### The mark
Two drawings, never side by side. The **A-quatro** goes with the handle and sits at the head of the page, in brass, where the 4 of the wordmark would be; the letters beside it are type, Sofia Sans Condensed 700 and 500 at 1.5rem, tracked 0.05em, on the drawing's baseline. The **AS** goes with the name and signs the foot at 44px. One colour: brass on graphite, deep brass on rhodium, or the colour of the surrounding text. The plate of the icon and the avatar is graphite-800. Under 24px the heavier small cut is used, and nothing is drawn under 16px. Clear space is a quarter of the mark's height. The geometry and the usage sheet live in `brand/`.

Two lockups set a drawing beside a word, both in Sofia Sans Condensed, the face the owner chose over letters redrawn in the mark's geometry. The wordmark is the A-quatro, then LN at 700 and sz at 500, at 0.89 of the drawing's height, tracked 0.05em. The name is the AS, then Alan Sena at 600, at 0.82 of its height, centred on it, tracked 0.02em. On the page the header sets the wordmark as live type beside the inline drawing. Off the page each lockup is a file in `brand/` whose letters are the font's own outlines, in three forms: one colour (`wordmark.svg`, `name.svg`) and the two colourways (`-on-dark`, `-on-light`), where the drawing is brass and the word takes the theme's ink. Minimum height is 20px for the wordmark and 24px for the name. No other face is substituted and the letters are not redrawn.

### Motion
- **State changes:** 0.18s on background, border and colour.
- **Theme change:** instant, in one frame, with every transition held off while the new colours land. A cross-fade of the whole page cost more than it gave.
- **Press:** a tap or click shows the control's hover state at once; the release eases back over 0.18s.
- **Arrival:** the first screen settles once (opacity, and up to 20px of travel, 0.7s to 1.1s, exponential ease-out). Rows below settle as they enter the viewport (22px, 0.8s, 0.06s apart), once.
- **Loop:** the record is the only thing that loops, and it runs only while the dial or the record is on screen and the tab is visible.
- **Reduced motion:** the finished page, not a slower version of the animated one.

### Named Rules
**The Still Pointer Rule.** Hover is background, border and colour. Nothing translates, scales or tilts under the pointer, and hover styling applies only where the device can hover.

**The Measured Figure Rule.** Every figure in a readout is measured at runtime. A decorative number is not a component of this system.

## Do's and Don'ts

### Do:
- **Do** build each theme from one ramp: the graphite ramp for dark, the rhodium ramp for light, mapped onto the same roles.
- **Do** open every table and list on a 1.5px brass rule and close each row on a 1px hairline.
- **Do** fill a primary action with ink (`--fg`) and outline its partner in `--fg-muted` at 1px; both are at least 44px tall.
- **Do** keep the brass fill for Discord: one door on the first screen, one cell at the foot.
- **Do** set labels in Sofia Sans Condensed 600 at 0.8125rem, uppercase, tracked 0.16em, in `--fg-subtle`.
- **Do** set any number that changes in tabular figures.
- **Do** put an instrument in a well (`--bg-sunken`) with a 1px hairline around it.
- **Do** tell two states apart by form first: solid, dashed, hollow.
- **Do** recompute the contrast table in the token file when a tone moves; every text tone clears 4.5:1 on both the sheet and the well in both themes.
- **Do** draw a figure from data and at the width it is given, so its lettering stays the size it was set at.
- **Do** use the A-quatro with the handle and the AS with the name, the drawing in one colour, from the files in `brand/`; off the page, use the lockup files there instead of setting the lettering again.

### Don't:
- **Don't** put a pale surface in the dark theme or a dark one in the light theme.
- **Don't** bring blue into the dark theme, as a ground or as a hairline; steel is the light theme's ink only.
- **Don't** swap the graphite for a neutral grey or a pure black; it carries the brass's hue.
- **Don't** use ruby for a hover, a status, a rule or an ornament.
- **Don't** fill a control or a cell with brass unless it is the Discord door or the Discord cell.
- **Don't** write a colour outside the token file, and don't dim text with opacity.
- **Don't** add a shadow, a blur, a gradient or a rounded corner to a box.
- **Don't** put a kicker above a heading or a number beside one.
- **Don't** number a list that has no figure to point into.
- **Don't** draw a gear, a cog or a tourbillon; nothing on the sheet is a picture of a movement.
- **Don't** add a mono face; nothing on the page is code.
- **Don't** move, scale or tilt an interactive element on hover.
- **Don't** add a preloader, a smooth-scroll library, a marquee or a second looping animation.
- **Don't** use pixel lettering, pixel marks or any retro-game register.
- **Don't** redraw, outline, slant, round or recolour the mark, don't set its lettering in another face, and don't set the two drawings side by side.
- **Don't** show a number that is not measured or sourced.
