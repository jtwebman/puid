// Integration suite for the Go client — runs against a REAL PUID instance.
//
// Point it at a running server with PUID_ENDPOINT (default http://localhost:8799/api,
// i.e. `npm run dev:e2e` from the repo root). The site origin (for dev-login + the
// dashboard API used to mint keys) is derived by stripping the trailing /api, or set
// PUID_ORIGIN explicitly.
//
// Everything a real endpoint can produce is tested live: id generation, decoding,
// quota, 401, 402 (out of quota), 429 (one per second), and the OAuth2
// client-credentials flow. Two cases a live endpoint never produces are exercised
// differently: a non-JSON error body (a local httptest server) and a transport
// failure (a real connection to a closed port).
package puid_test

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"net/url"
	"os"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	puid "github.com/jtwebman/puid/sdks/go"
)

var (
	endpoint = strings.TrimRight(envOr("PUID_ENDPOINT", "http://localhost:8799/api"), "/")
	origin   = strings.TrimRight(envOr("PUID_ORIGIN", strings.TrimSuffix(endpoint, "/api")), "/")
	emailSeq atomic.Int64
)

func envOr(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func uniqEmail(tag string) string {
	return fmt.Sprintf("%s-%d-%d@example.com", tag, time.Now().UnixNano(), emailSeq.Add(1))
}

func requireServer(t *testing.T) {
	t.Helper()
	resp, err := http.Get(endpoint + "/openapi.json")
	if err != nil {
		t.Skipf("PUID not reachable at %s (%v); start `npm run dev:e2e` from the repo root", endpoint, err)
	}
	resp.Body.Close()
}

func asPuidErr(t *testing.T, err error) *puid.Error {
	t.Helper()
	if err == nil {
		t.Fatal("expected an error, got nil")
	}
	var pe *puid.Error
	if !errors.As(err, &pe) {
		t.Fatalf("expected *puid.Error, got %T: %v", err, err)
	}
	return pe
}

// --- dev-server session (mints keys via the dashboard API) ------------------

type session struct{ hc *http.Client }

func newSession(t *testing.T, email string) *session {
	t.Helper()
	jar, _ := cookiejar.New(nil)
	hc := &http.Client{Jar: jar}
	resp, err := hc.Get(origin + "/auth/dev-login?email=" + url.QueryEscape(email) + "&next=/dashboard")
	if err != nil {
		t.Fatalf("dev-login: %v", err)
	}
	resp.Body.Close()
	return &session{hc}
}

func (s *session) mintKey(t *testing.T) string {
	t.Helper()
	resp, err := s.hc.Post(origin+"/dashboard/api/team/keys", "application/json", strings.NewReader(`{"label":"go-test"}`))
	if err != nil {
		t.Fatalf("mint key: %v", err)
	}
	defer resp.Body.Close()
	var out struct {
		APIKey string `json:"api_key"`
	}
	json.NewDecoder(resp.Body).Decode(&out)
	if out.APIKey == "" {
		t.Fatalf("mintKey failed (HTTP %d)", resp.StatusCode)
	}
	return out.APIKey
}

func (s *session) seedUsage(t *testing.T, n int) {
	t.Helper()
	resp, err := s.hc.Get(fmt.Sprintf("%s/dashboard/api/dev/seed-usage?n=%d", origin, n))
	if err != nil {
		t.Fatalf("seed usage: %v", err)
	}
	resp.Body.Close()
}

func registerClient(t *testing.T, name string) (string, string) {
	t.Helper()
	body := fmt.Sprintf(`{"client_name":%q,"redirect_uris":["https://example.test/cb"]}`, name)
	resp, err := http.Post(endpoint+"/oauth/register", "application/json", strings.NewReader(body))
	if err != nil {
		t.Fatalf("register client: %v", err)
	}
	defer resp.Body.Close()
	var out struct {
		ClientID     string `json:"client_id"`
		ClientSecret string `json:"client_secret"`
	}
	json.NewDecoder(resp.Body).Decode(&out)
	if out.ClientID == "" || out.ClientSecret == "" {
		t.Fatalf("register failed (HTTP %d)", resp.StatusCode)
	}
	return out.ClientID, out.ClientSecret
}

func mustClient(t *testing.T, opts ...puid.Option) *puid.Client {
	t.Helper()
	c, err := puid.New(opts...)
	if err != nil {
		t.Fatalf("New: %v", err)
	}
	return c
}

// --- real service: generation & decoding ------------------------------------

func TestIDsUnique(t *testing.T) {
	requireServer(t)
	key := newSession(t, uniqEmail("ids")).mintKey(t)
	c := mustClient(t, puid.WithAPIKey(key), puid.WithEndpoint(endpoint))
	ids, err := c.IDs(context.Background(), 10)
	if err != nil {
		t.Fatal(err)
	}
	if len(ids) != 10 {
		t.Fatalf("want 10 ids, got %d", len(ids))
	}
	seen := map[string]bool{}
	for _, id := range ids {
		if id == "" || seen[id] {
			t.Fatalf("empty or duplicate id: %q", id)
		}
		seen[id] = true
	}
}

func TestIDSingle(t *testing.T) {
	requireServer(t)
	key := newSession(t, uniqEmail("single")).mintKey(t)
	id, err := mustClient(t, puid.WithAPIKey(key), puid.WithEndpoint(endpoint)).ID(context.Background())
	if err != nil || id == "" {
		t.Fatalf("ID: %q err=%v", id, err)
	}
}

func TestOrdinalConsecutive(t *testing.T) {
	requireServer(t)
	key := newSession(t, uniqEmail("ord")).mintKey(t)
	c := mustClient(t, puid.WithAPIKey(key), puid.WithEndpoint(endpoint))
	ctx := context.Background()
	ids, err := c.IDs(ctx, 2) // one rate-limited request; Ordinal is not rate limited
	if err != nil {
		t.Fatal(err)
	}
	a, err := c.Ordinal(ctx, ids[0])
	if err != nil {
		t.Fatal(err)
	}
	b, err := c.Ordinal(ctx, ids[1])
	if err != nil {
		t.Fatal(err)
	}
	if a.Sign() <= 0 {
		t.Fatalf("ordinal must be positive, got %s", a)
	}
	if new(big.Int).Sub(b, a).Cmp(big.NewInt(1)) != 0 {
		t.Fatalf("ids in one batch must decode to consecutive ordinals: %s, %s", a, b)
	}
}

func TestEndpointTrailingSlash(t *testing.T) {
	requireServer(t)
	key := newSession(t, uniqEmail("slash")).mintKey(t)
	id, err := mustClient(t, puid.WithAPIKey(key), puid.WithEndpoint(endpoint+"/")).ID(context.Background())
	if err != nil || id == "" {
		t.Fatalf("trailing slash endpoint: %q err=%v", id, err)
	}
}

func TestQuota(t *testing.T) {
	requireServer(t)
	key := newSession(t, uniqEmail("quota")).mintKey(t)
	c := mustClient(t, puid.WithAPIKey(key), puid.WithEndpoint(endpoint))
	ctx := context.Background()
	before, err := c.Quota(ctx)
	if err != nil {
		t.Fatal(err)
	}
	after, err := c.Quota(ctx) // calling quota twice must not spend an id
	if err != nil {
		t.Fatal(err)
	}
	if before.Plan == "" || before.Used != after.Used {
		t.Fatalf("quota changed or missing plan: %+v then %+v", before, after)
	}
}

// --- real service: error paths ----------------------------------------------

func TestBadKey401(t *testing.T) {
	requireServer(t)
	c := mustClient(t, puid.WithAPIKey("puid_live_definitely_not_real"), puid.WithEndpoint(endpoint))
	pe := asPuidErr(t, func() error { _, err := c.ID(context.Background()); return err }())
	if pe.Status != 401 || pe.Code != "unauthorized" {
		t.Fatalf("want 401/unauthorized, got %d/%s", pe.Status, pe.Code)
	}
}

func TestQuotaExceeded402(t *testing.T) {
	requireServer(t)
	s := newSession(t, uniqEmail("over-quota"))
	s.seedUsage(t, 1000) // free plan = 1000/day
	c := mustClient(t, puid.WithAPIKey(s.mintKey(t)), puid.WithEndpoint(endpoint))
	pe := asPuidErr(t, func() error { _, err := c.ID(context.Background()); return err }())
	if pe.Status != 402 {
		t.Fatalf("want 402, got %d (%s)", pe.Status, pe.Code)
	}
}

func TestRateLimit429(t *testing.T) {
	requireServer(t)
	key := newSession(t, uniqEmail("rate")).mintKey(t)
	c := mustClient(t, puid.WithAPIKey(key), puid.WithEndpoint(endpoint))
	ctx := context.Background()
	if _, err := c.ID(ctx); err != nil { // first request allowed
		t.Fatal(err)
	}
	pe := asPuidErr(t, func() error { _, err := c.ID(ctx); return err }())
	if pe.Status != 429 || pe.Code != "rate_limited" {
		t.Fatalf("want 429/rate_limited, got %d/%s", pe.Status, pe.Code)
	}
}

// --- real service: OAuth2 (generate on someone else's behalf) ---------------

func TestFromClientCredentials(t *testing.T) {
	requireServer(t)
	id, secret := registerClient(t, "go-cc-test")
	c, err := puid.FromClientCredentials(context.Background(), id, secret, puid.WithEndpoint(endpoint))
	if err != nil {
		t.Fatal(err)
	}
	ids, err := c.IDs(context.Background(), 2)
	if err != nil || len(ids) != 2 {
		t.Fatalf("client-credentials IDs: %v len=%d", err, len(ids))
	}
}

func TestFromClientCredentialsBad(t *testing.T) {
	requireServer(t)
	_, err := puid.FromClientCredentials(context.Background(), "nope", "wrong", puid.WithEndpoint(endpoint))
	pe := asPuidErr(t, err)
	if pe.Status < 400 {
		t.Fatalf("want >=400, got %d", pe.Status)
	}
}

// --- client-side validation (no network needed) -----------------------------

func TestDefaultEndpoint(t *testing.T) {
	if puid.DefaultEndpoint != "https://puid.dev/api" {
		t.Fatalf("unexpected DefaultEndpoint: %s", puid.DefaultEndpoint)
	}
}

func TestNewRequiresExactlyOneCredential(t *testing.T) {
	if _, err := puid.New(); err == nil {
		t.Fatal("expected error with no credential")
	}
	if _, err := puid.New(puid.WithAPIKey("k"), puid.WithAccessToken("t")); err == nil {
		t.Fatal("expected error with both credentials")
	}
}

func TestIDsValidation(t *testing.T) {
	c := mustClient(t, puid.WithAPIKey("k"), puid.WithEndpoint(endpoint))
	for _, bad := range []int{0, 11, -3} {
		pe := asPuidErr(t, func() error { _, err := c.IDs(context.Background(), bad); return err }())
		if pe.Code != "invalid_count" {
			t.Fatalf("IDs(%d): want invalid_count, got %s", bad, pe.Code)
		}
	}
}

func TestOrdinalValidation(t *testing.T) {
	c := mustClient(t, puid.WithAPIKey("k"), puid.WithEndpoint(endpoint))
	pe := asPuidErr(t, func() error { _, err := c.Ordinal(context.Background(), ""); return err }())
	if pe.Code != "invalid_puid" {
		t.Fatalf("want invalid_puid, got %s", pe.Code)
	}
}

func TestFromClientCredentialsRequiresArgs(t *testing.T) {
	if _, err := puid.FromClientCredentials(context.Background(), "only", "", puid.WithEndpoint(endpoint)); err == nil {
		t.Fatal("expected error with missing secret")
	}
}

// --- cases a live endpoint can't produce ------------------------------------

func TestNonJSONErrorBody(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(502)
		w.Write([]byte("<html>nope</html>"))
	}))
	defer ts.Close()
	c := mustClient(t, puid.WithAPIKey("k"), puid.WithEndpoint(ts.URL))
	pe := asPuidErr(t, func() error { _, err := c.ID(context.Background()); return err }())
	if pe.Status != 502 || pe.Code != "" || !strings.Contains(pe.Message, "HTTP 502") {
		t.Fatalf("unexpected error: %+v", pe)
	}
}

func TestNetworkError(t *testing.T) {
	c := mustClient(t, puid.WithAPIKey("k"), puid.WithEndpoint("http://127.0.0.1:1/api"))
	pe := asPuidErr(t, func() error { _, err := c.ID(context.Background()); return err }())
	if pe.Code != "network_error" {
		t.Fatalf("want network_error, got %q", pe.Code)
	}
}
