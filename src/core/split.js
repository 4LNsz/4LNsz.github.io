/**
 * Minimal text splitting. Replaces GSAP SplitText so the bundle carries
 * one less dependency; swap it in if you ever need line-level masking.
 *
 * The original string is cached on data-raw, so re-splitting after a
 * language switch is idempotent.
 *
 * There was also a splitWords() here, used only by the section 01
 * manifesto's scrubbed word-by-word reveal. That section is now an
 * attribute table with no prose to scrub, so the function went with it.
 */

/**
 * Chars, grouped into words.
 *
 * The grouping is what makes the result wrappable. Splitting straight
 * into a flat run of <span class="ch"> put no whitespace anywhere in the
 * element, and a line break can only happen at whitespace — so the
 * headline became one unbreakable box as wide as its longest phrase.
 * On a 375px screen "VAMOS CONVERSAR" ran off the side of the page
 * instead of wrapping onto two lines. (Spaces were emitted as U+00A0,
 * which is a non-breaking space, so they were not opportunities either.)
 *
 * Words are separated by real text nodes; .ch is untouched, so every
 * existing stagger still targets the same set in the same order.
 */
export function splitChars(el) {
  const raw = el.dataset.raw ?? (el.dataset.raw = el.textContent.trim());
  el.innerHTML = "";

  raw.split(/\s+/).forEach((word, i) => {
    if (i) el.appendChild(document.createTextNode(" "));

    const wrap = document.createElement("span");
    wrap.className = "wd";
    for (const c of word) {
      const span = document.createElement("span");
      span.className = "ch";
      span.textContent = c;
      wrap.appendChild(span);
    }
    el.appendChild(wrap);
  });

  return el.querySelectorAll(".ch");
}

/** Re-split everything after the text has changed. */
export function resplitAll() {
  document.querySelectorAll("[data-chars]").forEach((el) => {
    delete el.dataset.raw;
    splitChars(el);
  });
}
