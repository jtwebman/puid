//! Integration suite for puid-client — runs against a REAL PUID instance.
//!
//! Point it at a running server with PUID_ENDPOINT (default http://localhost:8799/api,
//! i.e. `npm run dev:e2e` from the repo root). The site origin (for dev-login + the
//! dashboard API used to mint keys) is derived by stripping the trailing /api, or set
//! PUID_ORIGIN explicitly.
//!
//! Everything a real endpoint can produce is tested live: id generation, decoding,
//! quota, 401, 402 (out of quota), 429 (one per second), and the OAuth2
//! client-credentials flow. Two cases a live endpoint never produces are exercised
//! differently: a non-JSON error body (a one-shot raw TCP server) and a transport
//! failure (a real connection to a closed port). When the server is unreachable the
//! live tests return early (so a bare `cargo test` without a server still passes).

use std::sync::atomic::{AtomicU64, Ordering};

use puid::{ClientCredentials, Puid, DEFAULT_ENDPOINT};

fn endpoint() -> String {
    std::env::var("PUID_ENDPOINT")
        .unwrap_or_else(|_| "http://localhost:8799/api".to_string())
        .trim_end_matches('/')
        .to_string()
}

fn origin() -> String {
    std::env::var("PUID_ORIGIN")
        .unwrap_or_else(|_| endpoint().trim_end_matches("/api").to_string())
        .trim_end_matches('/')
        .to_string()
}

static SEQ: AtomicU64 = AtomicU64::new(0);

fn uniq_email(tag: &str) -> String {
    let n = SEQ.fetch_add(1, Ordering::SeqCst);
    let t = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    format!("{tag}-{t}-{n}@example.com")
}

fn server_up() -> bool {
    ureq::get(&format!("{}/openapi.json", endpoint()))
        .call()
        .is_ok()
}

/// A dev-login session (cookie jar) used to mint keys via the dashboard API.
fn session(email: &str) -> ureq::Agent {
    let agent = ureq::AgentBuilder::new().redirects(5).build();
    let _ = agent
        .get(&format!(
            "{}/auth/dev-login?email={}&next=/dashboard",
            origin(),
            email.replace('@', "%40")
        ))
        .call();
    agent
}

fn mint_key(agent: &ureq::Agent) -> String {
    let resp = agent
        .post(&format!("{}/dashboard/api/team/keys", origin()))
        .send_json(serde_json::json!({ "label": "rust-test" }))
        .expect("mint key request");
    let v: serde_json::Value = resp.into_json().expect("mint key json");
    v["api_key"]
        .as_str()
        .expect("api_key in response")
        .to_string()
}

fn seed_usage(agent: &ureq::Agent, n: i64) {
    let _ = agent
        .get(&format!("{}/dashboard/api/dev/seed-usage?n={n}", origin()))
        .call();
}

fn register_client(name: &str) -> (String, String) {
    let resp = ureq::post(&format!("{}/oauth/register", endpoint()))
        .send_json(serde_json::json!({ "client_name": name, "redirect_uris": ["https://example.test/cb"] }))
        .expect("register client");
    let v: serde_json::Value = resp.into_json().expect("register json");
    (
        v["client_id"].as_str().expect("client_id").to_string(),
        v["client_secret"]
            .as_str()
            .expect("client_secret")
            .to_string(),
    )
}

// --- real service: generation & decoding ------------------------------------

#[test]
fn ids_unique() {
    if !server_up() {
        return;
    }
    let key = mint_key(&session(&uniq_email("ids")));
    let c = Puid::with_api_key(key).endpoint(endpoint());
    let ids = c.ids(10).unwrap();
    assert_eq!(ids.len(), 10);
    assert!(ids.iter().all(|s| !s.is_empty()));
    let set: std::collections::HashSet<_> = ids.iter().collect();
    assert_eq!(set.len(), 10, "ids must be unique");
}

#[test]
fn id_single() {
    if !server_up() {
        return;
    }
    let key = mint_key(&session(&uniq_email("single")));
    let id = Puid::with_api_key(key).endpoint(endpoint()).id().unwrap();
    assert!(!id.is_empty());
}

#[test]
fn ordinal_consecutive() {
    if !server_up() {
        return;
    }
    let key = mint_key(&session(&uniq_email("ord")));
    let c = Puid::with_api_key(key).endpoint(endpoint());
    let ids = c.ids(2).unwrap(); // one rate-limited request; ordinal() is not rate limited
    let a = c.ordinal(&ids[0]).unwrap();
    let b = c.ordinal(&ids[1]).unwrap();
    assert!(a > 0);
    assert_eq!(
        b - a,
        1,
        "ids in one batch must decode to consecutive ordinals"
    );
}

#[test]
fn endpoint_trailing_slash() {
    if !server_up() {
        return;
    }
    let key = mint_key(&session(&uniq_email("slash")));
    let id = Puid::with_api_key(key)
        .endpoint(format!("{}/", endpoint()))
        .id()
        .unwrap();
    assert!(!id.is_empty());
}

#[test]
fn quota_does_not_spend() {
    if !server_up() {
        return;
    }
    let key = mint_key(&session(&uniq_email("quota")));
    let c = Puid::with_api_key(key).endpoint(endpoint());
    let before = c.quota().unwrap();
    let after = c.quota().unwrap();
    assert!(!before.plan.is_empty());
    assert_eq!(before.used, after.used);
    if let Some(limit) = before.limit {
        assert!(before.remaining.unwrap() <= limit);
    }
}

// --- real service: error paths ----------------------------------------------

#[test]
fn bad_key_401() {
    if !server_up() {
        return;
    }
    let c = Puid::with_api_key("puid_live_definitely_not_real").endpoint(endpoint());
    let err = c.id().unwrap_err();
    assert_eq!(err.status, Some(401));
    assert_eq!(err.code.as_deref(), Some("unauthorized"));
}

#[test]
fn quota_exceeded_402() {
    if !server_up() {
        return;
    }
    let agent = session(&uniq_email("over-quota"));
    seed_usage(&agent, 1000); // free plan = 1000/day
    let c = Puid::with_api_key(mint_key(&agent)).endpoint(endpoint());
    assert_eq!(c.id().unwrap_err().status, Some(402));
}

#[test]
fn rate_limit_429() {
    if !server_up() {
        return;
    }
    let key = mint_key(&session(&uniq_email("rate")));
    let c = Puid::with_api_key(key).endpoint(endpoint());
    c.id().unwrap(); // first request allowed
    let err = c.id().unwrap_err();
    assert_eq!(err.status, Some(429));
    assert_eq!(err.code.as_deref(), Some("rate_limited"));
}

// --- real service: OAuth2 (generate on someone else's behalf) ---------------

#[test]
fn from_client_credentials() {
    if !server_up() {
        return;
    }
    let (id, secret) = register_client("rust-cc-test");
    let c = ClientCredentials::new(id, secret)
        .endpoint(endpoint())
        .exchange()
        .unwrap();
    assert_eq!(c.ids(2).unwrap().len(), 2);
}

#[test]
fn from_client_credentials_bad() {
    if !server_up() {
        return;
    }
    let err = ClientCredentials::new("nope", "wrong")
        .endpoint(endpoint())
        .exchange()
        .unwrap_err();
    assert!(err.status.map(|s| s >= 400).unwrap_or(false));
}

// --- client-side validation (no network needed) -----------------------------

#[test]
fn default_endpoint() {
    assert_eq!(DEFAULT_ENDPOINT, "https://puid.dev/api");
}

#[test]
fn ids_validation() {
    let c = Puid::with_api_key("k").endpoint(endpoint());
    assert_eq!(c.ids(0).unwrap_err().code.as_deref(), Some("invalid_count"));
    assert_eq!(
        c.ids(11).unwrap_err().code.as_deref(),
        Some("invalid_count")
    );
}

#[test]
fn ordinal_validation() {
    let c = Puid::with_api_key("k").endpoint(endpoint());
    assert_eq!(
        c.ordinal("").unwrap_err().code.as_deref(),
        Some("invalid_puid")
    );
}

#[test]
fn client_credentials_requires_args() {
    assert!(ClientCredentials::new("only", "")
        .endpoint(endpoint())
        .exchange()
        .is_err());
}

// --- cases a live endpoint can't produce ------------------------------------

/// One-shot TCP server that answers any request with a 502 and a non-JSON body.
fn spawn_502_server() -> String {
    use std::io::{Read, Write};
    let listener = std::net::TcpListener::bind("127.0.0.1:0").unwrap();
    let addr = listener.local_addr().unwrap();
    std::thread::spawn(move || {
        if let Ok((mut stream, _)) = listener.accept() {
            let mut buf = [0u8; 1024];
            let _ = stream.read(&mut buf);
            let body = "<html>nope</html>";
            let resp = format!(
                "HTTP/1.1 502 Bad Gateway\r\nContent-Type: text/html\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
                body.len(),
                body
            );
            let _ = stream.write_all(resp.as_bytes());
        }
    });
    format!("http://{addr}")
}

#[test]
fn non_json_error_body() {
    let base = spawn_502_server();
    let err = Puid::with_api_key("k").endpoint(base).id().unwrap_err();
    assert_eq!(err.status, Some(502));
    assert!(err.code.is_none());
    assert!(err.message.contains("HTTP 502"), "got: {}", err.message);
}

#[test]
fn network_error() {
    let err = Puid::with_api_key("k")
        .endpoint("http://127.0.0.1:1/api")
        .id()
        .unwrap_err();
    assert_eq!(err.code.as_deref(), Some("network_error"));
}
