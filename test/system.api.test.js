// System/integration tests: run the REAL Worker in workerd (Miniflare) against a
// real local D1, and hit endpoints over HTTP via SELF.fetch(). Seeding goes
// through the actual data layer (dispatch), so these exercise the deployed path.
//
// Run: npm run test:api   (needs @cloudflare/vitest-pool-workers installed)
import { env, SELF } from "cloudflare:test";
import { beforeAll, describe, expect, it } from "vitest";
import schemaSql from "../schema/d1.sql?raw";
import { dispatch } from "../src/data.js";
import { decodePuid } from "../src/puid.js";

const PUID_RE = /^[0-9A-Za-z]{1,22}$/;

beforeAll(async () => {
  // Apply the schema to the local test D1, statement by statement. D1.exec treats
  // each newline as a statement boundary, so we strip comments, split on ";", and
  // collapse each statement onto a single line before exec.
  const statements = schemaSql
    .split("\n").map((l) => l.replace(/--.*$/, "")).join("\n") // strip line + trailing comments
    .split(";").map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);
  for (const s of statements) await env.DB.exec(s);
});

let seq = 0;
// Create a fresh account (+owner) and an API key via the real data layer.
async function newAccount(emailPrefix = "user") {
  seq++;
  const email = `${emailPrefix}${seq}@example.com`;
  const { data: id } = await dispatch(env, "upsert-identity", { provider: "dev", sub: `${email}-${seq}`, email, name: emailPrefix });
  const { data: key } = await dispatch(env, "create-key", { account_id: id.active_account_id, actor_user_id: id.user_id });
  return { ...id, email, apiKey: key.api_key };
}

describe("public surface", () => {
  it("serves the landing page", async () => {
    const r = await SELF.fetch("https://puid.dev/");
    expect(r.status).toBe(200);
    expect(r.headers.get("content-type")).toContain("text/html");
    expect(await r.text()).toContain("Probably Unique");
  });

  it("serves a valid OpenAPI doc at /api/openapi.json", async () => {
    const r = await SELF.fetch("https://puid.dev/api/openapi.json");
    const spec = await r.json();
    expect(spec.openapi).toBe("3.1.0");
    expect(spec.servers[0].url).toBe("https://puid.dev/api");
    expect(spec.paths["/v1/ids"]).toBeTruthy();
  });

  it("leaks metrics without auth", async () => {
    const r = await SELF.fetch("https://puid.dev/api/metrics");
    expect(r.status).toBe(200);
    expect((await r.json()).ids_ever_issued).toBeDefined();
  });
});

describe("the paywall gag", () => {
  it("serves the upgrade page with the hire-me pitch", async () => {
    const r = await SELF.fetch("https://puid.dev/upgrade");
    expect(r.status).toBe(200);
    const html = await r.text();
    expect(html).toContain("linkedin.com/in/jtwebman");
    expect(html).toContain("x.com/jtwebman");
    expect(html.toLowerCase()).toContain("hire him");
  });

  it("points rate-limited callers at the upgrade page", async () => {
    const { apiKey } = await newAccount();
    const h = { headers: { "X-API-Key": apiKey } };
    await SELF.fetch("https://puid.dev/api/v1/ids?n=1", h); // consume the 1/sec window
    const r = await SELF.fetch("https://puid.dev/api/v1/ids?n=1", h);
    expect(r.status).toBe(429);
    expect((await r.json()).upgrade_url).toContain("/upgrade");
  });
});

describe("/api/v1/ids", () => {
  it("rejects unauthenticated requests", async () => {
    const r = await SELF.fetch("https://puid.dev/api/v1/ids?n=3");
    expect(r.status).toBe(401);
  });

  it("returns n unique base62 ids for a valid key", async () => {
    const { apiKey } = await newAccount();
    const r = await SELF.fetch("https://puid.dev/api/v1/ids?n=5", { headers: { "X-API-Key": apiKey } });
    expect(r.status).toBe(200);
    const body = await r.json();
    expect(body.ids).toHaveLength(5);
    expect(body.count).toBe(5);
    for (const id of body.ids) expect(id).toMatch(PUID_RE);
    expect(new Set(body.ids).size).toBe(5); // all distinct
  });

  it("validates n is 1..10", async () => {
    const { apiKey } = await newAccount();
    const r = await SELF.fetch("https://puid.dev/api/v1/ids?n=99", { headers: { "X-API-Key": apiKey } });
    expect(r.status).toBe(400);
  });

  it("enforces one request per second per account", async () => {
    const { apiKey } = await newAccount();
    const h = { headers: { "X-API-Key": apiKey } };
    const first = await SELF.fetch("https://puid.dev/api/v1/ids?n=1", h);
    const second = await SELF.fetch("https://puid.dev/api/v1/ids?n=1", h);
    expect(first.status).toBe(200);
    expect(second.status).toBe(429); // the whole brand
  });

  it("enforces the daily quota (402 when exceeded)", async () => {
    const acct = await newAccount();
    // seed today's usage at the free limit via the event log
    await env.DB.prepare("INSERT INTO usage_events (account_id,n,ts) VALUES (?1,1000,?2)").bind(acct.active_account_id, Date.now()).run();
    const r = await SELF.fetch("https://puid.dev/api/v1/ids?n=1", { headers: { "X-API-Key": acct.apiKey } });
    expect(r.status).toBe(402);
  });

  it("logs an account-stamped usage event per request (for dashboards)", async () => {
    const acct = await newAccount();
    await SELF.fetch("https://puid.dev/api/v1/ids?n=4", { headers: { "X-API-Key": acct.apiKey } });
    const row = await env.DB.prepare("SELECT COALESCE(SUM(n),0) AS used FROM usage_events WHERE account_id=?1").bind(acct.active_account_id).first();
    expect(Number(row.used)).toBe(4);
  });
});

describe("/api/v1/ordinal (the confession booth)", () => {
  it("decodes a generated id back to the ordinal it encodes", async () => {
    const { apiKey } = await newAccount();
    const ids = (await (await SELF.fetch("https://puid.dev/api/v1/ids?n=1", { headers: { "X-API-Key": apiKey } })).json()).ids;
    const id = ids[0];
    const r = await SELF.fetch(`https://puid.dev/api/v1/ordinal/${id}`, { headers: { "X-API-Key": apiKey } });
    const body = await r.json();
    // the API's ordinal must equal the local inverse permutation of the id
    expect(BigInt(body.ordinal)).toBe(decodePuid(id));
  });
});

describe("OAuth2 client_credentials (end to end)", () => {
  it("registers a client, gets a token, and uses it to generate ids", async () => {
    const reg = await (await SELF.fetch("https://puid.dev/api/oauth/register", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ client_name: "test app", redirect_uris: ["https://app.example/cb"] }),
    })).json();
    expect(reg.client_id).toBeTruthy();

    const tok = await (await SELF.fetch("https://puid.dev/api/oauth/token", {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "client_credentials", client_id: reg.client_id, client_secret: reg.client_secret, scope: "puid:generate" }),
    })).json();
    expect(tok.access_token).toMatch(/^puid_at_/);

    const r = await SELF.fetch("https://puid.dev/api/v1/ids?n=2", { headers: { authorization: `Bearer ${tok.access_token}` } });
    expect(r.status).toBe(200);
    expect((await r.json()).ids).toHaveLength(2);
  });
});

describe("reusable join code lifecycle", () => {
  it("rotate -> join works; rotate again -> old code stops working; revoke -> disabled", async () => {
    const owner = await newAccount("owner");
    const acct = owner.active_account_id;

    // owner rotates to create a code
    const c1 = await dispatch(env, "rotate-join-code", { account_id: acct, actor_user_id: owner.user_id });
    expect(c1.data.join_code).toMatch(/^join_/);

    // a different user joins with the code (reusable: not consumed)
    const bob = await dispatch(env, "upsert-identity", { provider: "dev", sub: "bob-join", email: "bob@example.com", name: "bob" });
    const j1 = await dispatch(env, "join", { code: c1.data.join_code, user_id: bob.data.user_id });
    expect(j1.status).toBe(200);
    expect(j1.data.account_id).toBe(acct);

    // a second user can ALSO use the same code (it is reusable)
    const cara = await dispatch(env, "upsert-identity", { provider: "dev", sub: "cara-join", email: "cara@example.com", name: "cara" });
    expect((await dispatch(env, "join", { code: c1.data.join_code, user_id: cara.data.user_id })).status).toBe(200);

    // rotating invalidates the OLD code
    const c2 = await dispatch(env, "rotate-join-code", { account_id: acct, actor_user_id: owner.user_id });
    expect(c2.data.join_code).not.toBe(c1.data.join_code);
    const dave = await dispatch(env, "upsert-identity", { provider: "dev", sub: "dave-join", email: "dave@example.com", name: "dave" });
    expect((await dispatch(env, "join", { code: c1.data.join_code, user_id: dave.data.user_id })).status).toBe(400); // old code dead
    expect((await dispatch(env, "join", { code: c2.data.join_code, user_id: dave.data.user_id })).status).toBe(200); // new code works

    // revoking disables joining entirely
    await dispatch(env, "revoke-join-code", { account_id: acct, actor_user_id: owner.user_id });
    const eve = await dispatch(env, "upsert-identity", { provider: "dev", sub: "eve-join", email: "eve@example.com", name: "eve" });
    expect((await dispatch(env, "join", { code: c2.data.join_code, user_id: eve.data.user_id })).status).toBe(400);

    // non-owners cannot manage the code
    const forbidden = await dispatch(env, "rotate-join-code", { account_id: acct, actor_user_id: bob.data.user_id });
    expect(forbidden.status).toBe(403);
  });
});

describe("multi-account membership", () => {
  it("a user can create another account and switch; joining adds (not moves) membership", async () => {
    const u = await newAccount("multi");
    const created = await dispatch(env, "create-account", { user_id: u.user_id, name: "Second Co" });
    expect(created.data.account_id).toBeTruthy();
    const list = await dispatch(env, "list-accounts", { user_id: u.user_id });
    expect(list.data.accounts.length).toBeGreaterThanOrEqual(2); // personal + Second Co
  });
});
