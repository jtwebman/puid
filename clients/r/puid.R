# PUID client (R). httr + jsonlite. Auth via PUID_API_KEY.
library(httr); library(jsonlite)
PUID_BASE <- "https://puid.dev/api"
.puid_get <- function(path) {
  r <- GET(paste0(PUID_BASE, path), add_headers(`X-API-Key` = Sys.getenv("PUID_API_KEY")))
  if (status_code(r) == 429) stop("Rate limited. One per second.")
  fromJSON(content(r, "text", encoding = "UTF-8"))
}
puid_generate <- function(n = 1) {
  if (n < 1 || n > 10) stop("n must be 1..10")
  .puid_get(paste0("/v1/ids?n=", n))$ids
}
puid_ordinal <- function(puid) .puid_get(paste0("/v1/ordinal/", puid))$ordinal
