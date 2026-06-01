// Integration suite for @puid-dev/client — runs against a REAL PUID instance.
//
// Point it at a running server with PUID_ENDPOINT (default http://localhost:8799/api,
// i.e. `npm run dev:e2e` from the repo root). The site origin (for dev-login + the
// dashboard API used to mint keys) is derived by stripping the trailing /api, or set
// PUID_ORIGIN explicitly.
//
// Everything that a real endpoint can produce is tested against the real endpoint:
// id generation, decoding, quota, 401, 402 (out of quota), 429 (one per second), and
// the OAuth2 client-credentials bearer flow. Only two things are not reachable via the
// live API and are exercised differently: a non-JSON error body (faked fetch) and a
// transport failure (a real connection to a closed port).
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { Puid, PuidError, DEFAULT_ENDPOINT } from "../index.js";

const ENDPOINT = (process.env.PUID_ENDPOINT || "http://localhost:8799/api").replace(/\/+$/, "");
const ORIGIN = (process.env.PUID_ORIGIN || ENDPOINT.replace(/\/api$/, "")).replace(/\/+$/, "");

const uniqEmail = (tag) => `${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

// A cookie-jar session against the dev server. /auth/dev-login (gated by
// ALLOW_DEV_LOGIN) stands in for a completed Google sign-in, giving us a session
// cookie we can use against the dashboard API to mint keys and seed usage.
async function devSession(email) {
  const res = await fetch(`${ORIGIN}/auth/dev-login?email=${encodeURIComponent(email)}&next=/dashboard`, {
    redirect: "manual",
  });
  const setCookies = res.headers.getSetCookie?.() ?? [res.headers.get("set-cookie")].filter(Boolean);
  const cookie = setCookies.map((c) => c.split(";")[0]).join("; ");
  if (!cookie) throw new Error("dev-login returned no session cookie — is ALLOW_DEV_LOGIN=1 set on the server?");

  const req = (path, opts = {}) =>
    fetch(`${ORIGIN}${path}`, { ...opts, headers: { cookie, ...(opts.headers || {}) } });

  return {
    async mintKey(label = "sdk-test") {
      const r = await req("/dashboard/api/team/keys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ label }),
      });
      const body = await r.json();
      if (!body.api_key) throw new Error(`mintKey failed (HTTP ${r.status})`);
      return body.api_key;
    },
    async seedUsage(n) {
      const r = await req(`/dashboard/api/dev/seed-usage?n=${n}`);
      if (!r.ok) throw new Error(`seedUsage failed (HTTP ${r.status})`);
    },
  };
}

// Dynamic client registration is unauthenticated (RFC 7591 style), so this needs
// no session.
async function registerClient(name) {
  const r = await fetch(`${ENDPOINT}/oauth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ client_name: name, redirect_uris: ["https://example.test/cb"] }),
  });
  const body = await r.json();
  if (!body.client_id || !body.client_secret) throw new Error(`register failed (HTTP ${r.status})`);
  return body;
}

before(async () => {
  try {
    const r = await fetch(`${ENDPOINT}/openapi.json`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
  } catch (e) {
    throw new Error(
      `PUID is not reachable at ${ENDPOINT} (${e.message}).\n` +
        `Start a local server first:  npm run dev:e2e   (from the repo root)\n` +
        `or set PUID_ENDPOINT to a running instance.`,
    );
  }
});

// --- real service: generation & decoding ------------------------------------

test("ids() returns the requested number of unique, non-empty ids", async () => {
  const key = await (await devSession(uniqEmail("ids"))).mintKey();
  const puid = new Puid({ apiKey: key, endpoint: ENDPOINT });
  const ids = await puid.ids(10);
  assert.equal(ids.length, 10);
  for (const id of ids) assert.match(id, /^[0-9A-Za-z]{1,22}$/);
  assert.equal(new Set(ids).size, 10, "ids must be unique");
});

test("id() returns a single id", async () => {
  const key = await (await devSession(uniqEmail("single"))).mintKey();
  const id = await new Puid({ apiKey: key, endpoint: ENDPOINT }).id();
  assert.equal(typeof id, "string");
  assert.ok(id.length > 0);
});

test("ordinal() decodes an id to its counter value; a batch decodes to consecutive ordinals", async () => {
  const key = await (await devSession(uniqEmail("ord"))).mintKey();
  const puid = new Puid({ apiKey: key, endpoint: ENDPOINT });
  const [a, b] = await puid.ids(2); // one rate-limited request; ordinal() is not rate limited
  const oa = await puid.ordinal(a);
  const ob = await puid.ordinal(b);
  assert.equal(typeof oa, "bigint");
  assert.ok(oa > 0n);
  assert.equal(ob - oa, 1n, "ids generated together must decode to consecutive ordinals");
});

test("endpoint with a trailing slash still resolves", async () => {
  const key = await (await devSession(uniqEmail("slash"))).mintKey();
  const puid = new Puid({ apiKey: key, endpoint: ENDPOINT + "/" });
  assert.ok((await puid.id()).length > 0);
});

// --- real service: quota ----------------------------------------------------

test("quota() reports plan and remaining without spending an id", async () => {
  const key = await (await devSession(uniqEmail("quota"))).mintKey();
  const puid = new Puid({ apiKey: key, endpoint: ENDPOINT });
  const before = await puid.quota();
  const after = await puid.quota(); // calling quota twice must not change usage
  assert.equal(typeof before.plan, "string");
  assert.equal(before.used, after.used);
  if (before.limit !== null) assert.ok(before.remaining <= before.limit);
});

// --- real service: error paths ----------------------------------------------

test("a bad API key yields a 401 PuidError", async () => {
  const puid = new Puid({ apiKey: "puid_live_definitely_not_real", endpoint: ENDPOINT });
  await assert.rejects(() => puid.id(), (e) => {
    assert.ok(e instanceof PuidError);
    assert.equal(e.status, 401);
    assert.equal(e.code, "unauthorized");
    return true;
  });
});

test("exceeding the daily quota yields a 402 PuidError", async () => {
  const session = await devSession(uniqEmail("over-quota"));
  await session.seedUsage(1000); // free plan = 1000/day
  const key = await session.mintKey();
  const puid = new Puid({ apiKey: key, endpoint: ENDPOINT });
  await assert.rejects(() => puid.id(), (e) => {
    assert.ok(e instanceof PuidError);
    assert.equal(e.status, 402);
    return true;
  });
});

test("more than one request per second yields a 429 PuidError", async () => {
  const key = await (await devSession(uniqEmail("rate"))).mintKey();
  const puid = new Puid({ apiKey: key, endpoint: ENDPOINT });
  await puid.id(); // first request: allowed
  await assert.rejects(() => puid.id(), (e) => {
    assert.ok(e instanceof PuidError);
    assert.equal(e.status, 429);
    assert.equal(e.code, "rate_limited");
    return true;
  });
});

// --- real service: OAuth2 (generate on someone else's behalf) ---------------

test("fromClientCredentials() mints a bearer token and generates ids", async () => {
  const { client_id, client_secret } = await registerClient("sdk-cc-test");
  const puid = await Puid.fromClientCredentials({
    clientId: client_id,
    clientSecret: client_secret,
    endpoint: ENDPOINT,
  });
  const ids = await puid.ids(2);
  assert.equal(ids.length, 2);
});

test("fromClientCredentials() rejects bad credentials with a PuidError", async () => {
  await assert.rejects(
    () => Puid.fromClientCredentials({ clientId: "nope", clientSecret: "wrong", endpoint: ENDPOINT }),
    (e) => e instanceof PuidError && e.status >= 400,
  );
});

// --- client-side validation (no network needed) -----------------------------

test("DEFAULT_ENDPOINT points at production", () => {
  assert.equal(DEFAULT_ENDPOINT, "https://puid.dev/api");
});

test("constructor requires exactly one credential", () => {
  assert.throws(() => new Puid({}), /apiKey.*accessToken/);
  assert.throws(() => new Puid({ apiKey: "k", accessToken: "t" }), /not both/);
});

test("ids() validates the range before making a request", async () => {
  const puid = new Puid({ apiKey: "k", endpoint: ENDPOINT });
  for (const bad of [0, 11, 1.5, -3, Number.NaN]) {
    await assert.rejects(() => puid.ids(bad), (e) => e instanceof PuidError && e.code === "invalid_count");
  }
});

test("ordinal() validates its argument before making a request", async () => {
  const puid = new Puid({ apiKey: "k", endpoint: ENDPOINT });
  await assert.rejects(() => puid.ordinal(""), (e) => e instanceof PuidError && e.code === "invalid_puid");
  await assert.rejects(() => puid.ordinal(null), (e) => e instanceof PuidError && e.code === "invalid_puid");
});

test("fromClientCredentials() requires clientId and clientSecret", async () => {
  await assert.rejects(() => Puid.fromClientCredentials({ clientId: "only", endpoint: ENDPOINT }), /required/);
});

// --- the two cases a live endpoint can't produce ----------------------------

test("a non-JSON error body still yields a useful PuidError (faked: the API always returns JSON)", async () => {
  const fakeFetch = async () => ({
    ok: false,
    status: 502,
    json: async () => {
      throw new SyntaxError("Unexpected token < in JSON");
    },
  });
  const puid = new Puid({ apiKey: "k", endpoint: ENDPOINT, fetch: fakeFetch });
  await assert.rejects(() => puid.id(), (e) => {
    assert.ok(e instanceof PuidError);
    assert.equal(e.status, 502);
    assert.equal(e.code, null);
    assert.match(e.message, /HTTP 502/);
    return true;
  });
});

test("a transport failure becomes a PuidError with code network_error (real: closed port)", async () => {
  const puid = new Puid({ apiKey: "k", endpoint: "http://127.0.0.1:1/api" });
  await assert.rejects(() => puid.id(), (e) => {
    assert.ok(e instanceof PuidError);
    assert.equal(e.code, "network_error");
    return true;
  });
});
