/**
 * Locale registry — fully automatic.
 *
 * To add a language: drop a new file in ./locales/ (copy an existing one),
 * set its __meta.order, and it appears in the switcher. No code changes.
 */
const modules = import.meta.glob("./locales/*.js", { eager: true });

export const CONTENT = Object.fromEntries(
  Object.entries(modules)
    .map(([path, mod]) => [path.match(/\/([^/]+)\.js$/)[1], mod.default])
    .sort((a, b) => (a[1].__meta.order ?? 99) - (b[1].__meta.order ?? 99))
);

export const LANGS = Object.keys(CONTENT);
export const DEFAULT_LANG = LANGS[0];
