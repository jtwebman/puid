// API / integration tests (Playwright request fixture) against the running
// SvelteKit dev server with real local D1. Replaces the old vitest-pool-workers
// suite — same coverage, one test runner.
import { test, expect, request as pwRequest } from "@playwright/test";
import { decodePuid } from "../src/lib/puid.js";

const PUID_RE = /^[0-9A-Za-z]{1,22}$/;
const uniq = () => `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

// dev-login (sets session cookie on the context) then mint an API key.
async function keyFor(ctx, email) {
  await ctx.get(`/auth/dev-login?email=${encodeURIComponent(email)}&next=/dashboard`);
  const r = await ctx.post("/api/team/keys", { data: {} });
  return (await r.json()).api_key;
}

test("unauthenticated /api/v1/ids is 401", async ({ request }) => {
  const r = await request.get("/api/v1/ids?n=3");
  expect(r.status()).toBe(401);
});

test("openapi doc is served with a runtime base url (works locally)", async ({ request }) => {
  const spec = await (await request.get("/api/openapi.json")).json();
  expect(spec.openapi).toBe("3.1.0");
  // server url is the runtime origin, not hardcoded prod — so Try-it-out works here
  expect(spec.servers[0].url).toMatch(/^http:\/\/localhost:8799\/api$/);
  expect(Object.keys(spec.paths)).toEqual(["/v1/ids", "/v1/ordinal/{puid}"]);
});

test("API key → generate unique base62 ids; ordinal decodes back", async ({ request }) => {
  const key = await keyFor(request, `api-${uniq()}@example.com`);
  const r = await request.get("/api/v1/ids?n=5", { headers: { "X-API-Key": key } });
  expect(r.status()).toBe(200);
  const body = await r.json();
  expect(body.ids).toHaveLength(5);
  for (const id of body.ids) expect(id).toMatch(PUID_RE);
  expect(new Set(body.ids).size).toBe(5);
  // confession booth matches the local inverse permutation
  const o = await (await request.get(`/api/v1/ordinal/${body.ids[0]}`, { headers: { "X-API-Key": key } })).json();
  expect(BigInt(o.ordinal)).toBe(decodePuid(body.ids[0]));
});

test("one request per second (429 on immediate retry)", async ({ request }) => {
  const key = await keyFor(request, `rate-${uniq()}@example.com`);
  const h = { headers: { "X-API-Key": key } };
  expect((await request.get("/api/v1/ids?n=1", h)).status()).toBe(200);
  expect((await request.get("/api/v1/ids?n=1", h)).status()).toBe(429);
});

test("daily quota returns 402 when exceeded", async ({ request }) => {
  await keyFor(request, `quota-${uniq()}@example.com`); // also establishes the session
  await request.get("/api/dev/seed-usage?n=1000");
  // a fresh key on the same account, then generate → over quota
  const key = (await (await request.post("/api/team/keys", { data: {} })).json()).api_key;
  const r = await request.get("/api/v1/ids?n=1", { headers: { "X-API-Key": key } });
  expect(r.status()).toBe(402);
});

test("usage events are logged per request", async ({ request }) => {
  const key = await keyFor(request, `usage-${uniq()}@example.com`);
  await request.get("/api/v1/ids?n=4", { headers: { "X-API-Key": key } });
  const usage = await (await request.get("/api/usage")).json();
  expect(usage.total).toBeGreaterThanOrEqual(4);
});

test("OAuth2 client_credentials → bearer token generates ids", async ({ request }) => {
  const reg = await (await request.post("/api/oauth/register", {
    data: { client_name: "test", redirect_uris: ["https://app.example/cb"] },
  })).json();
  const tok = await (await request.post("/api/oauth/token", {
    form: { grant_type: "client_credentials", client_id: reg.client_id, client_secret: reg.client_secret, scope: "puid:generate" },
  })).json();
  expect(tok.access_token).toMatch(/^puid_at_/);
  const r = await request.get("/api/v1/ids?n=2", { headers: { authorization: `Bearer ${tok.access_token}` } });
  expect(r.status()).toBe(200);
});

test("reusable join code: join works, rotate kills old, revoke disables", async ({ playwright, baseURL }) => {
  const owner = await pwRequest.newContext({ baseURL });
  await owner.get(`/auth/dev-login?email=owner-${uniq()}@example.com&next=/dashboard`);
  const code1 = (await (await owner.post("/api/team/join-code/rotate", { data: {} })).json()).join_code;
  expect(code1).toMatch(/^join_/);

  const bob = await pwRequest.newContext({ baseURL });
  await bob.get(`/auth/dev-login?email=bob-${uniq()}@example.com&next=/dashboard`);
  await bob.get(`/join/${code1}`); // reusable
  const bobAccts = await (await bob.get("/api/accounts")).json();
  expect(bobAccts.accounts.length).toBeGreaterThanOrEqual(2);

  const code2 = (await (await owner.post("/api/team/join-code/rotate", { data: {} })).json()).join_code;
  expect(code2).not.toBe(code1);
  const late = await pwRequest.newContext({ baseURL });
  await late.get(`/auth/dev-login?email=late-${uniq()}@example.com&next=/dashboard`);
  await late.get(`/join/${code1}`); // old code, dead
  const lateAccts = await (await late.get("/api/accounts")).json();
  expect(lateAccts.accounts.length).toBe(1);

  await owner.post("/api/team/join-code/revoke", { data: {} });
  const settings = await (await owner.get("/api/team/settings")).json();
  expect(settings.join_code).toBeFalsy();
  await owner.dispose(); await bob.dispose(); await late.dispose();
});

test("the paywall upgrade page pitches hiring the engineer", async ({ request }) => {
  const html = await (await request.get("/upgrade")).text();
  expect(html).toContain("linkedin.com/in/jtwebman");
  expect(html.toLowerCase()).toContain("hire him");
});
