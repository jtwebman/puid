// PUID client (Java 11+). Auth via PUID_API_KEY env var.
import java.net.URI;
import java.net.http.*;
import java.util.*;
import java.util.regex.*;

public final class Puid {
    public static final String BASE = "https://puid.dev/api";
    private static final HttpClient HTTP = HttpClient.newHttpClient();

    public static List<String> generate(int n) throws Exception {
        if (n < 1 || n > 10) throw new IllegalArgumentException("n must be 1..10");
        String body = get("/v1/ids?n=" + n);
        List<String> ids = new ArrayList<>();
        Matcher m = Pattern.compile("\"([0-9A-Za-z]+)\"").matcher(body.substring(body.indexOf('[') + 1, body.indexOf(']')));
        while (m.find()) ids.add(m.group(1));
        return ids;
    }
    public static String ordinal(String puid) throws Exception {
        Matcher m = Pattern.compile("\"ordinal\"\\s*:\\s*\"(\\d+)\"").matcher(get("/v1/ordinal/" + puid));
        return m.find() ? m.group(1) : null;
    }
    private static String get(String path) throws Exception {
        HttpResponse<String> r = HTTP.send(HttpRequest.newBuilder(URI.create(BASE + path))
            .header("X-API-Key", System.getenv().getOrDefault("PUID_API_KEY", "")).build(),
            HttpResponse.BodyHandlers.ofString());
        if (r.statusCode() == 429) throw new RuntimeException("Rate limited. One per second.");
        return r.body();
    }
}
