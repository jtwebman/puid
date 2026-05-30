//! PUID client (Rust). ureq + serde_json. Auth via PUID_API_KEY.
use serde_json::Value;

const BASE: &str = "https://puid.dev/api";

fn get(path: &str) -> Result<Value, String> {
    let key = std::env::var("PUID_API_KEY").unwrap_or_default();
    ureq::get(&format!("{BASE}{path}")).set("X-API-Key", &key)
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
