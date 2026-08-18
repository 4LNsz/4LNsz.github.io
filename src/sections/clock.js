import { SITE } from "../config.js";
import { meta } from "../core/i18n.js";

/** Live local time, formatted with the active locale. */
export function startClock() {
  const el = document.getElementById("clock");
  if (!el) return;

  const tick = () => {
    el.textContent = new Intl.DateTimeFormat(meta().locale, {
      timeZone: SITE.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  };

  tick();
  setInterval(tick, 1000);
}
