import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
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

/**
 * Gives each icon a URL that changes when the icon does.
 *
 * A browser keeps tab icons in a store of its own, keyed by URL, and a
 * reload does not ask for them again, not even a forced one. The mark
 * replaced a teal 4 that had lived at /favicon.svg, the server sent the
 * new file from the first request, and the old one stayed in the tab of
 * everyone who had been here before, Alan included.
 *
 * So the link carries the first eight digits of the file's own hash as
 * a query. A static host ignores the query and serves the same file;
 * the browser sees an address it has never fetched. The files keep
 * their well-known names in public/, which is where brand/src/build.mjs
 * writes one of them and where iOS looks for the other unasked.
 */
function iconVersions() {
  const icons = ["favicon.svg", "apple-touch-icon.png"];
  const stamp = (file) => createHash("sha1").update(readFileSync(new URL(`./public/${file}`, import.meta.url))).digest("hex").slice(0, 8);
  return {
    name: "icon-versions",
    transformIndexHtml: (html) => icons.reduce((out, file) => out.replaceAll(`${file}"`, `${file}?v=${stamp(file)}"`), html),
  };
}

/**
 * Who the page is about, for search engines: a schema.org Person in the
 * head, read from config.js like the static card, so a search for the
 * name can be tied to this page and to the profiles that are his. The
 * title is the CV's, in English, the language these records are read
 * in. Nothing here is shown on the page.
 */
function personData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    alternateName: SITE.handle,
    url: SITE_URL,
    jobTitle: "Software Engineer", // [CV]
    sameAs: SITE.channels.filter((c) => !c.featured && c.url.startsWith("https://")).map((c) => c.url),
  };
  return {
    name: "person-data",
    // The home page only: the 404 page is not about anyone.
    transformIndexHtml: (html, ctx) =>
      ctx.path.endsWith("index.html") || ctx.path === "/" ? html.replace("</head>", `<script type="application/ld+json">${JSON.stringify(data)}</script>\n</head>`) : html,
  };
}

export default defineConfig({
  base: BASE,
  plugins: [siteUrlTokens(), staticCard(), iconVersions(), personData()],
  server: { port: 4000, open: true },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    target: "es2020",
    // Two pages: the portfolio, and the 404 GitHub Pages serves for an
    // address that does not exist. They share the stylesheet.
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        notFound: fileURLToPath(new URL("./404.html", import.meta.url)),
      },
    },
  },
});
