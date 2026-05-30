import { messagesFor, LOCALES } from "$lib/i18n";

// Provide the active locale + its merged messages to every page. SSR per request
// (no prerender) so ?lang / Accept-Language take effect at runtime.
export const prerender = false;

export function load({ locals }) {
  const locale = locals.locale || "en";
  return { locale, dir: LOCALES[locale]?.dir || "ltr", m: messagesFor(locale), locales: LOCALES };
}
