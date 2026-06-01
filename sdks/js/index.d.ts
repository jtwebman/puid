// Type definitions for @puid-dev/client.

export const DEFAULT_ENDPOINT: string;

export interface PuidOptions {
  /** A team API key (puid_live_…). Mutually exclusive with `accessToken`. */
  apiKey?: string;
  /** An OAuth2 bearer token (puid_at_…). Mutually exclusive with `apiKey`. */
  accessToken?: string;
  /**
   * API endpoint. Defaults to https://puid.dev/api. Point it at a local dev
   * server for tests, or at your own domain for a self-hosted (Enterprise) PUID.
   */
  endpoint?: string;
  /** A fetch implementation. Defaults to the global `fetch`. */
  fetch?: typeof fetch;
}

export interface ClientCredentialsOptions {
  clientId: string;
  clientSecret: string;
  /** OAuth2 scope. Defaults to "puid:generate". */
  scope?: string;
  /** API endpoint. Defaults to https://puid.dev/api. */
  endpoint?: string;
  fetch?: typeof fetch;
}

export interface QuotaResponse {
  plan: string;
  used: number;
  limit: number | null;
  remaining: number | null;
}

export class PuidError extends Error {
  name: "PuidError";
  /** HTTP status, when the error came from the server. */
  status: number | null;
  /** Machine-readable error code (e.g. "rate_limited", "quota_exceeded"). */
  code: string | null;
  constructor(message: string, options?: { status?: number | null; code?: string | null });
}

export class Puid {
  constructor(options: PuidOptions);
  /** Generate `count` ids (1–10). */
  ids(count?: number): Promise<string[]>;
  /** Generate a single id. */
  id(): Promise<string>;
  /** Decode a PUID back to the ordinal it encodes. */
  ordinal(puid: string): Promise<bigint>;
  /** Today's usage and remaining daily quota. Does not spend an id. */
  quota(): Promise<QuotaResponse>;
  /** Exchange OAuth2 client credentials for a bearer token and return a client. */
  static fromClientCredentials(options: ClientCredentialsOptions): Promise<Puid>;
}

export default Puid;
