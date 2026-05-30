// End-to-end browser flows: login, account creation, generating ids, and the
// reusable join-code lifecycle (join, rotate-kills-old, revoke-disables).
//
// Run: npm run test:e2e   (needs @playwright/test + browsers; boots wrangler dev)
//
// We use /auth/dev-login (gated by ALLOW_DEV_LOGIN, local only) to stand in for a
// completed Google/Microsoft sign-in — the part Playwright cannot drive against a
// real provider. Everything AFTER login is the real UI and real endpoints.
import { test, expect } from "@playwright/test";

const uniq = () => `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const devLogin = (page, email, next = "/dashboard") =>
  page.goto(`/auth/dev-login?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`);

test("sign in, see dashboard, mint a key, generate ids, and decode them", async ({ page }) => {
  await devLogin(page, `owner-${uniq()}@example.com`);
  await expect(page.locator("#email")).toContainText("@example.com");

  // mint an API key (shown once)
  await page.getByRole("button", { name: "Mint a key" }).click();
  await expect(page.locator("#keyOut")).toContainText("puid_live_");

  // generate 3 ids and confirm they get decoded back to ordinals
  await page.locator("#n").fill("3");
  await page.getByRole("button", { name: "Generate", exact: true }).click();
  await expect(page.locator("#idsOut")).toBeVisible();
  await expect(page.locator("#ordinals")).toContainText("#"); // "id → #N"
});

test("create a second account and switch between them", async ({ page }) => {
  await devLogin(page, `multi-${uniq()}@example.com`);
  page.once("dialog", (d) => d.accept("Second Co")); // window.prompt for the name
  await page.getByRole("button", { name: "+ New account" }).click();
  await expect(page.locator("#accountSel option")).toHaveCount(2);
});

test("reusable join code: generate, second user joins, rotate kills old, revoke disables", async ({ browser }) => {
  const ownerCtx = await browser.newContext();
  const owner = await ownerCtx.newPage();
  await devLogin(owner, `host-${uniq()}@example.com`);

  // generate a join code
  await owner.getByTestId("generate-btn").click();
  await expect(owner.getByTestId("join-link")).toContainText("/join/join_");
  const link1 = (await owner.getByTestId("join-link").textContent()).match(/\/join\/(join_[0-9A-Za-z]+)/)[0];

  // a SECOND user joins via the code (simulate their Google sign-in landing on /join)
  const bobCtx = await browser.newContext();
  const bob = await bobCtx.newPage();
  await devLogin(bob, `bob-${uniq()}@example.com`, link1); // login -> /join/<code> -> joined
  await expect(bob).toHaveURL(/\/dashboard\?joined=/);
  const bobAccounts = await (await bob.request.get("/api/accounts")).json();
  expect(bobAccounts.accounts.length).toBeGreaterThanOrEqual(2); // personal + joined

  // owner ROTATES -> old code must stop working
  await owner.getByTestId("rotate-btn").click();
  await expect(owner.getByTestId("join-link")).not.toContainText(link1.split("/").pop());

  const lateCtx = await browser.newContext();
  const late = await lateCtx.newPage();
  await devLogin(late, `late-${uniq()}@example.com`, link1); // old link
  await expect(late).toHaveURL(/join_error=1/); // rejected
  const lateAccounts = await (await late.request.get("/api/accounts")).json();
  expect(lateAccounts.accounts.length).toBe(1); // only their own — did not join

  // owner REVOKES -> joining disabled
  await owner.getByTestId("revoke-btn").click();
  await expect(owner.getByTestId("generate-btn")).toBeVisible(); // back to "no code" state
});
