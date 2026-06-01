import { messagesFor, LOCALES } from "$lib/i18n";

// Provide the active locale + its merged messages to every page. SSR per request
// (no prerender) so ?lang / Accept-Language take effect at runtime.
export const prerender = false;

export function load({ locals, platform }) {
  const locale = locals.locale || "en";
  const env = platform?.env ?? {};
  // Which social-login providers actually have credentials configured, so the
  // UI only shows buttons that work.
  const providers = { google: !!env.GOOGLE_CLIENT_ID, microsoft: !!env.MICROSOFT_CLIENT_ID };
  return {
    locale,
    dir: LOCALES[locale]?.dir || "ltr",
    m: messagesFor(locale),
    locales: LOCALES,
    providers,
  };
}
