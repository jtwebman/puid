# frozen_string_literal: true

require_relative "lib/puid/version"

Gem::Specification.new do |spec|
  spec.name = "puid"
  spec.version = Puid::VERSION
  spec.summary = "Official Ruby client for the PUID API — the Provably Unique IDentifier service."
  spec.description = "A zero-dependency client for PUID (puid.dev): generate provably-collision-free " \
                     "identifiers, decode them, check quota, and authenticate with an API key or an " \
                     "OAuth2 bearer token."
  spec.authors = ["jtwebman"]
  spec.homepage = "https://puid.dev"
  spec.license = "AGPL-3.0-only"
  spec.required_ruby_version = ">= 3.0"

  spec.files = Dir["lib/**/*.rb"] + ["README.md", "LICENSE"]
  spec.require_paths = ["lib"]

  spec.metadata = {
    "homepage_uri" => "https://puid.dev",
    "source_code_uri" => "https://github.com/jtwebman/puid",
    "bug_tracker_uri" => "https://github.com/jtwebman/puid/issues"
  }
end
