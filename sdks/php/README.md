# jtwebman/puid (PHP)

The official PHP client for the [PUID](https://puid.dev) API — the **Provably Unique
IDentifier** service. Every id is guaranteed distinct by construction, not by the
dice roll a random UUID makes.

- Zero userland dependencies — uses the `curl` extension.
- PHP 8.1+.

## Install

```sh
composer require jtwebman/puid
```

## Quickstart

```php
use Puid\Client;

$puid = new Client(apiKey: 'puid_live_...'); // mint one in the dashboard

$one     = $puid->id();
$ids     = $puid->ids(5);          // 1–10 per request
$ordinal = $puid->ordinal($one);   // decimal string — the counter it encodes
$quota   = $puid->quota();         // ['plan' => ..., 'used' => ..., 'limit' => ..., 'remaining' => ...]
```

Mint an API key in the [dashboard](https://puid.dev/dashboard) after signing in.

> `ordinal()` returns a **string** because the value can exceed PHP's 64-bit integer
> range. Use it as-is, or with `bcmath`/`gmp` if you need arithmetic.

## Generating ids on someone else's behalf (OAuth2)

If you've registered an OAuth2 client, exchange its credentials for a bearer token
and generate ids for the account that granted you access — without ever touching
their API key:

```php
$puid = Puid\Client::fromClientCredentials('client-id', 'client-secret'); // scope defaults to "puid:generate"
$puid->ids(3);
```

Already have a bearer token (e.g. from the authorization-code flow)? Use it directly:

```php
$puid = new Puid\Client(accessToken: 'puid_at_...');
```

## Endpoint (local / self-hosted)

```php
$puid = new Puid\Client(apiKey: '...', endpoint: 'https://ids.yourcompany.com/api');
```

Defaults to `https://puid.dev/api`. Point it at a local dev server for tests, or at
your own domain for a self-hosted (Enterprise) PUID.

## Errors

Every non-2xx response (and client-side validation) throws `Puid\PuidError`:

```php
try {
    $puid->ids(3);
} catch (Puid\PuidError $e) {
    $e->status; // 401 | 402 | 429 | … (null for client-side/transport errors)
    $e->errorCode;   // "rate_limited" | "quota_exceeded" | "unauthorized" | "network_error" | …
}
```

PUID is rate limited to **one request per second** — that 429 is by design.

## License

AGPL-3.0-only. See [the repository](https://github.com/jtwebman/puid).
