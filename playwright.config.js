// Playwright e2e: drives the real site in a browser against a local `wrangler dev`.
// The web server applies the D1 schema locally, then boots the Worker with
// ALLOW_DEV_LOGIN=1 (from .dev.vars) so tests can simulate Google/Microsoft login
// without driving a real provider.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: false, // one local D1; keep account state predictable
  use: { baseURL: "http://localhost:8799" },
  webServer: {
    command: "npm run dev:e2e",
    url: "http://localhost:8799/",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
