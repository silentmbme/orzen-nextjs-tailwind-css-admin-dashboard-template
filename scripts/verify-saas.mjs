import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "@playwright/test";
const base = process.env.VISUAL_BASE_URL || "http://localhost:3161";
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage(), errors = [];
page.on("pageerror", error => errors.push(error.message));
const go = async route => { await page.goto(base + route); await page.locator("main h1").waitFor(); };
const dialog = () => page.getByRole("dialog");
async function createPlan(name) {
  await page.getByRole("button", { name: "Create plan", exact: true }).click();
  await dialog().getByLabel("Plan name *").fill(name);
  await dialog().getByLabel("Description *").fill("Browser-verified demo offering");
  await dialog().getByLabel("Monthly price ($) *", { exact: true }).fill("49");
  await dialog().getByLabel("Yearly price ($) *", { exact: true }).fill("490");
  await dialog().getByRole("button", { name: "Save demo plan", exact: true }).click();
  await dialog().waitFor({ state: "hidden" });
}
try {
  await fs.mkdir("artifacts/saas", { recursive: true });
  await go("/dashboards/saas");
  const overview = page.locator("section").filter({ has: page.getByRole("heading", { name: "Subscription overview", exact: true }) });
  const first = await overview.innerText();
  await page.getByLabel("Revenue window").selectOption("180");
  assert.notEqual(await overview.innerText(), first);
  await page.getByRole("button", { name: "Show counts", exact: true }).click();
  await page.getByRole("button", { name: /^2026-05 month 0:/ }).click();
  assert.match(await page.getByRole("status").innerText(), /2026-05 cohort/);
  await page.getByRole("button", { name: "Loss", exact: true }).click();
  const dashboardExport = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export snapshot", exact: true }).click();
  const csv = await fs.readFile(await (await dashboardExport).path(), "utf8"); assert.match(csv, /opening/);
  console.log("PASS dashboard period filter, cohort inspection, movement filters and export");

  await go("/apps/saas/plans");
  await page.getByRole("button", { name: "Yearly pricing", exact: true }).click();
  await page.getByLabel("Search pricing plans").fill("Growth");
  await page.getByRole("button", { name: "Differences only", exact: true }).click();
  await page.getByText(/No differences across the visible plans/).waitFor();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  const comparisonExport = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export comparison", exact: true }).click();
  assert.match((await comparisonExport).suggestedFilename(), /plan-comparison-yearly-demo.csv/);
  await page.getByLabel("Sort pricing plans").selectOption("mrr");
  const growthCard = page.locator("section").filter({ has: page.getByRole("heading", { name: "Growth", exact: true }) });
  await growthCard.getByRole("button", { name: "Subscribers", exact: true }).click();
  assert.ok(await dialog().locator("tbody tr").count());
  await page.keyboard.press("Escape");
  await page.getByLabel("Plan availability filter").selectOption("inactive");
  await page.getByText(/No pricing plans match these filters/).waitFor();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await page.getByRole("button", { name: "Differences only", exact: true }).click();
  await createPlan("Studio Test");
  await page.getByRole("heading", { name: "Studio Test", exact: true }).waitFor();
  const planCard = page.locator("section").filter({ has: page.getByRole("heading", { name: "Studio Test", exact: true }) });
  await planCard.getByRole("button", { name: "Edit plan", exact: true }).click();
  await dialog().getByLabel("Description *").fill("Updated and persisted offering");
  await dialog().getByRole("button", { name: "Save demo plan", exact: true }).click();
  await page.getByText("Updated and persisted offering", { exact: true }).waitFor();
  await createPlan("Disposable");
  await page.getByRole("button", { name: "Delete Disposable", exact: true }).click();
  await dialog().getByRole("button", { name: "Confirm delete", exact: true }).click();
  assert.equal(await page.getByRole("heading", { name: "Disposable", exact: true }).count(), 0);
  await page.getByRole("button", { name: "Delete Starter", exact: true }).click();
  assert.equal(await dialog().getByRole("button", { name: "Confirm delete", exact: true }).isDisabled(), true);
  await page.keyboard.press("Escape");
  console.log("PASS pricing toggle, plan creation, delete confirmation and reference protection");

  await go("/apps/saas/subscriptions");
  await page.getByRole("button", { name: "Create subscription", exact: true }).click();
  await dialog().getByLabel("Subscription plan", { exact: true }).selectOption({ label: "Studio Test" });
  await dialog().getByRole("button", { name: "Save demo subscription", exact: true }).click();
  await page.getByLabel("Search Subscriptions", { exact: true }).fill("Studio Test");
  assert.equal(await page.locator("tbody tr").count(), 1);
  await page.getByRole("button", { name: "View details", exact: true }).click();
  await dialog().getByRole("button", { name: "Activate trial", exact: true }).click();
  await dialog().getByRole("button", { name: "Confirm activation", exact: true }).click();
  await dialog().getByRole("button", { name: "Pause", exact: true }).click();
  await dialog().getByRole("button", { name: "Keep current status", exact: true }).click();
  await dialog().getByRole("button", { name: "Pause", exact: true }).click();
  await dialog().getByRole("button", { name: "Confirm pause", exact: true }).click();
  await dialog().getByRole("button", { name: "Resume", exact: true }).click();
  await dialog().getByRole("button", { name: "Confirm activation", exact: true }).click();
  await dialog().getByRole("button", { name: "Edit / change plan", exact: true }).click();
  await dialog().getByLabel("Subscription plan", { exact: true }).selectOption("growth");
  await dialog().getByRole("button", { name: "Save demo subscription", exact: true }).click();
  await dialog().getByText("Growth", { exact: true }).waitFor();
  await dialog().getByRole("button", { name: "Cancel subscription", exact: true }).click();
  await dialog().getByRole("button", { name: "Confirm cancellation", exact: true }).click();
  assert.equal(await dialog().getByRole("button", { name: "Resume", exact: true }).count(), 0);
  await page.keyboard.press("Escape");
  await page.getByLabel("Search Subscriptions", { exact: true }).fill("");
  await page.getByLabel("Subscription status filter").selectOption("Active");
  await page.getByLabel("Subscription plan filter").selectOption("growth");
  assert.ok(await page.locator("tbody tr").count());
  await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  await page.getByLabel("Next Subscriptions page", { exact: true }).click();
  await page.getByRole("button", { name: "Amount", exact: true }).click();
  await page.reload();
  await page.getByLabel("Search Subscriptions", { exact: true }).fill("Studio Test");
  assert.equal(await page.locator("tbody tr").count(), 0); // plan changed; historical record remains in Growth
  console.log("PASS subscription create/activate/pause/resume/upgrade/cancel, confirmations, filtering, sorting, pagination and persistence");

  await go("/apps/saas/customers");
  await page.getByLabel("Search SaaS customers").fill("Orbit");
  await page.getByRole("textbox", { name: "Customer notes", exact: true }).fill("SaaS browser verification note");
  await page.getByRole("button", { name: "Save note", exact: true }).click();
  await page.reload();
  await page.getByRole("textbox", { name: "Customer notes", exact: true }).waitFor();
  await page.waitForTimeout(100);
  assert.equal(await page.getByRole("textbox", { name: "Customer notes", exact: true }).inputValue(), "SaaS browser verification note");
  await page.getByRole("button", { name: "Open customer profile", exact: true }).click();
  await dialog().getByRole("heading", { name: "Workspace usage", exact: true }).waitFor();
  await page.keyboard.press("Escape");
  await page.getByLabel("Customer health filter").selectOption("At risk");
  await page.getByLabel("Search SaaS customers").fill("not-a-customer");
  await page.getByText("No customers match these filters.", { exact: true }).waitFor();
  console.log("PASS customer directory filtering, empty state, profile modal and saved notes");

  await go("/apps/saas/billing");
  await page.getByLabel("Invoice status filter").selectOption("Failed");
  await page.getByRole("button", { name: "Log demo follow-up", exact: true }).first().click();
  await page.getByRole("status").filter({ hasText: "Demo follow-up logged" }).waitFor();
  await page.getByRole("button", { name: "Preview", exact: true }).first().click();
  await page.evaluate(() => { window.open = () => ({ document: { open() {}, write(html) { window.__invoiceHtml = html; }, close() {} }, focus() {}, print() { window.__printed = true; } }); });
  await dialog().getByRole("button", { name: "Print demo invoice", exact: true }).click();
  assert.equal(await page.evaluate(() => window.__printed), true);
  assert.match(await page.evaluate(() => window.__invoiceHtml), /FICTIONAL DEMO INVOICE/);
  await page.evaluate(() => { window.open = () => null; });
  await dialog().getByRole("button", { name: "Print demo invoice", exact: true }).click();
  await dialog().getByRole("alert").waitFor();
  await page.keyboard.press("Escape");
  console.log("PASS billing filters, non-financial follow-up ledger and isolated print document");

  await go("/apps/saas/analytics");
  await page.getByLabel("Usage date range").selectOption("7");
  await page.getByLabel("Usage plan filter").selectOption("growth");
  await page.getByRole("button", { name: "Active users", exact: true }).click();
  await page.getByRole("button", { name: /^Automations/ }).click();
  const usageExport = page.waitForEvent("download"); await page.getByRole("button", { name: "Export usage", exact: true }).click();
  assert.match((await usageExport).suggestedFilename(), /saas-usage-demo.csv/);
  console.log("PASS usage filters, metric switching, adoption selection and usage export");

  const routes = ["/dashboards/saas", "/apps/saas/subscriptions", "/apps/saas/plans", "/apps/saas/customers", "/apps/saas/billing", "/apps/saas/analytics"];
  for (const theme of ["light", "dark"]) {
    await page.evaluate(theme => localStorage.setItem("theme", theme), theme);
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of routes) {
        await go(route); await page.waitForTimeout(150);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${route} ${width} ${theme} overflow`);
        assert.equal(await page.locator("html").evaluate((el, theme) => el.classList.contains(theme), theme), true);
        assert.equal(await page.locator("main .ui-card__title").evaluateAll(titles => titles.some(title => getComputedStyle(title).fontSize !== "11px" || getComputedStyle(title).textTransform !== "uppercase" || !title.querySelector("svg"))), false, `card heading ${route}`);
        await page.waitForTimeout(route === "/dashboards/saas" || route === "/apps/saas/analytics" ? 1200 : 0);
        await page.screenshot({ path: `artifacts/saas/${route.split("/").at(-1)}-${theme}-${width}.png`, fullPage: true });
      }
      await go("/apps/saas/subscriptions"); await page.getByRole("button", { name: "Create subscription", exact: true }).click();
      const bounds = await dialog().boundingBox(); assert.ok(Math.abs(bounds.x + bounds.width / 2 - width / 2) < 2); assert.ok(Math.abs(bounds.y + bounds.height / 2 - 500) < 2);
      await page.keyboard.press("Escape"); assert.equal(await dialog().isVisible(), false);
    }
  }
  await page.getByLabel("Open navigation", { exact: true }).click();
  await page.locator("#admin-sidebar").getByRole("link", { name: "Usage & Analytics", exact: true }).click();
  await page.getByRole("heading", { name: "Usage & analytics", exact: true }).waitFor();
  await page.evaluate(() => localStorage.setItem("nova-saas-demo-v1", "{broken"));
  await go("/dashboards/saas"); await page.locator("main").getByRole("alert").waitFor();
  await go("/apps/saas/customers");
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException("Storage full", "QuotaExceededError"); }; });
  await page.getByRole("textbox", { name: "Customer notes", exact: true }).fill("In-memory fallback check");
  await page.getByRole("button", { name: "Save note", exact: true }).click();
  assert.match(await page.locator("main").getByRole("alert").innerText(), /session only/);
  assert.equal(await page.getByRole("textbox", { name: "Customer notes", exact: true }).inputValue(), "In-memory fallback check");
  assert.deepEqual(errors, []);
  console.log("PASS 48 SaaS route/theme/viewport checks, centered dialogs/Escape, mobile navigation, corrupt-storage fallback and no runtime errors");
} finally { await browser.close(); }

