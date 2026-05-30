// data.js — the D1 (SQLite) data layer. This replaced the Auth Durable Object the
// moment a user could belong to many accounts: that's a many-to-many relationship,
// and a relational DB models it with one join table instead of hand-rolled KV
// indexes. D1 is also on Cloudflare's FREE plan, which is how the whole thing
// runs for $0 (Durable Objects would have forced the $5/mo paid plan).
//
// Exposes:
//   dispatch(env, op, body) -> { status, data }   // all auth/account/oauth ops
//   allocateBlock(env, size) -> { start, end }     // the atomic counter
//   rateLimit(env, principal) -> { allowed, retryAfterMs }
//
// D1 serializes writes per database, so `UPDATE ... RETURNING` and upserts are
// effectively transactional — enough for a counter and a 1/sec limiter.

const DAY_MS = 86_400_000;
const FREE_DAILY_QUOTA = 1000;
const TOKEN_TTL_MS = 3600_000;
const CODE_TTL_MS = 300_000;
const SESSION_TTL_MS = 30 * DAY_MS;
const RATE_WINDOW_MS = 1000;
const SCOPES = ["puid:generate", "puid:ordinal"];

const enc = new TextEncoder();
const B62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const now = () => Date.now();

function rand(prefix, len = 24) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  let s = "";
  for (const b of bytes) s += B62[b % 62];
  return prefix + s;
}
async function sha256hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function b64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function pkceMatches(verifier, challenge, method) {
  if (!challenge) return true;
  if (method === "plain" || !method) return verifier === challenge;
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(verifier || ""));
  return b64url(digest) === challenge;
}
const ok = (data, status = 200) => ({ status, data });
const err = (error, status, extra = {}) => ({ status, data: { error, ...extra } });

// ---- counter + rate limit (the parts that used to be Durable Objects) --------
// Allocate EXACTLY `count` ordinals AND log the usage, atomically. D1 runs the
// batch as a single serialized transaction:
//   1) UPDATE ... RETURNING  — atomic read-modify-write of the counter (no two
//      requests can get the same range; SQLite's single-writer lock blocks others)
//   2) INSERT usage_events   — one account-stamped row per request, for dashboards
//      and the daily quota sum.
// Per request, no buffering: zero waste, zero gaps. Cheap because requests are
// capped at 1/sec/account.
export async function allocateOrdinals(env, count, accountId) {
  const results = await env.DB.batch([
    env.DB.prepare("UPDATE sequence SET next = next + ?1 WHERE id = 1 RETURNING next").bind(count),
    env.DB.prepare("INSERT INTO usage_events (account_id, n, ts) VALUES (?1, ?2, ?3)").bind(accountId, count, now()),
  ]);
  const end = BigInt(results[0].results[0].next); // new value after increment (exclusive)
  return { start: end - BigInt(count), end };
}

export async function rateLimit(env, principal) {
  const t = now();
  const res = await env.DB.prepare(
    `INSERT INTO rate (principal, last) VALUES (?1, ?2)
     ON CONFLICT(principal) DO UPDATE SET last = ?2 WHERE ?2 - rate.last >= ?3`
  ).bind(principal, t, RATE_WINDOW_MS).run();
  if (res.meta.changes > 0) return { allowed: true };
  const cur = await env.DB.prepare("SELECT last FROM rate WHERE principal = ?1").bind(principal).first();
  const retryAfterMs = cur ? Math.max(0, RATE_WINDOW_MS - (t - cur.last)) : RATE_WINDOW_MS;
  return { allowed: false, retryAfterMs };
}

// ---- the op dispatcher (mirrors the old Auth DO interface) -------------------
export async function dispatch(env, op, body = {}) {
  const db = env.DB;
  switch (op) {
    // ----- inbound identity (Google/Microsoft) -----
    case "upsert-identity": {
      const { provider, sub, email, name } = body;
      if (!provider || !sub) return err("missing_identity", 400);
      let ident = await db.prepare("SELECT user_id FROM identities WHERE provider=?1 AND sub=?2").bind(provider, sub).first();
      let userId, accountId;
      if (!ident) {
        userId = rand("user_", 16);
        accountId = rand("team_", 16);
        const t = now();
        await db.batch([
          db.prepare("INSERT INTO users (id,email,name,created) VALUES (?1,?2,?3,?4)").bind(userId, email, name, t),
          db.prepare("INSERT INTO identities (provider,sub,user_id) VALUES (?1,?2,?3)").bind(provider, sub, userId),
          db.prepare("INSERT INTO accounts (id,name,plan,created) VALUES (?1,?2,'free',?3)").bind(accountId, (name ? `${name}'s Team` : "Personal"), t),
          db.prepare("INSERT INTO memberships (account_id,user_id,role,joined) VALUES (?1,?2,'owner',?3)").bind(accountId, userId, t),
        ]);
      } else {
        userId = ident.user_id;
        const m = await db.prepare("SELECT account_id FROM memberships WHERE user_id=?1 ORDER BY joined LIMIT 1").bind(userId).first();
        accountId = m?.account_id ?? null;
      }
      const session = rand("sess_", 32);
      await db.prepare("INSERT INTO sessions (session_hash,user_id,active_account_id,exp) VALUES (?1,?2,?3,?4)")
        .bind(await sha256hex(session), userId, accountId, now() + SESSION_TTL_MS).run();
      return ok({ user_id: userId, active_account_id: accountId, session, provider });
    }

    case "session": {
      const row = await db.prepare(
        `SELECT s.user_id, s.active_account_id, s.exp, u.email, u.name
         FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.session_hash = ?1`
      ).bind(await sha256hex(body.session || "")).first();
      if (!row || row.exp < now()) return err("no_session", 401);
      return ok({ user_id: row.user_id, active_account_id: row.active_account_id, email: row.email, name: row.name });
    }

    // ----- accounts (a user can be in many, and can create more) -----
    case "list-accounts": {
      const { results } = await db.prepare(
        `SELECT a.id, a.name, a.plan, m.role FROM memberships m
         JOIN accounts a ON a.id = m.account_id WHERE m.user_id = ?1 ORDER BY m.joined`
      ).bind(body.user_id).all();
      return ok({ accounts: results });
    }

    case "create-account": {
      const { user_id, name } = body;
      const accountId = rand("team_", 16);
      const t = now();
      await db.batch([
        db.prepare("INSERT INTO accounts (id,name,plan,created) VALUES (?1,?2,'free',?3)").bind(accountId, name || "New Account", t),
        db.prepare("INSERT INTO memberships (account_id,user_id,role,joined) VALUES (?1,?2,'owner',?3)").bind(accountId, user_id, t),
      ]);
      return ok({ account_id: accountId, name: name || "New Account", role: "owner" });
    }

    case "switch-account": {
      const { session, user_id, account_id } = body;
      const member = await db.prepare("SELECT 1 FROM memberships WHERE account_id=?1 AND user_id=?2").bind(account_id, user_id).first();
      if (!member) return err("not_a_member", 403);
      await db.prepare("UPDATE sessions SET active_account_id=?1 WHERE session_hash=?2").bind(account_id, await sha256hex(session)).run();
      return ok({ active_account_id: account_id });
    }

    // ----- teams / membership -----
    // ----- reusable join code (one per account, owner-managed) -----
    case "team-settings": {
      // Owners see/manage the join code; members just learn they can't.
      const me = await db.prepare("SELECT role FROM memberships WHERE account_id=?1 AND user_id=?2").bind(body.account_id, body.actor_user_id).first();
      if (!me) return err("forbidden", 403);
      const acct = await db.prepare("SELECT join_code FROM accounts WHERE id=?1").bind(body.account_id).first();
      return ok({ role: me.role, join_code: me.role === "owner" ? (acct?.join_code ?? null) : null });
    }

    case "rotate-join-code": {
      // Generate a new code. Because there is exactly one code per account,
      // replacing it is what makes the OLD code stop working.
      const me = await db.prepare("SELECT role FROM memberships WHERE account_id=?1 AND user_id=?2").bind(body.account_id, body.actor_user_id).first();
      if (me?.role !== "owner") return err("forbidden", 403, { detail: "owners only" });
      const code = rand("join_", 18);
      await db.prepare("UPDATE accounts SET join_code=?1 WHERE id=?2").bind(code, body.account_id).run();
      return ok({ join_code: code });
    }

    case "revoke-join-code": {
      // Remove the code entirely -> joining is disabled until a new one is made.
      const me = await db.prepare("SELECT role FROM memberships WHERE account_id=?1 AND user_id=?2").bind(body.account_id, body.actor_user_id).first();
      if (me?.role !== "owner") return err("forbidden", 403, { detail: "owners only" });
      await db.prepare("UPDATE accounts SET join_code=NULL WHERE id=?1").bind(body.account_id).run();
      return ok({ join_code: null, disabled: true });
    }

    case "join": {
      // Anyone with a live code can join (as member). Reusable — NOT consumed.
      // KEY M:N: this ADDS a membership; the user keeps their other accounts.
      const acct = body.code ? await db.prepare("SELECT id FROM accounts WHERE join_code=?1").bind(body.code).first() : null;
      if (!acct) return err("invalid_or_disabled_code", 400, { message: "That join code is invalid, was rotated, or invites are disabled." });
      await db.prepare("INSERT OR IGNORE INTO memberships (account_id,user_id,role,joined) VALUES (?1,?2,'member',?3)")
        .bind(acct.id, body.user_id, now()).run();
      return ok({ account_id: acct.id, role: "member" });
    }

    case "members": {
      const { results } = await db.prepare(
        `SELECT m.user_id, m.role, u.email, u.name FROM memberships m
         JOIN users u ON u.id = m.user_id WHERE m.account_id = ?1`
      ).bind(body.account_id).all();
      return ok({ account_id: body.account_id, members: results });
    }

    // ----- API keys (account-scoped) -----
    case "create-key": {
      const { account_id, actor_user_id, label } = body;
      const member = await db.prepare("SELECT 1 FROM memberships WHERE account_id=?1 AND user_id=?2").bind(account_id, actor_user_id).first();
      if (!member) return err("forbidden", 403);
      const apiKey = rand("puid_live_", 24);
      const id = rand("key_", 12);
      const hint = apiKey.slice(-4);
      await db.prepare("INSERT INTO api_keys (key_hash,id,account_id,created_by,label,hint,created) VALUES (?1,?2,?3,?4,?5,?6,?7)")
        .bind(await sha256hex(apiKey), id, account_id, actor_user_id, label || "default", hint, now()).run();
      return ok({ api_key: apiKey, id, hint, label: label || "default", account_id, message: "Shown once. Hashed at rest. This is what the SDKs send." });
    }

    case "list-keys": {
      const { results } = await db.prepare(
        "SELECT id, label, hint, created FROM api_keys WHERE account_id=?1 ORDER BY created DESC"
      ).bind(body.account_id).all();
      return ok({ keys: results });
    }

    case "revoke-key": {
      const member = await db.prepare("SELECT 1 FROM memberships WHERE account_id=?1 AND user_id=?2").bind(body.account_id, body.actor_user_id).first();
      if (!member) return err("forbidden", 403);
      await db.prepare("DELETE FROM api_keys WHERE account_id=?1 AND id=?2").bind(body.account_id, body.key_id).run();
      return ok({ revoked: body.key_id });
    }

    case "verify-key": {
      const row = await db.prepare(
        `SELECT k.account_id, a.plan FROM api_keys k JOIN accounts a ON a.id = k.account_id WHERE k.key_hash = ?1`
      ).bind(await sha256hex(body.key || "")).first();
      if (!row) return err("invalid_key", 401);
      return ok({ account_id: row.account_id, plan: row.plan });
    }

    // ----- OAuth2 provider (outbound) -----
    case "register-client": {
      const { client_name, redirect_uris } = body;
      if (!Array.isArray(redirect_uris) || redirect_uris.length === 0) return err("invalid_redirect_uris", 400);
      const clientId = rand("client_", 16);
      const clientSecret = rand("secret_", 32);
      await db.prepare("INSERT INTO oauth_clients (client_id,name,secret_hash,redirect_uris) VALUES (?1,?2,?3,?4)")
        .bind(clientId, client_name || "Unnamed App", await sha256hex(clientSecret), JSON.stringify(redirect_uris)).run();
      return ok({ client_id: clientId, client_secret: clientSecret, redirect_uris,
        grant_types: ["authorization_code", "refresh_token", "client_credentials"], scopes_supported: SCOPES });
    }

    case "issue-code": {
      const { session, client_id, redirect_uri, scope, code_challenge, code_challenge_method } = body;
      const sess = await db.prepare("SELECT active_account_id, exp FROM sessions WHERE session_hash=?1").bind(await sha256hex(session || "")).first();
      if (!sess || sess.exp < now()) return err("access_denied", 401, { detail: "must be logged in" });
      const client = await db.prepare("SELECT redirect_uris FROM oauth_clients WHERE client_id=?1").bind(client_id).first();
      if (!client) return err("invalid_client", 400);
      if (!JSON.parse(client.redirect_uris).includes(redirect_uri)) return err("invalid_redirect_uri", 400);
      const granted = (scope || SCOPES.join(" ")).split(/\s+/).filter((x) => SCOPES.includes(x)).join(" ");
      const code = rand("code_", 24);
      await db.prepare(
        `INSERT INTO oauth_codes (code,account_id,client_id,redirect_uri,scope,code_challenge,code_challenge_method,exp)
         VALUES (?1,?2,?3,?4,?5,?6,?7,?8)`
      ).bind(code, sess.active_account_id, client_id, redirect_uri, granted, code_challenge || null, code_challenge_method || null, now() + CODE_TTL_MS).run();
      return ok({ code, scope: granted });
    }

    case "token": {
      const g = body.grant_type;
      if (g === "authorization_code") {
        const rec = await db.prepare("SELECT * FROM oauth_codes WHERE code=?1").bind(body.code || "").first();
        if (!rec || rec.exp < now()) return err("invalid_grant", 400);
        await db.prepare("DELETE FROM oauth_codes WHERE code=?1").bind(body.code).run();
        if (rec.client_id !== body.client_id || rec.redirect_uri !== body.redirect_uri) return err("invalid_grant", 400);
        if (!(await pkceMatches(body.code_verifier, rec.code_challenge, rec.code_challenge_method))) return err("invalid_grant", 400, { detail: "PKCE failed" });
        // record the standing grant so the team can see/revoke this app later
        await db.prepare("INSERT INTO oauth_grants (account_id,client_id,scope,created) VALUES (?1,?2,?3,?4) ON CONFLICT(account_id,client_id) DO UPDATE SET scope=?3")
          .bind(rec.account_id, rec.client_id, rec.scope, now()).run();
        return mintTokens(db, rec.account_id, rec.scope, true, rec.client_id);
      }
      if (g === "refresh_token") {
        const rec = await db.prepare("SELECT account_id,client_id,scope FROM oauth_tokens WHERE token_hash=?1 AND kind='refresh'").bind(await sha256hex(body.refresh_token || "")).first();
        if (!rec) return err("invalid_grant", 400);
        return mintTokens(db, rec.account_id, rec.scope, true, rec.client_id);
      }
      if (g === "client_credentials") {
        const client = await db.prepare("SELECT secret_hash FROM oauth_clients WHERE client_id=?1").bind(body.client_id || "").first();
        if (!client || client.secret_hash !== (await sha256hex(body.client_secret || ""))) return err("invalid_client", 401);
        const granted = (body.scope || SCOPES.join(" ")).split(/\s+/).filter((x) => SCOPES.includes(x)).join(" ");
        return mintTokens(db, "client:" + body.client_id, granted, false, body.client_id);
      }
      return err("unsupported_grant_type", 400);
    }

    // ----- authorized apps (delegated OAuth grants on this account) -----
    case "list-grants": {
      const { results } = await db.prepare(
        `SELECT g.client_id, g.scope, g.created, c.name FROM oauth_grants g
         LEFT JOIN oauth_clients c ON c.client_id = g.client_id WHERE g.account_id=?1 ORDER BY g.created DESC`
      ).bind(body.account_id).all();
      return ok({ grants: results });
    }

    case "revoke-grant": {
      const member = await db.prepare("SELECT 1 FROM memberships WHERE account_id=?1 AND user_id=?2").bind(body.account_id, body.actor_user_id).first();
      if (!member) return err("forbidden", 403);
      await db.batch([
        db.prepare("DELETE FROM oauth_grants WHERE account_id=?1 AND client_id=?2").bind(body.account_id, body.client_id),
        db.prepare("DELETE FROM oauth_tokens WHERE account_id=?1 AND client_id=?2").bind(body.account_id, body.client_id),
      ]);
      return ok({ revoked: body.client_id });
    }

    case "verify-token": {
      const h = await sha256hex(body.token || "");
      const rec = await db.prepare("SELECT account_id,scope,exp FROM oauth_tokens WHERE token_hash=?1 AND kind='access'").bind(h).first();
      if (!rec) return err("invalid_token", 401);
      if (rec.exp < now()) { await db.prepare("DELETE FROM oauth_tokens WHERE token_hash=?1").bind(h).run(); return err("expired_token", 401); }
      if (body.scope_required && !rec.scope.split(" ").includes(body.scope_required)) return err("insufficient_scope", 403, { scope_required: body.scope_required });
      return ok({ account_id: rec.account_id, scope: rec.scope });
    }

    // ----- quota / paywall (read-only; the usage row is written at allocation) -----
    case "quota": {
      const want = Number(body.want) || 1;
      const account = body.account_id.startsWith("team_")
        ? await db.prepare("SELECT plan FROM accounts WHERE id=?1").bind(body.account_id).first() : null;
      const plan = account?.plan ?? "free";
      const limit = plan === "free" ? FREE_DAILY_QUOTA : null; // null = unlimited
      const dayStart = Math.floor(now() / DAY_MS) * DAY_MS;
      const row = await db.prepare("SELECT COALESCE(SUM(n),0) AS used FROM usage_events WHERE account_id=?1 AND ts>=?2")
        .bind(body.account_id, dayStart).first();
      const used = Number(row?.used ?? 0);
      if (limit !== null && used + want > limit)
        return err("quota_exceeded", 402, { used, limit, plan, message: `Free tier is ${FREE_DAILY_QUOTA} numbers/day. Upgrade to count higher.` });
      return ok({ allowed: true, used: used + want, limit, plan });
    }

    // ----- API-key quota check (no id spent) -----
    case "quota-status": {
      const account = body.account_id.startsWith("team_")
        ? await db.prepare("SELECT plan FROM accounts WHERE id=?1").bind(body.account_id).first() : null;
      const plan = account?.plan ?? "free";
      const limit = plan === "free" ? FREE_DAILY_QUOTA : null; // null = unlimited
      const dayStart = Math.floor(now() / DAY_MS) * DAY_MS;
      const row = await db.prepare("SELECT COALESCE(SUM(n),0) AS used FROM usage_events WHERE account_id=?1 AND ts>=?2").bind(body.account_id, dayStart).first();
      const used = Number(row?.used ?? 0);
      return ok({ plan, used, limit, remaining: limit === null ? null : Math.max(0, limit - used) });
    }

    // ----- dashboard usage chart: bucket issuance by minute / hour / day -----
    case "list-usage": {
      const SIZE = { minute: 60000, hour: 3600000, day: 86400000 };
      const DEFAULT_WINDOW = { minute: 60, hour: 48, day: 30 };
      const MAX_WINDOW = { minute: 90, hour: 72, day: 90 };
      const b = SIZE[body.bucket] ? body.bucket : "day";
      const size = SIZE[b];
      const window = Math.max(1, Math.min(MAX_WINDOW[b], Number(body.window) || DEFAULT_WINDOW[b]));
      const since = now() - window * size;
      const { results } = await db.prepare(
        "SELECT (ts/?1) AS t, SUM(n) AS count FROM usage_events WHERE account_id=?2 AND ts>=?3 GROUP BY t ORDER BY t"
      ).bind(size, body.account_id, since).all();
      const tot = await db.prepare("SELECT COALESCE(SUM(n),0) AS total FROM usage_events WHERE account_id=?1").bind(body.account_id).first();
      return ok({ bucket: b, window, points: results.map((r) => ({ t: Number(r.t) * size, count: Number(r.count) })), total: Number(tot?.total ?? 0) });
    }

    default:
      return err("unknown_op", 404, { op });
  }
}

async function mintTokens(db, accountId, scope, withRefresh, clientId = null) {
  const accessToken = rand("puid_at_", 32);
  await db.prepare("INSERT INTO oauth_tokens (token_hash,account_id,client_id,scope,exp,kind) VALUES (?1,?2,?3,?4,?5,'access')")
    .bind(await sha256hex(accessToken), accountId, clientId, scope, now() + TOKEN_TTL_MS).run();
  const out = { access_token: accessToken, token_type: "Bearer", expires_in: TOKEN_TTL_MS / 1000, scope };
  if (withRefresh) {
    const refreshToken = rand("puid_rt_", 32);
    await db.prepare("INSERT INTO oauth_tokens (token_hash,account_id,client_id,scope,exp,kind) VALUES (?1,?2,?3,?4,?5,'refresh')")
      .bind(await sha256hex(refreshToken), accountId, clientId, scope, now() + 90 * DAY_MS).run();
    out.refresh_token = refreshToken;
  }
  return ok(out);
}
