package dev.puid;

import java.math.BigInteger;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Official JVM client for the PUID API — the Provably Unique IDentifier service. Every id is
 * guaranteed distinct by construction (a counter run through a 128-bit permutation), not by the
 * dice roll a random UUID makes. Usable from Java, Kotlin, and Scala.
 *
 * <pre>{@code
 * Puid puid = Puid.withApiKey("puid_live_...");
 * List<String> ids = puid.ids(5);            // 1–10 per request
 * BigInteger ordinal = puid.ordinal(ids.get(0));
 * Quota quota = puid.quota();
 * }</pre>
 */
public final class Puid {

  /**
   * The production API endpoint. Override via the builder for local tests or a self-hosted PUID.
   */
  public static final String DEFAULT_ENDPOINT = "https://puid.dev/api";

  private final String endpoint;
  private final String authName;
  private final String authValue;
  private final HttpClient http;

  private Puid(String endpoint, String authName, String authValue, HttpClient http) {
    this.endpoint = stripTrailingSlash(endpoint);
    this.authName = authName;
    this.authValue = authValue;
    this.http = http != null ? http : defaultHttpClient();
  }

  /** Authenticate with a team API key (puid_live_…). */
  public static Puid withApiKey(String apiKey) {
    return builder().apiKey(apiKey).build();
  }

  /** Authenticate with an OAuth2 bearer token (puid_at_…). */
  public static Puid withAccessToken(String accessToken) {
    return builder().accessToken(accessToken).build();
  }

  public static Builder builder() {
    return new Builder();
  }

  /** Generate {@code count} ids (1–10). */
  public List<String> ids(int count) {
    if (count < 1 || count > 10) {
      throw new PuidError("count must be between 1 and 10", null, "invalid_count");
    }
    Object ids = get("/v1/ids?n=" + count).get("ids");
    List<String> out = new ArrayList<>();
    if (ids instanceof List) {
      for (Object o : (List<?>) ids) {
        out.add(String.valueOf(o));
      }
    }
    return out;
  }

  /** Generate a single id. */
  public String id() {
    return ids(1).get(0);
  }

  /** Decode a PUID back to the counter value it encodes (up to 128 bits → {@link BigInteger}). */
  public BigInteger ordinal(String puid) {
    if (puid == null || puid.isEmpty()) {
      throw new PuidError("puid must be a non-empty string", null, "invalid_puid");
    }
    return new BigInteger(str(get("/v1/ordinal/" + encode(puid)).get("ordinal")));
  }

  /** Today's usage and remaining daily quota. Does not spend an id. */
  public Quota quota() {
    Map<String, Object> b = get("/v1/quota");
    return new Quota(
        str(b.get("plan")),
        asLong(b.get("used")),
        asLongOrNull(b.get("limit")),
        asLongOrNull(b.get("remaining")));
  }

  /**
   * Exchange OAuth2 client credentials for a bearer token and return a ready client. This is how an
   * app generates ids on a team's behalf without ever handling the team's API key.
   */
  public static Puid fromClientCredentials(String clientId, String clientSecret) {
    return fromClientCredentials(clientId, clientSecret, DEFAULT_ENDPOINT, "puid:generate");
  }

  public static Puid fromClientCredentials(
      String clientId, String clientSecret, String endpoint, String scope) {
    if (clientId == null || clientId.isEmpty() || clientSecret == null || clientSecret.isEmpty()) {
      throw new PuidError("clientId and clientSecret are required", null, "invalid_client");
    }
    String base = stripTrailingSlash(endpoint);
    HttpClient http = defaultHttpClient();
    String form =
        "grant_type=client_credentials&client_id="
            + encode(clientId)
            + "&client_secret="
            + encode(clientSecret)
            + "&scope="
            + encode(scope);
    HttpRequest req =
        HttpRequest.newBuilder(URI.create(base + "/oauth/token"))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .header("Accept", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(form))
            .build();
    Response r = send(http, req, "token request");
    Map<String, Object> body = Json.parseObject(r.body);
    String token = str(body.get("access_token"));
    if (r.status < 200 || r.status >= 300 || token == null || token.isEmpty()) {
      throw new PuidError(
          firstNonEmpty(
              str(body.get("error_description")),
              str(body.get("error")),
              "token request failed with HTTP " + r.status),
          r.status,
          str(body.get("error")));
    }
    return builder().accessToken(token).endpoint(endpoint).httpClient(http).build();
  }

  private Map<String, Object> get(String path) {
    HttpRequest req =
        HttpRequest.newBuilder(URI.create(endpoint + path))
            .header(authName, authValue)
            .header("Accept", "application/json")
            .GET()
            .build();
    Response r = send(http, req, "request");
    Map<String, Object> body = Json.parseObject(r.body);
    if (r.status < 200 || r.status >= 300) {
      throw new PuidError(
          firstNonEmpty(
              str(body.get("message")),
              str(body.get("error")),
              "request failed with HTTP " + r.status),
          r.status,
          str(body.get("error")));
    }
    return body;
  }

  private static Response send(HttpClient http, HttpRequest req, String what) {
    try {
      HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
      return new Response(resp.statusCode(), resp.body());
    } catch (java.io.IOException | InterruptedException e) {
      if (e instanceof InterruptedException) {
        Thread.currentThread().interrupt();
      }
      throw new PuidError(what + " to PUID failed: " + e.getMessage(), null, "network_error");
    }
  }

  // HTTP/1.1 avoids the cleartext h2c upgrade probe that some servers mishandle; over
  // TLS, HTTP/2 still negotiates via ALPN where the server supports it.
  private static HttpClient defaultHttpClient() {
    return HttpClient.newBuilder().version(HttpClient.Version.HTTP_1_1).build();
  }

  private static String encode(String s) {
    return URLEncoder.encode(s, StandardCharsets.UTF_8);
  }

  private static String stripTrailingSlash(String s) {
    int end = s.length();
    while (end > 0 && s.charAt(end - 1) == '/') {
      end--;
    }
    return s.substring(0, end);
  }

  private static String str(Object o) {
    return o == null ? null : o.toString();
  }

  private static long asLong(Object o) {
    return o instanceof Number ? ((Number) o).longValue() : 0L;
  }

  private static Long asLongOrNull(Object o) {
    return o instanceof Number ? ((Number) o).longValue() : null;
  }

  private static String firstNonEmpty(String... values) {
    for (String v : values) {
      if (v != null && !v.isEmpty()) {
        return v;
      }
    }
    return "";
  }

  private static final class Response {
    final int status;
    final String body;

    Response(int status, String body) {
      this.status = status;
      this.body = body;
    }
  }

  /** Builds a {@link Puid}. Provide exactly one of an API key or an access token. */
  public static final class Builder {
    private String apiKey;
    private String accessToken;
    private String endpoint = DEFAULT_ENDPOINT;
    private HttpClient httpClient;

    public Builder apiKey(String apiKey) {
      this.apiKey = apiKey;
      return this;
    }

    public Builder accessToken(String accessToken) {
      this.accessToken = accessToken;
      return this;
    }

    public Builder endpoint(String endpoint) {
      this.endpoint = endpoint;
      return this;
    }

    public Builder httpClient(HttpClient httpClient) {
      this.httpClient = httpClient;
      return this;
    }

    public Puid build() {
      if (apiKey != null && accessToken != null) {
        throw new PuidError("provide either an API key or an access token, not both");
      }
      if (apiKey != null) {
        return new Puid(endpoint, "X-API-Key", apiKey, httpClient);
      }
      if (accessToken != null) {
        return new Puid(endpoint, "Authorization", "Bearer " + accessToken, httpClient);
      }
      throw new PuidError("provide an API key (puid_live_...) or an access token (puid_at_...)");
    }
  }
}
