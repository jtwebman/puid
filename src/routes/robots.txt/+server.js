export const prerender = false;

export function GET({ url, platform }) {
  const base = (platform?.env?.PUID_BASE_URL || url.origin).replace(/\/$/, "");
  const body =
    `User-agent: *\n` +
    `Allow: /\n` +
    `Disallow: /dashboard\n` +
    `Disallow: /api/\n` +
    `Disallow: /dashboard/api/\n` +
    `Disallow: /auth/\n` +
    `Disallow: /oauth/\n` +
    `Disallow: /join/\n` +
    `\n` +
    `Sitemap: ${base}/sitemap.xml\n`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
