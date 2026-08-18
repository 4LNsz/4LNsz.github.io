# 4LNsz — Portfolio

Single-page portfolio. Vanilla JS, Vite, GSAP + ScrollTrigger, Lenis.
Dark and light themes, PT/EN with automatic detection.

## Running it

```bash
npm install
npm run dev      # http://localhost:4000
```

```bash
npm run build    # -> dist/
npm run preview  # serve the build on :4001
```

## Deploying to GitHub Pages

1. Push to a repo on the `main` branch.
2. **Settings → Pages → Source → GitHub Actions**.
3. Done. `.github/workflows/deploy.yml` builds and publishes on every push.

The workflow figures out the base path on its own: a repo named
`4LNsz.github.io` serves from `/`, any other repo serves from `/<repo>/`.

## Editing

| I want to change... | File |
|---|---|
| Any text | `src/content/locales/pt.js` · `en.js` |
| Links, Discord ID, timezone | `src/config.js` |
| Colours, themes | `src/styles/tokens.css` |
| Animation timing | `src/motion/` and `MOTION` in `src/config.js` |

Adding a language: copy a file in `src/content/locales/`, translate it, set
`__meta.order`. It shows up in the switcher by itself.

See `CLAUDE.md` for the conventions this codebase enforces.
