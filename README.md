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

Everything runs on **Cloudflare Workers + D1** (SQLite). Two surfaces on one Worker:

| Surface | What lives there |
|---|---|
| `puid.dev` | Marketing site, interactive docs (`/docs`), login + dashboard (`/dashboard`), OAuth2 consent screen |
| `puid.dev/api` | The JSON API: ids, ordinal, metrics, OAuth2 token/registration, dashboard AJAX |

```
src/
  puid.js        bijective permutation (Feistel) + base62 — the entire IP
  index.js       Worker router: site + auth flows + /api
  data.js        D1 data layer: accounts, M:N memberships, keys, oauth, quota, counter, rate limit
  oauth_login.js INBOUND login — we are the OAuth *client* of Google/Microsoft
  openapi.js     the OpenAPI 3.1 spec (single source of truth) + YAML emitter
  site.js        landing / docs / dashboard HTML
schema/d1.sql    relational schema (users, accounts, memberships, keys, tokens, sequence, …)
extension/postgres/   a `puid` column type whose DEFAULT calls this API on every INSERT
tools/
  gen-openapi.mjs  writes openapi.{json,yaml} from src/openapi.js
  gen-clients.mjs  writes 20 SDKs from src/openapi.js (base URL + X-API-Key come from the spec)
clients/         generated SDKs for 20 languages
```

### Why D1 and not Durable Objects?

We started with Durable Objects (a single-threaded counter is a perfect fit). But once **a user can belong to many accounts and create more**, the data is *relational* (many-to-many memberships) — and modeling that in KV means hand-rolling indexes on both sides. So the relational data moved to **D1**. The counter and the 1/sec rate limiter also live in D1 now (`UPDATE … RETURNING` and an upsert; D1 serializes writes, so both are atomic enough). One storage system, on the free tier.

## Auth

Two OAuth layers, deliberately:

1. **Inbound (we are the client):** "Sign in with Google / Microsoft." We never send email or store passwords — the provider already verified the human, at no cost to us. A login creates a **team/account**; you can create more and switch between them; owners can invite teammates (accepting an invite *adds* a membership — you keep your other accounts).
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

## Deploy

```bash
npm install                       # wrangler
wrangler d1 create puid           # paste the database_id into wrangler.toml
wrangler d1 execute puid --file=schema/d1.sql --remote

# inbound social-login secrets (register apps in Google Cloud + Azure first):
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put MICROSOFT_CLIENT_ID
wrangler secret put MICROSOFT_CLIENT_SECRET

wrangler deploy
```

**OAuth redirect URIs** to register with each provider:
`https://puid.dev/auth/callback/google` and `https://puid.dev/auth/callback/microsoft`.

**Domain:** point `puid.dev`'s nameservers at Cloudflare; once the zone is active, the `routes` entry in `wrangler.toml` serves the Worker on the apex.

## SDKs

20 languages, generated from the spec (`node tools/gen-clients.mjs`): Python, Node, TypeScript, Go, Rust, Ruby, PHP, Java, Kotlin, Swift, C#, C, C++, Bash, Perl, Elixir, Scala, Dart, R, Lua. All read `PUID_API_KEY` from the environment.

```python
import puid                       # clients/python/puid.py
ids = puid.generate(3)
print(ids[0], "was secretly #", puid.ordinal(ids[0]))
```

## License

MIT. The math is free. The shame is included at no extra charge.
