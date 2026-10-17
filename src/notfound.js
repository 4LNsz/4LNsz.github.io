import { applyI18n, t } from "./core/i18n.js";

/**
 * The 404 page. The address asked for does not exist; the page says so
 * in the visitor's language, picked the way the home page picks it, and
 * points home. It loads none of the home page's motion or simulation.
 */
applyI18n();
document.title = `${t("notFound.title")} — Alan Sena`;

// Home is the base path, which on a project page is not "/". The
// links say "/" in the markup so they work with no script at all.
for (const a of document.querySelectorAll('a[href="/"]')) a.href = import.meta.env.BASE_URL;
