// PUID client (Kotlin). Auth via PUID_API_KEY.
import java.net.URI
import java.net.http.*

object Puid {
    const val BASE = "https://puid.dev/api"
    private val http = HttpClient.newHttpClient()
    fun generate(n: Int = 1): List<String> {
        require(n in 1..10) { "n must be 1..10" }
        val body = get("/v1/ids?n=$n")
        return Regex("\"([0-9A-Za-z]+)\"").findAll(body.substringAfter('[').substringBefore(']')).map { it.groupValues[1] }.toList()
    }
    fun ordinal(puid: String) = Regex("\"ordinal\"\\s*:\\s*\"(\\d+)\"").find(get("/v1/ordinal/$puid"))!!.groupValues[1]
    private fun get(path: String): String {
        val r = http.send(HttpRequest.newBuilder(URI.create(BASE + path))
            .header("X-API-Key", System.getenv("PUID_API_KEY") ?: "").build(), HttpResponse.BodyHandlers.ofString())
        if (r.statusCode() == 429) throw RuntimeException("Rate limited. One per second.")
        return r.body()
    }
}
