"""Integration suite for puid-client — runs against a REAL PUID instance.

Point it at a running server with PUID_ENDPOINT (default http://localhost:8799/api,
i.e. ``npm run dev:e2e`` from the repo root). The site origin (for dev-login + the
dashboard API used to mint keys) is derived by stripping the trailing /api, or set
PUID_ORIGIN explicitly.

Everything a real endpoint can produce is tested against the real endpoint: id
generation, decoding, quota, 401, 402 (out of quota), 429 (one per second), and the
OAuth2 client-credentials flow. Only two cases are exercised differently because a
live endpoint never produces them: a non-JSON error body (a fake opener) and a
transport failure (a real connection to a closed port).
"""

import http.client
import http.cookiejar
import io
import json
import os
import secrets
import urllib.error
import urllib.parse
import urllib.request

import pytest

from puid import DEFAULT_ENDPOINT, Puid, PuidError

ENDPOINT = os.environ.get("PUID_ENDPOINT", "http://localhost:8799/api").rstrip("/")
ORIGIN = os.environ.get("PUID_ORIGIN", ENDPOINT.removesuffix("/api")).rstrip("/")


def uniq_email(tag: str) -> str:
    return f"{tag}-{secrets.token_hex(6)}@example.com"


class DevSession:
    """Cookie-jar session against the dev server. dev-login (gated by ALLOW_DEV_LOGIN)
    stands in for a completed Google sign-in, giving a session cookie usable against
    the dashboard API to mint keys and seed usage."""

    def __init__(self, email: str):
        jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
        url = f"{ORIGIN}/auth/dev-login?email={urllib.parse.quote(email)}&next=/dashboard"
        self.opener.open(url)  # follows the redirect; the cookie jar captures the session
        if not list(jar):
            raise RuntimeError("dev-login set no cookie — is ALLOW_DEV_LOGIN=1 on the server?")

    def _post(self, path: str, payload: dict) -> dict:
        req = urllib.request.Request(
            f"{ORIGIN}{path}",
            data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json", "Accept": "application/json"},
            method="POST",
        )
        with self.opener.open(req) as r:
            return json.loads(r.read().decode())

    def mint_key(self, label: str = "sdk-test") -> str:
        body = self._post("/dashboard/api/team/keys", {"label": label})
        if not body.get("api_key"):
            raise RuntimeError("mint_key failed")
        return body["api_key"]

    def seed_usage(self, n: int) -> None:
        with self.opener.open(f"{ORIGIN}/dashboard/api/dev/seed-usage?n={n}") as r:
            r.read()


def register_client(name: str) -> dict:
    """Dynamic client registration is unauthenticated, so no session is needed."""
    req = urllib.request.Request(
        f"{ENDPOINT}/oauth/register",
        data=json.dumps(
            {"client_name": name, "redirect_uris": ["https://example.test/cb"]}
        ).encode(),
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req) as r:
        body = json.loads(r.read().decode())
    if not body.get("client_id") or not body.get("client_secret"):
        raise RuntimeError("register failed")
    return body


@pytest.fixture(scope="session", autouse=True)
def _require_server():
    try:
        urllib.request.urlopen(f"{ENDPOINT}/openapi.json", timeout=5).read()
    except Exception as exc:  # noqa: BLE001
        pytest.skip(
            f"PUID not reachable at {ENDPOINT} ({exc}). Start `npm run dev:e2e` from the repo root."
        )


# --- real service: generation & decoding ------------------------------------


def test_ids_returns_unique_non_empty():
    key = DevSession(uniq_email("ids")).mint_key()
    ids = Puid(api_key=key, endpoint=ENDPOINT).ids(10)
    assert len(ids) == 10
    assert all(isinstance(i, str) and i for i in ids)
    assert len(set(ids)) == 10


def test_id_single():
    key = DevSession(uniq_email("single")).mint_key()
    assert isinstance(Puid(api_key=key, endpoint=ENDPOINT).id(), str)


def test_ordinal_decodes_consecutive():
    key = DevSession(uniq_email("ord")).mint_key()
    puid = Puid(api_key=key, endpoint=ENDPOINT)
    a, b = puid.ids(2)  # one rate-limited request; ordinal() is not rate limited
    oa, ob = puid.ordinal(a), puid.ordinal(b)
    assert isinstance(oa, int) and oa > 0
    assert ob - oa == 1


def test_endpoint_trailing_slash():
    key = DevSession(uniq_email("slash")).mint_key()
    assert Puid(api_key=key, endpoint=ENDPOINT + "/").id()


# --- real service: quota ----------------------------------------------------


def test_quota_does_not_spend():
    key = DevSession(uniq_email("quota")).mint_key()
    puid = Puid(api_key=key, endpoint=ENDPOINT)
    before = puid.quota()
    after = puid.quota()
    assert isinstance(before["plan"], str)
    assert before["used"] == after["used"]
    if before["limit"] is not None:
        assert before["remaining"] <= before["limit"]


# --- real service: error paths ----------------------------------------------


def test_bad_key_401():
    puid = Puid(api_key="puid_live_definitely_not_real", endpoint=ENDPOINT)
    with pytest.raises(PuidError) as exc:
        puid.id()
    assert exc.value.status == 401
    assert exc.value.code == "unauthorized"


def test_quota_exceeded_402():
    session = DevSession(uniq_email("over-quota"))
    session.seed_usage(1000)  # free plan = 1000/day
    puid = Puid(api_key=session.mint_key(), endpoint=ENDPOINT)
    with pytest.raises(PuidError) as exc:
        puid.id()
    assert exc.value.status == 402


def test_rate_limit_429():
    key = DevSession(uniq_email("rate")).mint_key()
    puid = Puid(api_key=key, endpoint=ENDPOINT)
    puid.id()  # first request allowed
    with pytest.raises(PuidError) as exc:
        puid.id()
    assert exc.value.status == 429
    assert exc.value.code == "rate_limited"


# --- real service: OAuth2 (generate on someone else's behalf) ---------------


def test_from_client_credentials():
    reg = register_client("py-cc-test")
    puid = Puid.from_client_credentials(
        client_id=reg["client_id"], client_secret=reg["client_secret"], endpoint=ENDPOINT
    )
    assert len(puid.ids(2)) == 2


def test_from_client_credentials_bad():
    with pytest.raises(PuidError) as exc:
        Puid.from_client_credentials(client_id="nope", client_secret="wrong", endpoint=ENDPOINT)
    assert exc.value.status is not None and exc.value.status >= 400


# --- client-side validation (no network needed) -----------------------------


def test_default_endpoint():
    assert DEFAULT_ENDPOINT == "https://puid.dev/api"


def test_requires_exactly_one_credential():
    with pytest.raises(PuidError):
        Puid()
    with pytest.raises(PuidError):
        Puid(api_key="k", access_token="t")


def test_ids_validation():
    puid = Puid(api_key="k", endpoint=ENDPOINT)
    for bad in (0, 11, 1.5, -3, True):
        with pytest.raises(PuidError) as exc:
            puid.ids(bad)
        assert exc.value.code == "invalid_count"


def test_ordinal_validation():
    puid = Puid(api_key="k", endpoint=ENDPOINT)
    for bad in ("", None):
        with pytest.raises(PuidError) as exc:
            puid.ordinal(bad)
        assert exc.value.code == "invalid_puid"


def test_from_client_credentials_requires_args():
    with pytest.raises(PuidError):
        Puid.from_client_credentials(client_id="only", client_secret="", endpoint=ENDPOINT)


# --- the two cases a live endpoint can't produce ----------------------------


class _NonJsonErrorOpener:
    """Returns a 502 whose body is not JSON (the real API always returns JSON)."""

    def open(self, req, *args, **kwargs):
        raise urllib.error.HTTPError(
            req.full_url,
            502,
            "Bad Gateway",
            http.client.HTTPMessage(),
            io.BytesIO(b"<html>nope</html>"),
        )


def test_non_json_error_body():
    puid = Puid(api_key="k", endpoint=ENDPOINT, opener=_NonJsonErrorOpener())
    with pytest.raises(PuidError) as exc:
        puid.id()
    assert exc.value.status == 502
    assert exc.value.code is None
    assert "HTTP 502" in str(exc.value)


def test_network_error_closed_port():
    puid = Puid(api_key="k", endpoint="http://127.0.0.1:1/api")
    with pytest.raises(PuidError) as exc:
        puid.id()
    assert exc.value.code == "network_error"
