// PUID client (Node 18+, ESM). Auth: process.env.PUID_API_KEY.
const BASE = "https://puid.dev/api";
const hdr = (key) => ({ "X-API-Key": key || process.env.PUID_API_KEY || "" });

export async function generate(n = 1, key) {
  if (!Number.isInteger(n) || n < 1 || n > 10) throw new Error("n must be 1..10");
  const r = await fetch(`${BASE}/v1/ids?n=${n}`, { headers: hdr(key) });
  if (r.status === 429) throw new Error("Rate limited. One per second. As intended.");
  if (!r.ok) throw new Error("PUID error " + r.status);
  return (await r.json()).ids;
}
export async function ordinal(puid, key) {
  const r = await fetch(`${BASE}/v1/ordinal/${encodeURIComponent(puid)}`, { headers: hdr(key) });
  return BigInt((await r.json()).ordinal);
}
