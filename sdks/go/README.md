# puid (Go)

The official Go client for the [PUID](https://puid.dev) API — the **Provably Unique
IDentifier** service. Every id is guaranteed distinct by construction, not by the
dice roll a random UUID makes.

- Zero dependencies — standard library only.
- Go 1.22+.

## Install

```sh
go get github.com/jtwebman/puid/sdks/go@latest
```

```go
import puid "github.com/jtwebman/puid/sdks/go"
```

## Quickstart

```go
package main

import (
	"context"
	"fmt"

	puid "github.com/jtwebman/puid/sdks/go"
)

func main() {
	c, err := puid.New(puid.WithAPIKey("puid_live_..."))
	if err != nil {
		panic(err)
	}
	ctx := context.Background()

	id, _ := c.ID(ctx)
	ids, _ := c.IDs(ctx, 5)         // 1–10 per request
	ord, _ := c.Ordinal(ctx, id)    // *big.Int — the counter it encodes
	q, _ := c.Quota(ctx)            // *puid.Quota{Plan, Used, Limit, Remaining}
	fmt.Println(id, ids, ord, q.Remaining)
}
```

Mint an API key in the [dashboard](https://puid.dev/dashboard) after signing in.

## Generating ids on someone else's behalf (OAuth2)

If you've registered an OAuth2 client, exchange its credentials for a bearer token
and generate ids for the account that granted you access — without ever touching
their API key:

```go
c, err := puid.FromClientCredentials(ctx, "client-id", "client-secret")
// optionally: puid.WithScope("puid:generate"), puid.WithEndpoint(...)
```

Already have a bearer token (e.g. from the authorization-code flow)? Use it directly:

```go
c, _ := puid.New(puid.WithAccessToken("puid_at_..."))
```

## Options

- `puid.WithAPIKey(key)` — a team API key (`puid_live_…`).
- `puid.WithAccessToken(token)` — an OAuth2 bearer token (`puid_at_…`).
- `puid.WithEndpoint(url)` — API endpoint. Defaults to `https://puid.dev/api`. Point
  it at a local dev server for tests, or at your own domain for a self-hosted
  (Enterprise) PUID.
- `puid.WithHTTPClient(*http.Client)` — supply your own HTTP client.
- `puid.WithScope(scope)` — OAuth2 scope for `FromClientCredentials` (default `puid:generate`).

## Errors

Every non-2xx response (and client-side validation) returns a `*puid.Error`:

```go
ids, err := c.IDs(ctx, 3)
var pe *puid.Error
if errors.As(err, &pe) {
	pe.Status  // 401 | 402 | 429 | … (0 for client-side/transport errors)
	pe.Code    // "rate_limited" | "quota_exceeded" | "unauthorized" | "network_error" | …
}
```

PUID is rate limited to **one request per second** — that 429 is by design.

## License

AGPL-3.0-only. See [the repository](https://github.com/jtwebman/puid).
