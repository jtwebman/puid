// router.js — the non-page server surface: the JSON API (/api/*) plus the
// browser auth flows (/auth, /oauth, /join). Ported verbatim from the original
// single-Worker index.js so the behavior (and the passing tests) carry over.
//
// `handle(request, env, url)` returns a Response for a matched route, or `null`
// to let SvelteKit render a page. In production it's called from hooks.server.js
// with `event.platform.env`; in tests, from a thin worker entry with the D1 binding.

import { encodePuid, decodePuid } from "../puid.js";
import { PROVIDERS, buildAuthUrl, exchangeAndProfile } from "./oauth_login.js";
import { dispatch, allocateOrdinals, rateLimit } from "./data.js";
import { SPEC, toYaml } from "../openapi.js";

const MAX_PER_REQUEST = 10;

const json = (obj, status = 200, extra = {}) =>
  Response.json(obj, { status, headers: { "cache-control": "no-store", ...extra } });
const authCall = (env, op, body) => dispatch(env, op, body);

function cookies(request) {
  const out = {};
  for (const part of (request.headers.get("cookie") || "").split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i)] = decodeURIComponent(part.slice(i + 1));
  }
  return out;
}
const setCookie = (name, val, maxAge, secure = true) =>
  `${name}=${encodeURIComponent(val)}; Path=/; HttpOnly;${secure ? " Secure;" : ""} SameSite=Lax; Max-Age=${maxAge}`;

async function sessionFromRequest(env, request) {
  const sess = cookies(request)["puid_session"];
  if (!sess) return null;
  const { status, data } = await authCall(env, "session", { session: sess });
  return status === 200 ? { ...data, session: sess } : null;
}

async function principalFromRequest(env, request) {
  const auth = request.headers.get("authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  const apiKey = request.headers.get("x-api-key") || (bearer?.startsWith("puid_live_") ? bearer : null);
  if (apiKey) {
    const { status, data } = await authCall(env, "verify-key", { key: apiKey });
    if (status === 200) return { accountId: data.account_id, plan: data.plan };
  }
  if (bearer?.startsWith("puid_at_")) {
    const { status, data } = await authCall(env, "verify-token", { token: bearer, scope_required: "puid:generate" });
    if (status === 200) return { accountId: data.account_id, plan: "token" };
  }
  return null;
}

async function takeOrdinals(env, count, accountId) {
  const { start } = await allocateOrdinals(env, count, accountId);
  return Array.from({ length: count }, (_, i) => start + BigInt(i));
}

export async function handle(request, env, url) {
  const origin = url.origin;
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const secure = url.protocol === "https:";

  // ---- browser auth flows ----
  if (path.startsWith("/auth/login/")) {
    const provider = path.split("/").pop();
    if (!PROVIDERS[provider]) return json({ error: "unknown_provider", supported: Object.keys(PROVIDERS) }, 404);
    const state = crypto.randomUUID();
    const next = url.searchParams.get("next") || "/dashboard";
    return new Response(null, { status: 302, headers: {
      location: buildAuthUrl(provider, env, origin, state),
      "set-cookie": setCookie("puid_login", JSON.stringify({ state, provider, next }), 600, secure),
    }});
  }
  if (path.startsWith("/auth/callback/")) {
    const provider = path.split("/").pop();
    const code = url.searchParams.get("code"), state = url.searchParams.get("state");
    const saved = (() => { try { return JSON.parse(cookies(request)["puid_login"] || "{}"); } catch { return {}; } })();
    if (!code || !state || state !== saved.state || provider !== saved.provider) return json({ error: "bad_login_state" }, 400);
    let profile;
    try { profile = await exchangeAndProfile(provider, env, origin, code); }
    catch (e) { return json({ error: "login_failed", detail: e.message }, 502); }
    const { data } = await authCall(env, "upsert-identity", profile);
    return new Response(null, { status: 302, headers: {
      location: saved.next || "/dashboard",
      "set-cookie": setCookie("puid_session", data.session, 60 * 60 * 24 * 30, secure),
    }});
  }
  // test-only login bypass (gated by ALLOW_DEV_LOGIN; never set in prod)
  if (path === "/auth/dev-login" && env.ALLOW_DEV_LOGIN === "1") {
    const email = url.searchParams.get("email") || "dev@example.com";
    const next = url.searchParams.get("next") || "/dashboard";
    const { data } = await authCall(env, "upsert-identity", { provider: "dev", sub: url.searchParams.get("sub") || email, email, name: email.split("@")[0] });
    return new Response(null, { status: 302, headers: {
      location: next, "set-cookie": setCookie("puid_session", data.session, 60 * 60 * 24 * 30, secure),
    }});
  }
  if (path === "/oauth/authorize") {
    const s = await sessionFromRequest(env, request);
    if (!s) return new Response(null, { status: 302, headers: { location: `${origin}/auth/login/google?next=${encodeURIComponent(url.pathname + url.search)}` } });
    return new Response(consentPage(Object.fromEntries(url.searchParams), s), { headers: { "content-type": "text/html; charset=utf-8" } });
  }
  if (path === "/oauth/decision" && request.method === "POST") {
    const s = await sessionFromRequest(env, request);
    if (!s) return json({ error: "not_logged_in" }, 401);
    const form = Object.fromEntries(await request.formData());
    if (form.decision !== "approve")
      return new Response(null, { status: 302, headers: { location: `${form.redirect_uri}?error=access_denied&state=${form.state || ""}` } });
    const { status, data } = await authCall(env, "issue-code", {
      session: s.session, client_id: form.client_id, redirect_uri: form.redirect_uri,
      scope: form.scope, code_challenge: form.code_challenge, code_challenge_method: form.code_challenge_method });
    if (status !== 200) return json(data, status);
    const sep = form.redirect_uri.includes("?") ? "&" : "?";
    return new Response(null, { status: 302, headers: { location: `${form.redirect_uri}${sep}code=${data.code}&state=${form.state || ""}` } });
  }
  if (path.startsWith("/join/")) {
    const code = decodeURIComponent(path.slice("/join/".length));
    const s = await sessionFromRequest(env, request);
    if (!s) return new Response(null, { status: 302, headers: { location: `${origin}/auth/login/google?next=${encodeURIComponent(url.pathname)}` } });
    const { status, data } = await authCall(env, "join", { code, user_id: s.user_id });
    const dest = status === 200 ? `/dashboard?joined=${data.account_id}` : `/dashboard?join_error=1`;
    return new Response(null, { status: 302, headers: { location: dest } });
  }

  // ---- JSON API ----
  if (path === "/api" || path.startsWith("/api/")) {
    return handleApi(request, env, origin, path.slice(4) || "/", url);
  }

  return null; // let SvelteKit render a page
}

async function handleApi(request, env, origin, p, url) {
  const API = origin + "/api";
  const needSession = async () => sessionFromRequest(env, request);

  if (p === "/openapi.json") return json(SPEC);
  if (p === "/openapi.yaml") return new Response(toYaml(SPEC), { headers: { "content-type": "application/yaml" } });
  if (p === "/.well-known/oauth-authorization-server") {
    return json({
      issuer: origin, authorization_endpoint: `${origin}/oauth/authorize`, token_endpoint: `${API}/oauth/token`,
      registration_endpoint: `${API}/oauth/register`, scopes_supported: ["puid:generate", "puid:ordinal"],
      response_types_supported: ["code"], grant_types_supported: ["authorization_code", "refresh_token", "client_credentials"],
      code_challenge_methods_supported: ["S256", "plain"],
    });
  }

  if (p === "/v1/ids") {
    const principal = await principalFromRequest(env, request);
    if (!principal) return json({ error: "unauthorized", message: "Send X-API-Key or a Bearer token. Sign in at /dashboard to get one." }, 401);
    const rl = await rateLimit(env, principal.accountId);
    if (!rl.allowed) return json({ error: "rate_limited", message: "One request per second. Want more? That requires an upgrade.", retryAfterMs: rl.retryAfterMs, upgrade_url: `${origin}/upgrade` },
      429, { "retry-after": String(Math.ceil((rl.retryAfterMs || 1000) / 1000)) });
    let n = Number(url.searchParams.get("n") ?? "1");
    if (!Number.isInteger(n) || n < 1 || n > MAX_PER_REQUEST) return json({ error: "bad_request", message: `n must be 1..${MAX_PER_REQUEST}.` }, 400);
    const q = await authCall(env, "quota", { account_id: principal.accountId, want: n });
    if (q.status === 402) return json({ ...q.data, upgrade_url: `${origin}/upgrade` }, 402);
    const ids = (await takeOrdinals(env, n, principal.accountId)).map(encodePuid);
    return json({ ids, count: ids.length, quota: { used: q.data.used, limit: q.data.limit },
      warning: "Sequential under a disguise. Subtracting two reveals our total issuance. Do not use this." });
  }
  if (p.startsWith("/v1/ordinal/")) {
    const puid = decodeURIComponent(p.split("/").pop());
    try { const ordinal = decodePuid(puid); return json({ puid, ordinal: ordinal.toString(), truth: `This "random unique" id was always just #${ordinal}.` }); }
    catch (e) { return json({ error: "bad_request", message: `Not a valid PUID: ${e.message}` }, 400); }
  }
  if (p === "/metrics") {
    const row = await env.DB.prepare("SELECT next FROM sequence WHERE id = 1").first();
    return json({ ids_ever_issued: String((row?.next ?? 1) - 1), note: "Competitive intelligence, free of charge." });
  }
  if (p === "/pricing") {
    return json({ tiers: {
      free: { price: "$0", quota: "1000 ids/day", rate: "1 req/sec" },
      hobby: { price: "$5/mo", quota: "10000 ids/day", rate: "5 req/sec" },
      enterprise: { price: "call us", quota: "unlimited", rate: "10 req/sec" },
    }, joke: "Yes, we charge money to make a counter count faster." });
  }

  if (p === "/oauth/register" && request.method === "POST") {
    const { status, data } = await authCall(env, "register-client", await request.json().catch(() => ({})));
    return json(data, status);
  }
  if (p === "/oauth/token" && request.method === "POST") {
    const ct = request.headers.get("content-type") || "";
    const body = ct.includes("application/json") ? await request.json().catch(() => ({})) : Object.fromEntries(await request.formData());
    const { status, data } = await authCall(env, "token", body);
    return json(data, status);
  }

  // dashboard AJAX (session cookie)
  if (p === "/me") {
    const s = await needSession(); if (!s) return json({ error: "not_logged_in" }, 401);
    return json({ user_id: s.user_id, active_account_id: s.active_account_id, email: s.email, name: s.name });
  }
  if (p === "/accounts") {
    const s = await needSession(); if (!s) return json({ error: "not_logged_in" }, 401);
    const { data } = await authCall(env, "list-accounts", { user_id: s.user_id });
    return json({ active_account_id: s.active_account_id, ...data });
  }
  if (p === "/usage") {
    const s = await needSession(); if (!s) return json({ error: "not_logged_in" }, 401);
    const { data } = await authCall(env, "list-usage", { account_id: s.active_account_id });
    return json(data);
  }
  if (p === "/account/create" && request.method === "POST") {
    const s = await needSession(); if (!s) return json({ error: "not_logged_in" }, 401);
    const { data } = await authCall(env, "create-account", { user_id: s.user_id, name: (await request.json().catch(() => ({}))).name });
    return json(data);
  }
  if (p === "/account/switch" && request.method === "POST") {
    const s = await needSession(); if (!s) return json({ error: "not_logged_in" }, 401);
    const { status, data } = await authCall(env, "switch-account", { session: s.session, user_id: s.user_id, account_id: (await request.json().catch(() => ({}))).account_id });
    return json(data, status);
  }
  if (p === "/team/keys" && request.method === "POST") {
    const s = await needSession(); if (!s) return json({ error: "not_logged_in" }, 401);
    const { data } = await authCall(env, "create-key", { account_id: s.active_account_id, actor_user_id: s.user_id, label: (await request.json().catch(() => ({}))).label });
    return json(data);
  }
  if (p === "/team/settings") {
    const s = await needSession(); if (!s) return json({ error: "not_logged_in" }, 401);
    const { status, data } = await authCall(env, "team-settings", { account_id: s.active_account_id, actor_user_id: s.user_id });
    return json(data, status);
  }
  if (p === "/team/join-code/rotate" && request.method === "POST") {
    const s = await needSession(); if (!s) return json({ error: "not_logged_in" }, 401);
    const { status, data } = await authCall(env, "rotate-join-code", { account_id: s.active_account_id, actor_user_id: s.user_id });
    return json(data, status);
  }
  if (p === "/team/join-code/revoke" && request.method === "POST") {
    const s = await needSession(); if (!s) return json({ error: "not_logged_in" }, 401);
    const { status, data } = await authCall(env, "revoke-join-code", { account_id: s.active_account_id, actor_user_id: s.user_id });
    return json(data, status);
  }
  if (p === "/team/members") {
    const s = await needSession(); if (!s) return json({ error: "not_logged_in" }, 401);
    const { data } = await authCall(env, "members", { account_id: s.active_account_id });
    return json(data);
  }

  return json({ error: "not_found", api: true }, 404);
}

function esc(s) { return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function consentPage(p, s) {
  const scopes = (p.scope || "puid:generate puid:ordinal").split(/\s+/);
  return `<!doctype html><meta charset=utf-8><title>Authorize</title>
<body style="font-family:system-ui;max-width:34rem;margin:4rem auto;line-height:1.5">
<h2>Authorize application</h2>
<p>An app wants to access <b>${esc(s.email || s.active_account_id)}</b>'s PUID account.</p>
<ul>${scopes.map((x) => `<li><code>${esc(x)}</code> — ${x === "puid:ordinal" ? "decode ids back to counters" : "request up to 10 numbers per second"}</li>`).join("")}</ul>
<form method="post" action="/oauth/decision">
${["client_id", "redirect_uri", "scope", "state", "code_challenge", "code_challenge_method"].map((k) => `<input type=hidden name=${k} value="${esc(p[k])}">`).join("")}
<button name=decision value=approve style="padding:.6rem 1rem">Approve</button>
<button name=decision value=deny style="padding:.6rem 1rem">Deny</button>
</form></body>`;
}
