# frozen_string_literal: true

# Integration suite for the Ruby client — runs against a REAL PUID instance.
#
# Point it at a running server with PUID_ENDPOINT (default http://localhost:8799/api,
# i.e. `npm run dev:e2e` from the repo root). The site origin (for dev-login + the
# dashboard API used to mint keys) is derived by stripping the trailing /api, or set
# PUID_ORIGIN explicitly.
#
# Everything a real endpoint can produce is tested live: id generation, decoding,
# quota, 401, 402 (out of quota), 429 (one per second), and the OAuth2
# client-credentials flow. Two cases a live endpoint never produces are exercised
# differently: a non-JSON error body (a one-shot raw TCP server) and a transport
# failure (a real connection to a closed port). When the server is unreachable the
# live tests skip.

require "minitest/autorun"
require "cgi"
require "json"
require "net/http"
require "securerandom"
require "socket"
require "uri"

require "puid"

ENDPOINT = (ENV["PUID_ENDPOINT"] || "http://localhost:8799/api").chomp("/")
ORIGIN = (ENV["PUID_ORIGIN"] || ENDPOINT.sub(%r{/api\z}, "")).chomp("/")

class PuidTest < Minitest::Test
  def server_up?
    uri = URI("#{ENDPOINT}/openapi.json")
    Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") { |h| h.get(uri.request_uri) }
    true
  rescue StandardError
    false
  end

  def require_server
    skip "PUID not reachable at #{ENDPOINT}; run `npm run dev:e2e` from the repo root" unless server_up?
  end

  def uniq_email(tag)
    "#{tag}-#{SecureRandom.hex(6)}@example.com"
  end

  def http(uri, req)
    Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") { |h| h.request(req) }
  end

  def post_json(url, payload, cookie = nil)
    uri = URI(url)
    req = Net::HTTP::Post.new(uri)
    req["Content-Type"] = "application/json"
    req["Accept"] = "application/json"
    req["Cookie"] = cookie if cookie
    req.body = JSON.generate(payload)
    JSON.parse(http(uri, req).body)
  end

  # dev-login (gated by ALLOW_DEV_LOGIN) returns a 302 with the session cookie; we
  # don't follow it (Net::HTTP doesn't), so we capture Set-Cookie directly.
  def dev_cookie(email)
    uri = URI("#{ORIGIN}/auth/dev-login?email=#{CGI.escape(email)}&next=/dashboard")
    res = http(uri, Net::HTTP::Get.new(uri))
    Array(res.get_fields("set-cookie")).map { |c| c.split(";").first }.join("; ")
  end

  def mint_key(cookie)
    post_json("#{ORIGIN}/dashboard/api/team/keys", { label: "ruby-test" }, cookie)["api_key"]
  end

  def seed_usage(cookie, count)
    uri = URI("#{ORIGIN}/dashboard/api/dev/seed-usage?n=#{count}")
    req = Net::HTTP::Get.new(uri)
    req["Cookie"] = cookie
    http(uri, req)
  end

  def register_client(name)
    res = post_json("#{ENDPOINT}/oauth/register", { client_name: name, redirect_uris: ["https://example.test/cb"] })
    [res["client_id"], res["client_secret"]]
  end

  # One-shot TCP server that answers any request with a 502 + non-JSON body.
  def spawn_502_server
    server = TCPServer.new("127.0.0.1", 0)
    port = server.addr[1]
    Thread.new do
      client = server.accept
      begin
        client.readpartial(2048)
      rescue StandardError
        nil
      end
      body = "<html>nope</html>"
      client.write("HTTP/1.1 502 Bad Gateway\r\nContent-Type: text/html\r\n" \
                   "Content-Length: #{body.bytesize}\r\nConnection: close\r\n\r\n#{body}")
      client.close
      server.close
    end
    "http://127.0.0.1:#{port}"
  end

  # --- real service ---------------------------------------------------------

  def test_ids_unique
    require_server
    key = mint_key(dev_cookie(uniq_email("ids")))
    ids = Puid::Client.new(api_key: key, endpoint: ENDPOINT).ids(10)
    assert_equal 10, ids.size
    assert(ids.all? { |s| s.is_a?(String) && !s.empty? })
    assert_equal 10, ids.uniq.size
  end

  def test_id_single
    require_server
    key = mint_key(dev_cookie(uniq_email("single")))
    refute_empty Puid::Client.new(api_key: key, endpoint: ENDPOINT).id
  end

  def test_ordinal_consecutive
    require_server
    key = mint_key(dev_cookie(uniq_email("ord")))
    client = Puid::Client.new(api_key: key, endpoint: ENDPOINT)
    ids = client.ids(2) # one rate-limited request; ordinal is not rate limited
    a = client.ordinal(ids[0])
    b = client.ordinal(ids[1])
    assert_operator a, :>, 0
    assert_equal 1, b - a
  end

  def test_endpoint_trailing_slash
    require_server
    key = mint_key(dev_cookie(uniq_email("slash")))
    refute_empty Puid::Client.new(api_key: key, endpoint: "#{ENDPOINT}/").id
  end

  def test_quota_does_not_spend
    require_server
    key = mint_key(dev_cookie(uniq_email("quota")))
    client = Puid::Client.new(api_key: key, endpoint: ENDPOINT)
    before = client.quota
    after = client.quota
    refute_empty before["plan"]
    assert_equal before["used"], after["used"]
  end

  def test_bad_key_401
    require_server
    err = assert_raises(Puid::Error) { Puid::Client.new(api_key: "puid_live_nope", endpoint: ENDPOINT).id }
    assert_equal 401, err.status
    assert_equal "unauthorized", err.code
  end

  def test_quota_exceeded_402
    require_server
    cookie = dev_cookie(uniq_email("over-quota"))
    seed_usage(cookie, 1000) # free plan = 1000/day
    err = assert_raises(Puid::Error) { Puid::Client.new(api_key: mint_key(cookie), endpoint: ENDPOINT).id }
    assert_equal 402, err.status
  end

  def test_rate_limit_429
    require_server
    key = mint_key(dev_cookie(uniq_email("rate")))
    client = Puid::Client.new(api_key: key, endpoint: ENDPOINT)
    client.id # first request allowed
    err = assert_raises(Puid::Error) { client.id }
    assert_equal 429, err.status
    assert_equal "rate_limited", err.code
  end

  def test_from_client_credentials
    require_server
    id, secret = register_client("ruby-cc-test")
    client = Puid::Client.from_client_credentials(client_id: id, client_secret: secret, endpoint: ENDPOINT)
    assert_equal 2, client.ids(2).size
  end

  def test_from_client_credentials_bad
    require_server
    err = assert_raises(Puid::Error) do
      Puid::Client.from_client_credentials(client_id: "nope", client_secret: "wrong", endpoint: ENDPOINT)
    end
    assert_operator err.status, :>=, 400
  end

  # --- client-side validation -----------------------------------------------

  def test_default_endpoint
    assert_equal "https://puid.dev/api", Puid::DEFAULT_ENDPOINT
  end

  def test_requires_exactly_one_credential
    assert_raises(Puid::Error) { Puid::Client.new }
    assert_raises(Puid::Error) { Puid::Client.new(api_key: "k", access_token: "t") }
  end

  def test_ids_validation
    client = Puid::Client.new(api_key: "k", endpoint: ENDPOINT)
    [0, 11].each do |n|
      err = assert_raises(Puid::Error) { client.ids(n) }
      assert_equal "invalid_count", err.code
    end
  end

  def test_ordinal_validation
    client = Puid::Client.new(api_key: "k", endpoint: ENDPOINT)
    err = assert_raises(Puid::Error) { client.ordinal("") }
    assert_equal "invalid_puid", err.code
  end

  def test_from_client_credentials_requires_args
    assert_raises(Puid::Error) do
      Puid::Client.from_client_credentials(client_id: "only", client_secret: "", endpoint: ENDPOINT)
    end
  end

  # --- cases a live endpoint can't produce -----------------------------------

  def test_non_json_error_body
    base = spawn_502_server
    err = assert_raises(Puid::Error) { Puid::Client.new(api_key: "k", endpoint: base).id }
    assert_equal 502, err.status
    assert_nil err.code
    assert_includes err.message, "HTTP 502"
  end

  def test_network_error
    err = assert_raises(Puid::Error) { Puid::Client.new(api_key: "k", endpoint: "http://127.0.0.1:1/api").id }
    assert_equal "network_error", err.code
  end
end
