// Package puid is the official Go client for the PUID API — the Provably Unique
// IDentifier service. Every id is guaranteed distinct by construction (a counter
// run through a 128-bit permutation), not by the dice roll a random UUID makes.
//
// The client wraps the three real endpoints:
//
//	IDs(ctx, n)        GET /v1/ids?n=1..10     -> []string
//	Ordinal(ctx, puid) GET /v1/ordinal/{puid}  -> *big.Int (the counter it encodes)
//	Quota(ctx)         GET /v1/quota           -> *Quota
//
// Auth is either a team API key (X-API-Key: puid_live_…) or an OAuth2 bearer token
// (Authorization: Bearer puid_at_…) granted to generate ids on a team's behalf.
// FromClientCredentials mints such a token from a registered OAuth client.
//
// Zero dependencies — built on the standard library.
package puid

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"net/url"
	"strings"
)

// DefaultEndpoint is the production API base. Override with WithEndpoint to point
// at a local dev server for tests, or at your own domain for a self-hosted PUID.
const DefaultEndpoint = "https://puid.dev/api"

// Error is returned for any non-2xx API response and for client-side validation.
// Status is the HTTP status (0 for client-side/transport errors); Code is the
// API's machine-readable error code (e.g. "rate_limited", "quota_exceeded").
type Error struct {
	Status  int
	Code    string
	Message string
}

func (e *Error) Error() string { return e.Message }

// Quota is the response from Quota. Limit and Remaining are nil when unlimited.
type Quota struct {
	Plan      string `json:"plan"`
	Used      int    `json:"used"`
	Limit     *int   `json:"limit"`
	Remaining *int   `json:"remaining"`
}

// Client is a PUID API client. Create one with New.
type Client struct {
	endpoint   string
	authName   string
	authValue  string
	httpClient *http.Client
}

type config struct {
	apiKey      string
	accessToken string
	scope       string
	endpoint    string
	httpClient  *http.Client
}

// Option configures a Client.
type Option func(*config)

// WithAPIKey authenticates with a team API key (puid_live_…).
func WithAPIKey(key string) Option { return func(c *config) { c.apiKey = key } }

// WithAccessToken authenticates with an OAuth2 bearer token (puid_at_…).
func WithAccessToken(token string) Option { return func(c *config) { c.accessToken = token } }

// WithEndpoint overrides the API endpoint (default DefaultEndpoint).
func WithEndpoint(endpoint string) Option { return func(c *config) { c.endpoint = endpoint } }

// WithHTTPClient supplies a custom *http.Client.
func WithHTTPClient(h *http.Client) Option { return func(c *config) { c.httpClient = h } }

// WithScope sets the OAuth2 scope for FromClientCredentials (default "puid:generate").
func WithScope(scope string) Option { return func(c *config) { c.scope = scope } }

func resolve(opts []Option) config {
	cfg := config{endpoint: DefaultEndpoint, scope: "puid:generate"}
	for _, o := range opts {
		o(&cfg)
	}
	if cfg.endpoint == "" {
		cfg.endpoint = DefaultEndpoint
	}
	if cfg.httpClient == nil {
		cfg.httpClient = http.DefaultClient
	}
	return cfg
}

// New builds a Client. Provide exactly one credential via WithAPIKey or
// WithAccessToken.
func New(opts ...Option) (*Client, error) {
	cfg := resolve(opts)
	if cfg.apiKey != "" && cfg.accessToken != "" {
		return nil, &Error{Message: "provide either an API key or an access token, not both"}
	}
	c := &Client{
		endpoint:   strings.TrimRight(cfg.endpoint, "/"),
		httpClient: cfg.httpClient,
	}
	switch {
	case cfg.accessToken != "":
		c.authName, c.authValue = "Authorization", "Bearer "+cfg.accessToken
	case cfg.apiKey != "":
		c.authName, c.authValue = "X-API-Key", cfg.apiKey
	default:
		return nil, &Error{Message: "provide an API key (puid_live_…) or an access token (puid_at_…)"}
	}
	return c, nil
}

func (c *Client) get(ctx context.Context, path string, out any) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.endpoint+path, nil)
	if err != nil {
		return &Error{Message: err.Error()}
	}
	req.Header.Set(c.authName, c.authValue)
	req.Header.Set("Accept", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return &Error{Code: "network_error", Message: fmt.Sprintf("request to PUID failed: %v", err)}
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		var e struct {
			Error   string `json:"error"`
			Message string `json:"message"`
		}
		_ = json.Unmarshal(body, &e)
		return &Error{Status: resp.StatusCode, Code: e.Error, Message: firstNonEmpty(e.Message, e.Error, fmt.Sprintf("request failed with HTTP %d", resp.StatusCode))}
	}
	if out != nil {
		if err := json.Unmarshal(body, out); err != nil {
			return &Error{Status: resp.StatusCode, Message: fmt.Sprintf("invalid JSON from PUID: %v", err)}
		}
	}
	return nil
}

// IDs generates count ids (1–10).
func (c *Client) IDs(ctx context.Context, count int) ([]string, error) {
	if count < 1 || count > 10 {
		return nil, &Error{Code: "invalid_count", Message: "count must be between 1 and 10"}
	}
	var out struct {
		IDs []string `json:"ids"`
	}
	if err := c.get(ctx, fmt.Sprintf("/v1/ids?n=%d", count), &out); err != nil {
		return nil, err
	}
	return out.IDs, nil
}

// ID generates a single id.
func (c *Client) ID(ctx context.Context) (string, error) {
	ids, err := c.IDs(ctx, 1)
	if err != nil {
		return "", err
	}
	return ids[0], nil
}

// Ordinal decodes a PUID back to the counter value it encodes. The ordinal can be
// up to 128 bits, so it is returned as *big.Int.
func (c *Client) Ordinal(ctx context.Context, puid string) (*big.Int, error) {
	if puid == "" {
		return nil, &Error{Code: "invalid_puid", Message: "puid must be a non-empty string"}
	}
	var out struct {
		Ordinal string `json:"ordinal"`
	}
	if err := c.get(ctx, "/v1/ordinal/"+url.PathEscape(puid), &out); err != nil {
		return nil, err
	}
	n, ok := new(big.Int).SetString(out.Ordinal, 10)
	if !ok {
		return nil, &Error{Message: "could not parse ordinal: " + out.Ordinal}
	}
	return n, nil
}

// Quota returns today's usage and remaining daily quota. It does not spend an id.
func (c *Client) Quota(ctx context.Context) (*Quota, error) {
	var q Quota
	if err := c.get(ctx, "/v1/quota", &q); err != nil {
		return nil, err
	}
	return &q, nil
}

// FromClientCredentials exchanges OAuth2 client credentials for a bearer token and
// returns a ready Client. This is how an app generates ids on a team's behalf
// without ever handling the team's API key. WithEndpoint, WithScope, and
// WithHTTPClient are honored.
func FromClientCredentials(ctx context.Context, clientID, clientSecret string, opts ...Option) (*Client, error) {
	if clientID == "" || clientSecret == "" {
		return nil, &Error{Code: "invalid_client", Message: "clientID and clientSecret are required"}
	}
	cfg := resolve(opts)
	endpoint := strings.TrimRight(cfg.endpoint, "/")

	form := url.Values{
		"grant_type":    {"client_credentials"},
		"client_id":     {clientID},
		"client_secret": {clientSecret},
		"scope":         {cfg.scope},
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint+"/oauth/token", strings.NewReader(form.Encode()))
	if err != nil {
		return nil, &Error{Message: err.Error()}
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")

	resp, err := cfg.httpClient.Do(req)
	if err != nil {
		return nil, &Error{Code: "network_error", Message: fmt.Sprintf("token request to PUID failed: %v", err)}
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)

	var tok struct {
		AccessToken      string `json:"access_token"`
		Error            string `json:"error"`
		ErrorDescription string `json:"error_description"`
	}
	_ = json.Unmarshal(body, &tok)
	if resp.StatusCode < 200 || resp.StatusCode >= 300 || tok.AccessToken == "" {
		return nil, &Error{Status: resp.StatusCode, Code: tok.Error, Message: firstNonEmpty(tok.ErrorDescription, tok.Error, fmt.Sprintf("token request failed with HTTP %d", resp.StatusCode))}
	}
	return New(WithAccessToken(tok.AccessToken), WithEndpoint(endpoint), WithHTTPClient(cfg.httpClient))
}

func firstNonEmpty(vals ...string) string {
	for _, v := range vals {
		if v != "" {
			return v
		}
	}
	return ""
}
