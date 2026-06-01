package dev.puid;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import com.sun.net.httpserver.HttpServer;
import java.math.BigInteger;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;

/**
 * Integration suite for the JVM client — runs against a REAL PUID instance. Point it at a running
 * server with PUID_ENDPOINT (default http://localhost:8799/api). Live tests are skipped (via
 * assumptions) when the server is unreachable.
 */
class PuidTest {

  private static String endpoint() {
    String e = System.getenv("PUID_ENDPOINT");
    return stripSlash(e != null && !e.isEmpty() ? e : "http://localhost:8799/api");
  }

  private static String origin() {
    String o = System.getenv("PUID_ORIGIN");
    if (o != null && !o.isEmpty()) {
      return stripSlash(o);
    }
    return endpoint().replaceFirst("/api$", "");
  }

  private static String stripSlash(String s) {
    return s.endsWith("/") ? s.substring(0, s.length() - 1) : s;
  }

  private static String enc(String s) {
    return URLEncoder.encode(s, StandardCharsets.UTF_8);
  }

  private static String uniqEmail(String tag) {
    return tag + "-" + UUID.randomUUID() + "@example.com";
  }

  private static HttpClient http1() {
    return HttpClient.newBuilder().version(HttpClient.Version.HTTP_1_1).build();
  }

  private static boolean serverUp() {
    try {
      http1()
          .send(
              HttpRequest.newBuilder(URI.create(endpoint() + "/openapi.json")).GET().build(),
              BodyHandlers.discarding());
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  // dev-login (gated by ALLOW_DEV_LOGIN) returns a 302 + Set-Cookie. We capture the
  // session cookie ourselves and send a plain Cookie header — Java's CookieManager
  // re-emits cookies in an RFC 2965 form the server doesn't parse.
  private static String devCookie(String email) throws Exception {
    HttpResponse<Void> resp =
        http1()
            .send(
                HttpRequest.newBuilder(
                        URI.create(
                            origin() + "/auth/dev-login?email=" + enc(email) + "&next=/dashboard"))
                    .GET()
                    .build(),
                BodyHandlers.discarding());
    StringBuilder cookie = new StringBuilder();
    for (String setCookie : resp.headers().allValues("set-cookie")) {
      if (cookie.length() > 0) {
        cookie.append("; ");
      }
      cookie.append(setCookie.split(";", 2)[0]);
    }
    return cookie.toString();
  }

  private static String mintKey(String cookie) throws Exception {
    String body =
        http1()
            .send(
                HttpRequest.newBuilder(URI.create(origin() + "/dashboard/api/team/keys"))
                    .header("Content-Type", "application/json")
                    .header("Cookie", cookie)
                    .POST(HttpRequest.BodyPublishers.ofString("{\"label\":\"java-test\"}"))
                    .build(),
                BodyHandlers.ofString())
            .body();
    return String.valueOf(Json.parseObject(body).get("api_key"));
  }

  private static void seedUsage(String cookie, int n) throws Exception {
    http1()
        .send(
            HttpRequest.newBuilder(URI.create(origin() + "/dashboard/api/dev/seed-usage?n=" + n))
                .header("Cookie", cookie)
                .GET()
                .build(),
            BodyHandlers.discarding());
  }

  private static String[] registerClient(String name) throws Exception {
    String payload =
        "{\"client_name\":\"" + name + "\",\"redirect_uris\":[\"https://example.test/cb\"]}";
    String body =
        http1()
            .send(
                HttpRequest.newBuilder(URI.create(endpoint() + "/oauth/register"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build(),
                BodyHandlers.ofString())
            .body();
    Map<String, Object> m = Json.parseObject(body);
    return new String[] {
      String.valueOf(m.get("client_id")), String.valueOf(m.get("client_secret"))
    };
  }

  // --- real service ---------------------------------------------------------

  @Test
  void idsUnique() throws Exception {
    assumeTrue(serverUp(), "PUID server not reachable");
    String key = mintKey(devCookie(uniqEmail("ids")));
    List<String> ids = Puid.builder().apiKey(key).endpoint(endpoint()).build().ids(10);
    assertEquals(10, ids.size());
    assertEquals(10, new HashSet<>(ids).size());
    for (String id : ids) {
      assertFalse(id.isEmpty());
    }
  }

  @Test
  void idSingle() throws Exception {
    assumeTrue(serverUp(), "PUID server not reachable");
    String key = mintKey(devCookie(uniqEmail("single")));
    assertFalse(Puid.builder().apiKey(key).endpoint(endpoint()).build().id().isEmpty());
  }

  @Test
  void ordinalConsecutive() throws Exception {
    assumeTrue(serverUp(), "PUID server not reachable");
    String key = mintKey(devCookie(uniqEmail("ord")));
    Puid puid = Puid.builder().apiKey(key).endpoint(endpoint()).build();
    List<String> ids = puid.ids(2); // one rate-limited request; ordinal is not rate limited
    BigInteger a = puid.ordinal(ids.get(0));
    BigInteger b = puid.ordinal(ids.get(1));
    assertTrue(a.signum() > 0);
    assertEquals(BigInteger.ONE, b.subtract(a));
  }

  @Test
  void endpointTrailingSlash() throws Exception {
    assumeTrue(serverUp(), "PUID server not reachable");
    String key = mintKey(devCookie(uniqEmail("slash")));
    assertFalse(Puid.builder().apiKey(key).endpoint(endpoint() + "/").build().id().isEmpty());
  }

  @Test
  void quotaDoesNotSpend() throws Exception {
    assumeTrue(serverUp(), "PUID server not reachable");
    String key = mintKey(devCookie(uniqEmail("quota")));
    Puid puid = Puid.builder().apiKey(key).endpoint(endpoint()).build();
    Quota before = puid.quota();
    Quota after = puid.quota();
    assertFalse(before.getPlan().isEmpty());
    assertEquals(before.getUsed(), after.getUsed());
  }

  @Test
  void badKey401() {
    assumeTrue(serverUp(), "PUID server not reachable");
    Puid puid = Puid.builder().apiKey("puid_live_definitely_not_real").endpoint(endpoint()).build();
    PuidError e = assertThrows(PuidError.class, puid::id);
    assertEquals(401, e.status().intValue());
    assertEquals("unauthorized", e.code());
  }

  @Test
  void quotaExceeded402() throws Exception {
    assumeTrue(serverUp(), "PUID server not reachable");
    String cookie = devCookie(uniqEmail("over-quota"));
    seedUsage(cookie, 1000); // free plan = 1000/day
    Puid puid = Puid.builder().apiKey(mintKey(cookie)).endpoint(endpoint()).build();
    assertEquals(402, assertThrows(PuidError.class, puid::id).status().intValue());
  }

  @Test
  void rateLimit429() throws Exception {
    assumeTrue(serverUp(), "PUID server not reachable");
    String key = mintKey(devCookie(uniqEmail("rate")));
    Puid puid = Puid.builder().apiKey(key).endpoint(endpoint()).build();
    puid.id(); // first request allowed
    PuidError e = assertThrows(PuidError.class, puid::id);
    assertEquals(429, e.status().intValue());
    assertEquals("rate_limited", e.code());
  }

  @Test
  void fromClientCredentials() throws Exception {
    assumeTrue(serverUp(), "PUID server not reachable");
    String[] cc = registerClient("java-cc-test");
    Puid puid = Puid.fromClientCredentials(cc[0], cc[1], endpoint(), "puid:generate");
    assertEquals(2, puid.ids(2).size());
  }

  @Test
  void fromClientCredentialsBad() {
    assumeTrue(serverUp(), "PUID server not reachable");
    PuidError e =
        assertThrows(
            PuidError.class,
            () -> Puid.fromClientCredentials("nope", "wrong", endpoint(), "puid:generate"));
    assertTrue(e.status() != null && e.status() >= 400);
  }

  // --- client-side validation ------------------------------------------------

  @Test
  void defaultEndpoint() {
    assertEquals("https://puid.dev/api", Puid.DEFAULT_ENDPOINT);
  }

  @Test
  void requiresExactlyOneCredential() {
    assertThrows(PuidError.class, () -> Puid.builder().build());
    assertThrows(PuidError.class, () -> Puid.builder().apiKey("k").accessToken("t").build());
  }

  @Test
  void idsValidation() {
    Puid puid = Puid.builder().apiKey("k").endpoint(endpoint()).build();
    assertEquals("invalid_count", assertThrows(PuidError.class, () -> puid.ids(0)).code());
    assertEquals("invalid_count", assertThrows(PuidError.class, () -> puid.ids(11)).code());
  }

  @Test
  void ordinalValidation() {
    Puid puid = Puid.builder().apiKey("k").endpoint(endpoint()).build();
    assertEquals("invalid_puid", assertThrows(PuidError.class, () -> puid.ordinal("")).code());
  }

  @Test
  void fromClientCredentialsRequiresArgs() {
    assertThrows(
        PuidError.class, () -> Puid.fromClientCredentials("only", "", endpoint(), "puid:generate"));
  }

  // --- cases a live endpoint can't produce -----------------------------------

  @Test
  void nonJsonErrorBody() throws Exception {
    HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
    server.createContext(
        "/",
        ex -> {
          byte[] body = "<html>nope</html>".getBytes(StandardCharsets.UTF_8);
          ex.getResponseHeaders().add("Content-Type", "text/html");
          ex.sendResponseHeaders(502, body.length);
          ex.getResponseBody().write(body);
          ex.close();
        });
    server.start();
    try {
      Puid puid =
          Puid.builder()
              .apiKey("k")
              .endpoint("http://127.0.0.1:" + server.getAddress().getPort())
              .build();
      PuidError e = assertThrows(PuidError.class, puid::id);
      assertEquals(502, e.status().intValue());
      assertNull(e.code());
      assertTrue(e.getMessage().contains("HTTP 502"));
    } finally {
      server.stop(0);
    }
  }

  @Test
  void networkError() {
    Puid puid = Puid.builder().apiKey("k").endpoint("http://127.0.0.1:1/api").build();
    assertEquals("network_error", assertThrows(PuidError.class, puid::id).code());
  }
}
