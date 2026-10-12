import { defineConfig } from "vite";
import { SITE } from "./src/config.js";
import { channelCell } from "./src/sections/contact.js";

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

/**
 * The card the page shows when its script never runs.
 *
 * Every word on the page is put there by the bundle, so a visitor whose
 * bundle fails to arrive, or who has scripting off, would get a header
 * and nothing else. This writes a small static stand-in into index.html
 * at build time: the name, the channels, and the CV in each language.
 * It holds no prose, only what src/config.js already publishes, so it
 * needs no locale and cannot say anything the page does not. The CSS
 * that decides when it shows is at the foot of styles/base.css.
 *
 * It is generated rather than typed into index.html so the channels
 * have one source: add one to config.js and it is on the card.
 */
function staticCard() {
  const cells = [
    ...SITE.channels.filter((c) => c.featured),
    // The CV sits straight after the featured channel: the page serves
    // two audiences at equal weight, and these are their two doors.
    ...SITE.cv.map((c) => ({ label: "CV", value: c.label, url: `${BASE}${c.file}` })),
    ...SITE.channels.filter((c) => !c.featured),
  ].map((c) => channelCell(c, { note: false }));

  const card = `<section class="fallback" aria-labelledby="fallback-h">
  <div class="wrap sec">
    <h1 class="hero-name" id="fallback-h">${SITE.name}</h1>
    <div class="channels">${cells.join("")}
    </div>
  </div>
</section>`;

  return {
    name: "static-card",
    transformIndexHtml: (html) => html.replace("<!-- __STATIC_CARD__ -->", card),
  };
}

export default defineConfig({
  base: BASE,
  plugins: [siteUrlTokens(), staticCard()],
  server: { port: 4000, open: true },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    target: "es2020",
  },
});
