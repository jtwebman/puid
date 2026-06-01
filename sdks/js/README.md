# @puid-dev/client

The official JavaScript / Node.js client for the [PUID](https://puid.dev) API — the
**Provably Unique IDentifier** service. Every id is guaranteed distinct by
construction, not by the dice roll a random UUID makes.

- Zero dependencies. Uses the built-in `fetch`.
- Node 18+ (or any runtime with a WHATWG `fetch`; you can also inject one).
- ESM, with TypeScript types included.

## Install

```sh
npm install @puid-dev/client
```

## Quickstart

```js
import { Puid } from "@puid-dev/client";

const puid = new Puid({ apiKey: process.env.PUID_API_KEY }); // puid_live_…

const id = await puid.id();
const ids = await puid.ids(5); // 1–10 per request
const ordinal = await puid.ordinal(id); // bigint — the counter it encodes
const quota = await puid.quota(); // { plan, used, limit, remaining }
```

Mint an API key in the [dashboard](https://puid.dev/dashboard) after signing in.

## Generating ids on someone else's behalf (OAuth2)

If you've registered an OAuth2 client, exchange its credentials for a bearer token
and generate ids for the account that granted you access — without ever touching
their API key:

```js
import { Puid } from "@puid-dev/client";

const puid = await Puid.fromClientCredentials({
  clientId: process.env.PUID_CLIENT_ID,
  clientSecret: process.env.PUID_CLIENT_SECRET,
  scope: "puid:generate", // default
});

await puid.ids(3);
```

Already have a bearer token (e.g. from the authorization-code flow)? Pass it
directly:

```js
const puid = new Puid({ accessToken: "puid_at_…" });
```

## API

### `new Puid(options)`

| option        | type     | description                                                                                                                                            |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apiKey`      | string   | A team API key (`puid_live_…`). Mutually exclusive with `accessToken`.                                                                                 |
| `accessToken` | string   | An OAuth2 bearer token (`puid_at_…`).                                                                                                                  |
| `endpoint`    | string   | API endpoint. Defaults to `https://puid.dev/api`. Point it at a local dev server for tests, or at your own domain for a self-hosted (Enterprise) PUID. |
| `fetch`       | function | A `fetch` implementation. Defaults to the global `fetch`.                                                                                              |

### Self-hosted / Enterprise

Running your own PUID? Point the client at your domain:

```js
const puid = new Puid({ apiKey: "...", endpoint: "https://ids.yourcompany.com/api" });
```

### Methods

- `ids(count = 1): Promise<string[]>` — generate 1–10 ids.
- `id(): Promise<string>` — generate a single id.
- `ordinal(puid): Promise<bigint>` — decode an id back to its counter value.
- `quota(): Promise<{ plan, used, limit, remaining }>` — check today's quota; does not spend an id.
- `static fromClientCredentials(options): Promise<Puid>` — mint a bearer token from an OAuth2 client.

## Errors

Every non-2xx response (and client-side validation) throws a `PuidError`:

```js
import { Puid, PuidError } from "@puid-dev/client";

try {
  await puid.ids(3);
} catch (err) {
  if (err instanceof PuidError) {
    err.status; // 401 | 402 | 429 | … (null for client-side/network errors)
    err.code; // "rate_limited" | "quota_exceeded" | "unauthorized" | "network_error" | …
  }
}
```

Common server codes: `unauthorized` (401), `quota_exceeded` (402),
`rate_limited` (429, one request per second). PUID is rate limited to **one
request per second** — that 429 is by design.

## License

AGPL-3.0-only. See [the repository](https://github.com/jtwebman/puid).
