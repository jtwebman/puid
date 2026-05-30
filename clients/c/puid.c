/* PUID client (C). libcurl. Auth via PUID_API_KEY. Returns raw JSON. */
#include <curl/curl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define PUID_BASE "https://puid.dev/api"
struct buf { char *data; size_t len; };
static size_t on_data(void *p, size_t s, size_t n, void *u) {
    struct buf *b = u; size_t add = s * n;
    b->data = realloc(b->data, b->len + add + 1);
    memcpy(b->data + b->len, p, add); b->len += add; b->data[b->len] = 0; return add;
}
char *puid_get(const char *path) {
    CURL *c = curl_easy_init(); struct buf b = {0};
    char url[512]; snprintf(url, sizeof url, "%s%s", PUID_BASE, path);
    char hdr[256]; snprintf(hdr, sizeof hdr, "X-API-Key: %s", getenv("PUID_API_KEY") ? getenv("PUID_API_KEY") : "");
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
