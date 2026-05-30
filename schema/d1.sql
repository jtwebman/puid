-- PUID relational schema (Cloudflare D1 / SQLite).
-- The "normal DB" we admitted we needed once a user could belong to many accounts.
--
-- Apply:  wrangler d1 execute puid --file=schema/d1.sql
--
-- Identity model:
--   users          one row per human (no passwords; we trust Google/Microsoft)
--   identities     (provider, sub) -> user. A user may link Google AND Microsoft.
--   accounts       teams/orgs. Has a plan. Owns keys, quota, oauth grants.
--   memberships    THE M:N JOIN: a user can be in many accounts; an account has
--                  many users. Roles per (account, user). This one table is the
--                  entire reason we switched off KV storage.

CREATE TABLE IF NOT EXISTS users (
  id      TEXT PRIMARY KEY,
  email   TEXT,
  name    TEXT,
  created INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS identities (
  provider TEXT NOT NULL,
  sub      TEXT NOT NULL,
  user_id  TEXT NOT NULL REFERENCES users(id),
  PRIMARY KEY (provider, sub)
);
CREATE INDEX IF NOT EXISTS idx_identities_user ON identities(user_id);

CREATE TABLE IF NOT EXISTS accounts (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  plan      TEXT NOT NULL DEFAULT 'free',
  -- ONE reusable join code per account. Anyone with it can join. Rotating sets a
  -- new value (old code stops working); revoking sets it NULL (joining disabled).
  join_code TEXT,
  created   INTEGER NOT NULL
);
-- partial unique index: codes are unique, but many accounts may have NULL (disabled).
CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_join_code ON accounts(join_code) WHERE join_code IS NOT NULL;

-- the many-to-many join. A user in N accounts = N rows. Creating "another
-- account" = one INSERT into accounts + one INSERT here. That's the whole feature.
CREATE TABLE IF NOT EXISTS memberships (
  account_id TEXT NOT NULL REFERENCES accounts(id),
  user_id    TEXT NOT NULL REFERENCES users(id),
  role       TEXT NOT NULL DEFAULT 'member',   -- 'owner' | 'member'
  joined     INTEGER NOT NULL,
  PRIMARY KEY (account_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);

CREATE TABLE IF NOT EXISTS api_keys (
  key_hash   TEXT PRIMARY KEY,                 -- sha256(key); plaintext shown once
  id         TEXT NOT NULL,                    -- public id for listing/revoking (key_xxx)
  account_id TEXT NOT NULL REFERENCES accounts(id),
  created_by TEXT REFERENCES users(id),
  label      TEXT,
  hint       TEXT,                             -- last 4 chars, so users can tell keys apart
  created    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_api_keys_account ON api_keys(account_id);

-- sessions carry the ACTIVE account, because a user is in many. Switching
-- accounts just updates active_account_id.
CREATE TABLE IF NOT EXISTS sessions (
  session_hash      TEXT PRIMARY KEY,
  user_id           TEXT NOT NULL REFERENCES users(id),
  active_account_id TEXT REFERENCES accounts(id),
  exp               INTEGER NOT NULL
);

-- OUR OAuth2 provider (we authorize third-party apps to call the API).
CREATE TABLE IF NOT EXISTS oauth_clients (
  client_id     TEXT PRIMARY KEY,
  name          TEXT,
  secret_hash   TEXT NOT NULL,
  redirect_uris TEXT NOT NULL                  -- JSON array
);

CREATE TABLE IF NOT EXISTS oauth_codes (
  code                  TEXT PRIMARY KEY,
  account_id            TEXT NOT NULL,
  client_id             TEXT NOT NULL,
  redirect_uri          TEXT NOT NULL,
  scope                 TEXT NOT NULL,
  code_challenge        TEXT,
  code_challenge_method TEXT,
  exp                   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS oauth_tokens (
  token_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  client_id  TEXT,                             -- which app holds this token (null for client_credentials)
  scope      TEXT NOT NULL,
  exp        INTEGER NOT NULL,
  kind       TEXT NOT NULL DEFAULT 'access'    -- 'access' | 'refresh'
);
CREATE INDEX IF NOT EXISTS idx_tokens_acct ON oauth_tokens(account_id);

-- A standing grant: account A authorized app C to act on its behalf. Lets the
-- owner see which apps have access and revoke them (deletes their tokens too).
CREATE TABLE IF NOT EXISTS oauth_grants (
  account_id TEXT NOT NULL,
  client_id  TEXT NOT NULL,
  scope      TEXT NOT NULL,
  created    INTEGER NOT NULL,
  PRIMARY KEY (account_id, client_id)
);

-- Per-request usage log. One row per /v1/ids call, written atomically with the
-- counter increment (see allocateOrdinals). Stamped with account_id so we can
-- build usage dashboards, and summed per day to enforce the quota. Replaces the
-- old daily-aggregate table — same info, but now we keep the detail.
CREATE TABLE IF NOT EXISTS usage_events (
  account_id TEXT NOT NULL,
  n          INTEGER NOT NULL,   -- ids issued in this request (1..10)
  ts         INTEGER NOT NULL    -- ms epoch
);
CREATE INDEX IF NOT EXISTS idx_usage_events ON usage_events(account_id, ts);

-- THE COUNTER. One row. The entire point of the company lives in `next`.
-- D1/SQLite serializes writes, so `UPDATE ... RETURNING` is an atomic allocator.
-- Note: this stays a 64-bit integer (good until ~year 29 billion at 10/sec). The
-- 128-bit PUID is produced by permuting this value at encode time, not stored.
CREATE TABLE IF NOT EXISTS sequence (
  id   INTEGER PRIMARY KEY CHECK (id = 1),
  next INTEGER NOT NULL
);
INSERT OR IGNORE INTO sequence (id, next) VALUES (1, 1);

-- Rate limiter: last allowed request time per principal (account/token/ip).
CREATE TABLE IF NOT EXISTS rate (
  principal TEXT PRIMARY KEY,
  last      INTEGER NOT NULL
);
