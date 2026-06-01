// hooks.server.js — every request passes through here.
//   • /api, /dashboard/api, /auth, /oauth, /join → delegated to the router (Response)
//   • everything else                            → SvelteKit pages, <html lang/dir> per locale
import { handle as routerHandle } from "$lib/server/router.js";
import { pickLocale, LOCALES } from "$lib/i18n";

const SERVER_ROUTE = /^\/(api|dashboard\/api|auth|oauth|join)(\/|$)/;

export async function handle({ event, resolve }) {
  const url = event.url;
  const env = event.platform?.env ?? {};

  if (SERVER_ROUTE.test(url.pathname)) {
    const res = await routerHandle(event.request, env, url);
    if (res) return res;
  }

  const { locale, persist } = pickLocale(event.request, url);
  event.locals.locale = locale;
  const res = await resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace("%lang%", locale).replace("%dir%", LOCALES[locale]?.dir || "ltr"),
  });
  if (persist)
    res.headers.append("set-cookie", `lang=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`);
  return res;
}
