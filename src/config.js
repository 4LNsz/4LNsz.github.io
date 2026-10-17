/**
 * Everything about *you* that isn't prose lives here.
 * Prose lives in src/content/locales/*.js
 */

const DISCORD_ID = "151555791608872961";
const EMAIL = "alansoaressobral@gmail.com";
const GITHUB = "https://github.com/4LNsz";

export const SITE = {
  name: "Alan Sena",
  handle: "4LNsz",

  /**
   * Where a fact on the page can be checked. Rows in the locale files
   * carry `src: ["cv", "gh"]`; sections/source.js turns each key into a
   * link. "cv" resolves to the PDF for the active language, so it has
   * no URL here.
   */
  github: GITHUB,

  /** IANA timezone driving the live clock in the hero. */
  timezone: "America/Recife",

  /**
   * Every way to reach you, rendered as one grid in section 05, in this
   * order. Discord and email lead because they are the ones answered.
   *
   * `value` is what the card shows. The Discord ID is deliberately NOT
   * shown — it is an opaque 18-digit number that means nothing to a
   * reader; the link carries it instead.
   *
   * `mono` sets the value a size down, for values that are long or
   * machine-ish (an address rather than a name). The name is a leftover:
   * the page has no mono face.
   */
  channels: [
    {
      label: "Discord",
      /**
       * [AL, 2026-10-16] Alan's own username. It stayed off the page
       * until he gave it: an earlier version printed "4LNsz", inferred
       * from the brand name, and nothing showed it was his. It is what a
       * visitor types into their own app to add him, which matters when
       * the handoff below cannot open the app for them. The ID is never
       * printed; it rides in the link.
       */
      value: "@4lnsz",
      url: `https://discord.com/users/${DISCORD_ID}`,
      /**
       * Optional. A custom scheme the desktop client registers with the
       * OS, so the card opens the app instead of a browser tab for
       * anyone who has it installed.
       *
       * It is NOT the href — `url` stays the https one. core/applink.js
       * tries this first and falls back to `url`, and the long comment
       * at the top of that file is the argument for why round that way
       * and not the other. Short version: a scheme with no handler
       * registered is a dead click, and this is the channel the whole
       * section points at.
       */
      app: `discord://-/users/${DISCORD_ID}`,
      /** Exactly one channel may be featured — it spans the whole grid. */
      featured: true,
    },
    {
      label: "E-mail",
      value: EMAIL,
      url: `mailto:${EMAIL}`,
      mono: true,
      external: false,
    },
    { label: "GitHub", value: "@4LNsz", url: GITHUB },
    { label: "LinkedIn", value: "in/4lnsz", url: "https://www.linkedin.com/in/4lnsz/" },
    { label: "Instagram", value: "@4LNsz", url: "https://instagram.com/4LNsz" },
    { label: "X", value: "@4LNsz", url: "https://x.com/4LNsz" },
  ],

  /**
   * CV downloads. `file` is a name inside public/, resolved against
   * import.meta.env.BASE_URL at render time — a root-relative href would
   * 404 on a project-page deploy served from /<repo>/.
   *
   * `code` matches a locale __meta.code so the renderer can mark the one
   * matching the active language.
   */
  /**
   * The portrait in Perfil. None yet: Alan is to supply a photograph.
   * Put the file in public/ and set { file, width, height } here, with
   * the file's real pixel size, so the page reserves its box before it
   * loads. sections/profile.js draws nothing while this is null.
   */
  photo: null,

  cv: [
    { code: "PT", label: "Português", file: "cv-alan-sena-pt-br.pdf" },
    { code: "EN", label: "English", file: "cv-alan-sena-en.pdf" },
  ],
};

export const THEME = {
  default: "dark",
  /**
   * Paints the browser chrome (Android address bar, iOS PWA status bar).
   * Must match --bg for each theme: --graphite-900 and --rhodium-100 in
   * src/styles/tokens.css. The <meta name="theme-color"> in index.html
   * carries the dark value for first paint, before this runs.
   */
  browserColor: { dark: "#18150f", light: "#e6e9ef" },
};
