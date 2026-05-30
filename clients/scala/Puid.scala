// PUID client (Scala, java.net.http). Auth via PUID_API_KEY.
import java.net.URI
import java.net.http.{HttpClient, HttpRequest, HttpResponse}

object Puid {
  val Base = "https://puid.dev/api"
  private val http = HttpClient.newHttpClient()
  def generate(n: Int = 1): List[String] = {
    require(n >= 1 && n <= 10, "n must be 1..10")
    val body = get(s"/v1/ids?n=$n")
    "\"([0-9A-Za-z]+)\"".r.findAllMatchIn(body.substring(body.indexOf('[') + 1, body.indexOf(']'))).map(_.group(1)).toList
  }
  def ordinal(puid: String): String =
    "\"ordinal\"\\s*:\\s*\"(\\d+)\"".r.findFirstMatchIn(get(s"/v1/ordinal/$puid")).get.group(1)
  private def get(path: String): String = {
    val r = http.send(HttpRequest.newBuilder(URI.create(Base + path))
      .header("X-API-Key", sys.env.getOrElse("PUID_API_KEY", "")).build(), HttpResponse.BodyHandlers.ofString())
    if (r.statusCode() == 429) throw new RuntimeException("Rate limited. One per second.")
    r.body()
  }
}
