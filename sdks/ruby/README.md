# puid (Ruby)

The official Ruby client for the [PUID](https://puid.dev) API — the **Provably Unique
IDentifier** service. Every id is guaranteed distinct by construction, not by the
dice roll a random UUID makes.

- Zero dependencies — standard library only (`net/http`).
- Ruby 3.0+.

## Install

```sh
gem install puid
```

Or in a Gemfile: `gem "puid"`.

## Quickstart

```ruby
require "puid"

puid = Puid::Client.new(api_key: "puid_live_...") # mint one in the dashboard

one     = puid.id
ids     = puid.ids(5)          # 1–10 per request
ordinal = puid.ordinal(one)    # Integer — the counter it encodes
quota   = puid.quota           # { "plan" => ..., "used" => ..., "limit" => ..., "remaining" => ... }
```

Mint an API key in the [dashboard](https://puid.dev/dashboard) after signing in.

## Generating ids on someone else's behalf (OAuth2)

If you've registered an OAuth2 client, exchange its credentials for a bearer token
and generate ids for the account that granted you access — without ever touching
their API key:

```ruby
puid = Puid::Client.from_client_credentials(
  client_id: "...",
  client_secret: "...",
  scope: "puid:generate" # default
)
puid.ids(3)
```

Already have a bearer token (e.g. from the authorization-code flow)? Use it directly:

```ruby
puid = Puid::Client.new(access_token: "puid_at_...")
```

## Endpoint (local / self-hosted)

```ruby
puid = Puid::Client.new(api_key: "...", endpoint: "https://ids.yourcompany.com/api")
```

Defaults to `https://puid.dev/api`. Point it at a local dev server for tests, or at
your own domain for a self-hosted (Enterprise) PUID.

## Errors

Every non-2xx response (and client-side validation) raises `Puid::Error`:

```ruby
begin
  puid.ids(3)
rescue Puid::Error => e
  e.status # 401 | 402 | 429 | … (nil for client-side/transport errors)
  e.code   # "rate_limited" | "quota_exceeded" | "unauthorized" | "network_error" | …
end
```

PUID is rate limited to **one request per second** — that 429 is by design.

## License

AGPL-3.0-only. See [the repository](https://github.com/jtwebman/puid).
