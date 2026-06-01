import { LOCALES } from "$lib/i18n";

// Public, indexable content pages (the app/auth surfaces are excluded).
const PAGES = ["", "docs", "why", "upgrade", "terms", "privacy"];

export const prerender = false;

const base = (url, platform) => (platform?.env?.PUID_BASE_URL || url.origin).replace(/\/$/, "");
// Localized URL: English is canonical (no query); others use ?lang=<code>.
const pageUrl = (root, page, code) =>
  `${root}/${page}${code === "en" ? "" : (page ? "?" : "?") + "lang=" + code}`;

export function GET({ url, platform }) {
  const root = base(url, platform);
  const codes = Object.keys(LOCALES);
  const entries = [];
  for (const page of PAGES) {
    for (const code of codes) {
      const alternates = codes
        .map(
          (c) =>
            `    <xhtml:link rel="alternate" hreflang="${c}" href="${pageUrl(root, page, c)}"/>`,
        )
        .join("\n");
      entries.push(
        `  <url>\n` +
          `    <loc>${pageUrl(root, page, code)}</loc>\n` +
          alternates +
          "\n" +
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(root, page, "en")}"/>\n` +
          `  </url>`,
      );
    }
  }
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    entries.join("\n") +
    `\n</urlset>\n`;
  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "max-age=3600" },
  });
}
