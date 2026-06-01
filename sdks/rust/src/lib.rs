//! Official Rust client for the [PUID](https://puid.dev) API — the Provably Unique
//! IDentifier service. Every id is guaranteed distinct by construction (a counter
//! run through a 128-bit permutation), not by the dice roll a random UUID makes.
//!
//! ```no_run
//! let puid = puid::Puid::with_api_key("puid_live_...");
//! let ids = puid.ids(5)?;            // 1–10 per request
//! let n = puid.ordinal(&ids[0])?;    // u128 — the counter it encodes
//! let q = puid.quota()?;             // does not spend an id
//! # Ok::<(), puid::PuidError>(())
//! ```
//!
//! Auth is either a team API key (`X-API-Key: puid_live_…`) or an OAuth2 bearer
//! token (`Authorization: Bearer puid_at_…`). [`ClientCredentials`] mints a token
//! from a registered OAuth client (generate ids on a team's behalf).

use serde::Deserialize;

/// The production API endpoint. Override with [`Puid::endpoint`] to point at a local
/// dev server for tests, or your own domain for a self-hosted (Enterprise) PUID.
pub const DEFAULT_ENDPOINT: &str = "https://puid.dev/api";

/// An error from the API (non-2xx) or from client-side validation.
#[derive(Debug, Clone)]
pub struct PuidError {
    /// HTTP status, or `None` for client-side / transport errors.
    pub status: Option<u16>,
    /// Machine-readable code, e.g. `"rate_limited"`, `"quota_exceeded"`, `"network_error"`.
    pub code: Option<String>,
    /// Human-readable message.
    pub message: String,
}

impl std::fmt::Display for PuidError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl std::error::Error for PuidError {}

/// Today's usage and remaining daily quota. `limit`/`remaining` are `None` when unlimited.
#[derive(Debug, Clone, Deserialize)]
pub struct Quota {
    pub plan: String,
    pub used: i64,
    pub limit: Option<i64>,
    pub remaining: Option<i64>,
}

/// A PUID API client.
#[derive(Debug, Clone)]
pub struct Puid {
    endpoint: String,
    auth_name: &'static str,
    auth_value: String,
    agent: ureq::Agent,
}

impl Puid {
    /// Authenticate with a team API key (`puid_live_…`).
    pub fn with_api_key(api_key: impl Into<String>) -> Self {
        Self::build("X-API-Key", api_key.into())
    }

    /// Authenticate with an OAuth2 bearer token (`puid_at_…`).
    pub fn with_access_token(token: impl Into<String>) -> Self {
        Self::build("Authorization", format!("Bearer {}", token.into()))
    }

    fn build(auth_name: &'static str, auth_value: String) -> Self {
        Puid {
            endpoint: DEFAULT_ENDPOINT.to_string(),
            auth_name,
            auth_value,
            agent: ureq::Agent::new(),
        }
    }

    /// Override the API endpoint (default [`DEFAULT_ENDPOINT`]).
    pub fn endpoint(mut self, endpoint: impl Into<String>) -> Self {
        self.endpoint = endpoint.into().trim_end_matches('/').to_string();
        self
    }

    fn get_json<T: serde::de::DeserializeOwned>(&self, path: &str) -> Result<T, PuidError> {
        let url = format!("{}{}", self.endpoint, path);
        match self
            .agent
            .get(&url)
            .set(self.auth_name, &self.auth_value)
            .set("Accept", "application/json")
            .call()
        {
            Ok(resp) => resp.into_json::<T>().map_err(|e| PuidError {
                status: None,
                code: None,
                message: format!("invalid JSON from PUID: {e}"),
            }),
            Err(ureq::Error::Status(code, resp)) => Err(parse_error(code, resp, "request")),
            Err(ureq::Error::Transport(t)) => Err(PuidError {
                status: None,
                code: Some("network_error".to_string()),
                message: format!("request to PUID failed: {t}"),
            }),
        }
    }

    /// Generate `count` ids (1–10).
    pub fn ids(&self, count: u32) -> Result<Vec<String>, PuidError> {
        if !(1..=10).contains(&count) {
            return Err(PuidError {
                status: None,
                code: Some("invalid_count".to_string()),
                message: "count must be between 1 and 10".to_string(),
            });
        }
        #[derive(Deserialize)]
        struct Resp {
            ids: Vec<String>,
        }
        Ok(self.get_json::<Resp>(&format!("/v1/ids?n={count}"))?.ids)
    }

    /// Generate a single id.
    pub fn id(&self) -> Result<String, PuidError> {
        let mut ids = self.ids(1)?;
        Ok(ids.remove(0))
    }

    /// Decode a PUID back to the counter value it encodes. The ordinal can be up to
    /// 128 bits, so it is returned as a `u128`.
    pub fn ordinal(&self, puid: &str) -> Result<u128, PuidError> {
        if puid.is_empty() {
            return Err(PuidError {
                status: None,
                code: Some("invalid_puid".to_string()),
                message: "puid must be a non-empty string".to_string(),
            });
        }
        #[derive(Deserialize)]
        struct Resp {
            ordinal: String,
        }
        let resp = self.get_json::<Resp>(&format!("/v1/ordinal/{}", encode_segment(puid)))?;
        resp.ordinal.parse::<u128>().map_err(|e| PuidError {
            status: None,
            code: None,
            message: format!("could not parse ordinal {:?}: {e}", resp.ordinal),
        })
    }

    /// Today's usage and remaining daily quota. Does not spend an id.
    pub fn quota(&self) -> Result<Quota, PuidError> {
        self.get_json::<Quota>("/v1/quota")
    }

    /// Exchange OAuth2 client credentials for a bearer token and return a ready
    /// client. Use [`ClientCredentials`] to customize the endpoint or scope.
    pub fn from_client_credentials(
        client_id: &str,
        client_secret: &str,
    ) -> Result<Self, PuidError> {
        ClientCredentials::new(client_id, client_secret).exchange()
    }
}

/// Builder for the OAuth2 client-credentials grant — how an app generates ids on a
/// team's behalf without ever handling the team's API key.
pub struct ClientCredentials {
    client_id: String,
    client_secret: String,
    endpoint: String,
    scope: String,
    agent: ureq::Agent,
}

impl ClientCredentials {
    pub fn new(client_id: impl Into<String>, client_secret: impl Into<String>) -> Self {
        ClientCredentials {
            client_id: client_id.into(),
            client_secret: client_secret.into(),
            endpoint: DEFAULT_ENDPOINT.to_string(),
            scope: "puid:generate".to_string(),
            agent: ureq::Agent::new(),
        }
    }

    /// Override the API endpoint (default [`DEFAULT_ENDPOINT`]).
    pub fn endpoint(mut self, endpoint: impl Into<String>) -> Self {
        self.endpoint = endpoint.into().trim_end_matches('/').to_string();
        self
    }

    /// Set the OAuth2 scope (default `"puid:generate"`).
    pub fn scope(mut self, scope: impl Into<String>) -> Self {
        self.scope = scope.into();
        self
    }

    /// Perform the token exchange and return a ready [`Puid`].
    pub fn exchange(self) -> Result<Puid, PuidError> {
        if self.client_id.is_empty() || self.client_secret.is_empty() {
            return Err(PuidError {
                status: None,
                code: Some("invalid_client".to_string()),
                message: "client_id and client_secret are required".to_string(),
            });
        }
        let url = format!("{}/oauth/token", self.endpoint);
        let value: serde_json::Value = match self
            .agent
            .post(&url)
            .set("Accept", "application/json")
            .send_form(&[
                ("grant_type", "client_credentials"),
                ("client_id", &self.client_id),
                ("client_secret", &self.client_secret),
                ("scope", &self.scope),
            ]) {
            Ok(resp) => resp.into_json().map_err(|e| PuidError {
                status: None,
                code: None,
                message: format!("invalid JSON from PUID: {e}"),
            })?,
            Err(ureq::Error::Status(code, resp)) => {
                return Err(parse_error(code, resp, "token request"))
            }
            Err(ureq::Error::Transport(t)) => {
                return Err(PuidError {
                    status: None,
                    code: Some("network_error".to_string()),
                    message: format!("token request to PUID failed: {t}"),
                })
            }
        };
        let token = value
            .get("access_token")
            .and_then(|v| v.as_str())
            .unwrap_or("");
        if token.is_empty() {
            return Err(PuidError {
                status: None,
                code: value
                    .get("error")
                    .and_then(|v| v.as_str())
                    .map(String::from),
                message: "token request returned no access_token".to_string(),
            });
        }
        Ok(Puid::with_access_token(token).endpoint(self.endpoint))
    }
}

fn parse_error(code: u16, resp: ureq::Response, what: &str) -> PuidError {
    let v: serde_json::Value = resp.into_json().unwrap_or(serde_json::Value::Null);
    let err_code = v.get("error").and_then(|x| x.as_str()).map(String::from);
    let message = v
        .get("message")
        .and_then(|x| x.as_str())
        .or_else(|| v.get("error_description").and_then(|x| x.as_str()))
        .or_else(|| v.get("error").and_then(|x| x.as_str()))
        .map(String::from)
        .unwrap_or_else(|| format!("{what} failed with HTTP {code}"));
    PuidError {
        status: Some(code),
        code: err_code,
        message,
    }
}

/// Percent-encode a single URL path segment (RFC 3986 unreserved chars pass through).
fn encode_segment(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for b in s.bytes() {
        match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                out.push(b as char)
            }
            _ => out.push_str(&format!("%{b:02X}")),
        }
    }
    out
}
