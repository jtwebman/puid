// oauth_login.js — INBOUND login. Here PUID is the OAuth *client*, delegating
// "is this a real human with a real email" to Google and Microsoft, who already
// solved it and charge us nothing. We never send email, store passwords, or run
// a verification flow. The joke service has better auth hygiene than most startups.

export const PROVIDERS = {
  google: {
    authorize: "https://accounts.google.com/o/oauth2/v2/auth",
    token: "https://oauth2.googleapis.com/token",
    userinfo: "https://openidconnect.googleapis.com/v1/userinfo",
    scope: "openid email profile",
    clientIdEnv: "GOOGLE_CLIENT_ID",
    clientSecretEnv: "GOOGLE_CLIENT_SECRET",
  },
  microsoft: {
    authorize: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    token: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    userinfo: "https://graph.microsoft.com/oidc/userinfo",
    scope: "openid email profile",
    clientIdEnv: "MICROSOFT_CLIENT_ID",
    clientSecretEnv: "MICROSOFT_CLIENT_SECRET",
  },
};

export function redirectUriFor(origin, provider) {
  return `${origin}/auth/callback/${provider}`;
}

// Build the provider's consent URL we send the human to.
export function buildAuthUrl(provider, env, origin, state) {
  const p = PROVIDERS[provider];
  const params = new URLSearchParams({
    client_id: env[p.clientIdEnv],
    redirect_uri: redirectUriFor(origin, provider),
    response_type: "code",
    scope: p.scope,
    state,
    access_type: "offline",
    prompt: "select_account",
  });
  return `${p.authorize}?${params}`;
}

// Exchange the callback code for tokens, then fetch the normalized identity.
export async function exchangeAndProfile(provider, env, origin, code) {
  const p = PROVIDERS[provider];
  const tokenRes = await fetch(p.token, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env[p.clientIdEnv],
      client_secret: env[p.clientSecretEnv],
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUriFor(origin, provider),
    }),
  });
  if (!tokenRes.ok) throw new Error(`${provider} token exchange failed: ${tokenRes.status}`);
  const tok = await tokenRes.json();

  const infoRes = await fetch(p.userinfo, {
    headers: { authorization: `Bearer ${tok.access_token}` },
  });
  if (!infoRes.ok) throw new Error(`${provider} userinfo failed: ${infoRes.status}`);
  const info = await infoRes.json();

  return {
    provider,
    sub: info.sub, // stable provider id; THIS is the account identity
    email: info.email,
    name: info.name || info.given_name || info.email,
  };
}
