// gen-clients.mjs — generates PUID client libraries for 20 languages FROM THE
// OPENAPI SPEC (src/openapi.js). The base URL and the auth header are read from
// SPEC, so the docs, the server, and every SDK agree by construction.
//
// Run: node tools/gen-clients.mjs   (writes to ../clients/<lang>/)
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SPEC } from "../src/lib/openapi.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "clients");
const BASE = SPEC.servers[0].url;                       // https://puid.dev/api
const AUTH = SPEC.components.securitySchemes.ApiKeyAuth.name; // X-API-Key

// Each SDK: generate(n) and ordinal(puid). Auth via the X-API-Key header, read
// from the PUID_API_KEY environment variable (mint a key in the dashboard).
const CLIENTS = {
"python/puid.py": `"""PUID client. Probably Unique IDentifier. Please do not use this.
Auth: export PUID_API_KEY=puid_live_...  (mint one in the dashboard)."""
import json, os, urllib.request

BASE = "${BASE}"

def _get(path: str, key=None):
    key = key or os.environ.get("PUID_API_KEY", "")
    req = urllib.request.Request(f"{BASE}{path}", headers={"${AUTH}": key})
    with urllib.request.urlopen(req) as r:
        return json.load(r)

def generate(n: int = 1, key=None) -> list:
    if not 1 <= n <= 10: raise ValueError("n must be 1..10")
    return _get(f"/v1/ids?n={n}", key)["ids"]

def ordinal(puid: str, key=None) -> int:
    return int(_get(f"/v1/ordinal/{puid}", key)["ordinal"])

if __name__ == "__main__":
    ids = generate(3); print(ids)
    print(f"{ids[0]} was secretly #{ordinal(ids[0])}")
`,

"node/puid.js": `// PUID client (Node 18+, ESM). Auth: process.env.PUID_API_KEY.
const BASE = "${BASE}";
const hdr = (key) => ({ "${AUTH}": key || process.env.PUID_API_KEY || "" });

export async function generate(n = 1, key) {
  if (!Number.isInteger(n) || n < 1 || n > 10) throw new Error("n must be 1..10");
  const r = await fetch(\`\${BASE}/v1/ids?n=\${n}\`, { headers: hdr(key) });
  if (r.status === 429) throw new Error("Rate limited. One per second. As intended.");
  if (!r.ok) throw new Error("PUID error " + r.status);
  return (await r.json()).ids;
}
export async function ordinal(puid, key) {
  const r = await fetch(\`\${BASE}/v1/ordinal/\${encodeURIComponent(puid)}\`, { headers: hdr(key) });
  return BigInt((await r.json()).ordinal);
}
`,

"typescript/puid.ts": `// PUID client (TypeScript). Auth: process.env.PUID_API_KEY.
const BASE = "${BASE}";
const hdr = (key?: string) => ({ "${AUTH}": key || process.env.PUID_API_KEY || "" });

export async function generate(n = 1, key?: string): Promise<string[]> {
  if (!Number.isInteger(n) || n < 1 || n > 10) throw new Error("n must be 1..10");
  const r = await fetch(\`\${BASE}/v1/ids?n=\${n}\`, { headers: hdr(key) });
  if (r.status === 429) throw new Error("Rate limited. One per second.");
  return ((await r.json()) as { ids: string[] }).ids;
}
export async function ordinal(puid: string, key?: string): Promise<bigint> {
  const r = await fetch(\`\${BASE}/v1/ordinal/\${encodeURIComponent(puid)}\`, { headers: hdr(key) });
  return BigInt(((await r.json()) as { ordinal: string }).ordinal);
}
`,

"go/puid.go": `// Package puid is the Go client for PUID. Auth via PUID_API_KEY.
package puid

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"os"
)

const Base = "${BASE}"

func get(path string) (*http.Response, error) {
	req, _ := http.NewRequest("GET", Base+path, nil)
	req.Header.Set("${AUTH}", os.Getenv("PUID_API_KEY"))
	return http.DefaultClient.Do(req)
}
func Generate(n int) ([]string, error) {
	if n < 1 || n > 10 {
		return nil, errors.New("n must be 1..10")
	}
	resp, err := get(fmt.Sprintf("/v1/ids?n=%d", n))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusTooManyRequests {
		return nil, errors.New("rate limited: one per second")
	}
	var out struct {
		IDs []string \`json:"ids"\`
	}
	return out.IDs, json.NewDecoder(resp.Body).Decode(&out)
}
func Ordinal(puid string) (string, error) {
	resp, err := get("/v1/ordinal/" + url.PathEscape(puid))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	var out struct {
		Ordinal string \`json:"ordinal"\`
	}
	return out.Ordinal, json.NewDecoder(resp.Body).Decode(&out)
}
`,

"rust/puid.rs": `//! PUID client (Rust). ureq + serde_json. Auth via PUID_API_KEY.
use serde_json::Value;

const BASE: &str = "${BASE}";

fn get(path: &str) -> Result<Value, String> {
    let key = std::env::var("PUID_API_KEY").unwrap_or_default();
    ureq::get(&format!("{BASE}{path}")).set("${AUTH}", &key)
        .call().map_err(|e| e.to_string())?
        .into_json().map_err(|e| e.to_string())
}
pub fn generate(n: u32) -> Result<Vec<String>, String> {
    if !(1..=10).contains(&n) { return Err("n must be 1..10".into()); }
    let body = get(&format!("/v1/ids?n={n}"))?;
    Ok(body["ids"].as_array().cloned().unwrap_or_default()
        .iter().filter_map(|v| v.as_str().map(String::from)).collect())
}
pub fn ordinal(puid: &str) -> Result<String, String> {
    Ok(get(&format!("/v1/ordinal/{puid}"))?["ordinal"].as_str().unwrap_or_default().to_string())
}
`,

"ruby/puid.rb": `# PUID client (Ruby). Auth via PUID_API_KEY.
require "net/http"; require "json"; require "uri"

module Puid
  BASE = "${BASE}"
  def self.get(path)
    uri = URI("#{BASE}#{path}")
    req = Net::HTTP::Get.new(uri); req["${AUTH}"] = ENV["PUID_API_KEY"]
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
`,

"php/puid.php": `<?php
// PUID client (PHP). Auth via PUID_API_KEY.
namespace Puid;
const BASE = "${BASE}";

function get(string $path): array {
    $ctx = stream_context_create(["http" => ["header" => "${AUTH}: " . (getenv("PUID_API_KEY") ?: "")]]);
    return json_decode(file_get_contents(BASE . $path, false, $ctx), true);
}
function generate(int $n = 1): array {
    if ($n < 1 || $n > 10) throw new \\InvalidArgumentException("n must be 1..10");
    return get("/v1/ids?n=" . $n)["ids"];
}
function ordinal(string $puid): string { return get("/v1/ordinal/" . rawurlencode($puid))["ordinal"]; }
`,

"java/Puid.java": `// PUID client (Java 11+). Auth via PUID_API_KEY env var.
import java.net.URI;
import java.net.http.*;
import java.util.*;
import java.util.regex.*;

public final class Puid {
    public static final String BASE = "${BASE}";
    private static final HttpClient HTTP = HttpClient.newHttpClient();

    public static List<String> generate(int n) throws Exception {
        if (n < 1 || n > 10) throw new IllegalArgumentException("n must be 1..10");
        String body = get("/v1/ids?n=" + n);
        List<String> ids = new ArrayList<>();
        Matcher m = Pattern.compile("\\"([0-9A-Za-z]+)\\"").matcher(body.substring(body.indexOf('[') + 1, body.indexOf(']')));
        while (m.find()) ids.add(m.group(1));
        return ids;
    }
    public static String ordinal(String puid) throws Exception {
        Matcher m = Pattern.compile("\\"ordinal\\"\\\\s*:\\\\s*\\"(\\\\d+)\\"").matcher(get("/v1/ordinal/" + puid));
        return m.find() ? m.group(1) : null;
    }
    private static String get(String path) throws Exception {
        HttpResponse<String> r = HTTP.send(HttpRequest.newBuilder(URI.create(BASE + path))
            .header("${AUTH}", System.getenv().getOrDefault("PUID_API_KEY", "")).build(),
            HttpResponse.BodyHandlers.ofString());
        if (r.statusCode() == 429) throw new RuntimeException("Rate limited. One per second.");
        return r.body();
    }
}
`,

"kotlin/Puid.kt": `// PUID client (Kotlin). Auth via PUID_API_KEY.
import java.net.URI
import java.net.http.*

object Puid {
    const val BASE = "${BASE}"
    private val http = HttpClient.newHttpClient()
    fun generate(n: Int = 1): List<String> {
        require(n in 1..10) { "n must be 1..10" }
        val body = get("/v1/ids?n=\$n")
        return Regex("\\"([0-9A-Za-z]+)\\"").findAll(body.substringAfter('[').substringBefore(']')).map { it.groupValues[1] }.toList()
    }
    fun ordinal(puid: String) = Regex("\\"ordinal\\"\\\\s*:\\\\s*\\"(\\\\d+)\\"").find(get("/v1/ordinal/\$puid"))!!.groupValues[1]
    private fun get(path: String): String {
        val r = http.send(HttpRequest.newBuilder(URI.create(BASE + path))
            .header("${AUTH}", System.getenv("PUID_API_KEY") ?: "").build(), HttpResponse.BodyHandlers.ofString())
        if (r.statusCode() == 429) throw RuntimeException("Rate limited. One per second.")
        return r.body()
    }
}
`,

"swift/Puid.swift": `// PUID client (Swift). Auth via PUID_API_KEY.
import Foundation

enum Puid {
    static let base = "${BASE}"
    static func get(_ path: String) async throws -> [String: Any] {
        var req = URLRequest(url: URL(string: base + path)!)
        req.setValue(ProcessInfo.processInfo.environment["PUID_API_KEY"] ?? "", forHTTPHeaderField: "${AUTH}")
        let (data, _) = try await URLSession.shared.data(for: req)
        return try JSONSerialization.jsonObject(with: data) as! [String: Any]
    }
    static func generate(_ n: Int = 1) async throws -> [String] {
        precondition((1...10).contains(n), "n must be 1...10")
        return try await get("/v1/ids?n=\\(n)")["ids"] as! [String]
    }
    static func ordinal(_ puid: String) async throws -> String {
        try await get("/v1/ordinal/\\(puid)")["ordinal"] as! String
    }
}
`,

"csharp/Puid.cs": `// PUID client (C#). Auth via PUID_API_KEY.
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

public static class Puid {
    public const string Base = "${BASE}";
    private static readonly HttpClient Http = NewClient();
    private static HttpClient NewClient() {
        var c = new HttpClient();
        c.DefaultRequestHeaders.Add("${AUTH}", Environment.GetEnvironmentVariable("PUID_API_KEY") ?? "");
        return c;
    }
    public static async Task<List<string>> Generate(int n = 1) {
        if (n < 1 || n > 10) throw new ArgumentException("n must be 1..10");
        var resp = await Http.GetAsync($"{Base}/v1/ids?n={n}");
        if ((int)resp.StatusCode == 429) throw new Exception("Rate limited. One per second.");
        var doc = JsonDocument.Parse(await resp.Content.ReadAsStringAsync());
        var ids = new List<string>();
        foreach (var e in doc.RootElement.GetProperty("ids").EnumerateArray()) ids.Add(e.GetString());
        return ids;
    }
    public static async Task<string> Ordinal(string puid) {
        var body = await Http.GetStringAsync($"{Base}/v1/ordinal/{Uri.EscapeDataString(puid)}");
        return JsonDocument.Parse(body).RootElement.GetProperty("ordinal").GetString();
    }
}
`,

"c/puid.c": `/* PUID client (C). libcurl. Auth via PUID_API_KEY. Returns raw JSON. */
#include <curl/curl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define PUID_BASE "${BASE}"
struct buf { char *data; size_t len; };
static size_t on_data(void *p, size_t s, size_t n, void *u) {
    struct buf *b = u; size_t add = s * n;
    b->data = realloc(b->data, b->len + add + 1);
    memcpy(b->data + b->len, p, add); b->len += add; b->data[b->len] = 0; return add;
}
char *puid_get(const char *path) {
    CURL *c = curl_easy_init(); struct buf b = {0};
    char url[512]; snprintf(url, sizeof url, "%s%s", PUID_BASE, path);
    char hdr[256]; snprintf(hdr, sizeof hdr, "${AUTH}: %s", getenv("PUID_API_KEY") ? getenv("PUID_API_KEY") : "");
    struct curl_slist *h = curl_slist_append(NULL, hdr);
    curl_easy_setopt(c, CURLOPT_URL, url);
    curl_easy_setopt(c, CURLOPT_HTTPHEADER, h);
    curl_easy_setopt(c, CURLOPT_WRITEFUNCTION, on_data);
    curl_easy_setopt(c, CURLOPT_WRITEDATA, &b);
    curl_easy_perform(c); curl_slist_free_all(h); curl_easy_cleanup(c);
    return b.data; /* caller frees */
}
char *puid_generate(int n) { char p[32]; snprintf(p, sizeof p, "/v1/ids?n=%d", n); return puid_get(p); }
char *puid_ordinal(const char *id) { char p[128]; snprintf(p, sizeof p, "/v1/ordinal/%s", id); return puid_get(p); }
`,

"cpp/puid.hpp": `// PUID client (C++17, header-only). libcurl. Auth via PUID_API_KEY.
#pragma once
#include <curl/curl.h>
#include <cstdlib>
#include <string>

namespace puid {
inline const std::string BASE = "${BASE}";
inline size_t writer(char* p, size_t s, size_t n, void* u) { static_cast<std::string*>(u)->append(p, s*n); return s*n; }
inline std::string get(const std::string& path) {
    CURL* c = curl_easy_init(); std::string out;
    const char* k = std::getenv("PUID_API_KEY");
    std::string h = "${AUTH}: " + std::string(k ? k : "");
    struct curl_slist* hl = curl_slist_append(nullptr, h.c_str());
    std::string url = BASE + path;
    curl_easy_setopt(c, CURLOPT_URL, url.c_str());
    curl_easy_setopt(c, CURLOPT_HTTPHEADER, hl);
    curl_easy_setopt(c, CURLOPT_WRITEFUNCTION, writer);
    curl_easy_setopt(c, CURLOPT_WRITEDATA, &out);
    curl_easy_perform(c); curl_slist_free_all(hl); curl_easy_cleanup(c);
    return out;
}
inline std::string generate(int n = 1) { return get("/v1/ids?n=" + std::to_string(n)); }
inline std::string ordinal(const std::string& id) { return get("/v1/ordinal/" + id); }
}
`,

"bash/puid.sh": `#!/usr/bin/env bash
# PUID client (bash + curl + jq). Auth via PUID_API_KEY.
set -euo pipefail
PUID_BASE="\${PUID_BASE:-${BASE}}"
_get() { curl -fsS -H "${AUTH}: \${PUID_API_KEY:-}" "\$PUID_BASE\$1"; }
puid_generate() { _get "/v1/ids?n=\${1:-1}" | jq -r '.ids[]'; }
puid_ordinal() { _get "/v1/ordinal/\$1" | jq -r '.ordinal'; }
# usage: ./puid.sh puid_generate 3   |   ./puid.sh puid_ordinal <puid>
"\${@:-puid_generate}"
`,

"perl/puid.pl": `#!/usr/bin/env perl
# PUID client (Perl). Auth via PUID_API_KEY.
use strict; use warnings;
use HTTP::Tiny; use JSON::PP;
my $BASE = "${BASE}";
my $http = HTTP::Tiny->new(default_headers => { "${AUTH}" => $ENV{PUID_API_KEY} // "" });
sub generate {
    my ($n) = @_; $n //= 1;
    die "n must be 1..10" unless $n >= 1 && $n <= 10;
    my $r = $http->get("$BASE/v1/ids?n=$n");
    die "Rate limited. One per second.\\n" if $r->{status} == 429;
    return @{ decode_json($r->{content})->{ids} };
}
sub ordinal { my ($p) = @_; decode_json($http->get("$BASE/v1/ordinal/$p")->{content})->{ordinal} }
unless (caller) { print "$_\\n" for generate(3); }
1;
`,

"elixir/puid.ex": `# PUID client (Elixir). Requires :req. Auth via PUID_API_KEY.
defmodule Puid do
  @base "${BASE}"
  defp hdr, do: [{"${AUTH}", System.get_env("PUID_API_KEY") || ""}]
  def generate(n \\\\ 1) when n in 1..10 do
    case Req.get!("#{@base}/v1/ids?n=#{n}", headers: hdr()) do
      %{status: 429} -> {:error, :rate_limited}
      %{body: %{"ids" => ids}} -> {:ok, ids}
    end
  end
  def ordinal(puid), do: Req.get!("#{@base}/v1/ordinal/#{puid}", headers: hdr()).body["ordinal"]
end
`,

"scala/Puid.scala": `// PUID client (Scala, java.net.http). Auth via PUID_API_KEY.
import java.net.URI
import java.net.http.{HttpClient, HttpRequest, HttpResponse}

object Puid {
  val Base = "${BASE}"
  private val http = HttpClient.newHttpClient()
  def generate(n: Int = 1): List[String] = {
    require(n >= 1 && n <= 10, "n must be 1..10")
    val body = get(s"/v1/ids?n=$n")
    "\\"([0-9A-Za-z]+)\\"".r.findAllMatchIn(body.substring(body.indexOf('[') + 1, body.indexOf(']'))).map(_.group(1)).toList
  }
  def ordinal(puid: String): String =
    "\\"ordinal\\"\\\\s*:\\\\s*\\"(\\\\d+)\\"".r.findFirstMatchIn(get(s"/v1/ordinal/$puid")).get.group(1)
  private def get(path: String): String = {
    val r = http.send(HttpRequest.newBuilder(URI.create(Base + path))
      .header("${AUTH}", sys.env.getOrElse("PUID_API_KEY", "")).build(), HttpResponse.BodyHandlers.ofString())
    if (r.statusCode() == 429) throw new RuntimeException("Rate limited. One per second.")
    r.body()
  }
}
`,

"dart/puid.dart": `// PUID client (Dart). Auth via PUID_API_KEY.
import 'dart:convert';
import 'dart:io' show Platform;
import 'package:http/http.dart' as http;

const base = "${BASE}";
Map<String, String> _hdr() => {"${AUTH}": Platform.environment["PUID_API_KEY"] ?? ""};

Future<List<String>> generate([int n = 1]) async {
  if (n < 1 || n > 10) throw ArgumentError("n must be 1..10");
  final r = await http.get(Uri.parse("\$base/v1/ids?n=\$n"), headers: _hdr());
  if (r.statusCode == 429) throw Exception("Rate limited. One per second.");
  return (jsonDecode(r.body)["ids"] as List).cast<String>();
}
Future<String> ordinal(String puid) async {
  final r = await http.get(Uri.parse("\$base/v1/ordinal/\$puid"), headers: _hdr());
  return jsonDecode(r.body)["ordinal"] as String;
}
`,

"r/puid.R": `# PUID client (R). httr + jsonlite. Auth via PUID_API_KEY.
library(httr); library(jsonlite)
PUID_BASE <- "${BASE}"
.puid_get <- function(path) {
  r <- GET(paste0(PUID_BASE, path), add_headers(\`${AUTH}\` = Sys.getenv("PUID_API_KEY")))
  if (status_code(r) == 429) stop("Rate limited. One per second.")
  fromJSON(content(r, "text", encoding = "UTF-8"))
}
puid_generate <- function(n = 1) {
  if (n < 1 || n > 10) stop("n must be 1..10")
  .puid_get(paste0("/v1/ids?n=", n))$ids
}
puid_ordinal <- function(puid) .puid_get(paste0("/v1/ordinal/", puid))$ordinal
`,

"lua/puid.lua": `-- PUID client (Lua). luasocket + dkjson. Auth via PUID_API_KEY.
local http = require("socket.http")
local ltn12 = require("ltn12")
local json = require("dkjson")
local BASE = "${BASE}"
local M = {}
local function get(path)
  local chunks = {}
  local _, code = http.request{ url = BASE .. path,
    headers = { ["${AUTH}"] = os.getenv("PUID_API_KEY") or "" },
    sink = ltn12.sink.table(chunks) }
  if code == 429 then error("Rate limited. One per second.") end
  return json.decode(table.concat(chunks))
end
function M.generate(n) n = n or 1; assert(n >= 1 and n <= 10, "n must be 1..10"); return get("/v1/ids?n=" .. n).ids end
function M.ordinal(puid) return get("/v1/ordinal/" .. puid).ordinal end
return M
`,
};

let count = 0;
for (const [rel, contents] of Object.entries(CLIENTS)) {
  const path = join(ROOT, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
  count++;
  console.log("  wrote", join("clients", rel));
}
console.log(`\nGenerated ${count} client libraries from the OpenAPI spec (base ${BASE}, auth header ${AUTH}).`);
