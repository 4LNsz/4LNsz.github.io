/**
 * Everything about *you* that isn't prose lives here.
 * Prose lives in src/content/locales/*.js
 */

const DISCORD_ID = "151555791608872961";
const EMAIL = "alansoaressobral@gmail.com";

export const SITE = {
  name: "Alan",
  handle: "4LNsz",

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
   * `mono` renders the value in the mono face at a smaller size, for
   * values that are long or machine-ish (an address rather than a name).
   */
  channels: [
    {
      label: "Discord",
      /**
       * No `value` on purpose. The card previously showed "4LNsz" as the
       * Discord handle, which was inferred from the site's brand name —
       * the actual username appears in neither the CV nor the GitHub
       * profile, and the ID is not something a reader can use. The card
       * links straight to the profile instead of claiming a handle.
       * Add `value: "<username>"` here to show one.
       */
      url: `https://discord.com/users/${DISCORD_ID}`,
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
    { label: "GitHub", value: "@4LNsz", url: "https://github.com/4LNsz" },
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
  cv: [
    { code: "PT", label: "Português", file: "cv-alan-sena-pt-br.pdf" },
    { code: "EN", label: "English", file: "cv-alan-sena-en.pdf" },
  ],
};

export const THEME = {
  default: "dark",
  /**
   * Paints the browser chrome (Android address bar, iOS PWA status bar).
   * Must match --bg for each theme: --ink-900 and --paper-100 in
   * src/styles/tokens.css. The <meta name="theme-color"> in index.html
   * carries the dark value for first paint, before this runs.
   */
  browserColor: { dark: "#0a1413", light: "#f3f0e8" },
};

export const MOTION = {
  lenis: { lerp: 0.085, wheelMultiplier: 1, smoothWheel: true },
  marqueeSecs: 26,
};
