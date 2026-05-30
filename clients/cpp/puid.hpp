// PUID client (C++17, header-only). libcurl. Auth via PUID_API_KEY.
#pragma once
#include <curl/curl.h>
#include <cstdlib>
#include <string>

namespace puid {
inline const std::string BASE = "https://puid.dev/api";
inline size_t writer(char* p, size_t s, size_t n, void* u) { static_cast<std::string*>(u)->append(p, s*n); return s*n; }
inline std::string get(const std::string& path) {
    CURL* c = curl_easy_init(); std::string out;
    const char* k = std::getenv("PUID_API_KEY");
    std::string h = "X-API-Key: " + std::string(k ? k : "");
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
