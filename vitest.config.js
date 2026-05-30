// Runs the API tests INSIDE workerd (via @cloudflare/vitest-pool-workers) with a
// real local D1 binding, so SELF.fetch() exercises the actual deployed code path:
// router -> auth -> rate limit -> quota -> D1 -> permutation -> base62.
import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  test: {
    include: ["test/**/*.api.test.js"],
    poolOptions: {
      workers: {
        // Reuse the real wrangler.toml so bindings (DB) and main entry match prod.
        wrangler: { configPath: "./wrangler.toml" },
        miniflare: {
          compatibilityDate: "2025-01-01",
          // Enable the test-only login bypass for the worker under test.
          bindings: { ALLOW_DEV_LOGIN: "1" },
        },
      },
    },
  },
});
