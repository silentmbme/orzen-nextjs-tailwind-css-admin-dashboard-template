import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "@playwright/test";

// Exercise the public button API without adding a test-only application route.
const require = createRequire(import.meta.url);
const source = await fs.readFile("src/components/ui/button.tsx", "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS } }).outputText;
const compiledModule = { exports: {} };
new Function("require", "module", "exports", compiled)(require, compiledModule, compiledModule.exports);
const { Button } = compiledModule.exports;
for (const variant of ["primary", "secondary", "outline", "ghost", "destructive"]) {
  const html = renderToStaticMarkup(React.createElement(Button, { variant, loading: true }, "Saving demo"));
  assert.match(html, /disabled=""/);
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /Saving demo/);
}
console.log("PASS: button variants retain labels and disable interaction while loading");

const base = process.env.VISUAL_BASE_URL || "http://localhost:3000";
const browser = await chromium.launch({ channel: process.env.VISUAL_BROWSER || "chrome" });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
try {
  await page.goto(`${base}/dashboards/sales`);
  await page.getByLabel("Revenue period", { exact: true }).selectOption("weekly");
  assert.ok(await page.locator(".sales-revenue-chart").getByText("Mon", { exact: true }).count());
  await page.getByLabel("Search Invoices", { exact: true }).fill("Northstar");
  assert.equal(await page.locator(".sales-invoices tbody tr").count(), 1);
  await page.getByLabel("Search Invoices", { exact: true }).fill("");
  await page.locator(".sales-invoices").getByRole("button", { name: "Amount", exact: true }).click();
  assert.match(await page.locator(".sales-invoices tbody tr").first().innerText(), /780/);
  await page.getByLabel("Next Invoices page", { exact: true }).click();
  assert.equal(await page.locator(".sales-invoices tbody tr").count(), 3);
  await page.getByLabel("Previous Invoices page", { exact: true }).click();
  await page.getByLabel("Search Invoices", { exact: true }).fill("not-a-record");
  assert.ok(await page.getByText("No matching invoices. Try another search.").isVisible());
  await page.getByLabel("Search Invoices", { exact: true }).fill("");
  await page.getByLabel("Search Orders", { exact: true }).fill("Olivia");
  await page.locator(".sales-order-link").first().click();
  assert.ok(await page.locator(".sales-order-dialog").isVisible());
  await page.keyboard.press("Escape");
  await page.getByLabel("Dashboard actions", { exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download demo CSV", exact: true }).click();
  assert.match((await download).suggestedFilename(), /orzen-demo-sales/);
  await page.evaluate(() => { window.print = () => { document.body.dataset.printed = "true"; }; });
  await page.getByRole("button", { name: "Export", exact: true }).click();
  assert.equal(await page.locator("body").getAttribute("data-printed"), "true");

  await page.getByLabel("Search available pages", { exact: true }).fill("Contacts");
  assert.equal(await page.locator(".header-search-results a").innerText(), "Contacts");
  await page.locator(".header-search-results a").click();
  await page.getByRole("heading", { name: "Contact directory", exact: true }).waitFor();
  await page.getByText("Loading local demo workspace...").waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "Add contact", exact: true }).click();
  await page.getByRole("button", { name: "Save demo contact", exact: true }).click();
  assert.ok(await page.getByText("Complete all required fields.").isVisible());
  await page.getByLabel("Full name *", { exact: true }).fill("Shared UI Verification");
  await page.getByLabel("Email *", { exact: true }).fill("ui-check@example.com");
  await page.getByLabel("Job title *", { exact: true }).fill("Operations");
  await page.getByRole("button", { name: "Save demo contact", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.getByLabel("Search contacts", { exact: true }).fill("Shared UI Verification");
  await page.getByRole("heading", { name: "Shared UI Verification", exact: true }).waitFor();

  await page.goto(`${base}/crm/deals`);
  await page.getByText("Loading local demo workspace...").waitFor({ state: "hidden" });
  await page.getByLabel("Stage for Retail analytics", { exact: true }).selectOption("Proposal");
  await page.reload();
  await page.getByText("Loading local demo workspace...").waitFor({ state: "hidden" });
  assert.equal(await page.getByLabel("Stage for Retail analytics", { exact: true }).inputValue(), "Proposal");
  const currentTheme = await page.locator("html").getAttribute("class");
  await page.getByLabel("Toggle light and dark theme", { exact: true }).click();
  await page.reload();
  assert.notEqual(await page.locator("html").getAttribute("class"), currentTheme);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.getByLabel("Open navigation", { exact: true }).click();
  await page.keyboard.press("Escape");
  assert.equal(await page.getByLabel("Open navigation", { exact: true }).getAttribute("aria-expanded"), "false");
  await page.getByLabel("Open navigation", { exact: true }).click();
  await page.locator("#admin-sidebar").getByRole("link", { name: "CRM", exact: true }).click();
  await page.getByRole("heading", { name: "Your CRM command center", exact: true }).waitFor();
  assert.equal(await page.locator(".crm-module-bar").count(), 0);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.getByRole("button", { name: "Add opportunity", exact: true }).click();
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog[open]").count(), 0);
  assert.deepEqual(errors, []);
  console.log("PASS: tables, filters, empty states, CSV/print, header search, forms/dialogs, persisted deal stages/themes, mobile navigation; no runtime errors");
} finally { await browser.close(); }
