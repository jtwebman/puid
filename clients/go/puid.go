// Package puid is the Go client for PUID. Auth via PUID_API_KEY.
package puid

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"os"
)

const Base = "https://puid.dev/api"

func get(path string) (*http.Response, error) {
	req, _ := http.NewRequest("GET", Base+path, nil)
	req.Header.Set("X-API-Key", os.Getenv("PUID_API_KEY"))
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
		IDs []string `json:"ids"`
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
		Ordinal string `json:"ordinal"`
	}
	return out.Ordinal, json.NewDecoder(resp.Body).Decode(&out)
}
