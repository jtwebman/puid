# puid-client

The official Python client for the [PUID](https://puid.dev) API — the **Provably
Unique IDentifier** service. Every id is guaranteed distinct by construction, not by
the dice roll a random UUID makes.

- Zero dependencies — built on the standard library (`urllib`).
- Python 3.9+.

## Install

```sh
pip install puid-client
```

## Quickstart

```python
from puid import Puid

puid = Puid(api_key="puid_live_...")  # mint one in the dashboard

one = puid.id()
ids = puid.ids(5)          # 1–10 per request
ordinal = puid.ordinal(one)  # int — the counter it encodes
quota = puid.quota()         # {"plan", "used", "limit", "remaining"}
```

Mint an API key in the [dashboard](https://puid.dev/dashboard) after signing in.

## Generating ids on someone else's behalf (OAuth2)

If you've registered an OAuth2 client, exchange its credentials for a bearer token
and generate ids for the account that granted you access — without ever touching
their API key:

```python
from puid import Puid

puid = Puid.from_client_credentials(
    client_id="...",
    client_secret="...",
    scope="puid:generate",  # default
)
puid.ids(3)
```

Already have a bearer token (e.g. from the authorization-code flow)? Pass it directly:

```python
puid = Puid(access_token="puid_at_...")
```

## API

### `Puid(api_key=None, access_token=None, endpoint="https://puid.dev/api", opener=None)`

Provide exactly one of `api_key` or `access_token`.

- `endpoint` — API endpoint. Defaults to `https://puid.dev/api`. Point it at a local
  dev server for tests, or at your own domain for a self-hosted (Enterprise) PUID.
- `opener` — an optional `urllib` opener (advanced / testing).

### Methods

- `ids(count=1) -> list[str]` — generate 1–10 ids.
- `id() -> str` — generate a single id.
- `ordinal(puid) -> int` — decode an id back to its counter value.
- `quota() -> dict` — check today's quota; does not spend an id.
- `Puid.from_client_credentials(client_id, client_secret, scope="puid:generate", endpoint=...) -> Puid`

### Self-hosted / Enterprise

```python
puid = Puid(api_key="...", endpoint="https://ids.yourcompany.com/api")
```

## Errors

Every non-2xx response (and client-side validation) raises `PuidError`:

```python
from puid import Puid, PuidError

try:
    puid.ids(3)
except PuidError as err:
    err.status  # 401 | 402 | 429 | … (None for client-side/network errors)
    err.code    # "rate_limited" | "quota_exceeded" | "unauthorized" | "network_error" | …
```

Common server codes: `unauthorized` (401), `quota_exceeded` (402),
`rate_limited` (429). PUID is rate limited to **one request per second** — that 429
is by design.

## License

AGPL-3.0-only. See [the repository](https://github.com/jtwebman/puid).
