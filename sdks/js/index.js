// @puid-dev/client — the official JavaScript / Node.js client for the PUID API.
//
// PUID is the Provably Unique IDentifier service: every id is guaranteed distinct
// by construction (a counter run through a 128-bit permutation), not by the dice
// roll a random UUID makes. This client wraps the three real endpoints:
//
//   • ids(n)        GET /v1/ids?n=1..10        → string[]
//   • ordinal(puid) GET /v1/ordinal/{puid}     → bigint (the counter it encodes)
//   • quota()       GET /v1/quota              → { plan, used, limit, remaining }
//
// Auth is either your team API key (X-API-Key: puid_live_…) or an OAuth2 bearer
// token (Authorization: Bearer puid_at_…) that a third-party app was granted to
// generate ids on a team's behalf. Use Puid.fromClientCredentials() to mint such
// a token from a registered OAuth client (the machine-to-machine path).
//
// Zero dependencies. Requires Node 18+ (global fetch) or any environment with a
// WHATWG fetch; you can also inject one via the `fetch` option.

export const DEFAULT_ENDPOINT = "https://puid.dev/api";

/**
 * Error thrown for any non-2xx API response (and for client-side validation).
 * `status` is the HTTP status (when from the server) and `code` is the API's
 * machine-readable error code (e.g. "rate_limited", "quota_exceeded").
 */
export class PuidError extends Error {
  constructor(message, { status = null, code = null } = {}) {
    super(message);
    this.name = "PuidError";
    this.status = status;
    this.code = code;
  }
}

function resolveFetch(injected) {
  const f = injected || globalThis.fetch;
  if (typeof f !== "function") {
    throw new PuidError("No fetch available. Use Node 18+, or pass a `fetch` implementation in the options.");
  }
  return f;
}

export class Puid {
  #base;
  #fetch;
  #authHeader;

  /**
   * @param {object} options
   * @param {string} [options.apiKey]      A team API key (puid_live_…).
   * @param {string} [options.accessToken] An OAuth2 bearer token (puid_at_…).
   * @param {string} [options.endpoint]    API endpoint. Defaults to https://puid.dev/api.
   *                                        Point it at a local dev server for tests, or at
   *                                        your own domain for a self-hosted (Enterprise) PUID.
   * @param {Function} [options.fetch]     A fetch implementation (defaults to global fetch).
   */
  constructor(options = {}) {
    const { apiKey, accessToken, endpoint = DEFAULT_ENDPOINT, fetch: injectedFetch } = options;
    if (apiKey && accessToken) {
      throw new PuidError("Provide either `apiKey` or `accessToken`, not both.");
    }
    if (!apiKey && !accessToken) {
      throw new PuidError("Provide an `apiKey` (puid_live_…) or an `accessToken` (puid_at_…).");
    }
    this.#base = String(endpoint).replace(/\/+$/, "");
    this.#fetch = resolveFetch(injectedFetch);
    this.#authHeader = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : { "X-API-Key": apiKey };
  }

  async #get(path) {
    let res;
    try {
      res = await this.#fetch(this.#base + path, {
        method: "GET",
        headers: { ...this.#authHeader, accept: "application/json" },
      });
    } catch (cause) {
      throw new PuidError(`Network request to PUID failed: ${cause?.message || cause}`, { code: "network_error" });
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new PuidError(body.message || body.error || `Request failed with HTTP ${res.status}.`, {
        status: res.status,
        code: body.error || null,
      });
    }
    return body;
  }

  /**
   * Generate `count` ids (1–10). Returns an array of opaque, URL-safe id strings.
   * @param {number} [count=1]
   * @returns {Promise<string[]>}
   */
  async ids(count = 1) {
    if (!Number.isInteger(count) || count < 1 || count > 10) {
      throw new PuidError("`count` must be an integer from 1 to 10.", { code: "invalid_count" });
    }
    const body = await this.#get(`/v1/ids?n=${count}`);
    return body.ids;
  }

  /**
   * Generate a single id.
   * @returns {Promise<string>}
   */
  async id() {
    const [first] = await this.ids(1);
    return first;
  }

  /**
   * Decode a PUID back to the ordinal (counter value) it encodes.
   * @param {string} puid
   * @returns {Promise<bigint>}
   */
  async ordinal(puid) {
    if (typeof puid !== "string" || puid.length === 0) {
      throw new PuidError("`puid` must be a non-empty string.", { code: "invalid_puid" });
    }
    const body = await this.#get(`/v1/ordinal/${encodeURIComponent(puid)}`);
    return BigInt(body.ordinal);
  }

  /**
   * Today's usage and remaining daily quota for the calling account. Does not
   * spend an id.
   * @returns {Promise<{plan: string, used: number, limit: number|null, remaining: number|null}>}
   */
  async quota() {
    return this.#get("/v1/quota");
  }

  /**
   * Machine-to-machine auth: exchange a registered OAuth2 client's credentials
   * for a bearer token and return a ready-to-use Puid client. This is how an app
   * generates ids on a team's behalf without ever handling the team's API key.
   *
   * @param {object} options
   * @param {string} options.clientId
   * @param {string} options.clientSecret
   * @param {string} [options.scope="puid:generate"]
   * @param {string} [options.endpoint]
   * @param {Function} [options.fetch]
   * @returns {Promise<Puid>}
   */
  static async fromClientCredentials(options = {}) {
    const { clientId, clientSecret, scope = "puid:generate", endpoint = DEFAULT_ENDPOINT, fetch: injectedFetch } = options;
    if (!clientId || !clientSecret) {
      throw new PuidError("`clientId` and `clientSecret` are required.", { code: "invalid_client" });
    }
    const doFetch = resolveFetch(injectedFetch);
    const base = String(endpoint).replace(/\/+$/, "");
    let res;
    try {
      res = await doFetch(base + "/oauth/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
          scope,
        }),
      });
    } catch (cause) {
      throw new PuidError(`Token request to PUID failed: ${cause?.message || cause}`, { code: "network_error" });
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.access_token) {
      throw new PuidError(body.error_description || body.error || `Token request failed with HTTP ${res.status}.`, {
        status: res.status,
        code: body.error || null,
      });
    }
    return new Puid({ accessToken: body.access_token, endpoint, fetch: injectedFetch });
  }
}

export default Puid;
