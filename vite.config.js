import { defineConfig } from "vite";

/**
 * BASE_PATH is injected by the GitHub Actions workflow.
 *   repo named `4LNsz.github.io`  -> "/"
 *   any other repo name          -> "/<repo-name>/"
 * Locally it stays "/".
 */
/* Normalised to a trailing slash: actions/configure-pages reports
   base_path as "/repo" (no slash), and Vite resolves asset URLs against
   base by concatenation — "/repoassets/…" without it. */
const BASE = (process.env.BASE_PATH || "/").replace(/\/?$/, "/");

/**
 * SITE_URL is the absolute origin+path the site is served from. It only
 * matters for the tags that cannot be relative — canonical, og:url and
 * og:image are fetched by crawlers with no page context, so a root-
 * relative path in them resolves against the wrong host.
 *
 * The workflow passes the real Pages URL. The fallback covers local
 * builds and keeps the tags well-formed rather than empty.
 */
const SITE_URL = (process.env.SITE_URL ?? "https://4lnsz.github.io/").replace(/\/?$/, "/");

/** Substitutes __SITE_URL__ in index.html. Vite rewrites href/src for
 *  the configured base, but never touches <meta content>. */
function siteUrlTokens() {
  return {
    name: "site-url-tokens",
    transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", SITE_URL),
  };
}

export default defineConfig({
  base: BASE,
  plugins: [siteUrlTokens()],
  server: { port: 4000, open: true },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    target: "es2020",
  },
});
