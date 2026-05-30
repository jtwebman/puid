<?php
// PUID client (PHP). Auth via PUID_API_KEY.
namespace Puid;
const BASE = "https://puid.dev/api";

function get(string $path): array {
    $ctx = stream_context_create(["http" => ["header" => "X-API-Key: " . (getenv("PUID_API_KEY") ?: "")]]);
    return json_decode(file_get_contents(BASE . $path, false, $ctx), true);
}
function generate(int $n = 1): array {
    if ($n < 1 || $n > 10) throw new \InvalidArgumentException("n must be 1..10");
    return get("/v1/ids?n=" . $n)["ids"];
}
function ordinal(string $puid): string { return get("/v1/ordinal/" . rawurlencode($puid))["ordinal"]; }
