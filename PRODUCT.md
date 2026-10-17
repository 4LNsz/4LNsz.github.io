# Product

<!-- impeccable:product-schema 1 -->

Source markers, same as `src/content/locales/*.js`: `[CV]` LinkedIn CV
export, `[GH]` github.com/4LNsz, `[AL]` stated directly by Alan,
`[REPO]` observed in this codebase and not separately confirmed.

## Platform

web

## Users

Two audiences at equal weight `[AL, 2026-10-11]`. The page may not pick
a side.

- **People hiring for a role** — recruiters and tech leads.
- **People hiring for a project** — server owners, studios and companies
  looking for back-end and performance work.

How each one arrives and how long they stay is not established. Do not
write it down as fact.

## Product Purpose

Two things that share one identity.

1. **The portfolio** — a single page presenting Alan (handle `4LNsz`),
   a back-end software engineer, to both audiences above. The page is
   built to end in contact: Contato lists every channel, with Discord
   featured as the primary one, and Trajetória offers the CV in PT and
   EN `[REPO]`.
2. **The personal brand** — a mark (logo and/or isotype) that signs his
   work outside the portfolio `[AL, 2026-10-11]`.

## Positioning

The CV headline, verbatim: "Lua Specialist | High-Performance Systems &
Scalability | Back-end Optimization" `[CV]`.

The mechanism a neighbouring portfolio could not copy: the hero runs a
real simulation and reports what stepping it costs, measured at runtime.
The page demonstrates performance instead of claiming it `[REPO]`.

## Operating Context

- Static build on GitHub Pages at https://4lnsz.github.io/ `[REPO]`.
- PT and EN, detected automatically; dark and light themes `[REPO]`.
- Where the brand has to work beyond this page `[AL, 2026-10-11]`:
  - avatars and profiles — GitHub, Discord, LinkedIn, X;
  - inside his own resources — a credit in NUI/HUD, a loading screen,
    the boot print in a server console;
  - repositories and docs — README covers, social banners;
  - products for sale — as a seal of authorship.

## Capabilities and Constraints

- Vanilla JS, Vite, GSAP + ScrollTrigger. npm only. No preloader and no
  smooth-scroll library — both were removed at Alan's request.
- **Every fact traces to `[CV]`, `[GH]` or `[AL]`.** Nothing is inferred
  to fill a layout. This has gone wrong three times; see CLAUDE.md.
- Atuação describes capability domains, not projects. The underlying
  work is under NDA: no client, server or repository names.
- FiveM / roleplay may be named as one context, never as the scope.
  In his words: he works in FiveM today, but the page presents a
  developer in general `[AL, 2026-10-11]`.
- The Discord ID is never printed on the page. His username is printed,
  `@4lnsz` `[AL, 2026-10-16]`, so that a visitor can add him from their
  own app.
- **No availability line** `[AL, 2026-10-12]`. "Disponível para
  projetos" was inherited from the previous page and removed at his
  request: to him it reads as AI-written. Nothing of that family comes
  back.
- **No process or pricing section** `[AL, 2026-10-16]`. How a project
  runs and the ways to hire him were proposed from two company sites
  and dropped: on a person's page they read as an agency's menu, and
  they are a subject for the conversation, not the page.
- A fact appears in one section only.
- Every number on the hero readout is measured at runtime. None may
  become decorative.

Undecided, and not to be invented:

- numeric scale claims (users, servers, percentages);
- a public project for Atuação;
- a photo. The slot exists (`photo` in config.js, empty) and he has
  agreed to supply one; it has to be a photograph, not a generated
  portrait;

- a timeline entry for 2018–2022;
- the name and address products are sold under. No store exists today;
  it is a plan `[AL, 2026-10-11]`. The mark has to be ready for it
  without a store name being assumed.

## Brand Commitments

- Name **Alan**, handle **4LNsz**. `4LN` is read as ALAN, with 4 for A —
  Claude's reading, put to Alan and not corrected.
- **`sz` means nothing** `[AL, 2026-10-11]`. It is pure form. Do not
  build a meaning into it.
- **His rubric is `AS`** `[AL, 2026-10-11]` — the initials he signs
  with. The handle and the rubric are two names for one person; a mark
  may be built on either.
- **Nothing 8-bit** `[AL, 2026-10-11]`: no pixel lettering, no pixel
  marks, no retro-game register.
- **Assets from the Base design system may be reused** `[AL,
  2026-10-11]` — typefaces, patterns, rules. It lives at
  `F:/FiveM/projetos/base` (DESIGN.md, v3 "Bandeira": Big Shoulders
  and Public Sans, flat fields, 45° and 90° only, state by fill).
  Permission, not obligation.
- **A theme never mixes ramps** `[AL]`: no light surfaces in dark mode.
- **The identity is brass, the graphite born from it, and steel** `[AL,
  2026-10-12]`. The dark ground was blued steel when the page was
  built; he replaced it with the graphite of his Base design system
  after seeing the two, so that both carry one identity. Steel stays as
  the second colour: the ink of the light theme here, the division of
  the flag there.
- Sentences in his voice are his own, taken from the CV. None is written
  for him.
- **The mark is two drawings** `[AL, 2026-10-11]`, both chosen by Alan
  from drawn options. The **A-quatro** is an A whose right leg stands
  upright, so that it is a 4 as well; it goes with the handle. **AS
  encaixado** is the A-quatro with an S whose open side takes the 4's
  bar; it goes with the name. One colour, 45° and 90° only. `brand/`
  holds both as files, with the avatar, the icon, the seal, the console
  print and the usage sheet `[REPO]`. The lettering beside the mark in
  the two lockups (LNsz, Alan Sena) is Sofia Sans Condensed. Shown that
  beside a version redrawn in the mark's own geometry, he chose the
  type `[AL, 2026-10-11]`; both lockups ship as files with the letters
  outlined `[REPO]`.
- **The fonts are served from his own site** `[AL, 2026-10-11]`: he
  approved bringing the font files into the repository. No font host.

## Evidence on Hand

- `public/cv-alan-sena-pt-br.pdf`, `public/cv-alan-sena-en.pdf`.
- github.com/4LNsz.
- `src/content/locales/pt.js` and `en.js`, every line source-marked.
- `src/motion/field.js` — the live simulation and its measured readout.

Absent, and not to be fabricated: client names, public case studies,
scale figures, testimonials, a portrait, press.

## Product Principles

1. **Evidence, not claims.** A portfolio is what someone is asked about
   in an interview; an invented line is a question he cannot answer.
2. **The page is the proof.** A slow or wasteful page argues against a
   performance engineer.
3. **Said once.** One fact, one place.
4. **Capability over client.** Domains, never systems under NDA.
5. **The mark signs work it does not control.** It has to survive at
   16px, in one colour, on someone else's background.

## Accessibility & Inclusion

- Text at WCAG AA or better in both themes `[REPO]`; re-measure when a
  tone changes.
- `prefers-reduced-motion` is honoured; the simulation draws one frame
  and never starts a loop.
- Focus moves with every in-page jump. Interactive targets are 44px or
  larger.
