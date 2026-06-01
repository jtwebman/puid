# frozen_string_literal: true

require "cgi"
require "json"
require "net/http"
require "uri"

require_relative "puid/version"

# Official Ruby client for the PUID API — the Provably Unique IDentifier service.
# Every id is guaranteed distinct by construction (a counter run through a 128-bit
# permutation), not by the dice roll a random UUID makes.
module Puid
  # The production API endpoint. Override with the +endpoint:+ keyword to point at a
  # local dev server for tests, or your own domain for a self-hosted (Enterprise) PUID.
  DEFAULT_ENDPOINT = "https://puid.dev/api"

  # Raised for any non-2xx API response or client-side validation failure.
  # +status+ is the HTTP status (nil for client-side/transport errors); +code+ is the
  # API's machine-readable error code (e.g. "rate_limited", "quota_exceeded").
  class Error < StandardError
    attr_reader :status, :code

    def initialize(message, status: nil, code: nil)
      super(message)
      @status = status
      @code = code
    end
  end

  # A PUID API client.
  class Client
    # Provide exactly one of +api_key:+ (puid_live_…) or +access_token:+ (puid_at_…).
    def initialize(api_key: nil, access_token: nil, endpoint: DEFAULT_ENDPOINT)
      raise Error.new("provide either api_key or access_token, not both") if api_key && access_token
      raise Error.new("provide an api_key (puid_live_…) or an access_token (puid_at_…)") unless api_key || access_token

      @endpoint = endpoint.to_s.chomp("/")
      @auth = access_token ? ["Authorization", "Bearer #{access_token}"] : ["X-API-Key", api_key]
    end

    # Generate +count+ ids (1–10). Returns an array of id strings.
    def ids(count = 1)
      unless count.is_a?(Integer) && count.between?(1, 10)
        raise Error.new("count must be between 1 and 10", code: "invalid_count")
      end

      get("/v1/ids?n=#{count}")["ids"]
    end

    # Generate a single id.
    def id
      ids(1).first
    end

    # Decode a PUID back to the counter value it encodes. Ruby integers are arbitrary
    # precision, so the 128-bit value fits.
    def ordinal(puid)
      raise Error.new("puid must be a non-empty string", code: "invalid_puid") unless puid.is_a?(String) && !puid.empty?

      Integer(get("/v1/ordinal/#{CGI.escape(puid)}")["ordinal"])
    end

    # Today's usage and remaining daily quota. Does not spend an id.
    def quota
      get("/v1/quota")
    end

    # Exchange OAuth2 client credentials for a bearer token and return a ready client.
    # This is how an app generates ids on a team's behalf without ever handling the
    # team's API key.
    def self.from_client_credentials(client_id:, client_secret:, scope: "puid:generate", endpoint: DEFAULT_ENDPOINT)
      if client_id.to_s.empty? || client_secret.to_s.empty?
        raise Error.new("client_id and client_secret are required", code: "invalid_client")
      end

      uri = URI("#{endpoint.to_s.chomp("/")}/oauth/token")
      req = Net::HTTP::Post.new(uri)
      req.set_form_data(grant_type: "client_credentials", client_id: client_id,
                        client_secret: client_secret, scope: scope)
      req["Accept"] = "application/json"
      res = request(uri, req, "token request")
      body = parse_json(res.body)
      unless res.is_a?(Net::HTTPSuccess) && body["access_token"]
        raise Error.new(body["error_description"] || body["error"] || "token request failed with HTTP #{res.code}",
                        status: res.code.to_i, code: body["error"])
      end

      new(access_token: body["access_token"], endpoint: endpoint)
    end

    # Perform an HTTP request, wrapping transport failures as Puid::Error.
    def self.request(uri, req, what)
      Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") { |http| http.request(req) }
    rescue StandardError => e
      raise Error.new("#{what} to PUID failed: #{e.message}", code: "network_error")
    end

    def self.parse_json(str)
      JSON.parse(str.to_s)
    rescue JSON::ParserError
      {}
    end

    private

    def get(path)
      uri = URI("#{@endpoint}#{path}")
      req = Net::HTTP::Get.new(uri)
      req[@auth[0]] = @auth[1]
      req["Accept"] = "application/json"
      res = self.class.request(uri, req, "request")
      body = self.class.parse_json(res.body)
      unless res.is_a?(Net::HTTPSuccess)
        raise Error.new(body["message"] || body["error"] || "request failed with HTTP #{res.code}",
                        status: res.code.to_i, code: body["error"])
      end

      body
    end
  end
end
