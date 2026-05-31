// Browser e2e against the SvelteKit dashboard. /auth/dev-login (gated by
// ALLOW_DEV_LOGIN) stands in for a completed Google/Microsoft sign-in; everything
// after is the real UI + real endpoints + real D1.
import { test, expect } from "@playwright/test";

const uniq = () => `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const devLogin = (page, email, next = "/dashboard") =>
  page.goto(`/auth/dev-login?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`);

test("landing page renders with theme + language controls", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("PUID");
  await expect(page.getByTestId("theme-select")).toBeVisible();
  await expect(page.getByTestId("language-select")).toBeVisible();
});

test("dark mode toggle adds the .dark class", async ({ page }) => {
  await page.goto("/");
  // retry until Svelte has hydrated and the change handler is attached
  await expect(async () => {
    await page.getByTestId("theme-select").selectOption("dark");
    await expect(page.locator("html")).toHaveClass(/dark/, { timeout: 1000 });
  }).toPass();
  await page.getByTestId("theme-select").selectOption("light");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("server renders Spanish for ?lang=es (Accept-Language / dropdown drive this)", async ({ page }) => {
  await page.goto("/?lang=es");
  await expect(page.locator("body")).toContainText("Precios"); // pricing → es
});

test("the /why page is translated too", async ({ page }) => {
  await page.goto("/why?lang=es");
  await expect(page.locator("h1")).toHaveText("Vale, es una broma.");
});

test("sign in and mint an API key", async ({ page }) => {
  await devLogin(page, `owner-${uniq()}@example.com`);
  await expect(page.getByTestId("email")).toContainText("@example.com");
  await page.getByTestId("mint-btn").click();
  await expect(page.getByTestId("key-out")).toContainText("puid_live_");
});

test("dashboard lists and revokes API keys", async ({ page }) => {
  await devLogin(page, `keysui-${uniq()}@example.com`);
  await page.getByTestId("mint-btn").click();
  await expect(page.getByTestId("keys").locator("tbody tr")).toHaveCount(1);
  await page.getByTestId("revoke-key").first().click();
  await expect(page.getByTestId("keys")).toHaveCount(0); // table gone once no keys remain
});

test("create a second account", async ({ page }) => {
  await devLogin(page, `multi-${uniq()}@example.com`);
  page.once("dialog", (d) => d.accept("Second Co"));
  await page.getByTestId("new-account-btn").click();
  await expect(page.getByTestId("account-select").locator("option")).toHaveCount(2);
});

test("join code: generate, second user joins, rotate kills old, revoke disables", async ({ browser, baseURL }) => {
  const ownerCtx = await browser.newContext();
  const owner = await ownerCtx.newPage();
  await devLogin(owner, `host-${uniq()}@example.com`);
  await owner.getByTestId("generate-btn").click();
  await expect(owner.getByTestId("join-link")).toContainText("/join/join_");
  const code = (await owner.getByTestId("join-link").textContent()).match(/join_[0-9A-Za-z]+/)[0];

  const bobCtx = await browser.newContext();
  const bob = await bobCtx.newPage();
  await devLogin(bob, `bob-${uniq()}@example.com`, `/join/${code}`);
  await expect(bob).toHaveURL(/\/dashboard\?joined=/);
  const bobAccts = await (await bob.request.get("/dashboard/api/accounts")).json();
  expect(bobAccts.accounts.length).toBeGreaterThanOrEqual(2);

  await owner.getByTestId("rotate-btn").click();
  const lateCtx = await browser.newContext();
  const late = await lateCtx.newPage();
  await devLogin(late, `late-${uniq()}@example.com`, `/join/${code}`); // old code
  await expect(late).toHaveURL(/join_error=1/);

  await owner.getByTestId("revoke-btn").click();
  await expect(owner.getByTestId("generate-btn")).toBeVisible(); // back to "no code"
  await ownerCtx.close(); await bobCtx.close(); await lateCtx.close();
});
