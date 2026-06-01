"""Official Python client for the PUID API — the Provably Unique IDentifier service.

PUID hands out identifiers that are guaranteed distinct by construction (a counter
run through a 128-bit permutation), not by the dice roll a random UUID makes. This
client wraps the three real endpoints:

    * ids(n)        GET /v1/ids?n=1..10        -> list[str]
    * ordinal(puid) GET /v1/ordinal/{puid}     -> int (the counter it encodes)
    * quota()       GET /v1/quota              -> dict (plan, used, limit, remaining)

Auth is either your team API key (X-API-Key: puid_live_...) or an OAuth2 bearer
token (Authorization: Bearer puid_at_...) granted to generate ids on a team's
behalf. Puid.from_client_credentials() mints such a token from a registered OAuth
client (the machine-to-machine path).

Zero dependencies — built on the standard library (urllib).
"""

from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

__all__ = ["Puid", "PuidError", "DEFAULT_ENDPOINT"]

DEFAULT_ENDPOINT = "https://puid.dev/api"


class PuidError(Exception):
    """Raised for any non-2xx API response and for client-side validation.

    ``status`` is the HTTP status (when the error came from the server) and
    ``code`` is the API's machine-readable error code (e.g. "rate_limited",
    "quota_exceeded", or "network_error" / "invalid_count" for client-side errors).
    """

    def __init__(self, message: str, status: int | None = None, code: str | None = None):
        super().__init__(message)
        self.status = status
        self.code = code


def _read_json(fp: Any) -> dict:
    try:
        return json.loads(fp.read().decode("utf-8"))
    except Exception:
        return {}


class Puid:
    """A PUID API client.

    Provide exactly one credential:

        Puid(api_key="puid_live_...")
        Puid(access_token="puid_at_...")

    ``endpoint`` defaults to https://puid.dev/api. Point it at a local dev server
    for tests, or at your own domain for a self-hosted (Enterprise) PUID. ``opener``
    accepts a custom ``urllib`` opener (used for testing / custom transports).
    """

    def __init__(
        self,
        api_key: str | None = None,
        access_token: str | None = None,
        endpoint: str = DEFAULT_ENDPOINT,
        opener: urllib.request.OpenerDirector | None = None,
    ):
        if api_key and access_token:
            raise PuidError("Provide either api_key or access_token, not both.")
        if not api_key and not access_token:
            raise PuidError("Provide an api_key (puid_live_...) or an access_token (puid_at_...).")
        self._base = endpoint.rstrip("/")
        self._auth = (
            {"Authorization": f"Bearer {access_token}"} if access_token else {"X-API-Key": api_key}
        )
        self._opener = opener or urllib.request.build_opener()

    def _get(self, path: str) -> dict:
        req = urllib.request.Request(
            self._base + path,
            headers={**self._auth, "Accept": "application/json"},
            method="GET",
        )
        try:
            with self._opener.open(req) as resp:
                return _read_json(resp)
        except urllib.error.HTTPError as exc:
            body = _read_json(exc)
            raise PuidError(
                body.get("message") or body.get("error") or f"Request failed with HTTP {exc.code}.",
                status=exc.code,
                code=body.get("error"),
            ) from exc
        except urllib.error.URLError as exc:
            raise PuidError(
                f"Network request to PUID failed: {exc.reason}", code="network_error"
            ) from exc

    def ids(self, count: int = 1) -> list:
        """Generate ``count`` ids (1-10). Returns a list of id strings."""
        if isinstance(count, bool) or not isinstance(count, int) or count < 1 or count > 10:
            raise PuidError("count must be an integer from 1 to 10.", code="invalid_count")
        return self._get(f"/v1/ids?n={count}")["ids"]

    def id(self) -> str:
        """Generate a single id."""
        return self.ids(1)[0]

    def ordinal(self, puid: str) -> int:
        """Decode a PUID back to the ordinal (counter value) it encodes."""
        if not isinstance(puid, str) or not puid:
            raise PuidError("puid must be a non-empty string.", code="invalid_puid")
        return int(self._get(f"/v1/ordinal/{urllib.parse.quote(puid, safe='')}")["ordinal"])

    def quota(self) -> dict:
        """Today's usage and remaining daily quota. Does not spend an id."""
        return self._get("/v1/quota")

    @classmethod
    def from_client_credentials(
        cls,
        client_id: str,
        client_secret: str,
        scope: str = "puid:generate",
        endpoint: str = DEFAULT_ENDPOINT,
        opener: urllib.request.OpenerDirector | None = None,
    ) -> Puid:
        """Exchange OAuth2 client credentials for a bearer token and return a client.

        This is how an app generates ids on a team's behalf without ever handling
        the team's API key.
        """
        if not client_id or not client_secret:
            raise PuidError("client_id and client_secret are required.", code="invalid_client")
        base = endpoint.rstrip("/")
        data = urllib.parse.urlencode(
            {
                "grant_type": "client_credentials",
                "client_id": client_id,
                "client_secret": client_secret,
                "scope": scope,
            }
        ).encode("utf-8")
        req = urllib.request.Request(
            base + "/oauth/token",
            data=data,
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
            method="POST",
        )
        op = opener or urllib.request.build_opener()
        try:
            with op.open(req) as resp:
                body = _read_json(resp)
        except urllib.error.HTTPError as exc:
            body = _read_json(exc)
            raise PuidError(
                body.get("error_description")
                or body.get("error")
                or f"Token request failed with HTTP {exc.code}.",
                status=exc.code,
                code=body.get("error"),
            ) from exc
        except urllib.error.URLError as exc:
            raise PuidError(
                f"Token request to PUID failed: {exc.reason}", code="network_error"
            ) from exc
        token = body.get("access_token")
        if not token:
            raise PuidError(
                body.get("error") or "Token request returned no access_token.",
                code="invalid_client",
            )
        return cls(access_token=token, endpoint=endpoint, opener=opener)
