# dev.puid:puid-client (JVM — Java / Kotlin / Scala)

The official JVM client for the [PUID](https://puid.dev) API — the **Provably Unique
IDentifier** service. Every id is guaranteed distinct by construction, not by the dice
roll a random UUID makes.

- Zero runtime dependencies — built on the JDK's `java.net.http` + a tiny JSON parser.
- Java 11+. Usable as-is from **Java, Kotlin, and Scala** (one artifact, full JVM interop).

## Install

Maven:

```xml
<dependency>
  <groupId>dev.puid</groupId>
  <artifactId>puid-client</artifactId>
  <version>1.0.0</version>
</dependency>
```

Gradle:

```kotlin
implementation("dev.puid:puid-client:1.0.0")
```

## Quickstart (Java)

```java
import dev.puid.Puid;

Puid puid = Puid.withApiKey("puid_live_..."); // mint one in the dashboard

String one = puid.id();
java.util.List<String> ids = puid.ids(5);          // 1–10 per request
java.math.BigInteger ordinal = puid.ordinal(one);  // the counter it encodes (up to 128-bit)
dev.puid.Quota quota = puid.quota();
```

### Kotlin

```kotlin
import dev.puid.Puid

val puid = Puid.withApiKey("puid_live_...")
val ids = puid.ids(5)
val ordinal = puid.ordinal(ids[0])
val remaining = puid.quota().remaining
```

### Scala

```scala
import dev.puid.Puid

val puid = Puid.withApiKey("puid_live_...")
val ids = puid.ids(5)
val ordinal = puid.ordinal(ids.get(0))
```

Mint an API key in the [dashboard](https://puid.dev/dashboard) after signing in.

## Generating ids on someone else's behalf (OAuth2)

If you've registered an OAuth2 client, exchange its credentials for a bearer token and
generate ids for the account that granted you access — without ever touching their API key:

```java
Puid puid = Puid.fromClientCredentials("client-id", "client-secret");
// or: Puid.fromClientCredentials(id, secret, "https://puid.dev/api", "puid:generate");
```

Already have a bearer token (e.g. from the authorization-code flow)?

```java
Puid puid = Puid.withAccessToken("puid_at_...");
```

## Endpoint (local / self-hosted)

```java
Puid puid = Puid.builder().apiKey("...").endpoint("https://ids.yourcompany.com/api").build();
```

Defaults to `https://puid.dev/api`. Point it at a local dev server for tests, or at your
own domain for a self-hosted (Enterprise) PUID. You can also supply your own
`HttpClient` via `.httpClient(...)`.

## Errors

Every non-2xx response (and client-side validation) throws `dev.puid.PuidError`:

```java
try {
  puid.ids(3);
} catch (dev.puid.PuidError e) {
  e.status(); // 401 | 402 | 429 | … (null for client-side/transport errors)
  e.code();   // "rate_limited" | "quota_exceeded" | "unauthorized" | "network_error" | …
}
```

PUID is rate limited to **one request per second** — that 429 is by design.

## License

AGPL-3.0-only. See [the repository](https://github.com/jtwebman/puid).
