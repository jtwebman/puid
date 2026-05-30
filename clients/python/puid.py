"""PUID client. Probably Unique IDentifier. Please do not use this.
Auth: export PUID_API_KEY=puid_live_...  (mint one in the dashboard)."""
import json, os, urllib.request

BASE = "https://puid.dev/api"

def _get(path: str, key=None):
    key = key or os.environ.get("PUID_API_KEY", "")
    req = urllib.request.Request(f"{BASE}{path}", headers={"X-API-Key": key})
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
