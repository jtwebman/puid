# PUID — Probably Unique IDentifier

> Like a UUID, but it's a counter wearing a trench coat.

A deliberately over-engineered joke API that hands out identifiers which are:

- **Provably 100% collision-free.** Not "astronomically unlikely" like a random UUIDv4 — *provably*. Each id is a sequential counter (`1, 2, 3, …`) run through a **bijective 128-bit permutation**. A bijection maps distinct inputs to distinct outputs by definition, so two different counters can *never* produce the same id. We beat UUIDv4 at its only job, using `i++`.
- **Indistinguishable from random.** Id `#1` is `64qAN39GjJh5kbi4HROOxh`. You cannot tell it's a counter… until you call `GET /api/v1/ordinal/:id`, which decrypts it right back to `#1`. The service rats out its own ids.
- **Aggressively rate limited.** One request per second, 1–10 ids per request. This is not a limitation. It is the entire value proposition.

base62 (URL-safe), up to 22 characters — the width of an unsigned 128-bit value.

**Please do not use this in production.**

## How the trick works

A real UUIDv4 is random, so its uniqueness is *probabilistic* (collision chance > 0). PUID inverts the trade:

```
ordinal (1,2,3…) ──▶ 4-round Feistel permutation (128-bit) ──▶ base62 ──▶ "64qAN39Gj…"
                          (a bijection, so collision-free)        (URL-safe)
```

A Feistel network is a bijection for *any* round function — you invert it by running the rounds backwards — which is why `/ordinal` can decode any id back to its counter value. The counter itself is a humble 64-bit integer (good until roughly the year 29-billion at 10 ids/sec); the 128-bit width is produced by the permutation, not stored.

Proof, not vibes: `npm test` encodes the first 2,000,000 ordinals and asserts **zero collisions** plus full roundtrip.

## Architecture

A **SvelteKit** app (Svelte 5 + Tailwind v4) on **Cloudflare Workers + D1** via `@sveltejs/adapter-cloudflare` — the same stack as the sibling sites `slowbreath`/`onyourfeet`. Two surfaces, one deploy:

| Surface | What lives there |
|---|---|
| `puid.dev` | Marketing site, interactive docs (`/docs`), login + dashboard (`/dashboard`), upgrade/paywall (`/upgrade`) — Svelte pages, mobile-first, light/dark, 20 languages |
| `puid.dev/api` | The JSON API: ids, ordinal, metrics, OAuth2, dashboard AJAX — served by the router |

```
src/
  app.html, app.css        shell + Tailwind v4 (class-based .dark, no-FOUC theme script)
  hooks.server.js          delegates /api,/auth,/oauth,/join to the router; sets <html lang/dir>
  lib/
    puid.js                bijective permutation (Feistel) + base62 — the entire IP
    openapi.js             OpenAPI 3.1 spec (single source of truth) + YAML emitter
    i18n.js                20-locale message dictionary + locale negotiation
    ThemeToggle.svelte, LanguageSwitcher.svelte   top-right dropdowns
    server/
      router.js            the API + browser auth flows (Response or null)
      data.js              D1 layer: accounts, M:N memberships, keys, oauth, quota, counter, usage, rate limit
      oauth_login.js       INBOUND login — we are the OAuth *client* of Google/Microsoft
  routes/
    +layout.svelte, +page.svelte (landing), docs/, dashboard/, upgrade/
schema/d1.sql              relational schema (users, accounts, memberships, keys, tokens, sequence, usage_events)
extension/postgres/        a `puid` column type whose DEFAULT calls this API on every INSERT
tools/                     gen-openapi.mjs + gen-clients.mjs (generate openapi.{json,yaml} + 20 SDKs from the spec)
clients/                   generated SDKs for 20 languages
e2e/                       Playwright API + browser tests
```

### Web app

Mobile-first, responsive, **light/dark** (system default + a top-right dropdown, class-based like the sibling sites), and **internationalized into 20 languages** (incl. RTL Arabic/Hebrew) — language is negotiated from `Accept-Language` and switchable via a dropdown; long-form copy falls back to English. The dashboard signs you in, mints keys, generates ids (and decodes them live), manages accounts/teams/join-codes, and shows a per-account usage chart. `/upgrade` is the paywall gag.

### Why D1 and not Durable Objects?

We started with Durable Objects (a single-threaded counter is a perfect fit). But once **a user can belong to many accounts and create more**, the data is *relational* (many-to-many memberships) — and modeling that in KV means hand-rolling indexes on both sides. So the relational data moved to **D1**. The counter and the 1/sec rate limiter also live in D1 now (`UPDATE … RETURNING` and an upsert; D1 serializes writes, so both are atomic enough). One storage system, on the free tier.

## Auth

Two OAuth layers, deliberately:

1. **Inbound (we are the client):** "Sign in with Google / Microsoft." We never send email or store passwords — the provider already verified the human, at no cost to us. A login creates a **team/account**; you can create more and switch between them. Owners share a **reusable, revocable join code** (`puid.dev/join/<code>`): anyone with it joins as a member (after signing in); rotating it kills the old code, revoking disables joining. Joining *adds* a membership — you keep your other accounts.
2. **Outbound (we are the provider):** a full OAuth2 authorization server (`/oauth/authorize`, `/api/oauth/token`, dynamic client registration, **PKCE**, refresh tokens, `client_credentials`) so third-party apps can call the API on a team's behalf. Discovery at `/api/.well-known/oauth-authorization-server`.

SDKs and direct calls authenticate with a **team API key** (`X-API-Key: puid_live_…`), minted in the dashboard.

## What does it cost to run?

You opted into the **$5/mo Workers Paid plan** — but the usage itself rounds to zero, because the joke *is* the cost control:

| Resource | Notes | Cost |
|---|---|---|
| Workers Paid plan | the floor | **$5/mo** |
| Requests | rate-limited to 1/sec/account; can't run up a bill | ~$0 |
| D1 storage/reads/writes | a few MB; 1 atomic counter-write per request (no waste, no buffering) | ~$0 |
| `puid.dev` domain | you bought it on Namecheap → move nameservers to Cloudflare | ~$12/yr |

> The 1-req/sec limit and 1000/day free quota you designed for comedy are also exactly what pins the infra bill to ~$5/mo. The cost control *is* the bit.
> (It would even run at **$0** on the free plan if you dropped to `*.workers.dev` and skipped Durable Objects — which we did. The $5 is now just headroom.)

## Develop & test

```bash
npm install
npm run dev          # vite dev on :8799 (adapter emulates D1 + reads .dev.vars)
npm test             # node unit proof: 2,000,000 ids, 0 collisions, roundtrip
npm run test:e2e     # Playwright: API (request fixture) + browser flows, against vite dev
```

Local dev/tests use a `.dev.vars` flag `ALLOW_DEV_LOGIN=1` to enable `/auth/dev-login`, a test-only stand-in for Google/Microsoft sign-in (never set in production). To exercise the *real* OAuth flow locally, register `http://localhost:8799/auth/callback/{google,microsoft}` and fill the client id/secrets in `.dev.vars`.

## Deploy

```bash
npm install
wrangler d1 create puid                              # paste database_id into wrangler.jsonc
wrangler d1 execute puid --file=schema/d1.sql --remote

# inbound social-login secrets (register apps in Google Cloud + Azure first):
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put MICROSOFT_CLIENT_ID
wrangler secret put MICROSOFT_CLIENT_SECRET

npm run deploy                                       # vite build && wrangler deploy
```

**OAuth redirect URIs** to register with each provider:
`https://puid.dev/auth/callback/google` and `https://puid.dev/auth/callback/microsoft`.

**Domain:** point `puid.dev`'s nameservers at Cloudflare; once the zone is active, add a `routes` custom-domain entry in `wrangler.jsonc`.

## SDKs

20 languages, generated from the spec (`node tools/gen-clients.mjs`): Python, Node, TypeScript, Go, Rust, Ruby, PHP, Java, Kotlin, Swift, C#, C, C++, Bash, Perl, Elixir, Scala, Dart, R, Lua. All read `PUID_API_KEY` from the environment.

```python
import puid                       # clients/python/puid.py
ids = puid.generate(3)
print(ids[0], "was secretly #", puid.ordinal(ids[0]))
```

## License

MIT. The math is free. The shame is included at no extra charge.
