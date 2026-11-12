import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.env.VISUAL_BASE_URL || "http://localhost:3000";
const output = "artifacts/modal-centering";
const cases = [
  ["lead", "/crm/leads", "Add lead"],
  ["contact", "/crm/contacts", "Add contact"],
  ["company", "/crm/companies", "Add company"],
  ["opportunity", "/crm/deals", "Add opportunity"],
  ["activity", "/crm/activities", "Log activity"],
  ["meeting", "/crm/meetings", "Schedule meeting"],
  ["order", "/dashboards/sales", null],
];
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.VISUAL_BROWSER || "chrome" });
const results = [];
const errors = [];
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 320, height: 568 }]) {
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({ viewport, colorScheme: theme });
      await context.addInitScript(value => localStorage.setItem("theme", value), theme);
      const page = await context.newPage();
      page.on("pageerror", error => errors.push(error.message));
      for (const [name, route, action] of cases) {
        await page.goto(base + route);
        if (action) {
          await page.getByText("Loading local demo workspace...").waitFor({ state: "hidden" });
          await page.getByRole("button", { name: action, exact: true }).click();
        } else await page.locator(".sales-order-link").first().click();
        const dialog = page.getByRole("dialog");
        await dialog.waitFor();
        const bounds = await dialog.boundingBox();
        assert.ok(bounds, `${name}: visible dialog`);
        const dx = Math.abs(bounds.x + bounds.width / 2 - viewport.width / 2);
        const dy = Math.abs(bounds.y + bounds.height / 2 - viewport.height / 2);
        assert.ok(dx <= 1 && dy <= 1, `${name} ${viewport.width} ${theme}: center offset ${dx}, ${dy}`);
        assert.ok(bounds.x >= 13 && bounds.y >= 15, `${name}: viewport gutters`);
        assert.ok(bounds.x + bounds.width <= viewport.width - 13 && bounds.y + bounds.height <= viewport.height - 15, `${name}: fits viewport`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${name}: no page overflow`);
        const overflowing = await dialog.evaluate(element => element.scrollHeight > element.clientHeight);
        if (overflowing) {
          await dialog.evaluate(element => { element.scrollTop = element.scrollHeight; });
          assert.ok(await dialog.evaluate(element => element.scrollTop > 0), `${name}: tall content scrolls`);
        }
        await dialog.evaluate(element => { element.scrollTop = 0; });
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: `${output}/${name}-${viewport.width}-${theme}.png`, animations: "disabled", caret: "hide" });
        await page.keyboard.press("Escape");
        await dialog.waitFor({ state: "hidden" });
        results.push({ name, theme, viewport, bounds, dx, dy, overflowing });
      }
      await context.close();
    }
    console.log(`PASS: seven modal types centered at ${viewport.width}px in both themes`);
  }
  assert.deepEqual(errors, []);
  await fs.writeFile(`${output}/results.json`, JSON.stringify({ cases: results.length, errors, results }, null, 2));
  console.log(`PASS: ${results.length} cases; viewport centering, gutters, internal scrolling, Escape dismissal, no runtime errors`);
} finally { await browser.close(); }
