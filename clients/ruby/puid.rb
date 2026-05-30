# PUID client (Ruby). Auth via PUID_API_KEY.
require "net/http"; require "json"; require "uri"

module Puid
  BASE = "https://puid.dev/api"
  def self.get(path)
    uri = URI("#{BASE}#{path}")
    req = Net::HTTP::Get.new(uri); req["X-API-Key"] = ENV["PUID_API_KEY"]
    res = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") { |h| h.request(req) }
    raise "Rate limited. One per second." if res.code == "429"
    JSON.parse(res.body)
  end
  def self.generate(n = 1)
    raise ArgumentError, "n must be 1..10" unless (1..10).include?(n)
    get("/v1/ids?n=#{n}")["ids"]
  end
  def self.ordinal(puid) = get("/v1/ordinal/#{URI.encode_www_form_component(puid)}")["ordinal"].to_i
end
