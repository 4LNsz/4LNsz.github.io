---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: the portfolio page

Scope and mode: the whole single page (`index.html`). Experience.

Audience and job: two audiences at equal weight, people hiring for a
role and people hiring for a project. Both need evidence fast and one
of two exits: Discord for a project, the CV for a role.

Content: the locale files, unchanged in fact. One fact moves: "building
since 2018, professionally since 2022" leaves Perfil and labels the
dashed run in the Trajetória diagram. Kickers, the marquee and the
per-section numbers are gone.

Constraints: PRODUCT.md. Both themes. Nothing 8-bit. No preloader, no
smooth-scroll library. The page has to stay cheap to run.

Chosen direction: Folha de Calibre, with the career diagram from
Gráfico Horário in Trajetória (Alan, 2026-10-11). Mark: A-quatro, the
isotype that also stands in for the 4 of the wordmark, and AS
encaixado, the rubric that goes with the name.

Memorable moment: the dial. One lap of the ring is one 16.7 ms frame,
and the ruby arc is the tick the visitor's own browser just paid.

Critique reference (a code-led build has no approved comp): the coded
decision comps under `.impeccable/mocks/decision/`: `calibre-page.png`,
`calibre-page-light.png`, `calibre-sec.png`, `dossie-calibre.png`,
`horario-sec.png` for the career diagram, `marca-refino.png`.

Unresolved, and Alan's to decide: whether the source links on rows stay
once he has lived with them.

Resolved by Alan on 2026-10-12: `hero.status` ("Disponível para
projetos") is removed. It predated this build, carried no source and
spoke to one of the two audiences only; he had it taken out because it
reads as AI-written. The `[?]` marker it was the only holder of went
with it.

Resolved by Alan on 2026-10-12: the dark ground is graphite, not blued
steel. He saw the page in both, beside the Base preview the graphite
comes from (`.impeccable/mocks/grafite/azul-ou-grafite.png`), and chose
it. Steel in the hairlines was shown in the same mock and not taken up.

Resolved by Alan on 2026-10-11: the three faces are served from the
site, out of font files in the repository; and the lettering of the two
lockups is Sofia Sans Condensed, chosen over a redraw in the mark's own
geometry when the two were put side by side
(`.impeccable/mocks/lettering/lettering.png`). Both lockups ship as
files with that lettering outlined.

## Direction contract

THESIS: The engineer presented as a movement's calibre sheet: what
runs under the case-back, regulated and measured. It refuses the dark
developer portfolio with one neon accent and a fake terminal, and it
refuses that page's editorial-serif opposite.

OWN-WORLD: Graphite born from the brass is the whole ground in dark
(blued steel when the page was built; Alan changed it on 2026-10-12 to
the graphite of his Base design system); a rhodium sheet with steel ink
in light. Brass draws rules, numerals and the one
action. Ruby is only ever what is being measured. Condensed grotesque
capitals for titles and labels, a scientific serif for prose. Hairline
tables, numbered callouts on leader lines, a graduated ring, dotted
traces. No gears, no cards.

STORY: The visitor watches a system being stepped and timed in their
own browser, reads who built it, believes the claim because the figure
answers to load, and leaves by one of two doors.

FIRST VIEWPORT: Name top-left at display size, role, specialty and
focus under it. The dial centred at about half the viewport height, four numbered
callouts on leaders to either side. Statement lower-left. Base, local
time and the two doors lower-right, the project door filled brass. The
tick record runs full width along the bottom, readout and load control
at its right end.

SIGNATURE INTERACTION: Adding load, by the button or by pressing the
dial, lengthens the ruby arc and steps the record up, then it settles.
The run is seeded, so the same seed draws the same field. State is
carried by form (solid, dashed, hollow), never by hue alone. Motion
grammar: the record travels right to left one dot per frame; nothing
else on the page loops.

FORM: Folha de Calibre, position 4 of 7 on the first ordered list; seed
key d225efaa. Raised by: load by hand and a seeded run (rain garden),
state by form (emission rail), one colour per theme (darkroom), two
doors (one-sheet), a source one touch away (seed rack). Borrowed
structure: the career diagram from Gráfico Horário, re-roll 2, set in
this world's ink.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
