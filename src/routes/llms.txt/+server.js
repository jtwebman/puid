import { LOCALES } from "$lib/i18n";

// llms.txt — the emerging convention (llmstxt.org) for helping AI/LLMs discover
// and understand a site. Markdown, served at /llms.txt.
export const prerender = false;

export function GET({ url, platform }) {
  const base = (platform?.env?.PUID_BASE_URL || url.origin).replace(/\/$/, "");
  const langs = Object.keys(LOCALES).join(", ");
  const body = `# PUID — Probably Unique IDentifier

> A joke API that returns provably-collision-free identifiers: a sequential counter run through a 128-bit bijection, so it looks random but can never collide (better than a random UUID, which is only probabilistic). Two endpoints, rate limited to one request per second. Please do not use it in production.

## Pages
- [Home](${base}/): what PUID is, the over-engineering, and pricing
- [Why](${base}/why): how it actually works — the joke explained honestly
- [API Docs](${base}/docs): interactive OpenAPI (Swagger) docs
- [Upgrade](${base}/upgrade): plans (Hobby, Professional, Enterprise)
- [Terms](${base}/terms): terms of service
- [Privacy](${base}/privacy): privacy policy (GDPR + CCPA aware)

## API
- [OpenAPI spec (JSON)](${base}/api/openapi.json)
- [OpenAPI spec (YAML)](${base}/api/openapi.yaml)
- \`GET /api/v1/ids?n=1..10\` — generate ids (X-API-Key)
- \`GET /api/v1/ordinal/{puid}\` — decode an id back to its ordinal
- \`GET /api/v1/quota\` — check remaining daily quota

## Notes
- The site is available in 20 languages via the \`?lang=<code>\` query parameter: ${langs}.
- Source: https://github.com/jtwebman/puid
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
