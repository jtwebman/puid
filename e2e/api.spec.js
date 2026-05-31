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
  const r = await ctx.post("/dashboard/api/team/keys", { data: {} });
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
  expect(Object.keys(spec.paths)).toEqual(["/v1/ids", "/v1/ordinal/{puid}", "/v1/quota"]);
  // API key OR an OAuth2 token (third-party apps generating ids on your behalf)
  expect(Object.keys(spec.components.securitySchemes)).toEqual(["ApiKeyAuth", "OAuth2"]);
  expect(spec.components.securitySchemes.OAuth2.flows.authorizationCode.tokenUrl).toContain("localhost:8799");
});

test("/v1/ordinal requires auth", async ({ request }) => {
  const r = await request.get("/api/v1/ordinal/64qAN39GjJh5kbi4HROOxh");
  expect(r.status()).toBe(401);
});

test("/v1/quota reports usage without spending an id (API key)", async ({ request }) => {
  const key = await keyFor(request, `quotachk-${uniq()}@example.com`);
  const q = await (await request.get("/api/v1/quota", { headers: { "X-API-Key": key } })).json();
  expect(q.plan).toBe("free");
  expect(q.limit).toBe(1000);
  expect(q.remaining).toBe(1000); // nothing spent yet
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
  await request.get("/dashboard/api/dev/seed-usage?n=1000");
  // a fresh key on the same account, then generate → over quota
  const key = (await (await request.post("/dashboard/api/team/keys", { data: {} })).json()).api_key;
  const r = await request.get("/api/v1/ids?n=1", { headers: { "X-API-Key": key } });
  expect(r.status()).toBe(402);
});

test("usage events are logged per request", async ({ request }) => {
  const key = await keyFor(request, `usage-${uniq()}@example.com`);
  await request.get("/api/v1/ids?n=4", { headers: { "X-API-Key": key } });
  const usage = await (await request.get("/dashboard/api/usage")).json();
  expect(usage.total).toBeGreaterThanOrEqual(4);
});

test("API keys: create, list, and revoke (revoked key stops working)", async ({ request }) => {
  await request.get(`/auth/dev-login?email=keys-${uniq()}@example.com&next=/dashboard`);
  const k1 = await (await request.post("/dashboard/api/team/keys", { data: { label: "one" } })).json();
  await request.post("/dashboard/api/team/keys", { data: { label: "two" } });
  expect((await (await request.get("/dashboard/api/keys")).json()).keys.length).toBe(2);
  await request.post("/dashboard/api/keys/revoke", { data: { key_id: k1.id } });
  expect((await (await request.get("/dashboard/api/keys")).json()).keys.length).toBe(1);
  // the revoked key no longer authenticates
  expect((await request.get("/api/v1/ids?n=1", { headers: { "X-API-Key": k1.api_key } })).status()).toBe(401);
});

test("OAuth authorization_code: app gets delegated access; owner can see + revoke it", async ({ request }) => {
  await request.get(`/auth/dev-login?email=owner-oauth-${uniq()}@example.com&next=/dashboard`);
  const reg = await (await request.post("/api/oauth/register", { data: { client_name: "My App", redirect_uris: ["https://app.example/cb"] } })).json();
  // user approves the consent screen (PKCE, plain method for the test)
  const dec = await request.post("/oauth/decision", {
    form: { decision: "approve", client_id: reg.client_id, redirect_uri: "https://app.example/cb", scope: "puid:generate", state: "xyz", code_challenge: "secret123", code_challenge_method: "plain" },
    maxRedirects: 0,
  });
  expect(dec.status()).toBe(302);
  const code = new URL(dec.headers()["location"]).searchParams.get("code");
  const tok = await (await request.post("/api/oauth/token", { form: { grant_type: "authorization_code", code, code_verifier: "secret123", client_id: reg.client_id, redirect_uri: "https://app.example/cb" } })).json();
  expect(tok.access_token).toMatch(/^puid_at_/);
  // the app generates ids on the team's behalf
  expect((await request.get("/api/v1/ids?n=1", { headers: { authorization: `Bearer ${tok.access_token}` } })).status()).toBe(200);
  // the owner sees the grant in their dashboard
  const grants = await (await request.get("/dashboard/api/grants")).json();
  expect(grants.grants.some((g) => g.client_id === reg.client_id && g.name === "My App")).toBe(true);
  // ...and revokes it; the token immediately stops working
  await request.post("/dashboard/api/grants/revoke", { data: { client_id: reg.client_id } });
  expect((await (await request.get("/dashboard/api/grants")).json()).grants.length).toBe(0);
  expect((await request.get("/api/v1/ids?n=1", { headers: { authorization: `Bearer ${tok.access_token}` } })).status()).toBe(401);
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
  const code1 = (await (await owner.post("/dashboard/api/team/join-code/rotate", { data: {} })).json()).join_code;
  expect(code1).toMatch(/^join_/);

  const bob = await pwRequest.newContext({ baseURL });
  await bob.get(`/auth/dev-login?email=bob-${uniq()}@example.com&next=/dashboard`);
  await bob.get(`/join/${code1}`); // reusable
  const bobAccts = await (await bob.get("/dashboard/api/accounts")).json();
  expect(bobAccts.accounts.length).toBeGreaterThanOrEqual(2);

  const code2 = (await (await owner.post("/dashboard/api/team/join-code/rotate", { data: {} })).json()).join_code;
  expect(code2).not.toBe(code1);
  const late = await pwRequest.newContext({ baseURL });
  await late.get(`/auth/dev-login?email=late-${uniq()}@example.com&next=/dashboard`);
  await late.get(`/join/${code1}`); // old code, dead
  const lateAccts = await (await late.get("/dashboard/api/accounts")).json();
  expect(lateAccts.accounts.length).toBe(1);

  await owner.post("/dashboard/api/team/join-code/revoke", { data: {} });
  const settings = await (await owner.get("/dashboard/api/team/settings")).json();
  expect(settings.join_code).toBeFalsy();
  await owner.dispose(); await bob.dispose(); await late.dispose();
});

test("the paywall upgrade page pitches hiring the engineer", async ({ request }) => {
  const html = await (await request.get("/upgrade")).text();
  expect(html).toContain("linkedin.com/in/jtwebman");
  expect(html.toLowerCase()).toContain("hire him");
});
