import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const stage = process.argv[2] || "baseline";
if (!/^[a-z-]+$/.test(stage)) throw new Error("Use a simple stage name, such as baseline or shared-layout.");
const root = path.resolve("artifacts/tailwind-migration");
const destination = path.join(root, stage);
const base = process.env.VISUAL_BASE_URL || "http://localhost:3000";
const routes = ["/dashboards/sales", "/dashboards/crm", "/crm/leads", "/crm/leads/ld-1", "/crm/contacts", "/crm/companies", "/crm/companies/co-1", "/crm/deals", "/crm/activities", "/crm/meetings"];
const snapshots = {};
const errors = [];
if (stage === "baseline" && process.env.UPDATE_VISUAL_BASELINE !== "1" && await fs.stat(path.join(destination, "computed-styles.json")).catch(() => null)) {
  throw new Error("Baseline already exists. Set UPDATE_VISUAL_BASELINE=1 only when deliberately replacing the reference captures.");
}
await fs.mkdir(destination, { recursive: true });
const browser = await chromium.launch({ channel: process.env.VISUAL_BROWSER || "chrome", headless: true });

async function capture(page, name) {
  await page.mouse.move(0, 0);
  await page.evaluate(async () => {
    document.querySelectorAll("img").forEach(image => { image.loading = "eager"; });
    await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
    await document.fonts.ready;
  });
  snapshots[name] = await page.evaluate(() => {
    const selectors = ["body", ".workspace", ".app-frame", ".sidebar", ".brand", ".brand-mark", ".profile", ".profile-avatar", ".nav-group", ".nav-section", ".nav-link", ".soon", ".topbar", ".header-title", ".header-title h1", ".header-actions", ".search-field", ".toolbar-static", ".header-search-results", ".mobile-backdrop", ".main-column", ".content", ".app-footer", ".ui-card", ".ui-card__header", ".ui-card__title", ".ui-card__body", ".ui-button", ".ui-input", ".ui-select", ".ui-badge", ".ui-field", ".ui-field__label", ".ui-field__hint", ".ui-empty", ".metric-card", ".ui-stat__heading", ".ui-stat__heading-label", ".ui-stat__value-wrap", ".ui-stat__value", ".ui-stat__trend", ".positive", ".negative", ".compare", ".data-table", ".data-table th", ".data-table td", ".data-table-pagination", ".ui-dialog", ".ui-dialog__header", ".chart-card-summary", ".chart-tooltip"];
    const properties = ["display", "position", "visibility", "width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "marginTop", "marginRight", "marginBottom", "marginLeft", "rowGap", "columnGap", "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color", "backgroundColor", "backgroundImage", "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius", "boxShadow", "opacity", "outlineStyle", "outlineWidth", "outlineColor", "outlineOffset", "overflowX", "overflowY", "transform", "alignItems", "justifyContent", "flexDirection", "flexWrap", "flexShrink", "transitionProperty", "transitionDuration", "transitionTimingFunction"];
    return Object.fromEntries(selectors.map(selector => [selector, [...document.querySelectorAll(selector)].map(element => {
      const computed = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return { tag: element.tagName, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, styles: Object.fromEntries(properties.map(property => [property, computed[property]])) };
    })]));
  });
  await page.screenshot({ path: path.join(destination, `${name}.png`), fullPage: true, animations: "disabled", caret: "hide" });
}

try {
  for (const width of [1440, 768, 390]) {
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, deviceScaleFactor: 1, locale: "en-US", timezoneId: "UTC", colorScheme: theme });
      await context.addInitScript(value => localStorage.setItem("theme", value), theme);
      const page = await context.newPage();
      page.on("pageerror", error => errors.push(error.message));
      for (const route of routes) {
        const response = await page.goto(base + route);
        if (!response.ok()) throw new Error(`HTTP ${response.status()}: ${route}`);
        await page.locator("main").waitFor();
        if (route !== "/dashboards/sales") await page.getByText("Loading local demo workspace...").waitFor({ state: "hidden" });
        const name = `${route.slice(1).replaceAll("/", "-")}-${width}-${theme}`;
        await capture(page, name);
      }
      await page.goto(`${base}/dashboards/crm`);
      await page.getByText("Loading local demo workspace...").waitFor({ state: "hidden" });
      await page.getByRole("button", { name: "Add opportunity", exact: true }).click();
      await page.getByRole("dialog").waitFor();
      await capture(page, `dialog-${width}-${theme}`);
      await page.keyboard.press("Escape");
      if (width <= 850) {
        await page.getByLabel("Open navigation", { exact: true }).click();
        await page.waitForTimeout(220);
        await capture(page, `sidebar-open-${width}-${theme}`);
      } else {
        await page.getByLabel("Search available pages", { exact: true }).fill("Contacts");
        await capture(page, `header-search-${width}-${theme}`);
        await page.getByLabel("Search available pages", { exact: true }).fill("");
        await page.locator(".topbar .ui-button--primary").hover();
        snapshots[`primary-hover-${theme}`] = await page.locator(".topbar .ui-button--primary").evaluate(element => { const css = getComputedStyle(element); return { background: css.backgroundColor, opacity: css.opacity, color: css.color, borderColor: css.borderColor }; });
      }
      await context.close();
    }
    console.log(`Captured ${width}px, both themes`);
  }
  await fs.writeFile(path.join(destination, "computed-styles.json"), JSON.stringify(snapshots, null, 2));
  if (errors.length) throw new Error(errors.join("\n"));
} finally { await browser.close(); }

if (stage !== "baseline") {
  const baseline = JSON.parse(await fs.readFile(path.join(root, "baseline/computed-styles.json"), "utf8"));
  const styleChanges = [];
  const compare = (first, second, key) => {
    if (JSON.stringify(first) === JSON.stringify(second)) return;
    if (first && second && typeof first === "object" && typeof second === "object") {
      for (const child of new Set([...Object.keys(first), ...Object.keys(second)])) compare(first[child], second[child], `${key}.${child}`);
    } else styleChanges.push({ key, before: first, after: second });
  };
  compare(baseline, snapshots, "snapshot");
  const imageChanges = [];
  for (const file of (await fs.readdir(destination)).filter(file => file.endsWith(".png"))) {
    const before = await sharp(path.join(root, "baseline", file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const after = await sharp(path.join(destination, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    if (before.info.width !== after.info.width || before.info.height !== after.info.height) { imageChanges.push({ file, dimensions: { before: before.info, after: after.info } }); continue; }
    if (before.data.equals(after.data)) continue;
    let changed = 0;
    const diff = Buffer.alloc(after.data.length);
    for (let i = 0; i < after.data.length; i += 4) {
      const different = before.data[i] !== after.data[i] || before.data[i + 1] !== after.data[i + 1] || before.data[i + 2] !== after.data[i + 2] || before.data[i + 3] !== after.data[i + 3];
      if (different) changed++;
      diff[i] = different ? 255 : after.data[i]; diff[i + 1] = different ? 0 : after.data[i + 1]; diff[i + 2] = different ? 128 : after.data[i + 2]; diff[i + 3] = 255;
    }
    if (changed) {
      imageChanges.push({ file, changedPixels: changed, percent: Number((changed / (after.info.width * after.info.height) * 100).toFixed(5)) });
      await sharp(diff, { raw: after.info }).png().toFile(path.join(destination, `diff-${file}`));
    }
  }
  const report = { stage, captures: Object.keys(snapshots).length - 2, styleChanges, imageChanges };
  await fs.writeFile(path.join(destination, "comparison.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ stage, screenshots: report.captures, computedStyleDifferences: styleChanges.length, imageDifferences: imageChanges.length, examples: imageChanges.slice(0, 5) }));
  if (styleChanges.length || imageChanges.length) process.exitCode = 1;
}
