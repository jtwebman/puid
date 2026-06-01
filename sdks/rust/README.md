# puid-client (Rust)

The official Rust client for the [PUID](https://puid.dev) API — the **Provably Unique
IDentifier** service. Every id is guaranteed distinct by construction, not by the
dice roll a random UUID makes.

- Minimal dependencies — blocking `ureq` + `serde` (Rust's std has no HTTP client).
- The crate is `puid-client`; the library is imported as `puid`.

## Install

```sh
cargo add puid-client
```

## Quickstart

```rust
use puid::Puid;

fn main() -> Result<(), puid::PuidError> {
    let puid = Puid::with_api_key("puid_live_..."); // mint one in the dashboard

    let one = puid.id()?;
    let ids = puid.ids(5)?;          // 1–10 per request
    let ordinal = puid.ordinal(&one)?; // u128 — the counter it encodes
    let quota = puid.quota()?;         // Quota { plan, used, limit, remaining }
    println!("{one} was #{ordinal}; {:?} remaining", quota.remaining);
    Ok(())
}
```

Mint an API key in the [dashboard](https://puid.dev/dashboard) after signing in.

## Generating ids on someone else's behalf (OAuth2)

If you've registered an OAuth2 client, exchange its credentials for a bearer token
and generate ids for the account that granted you access — without ever touching
their API key:

```rust
use puid::{ClientCredentials, Puid};

// convenience (defaults: production endpoint, scope "puid:generate")
let puid = Puid::from_client_credentials("client-id", "client-secret")?;

// or customize
let puid = ClientCredentials::new("client-id", "client-secret")
    .scope("puid:generate")
    .endpoint("https://puid.dev/api")
    .exchange()?;
# Ok::<(), puid::PuidError>(())
```

Already have a bearer token (e.g. from the authorization-code flow)? Use it directly:

```rust
let puid = puid::Puid::with_access_token("puid_at_...");
```

## Endpoint (local / self-hosted)

```rust
let puid = puid::Puid::with_api_key("...").endpoint("https://ids.yourcompany.com/api");
```

Defaults to `https://puid.dev/api`. Point it at a local dev server for tests, or at
your own domain for a self-hosted (Enterprise) PUID.

## Errors

Every non-2xx response (and client-side validation) returns a `PuidError`:

```rust
match puid.ids(3) {
    Ok(ids) => { /* … */ }
    Err(e) => {
        e.status; // Some(401|402|429|…) — None for client-side/transport errors
        e.code;   // Some("rate_limited" | "quota_exceeded" | "unauthorized" | "network_error" | …)
    }
}
```

PUID is rate limited to **one request per second** — that 429 is by design.

## License

AGPL-3.0-only. See [the repository](https://github.com/jtwebman/puid).
