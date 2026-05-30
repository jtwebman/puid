-- puid extension 1.0 — a PostgreSQL column type whose DEFAULT calls the PUID API.
--
-- This is a magnificently bad idea, which is the point: with `DEFAULT puid_generate()`,
-- every INSERT makes an outbound HTTPS request to an API that is rate limited to ONE
-- request per second. Your database's write throughput is now globally throttled to
-- 1 row/sec and will ERROR under concurrent load. Ship it.
--
-- Install:
--   CREATE EXTENSION plpython3u;          -- superuser; the HTTP call needs an untrusted lang
--   CREATE EXTENSION puid;
--   ALTER DATABASE mydb SET puid.api_key = 'puid_live_...';   -- from the dashboard
--   ALTER DATABASE mydb SET puid.base_url = 'https://puid.dev/api';  -- optional
--
-- Use:
--   CREATE TABLE orders (
--     id   puid PRIMARY KEY DEFAULT puid_generate(),
--     memo text
--   );
--   INSERT INTO orders (memo) VALUES ('hi');   -- blocks ~0s..1s, may 429 under load

\echo Use "CREATE EXTENSION puid" to load this file. \quit

-- The type: a domain over text constrained to URL-safe base62, max 22 chars
-- (the width of a 128-bit value). Looks random; is a counter.
CREATE DOMAIN puid AS text
  CHECK (VALUE ~ '^[0-9A-Za-z]{1,22}$');

COMMENT ON DOMAIN puid IS
  'Probably Unique IDentifier: base62 of a permuted counter. Provably collision-free, deeply ill-advised as a DB default.';

-- Generate one PUID by calling the remote, rate-limited, single-source-of-truth API.
CREATE FUNCTION puid_generate() RETURNS puid AS $$
    import json, urllib.request

    def setting(name, default=None):
        rv = plpy.execute(
            "SELECT current_setting(%s, true) AS v" % plpy.quote_literal(name))
        return rv[0]["v"] or default

    base = setting("puid.base_url", "https://puid.dev/api")
    key  = setting("puid.api_key", "")
    if not key:
        plpy.error("puid: set puid.api_key (ALTER DATABASE ... SET puid.api_key = 'puid_live_...')")

    req = urllib.request.Request(base + "/v1/ids?n=1", headers={"X-API-Key": key})
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            return json.load(r)["ids"][0]
    except urllib.error.HTTPError as e:
        if e.code == 429:
            plpy.error("puid: rate limited (1 request/second). Your INSERT lost the race. As designed.")
        if e.code == 402:
            plpy.error("puid: daily quota exceeded. Upgrade your plan to insert more rows.")
        plpy.error("puid: API returned HTTP %s" % e.code)
$$ LANGUAGE plpython3u VOLATILE;

COMMENT ON FUNCTION puid_generate() IS
  'Fetch one PUID from the API. VOLATILE, makes a network call, rate limited to 1/sec. Use as a column DEFAULT only if you hate your future self.';

-- Bulk helper: ask the API for up to 10 at once (still one rate-limited request).
CREATE FUNCTION puid_generate(n int) RETURNS SETOF puid AS $$
    import json, urllib.request
    if n < 1 or n > 10:
        plpy.error("puid: n must be 1..10")
    base = (plpy.execute("SELECT current_setting('puid.base_url', true) AS v")[0]["v"]
            or "https://puid.dev/api")
    key = plpy.execute("SELECT current_setting('puid.api_key', true) AS v")[0]["v"] or ""
    if not key:
        plpy.error("puid: set puid.api_key first")
    req = urllib.request.Request("%s/v1/ids?n=%d" % (base, n), headers={"X-API-Key": key})
    with urllib.request.urlopen(req, timeout=5) as r:
        return json.load(r)["ids"]
$$ LANGUAGE plpython3u VOLATILE;

-- Confession: decode a stored PUID back to its ordinal via the API.
CREATE FUNCTION puid_ordinal(id puid) RETURNS bigint AS $$
    import json, urllib.request
    base = (plpy.execute("SELECT current_setting('puid.base_url', true) AS v")[0]["v"]
            or "https://puid.dev/api")
    key = plpy.execute("SELECT current_setting('puid.api_key', true) AS v")[0]["v"] or ""
    req = urllib.request.Request("%s/v1/ordinal/%s" % (base, id), headers={"X-API-Key": key})
    with urllib.request.urlopen(req, timeout=5) as r:
        return int(json.load(r)["ordinal"])
$$ LANGUAGE plpython3u STABLE;
