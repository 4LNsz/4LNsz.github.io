/**
 * The flags in the language list, keyed by the region in each locale's
 * `__meta.region`. They mark the variant the text is written in: the
 * Portuguese is Brazil's and the English is the United States'.
 *
 * Drawn here rather than taken from emoji, which Windows does not draw
 * at all: it prints the two letters instead. Simplified for 20×14, the
 * size they are set at; detail finer than a pixel only muddies them.
 *
 * Their colours are those countries', not the page's, and they are the
 * one place on the page a colour lives outside styles/tokens.css. They
 * appear only inside the open list, so the header itself keeps one ink.
 * A locale whose region has no drawing here simply shows none.
 */
const stripes = (n, h, fill) =>
  Array.from({ length: Math.ceil(n / 2) }, (_, i) => `<rect y="${((i * 2 * h) / n).toFixed(3)}" width="30" height="${(h / n).toFixed(3)}" fill="${fill}"/>`).join("");

export const FLAGS = {
  BR: `<svg class="lang__flag" viewBox="0 0 30 21" aria-hidden="true"><rect width="30" height="21" fill="#009c3b"/><path d="M15 2.2 27.6 10.5 15 18.8 2.4 10.5z" fill="#ffdf00"/><circle cx="15" cy="10.5" r="5.2" fill="#002776"/><path d="M9.9 9.6c3.4-.7 7.1-.2 10.1 1.6" fill="none" stroke="#fff" stroke-width=".9"/></svg>`,
  US: `<svg class="lang__flag" viewBox="0 0 30 21" aria-hidden="true"><rect width="30" height="21" fill="#fff"/>${stripes(13, 21, "#b22234")}<rect width="12" height="${((7 * 21) / 13).toFixed(3)}" fill="#3c3b6e"/></svg>`,
};
