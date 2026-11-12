import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
await mkdir('artifacts/marketing', { recursive: true });
const base = process.env.BASE_URL ?? 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
page.setDefaultTimeout(15000);
const errors = [];
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', error => errors.push(error.message));
try {
  for (const theme of ['light', 'dark']) for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/landing/saas`);
    await page.evaluate(value => { localStorage.setItem('theme', value); localStorage.removeItem('orzen-layout'); }, theme);
    await page.reload();
    await page.locator('h1').waitFor();
    await page.waitForTimeout(650);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.sidebar,.topbar').count(), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const image = page.locator('#showcase img:visible');
    assert.equal(await image.count(), 1);
    assert.ok(await image.evaluate(element => element.complete && element.naturalWidth > 0));
    assert.match(await image.getAttribute('src'), new RegExp(`saas-dashboard-${theme}${width < 640 ? '-mobile' : ''}`));
    await page.locator('#revenue').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `artifacts/marketing/saas-premium-${theme}-${width}.png`, fullPage: true });
    const period = page.getByRole('group', { name: 'Billing period' });
    await period.getByRole('button', { name: 'Yearly', exact: true }).click();
    await page.getByText('$790 billed yearly', { exact: true }).waitFor();
    await period.getByRole('button', { name: 'Monthly', exact: true }).click();
    const faq = page.locator('#faq details');
    assert.equal(await faq.count(), 6);
    await faq.first().locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.notEqual(await faq.first().getAttribute('open'), null);
    if (width < 1024) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.getByRole('button', { name: 'Open marketing menu', exact: true }).click();
      await page.getByRole('navigation', { name: 'SaaS mobile sections' }).getByRole('link', { name: 'Features', exact: true }).click();
      await page.waitForURL('**/landing/saas#features');
      assert.equal(await page.locator('#marketing-mobile-menu').count(), 0);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/landing/saas`);
  await page.getByRole('combobox', { name: 'Marketing revenue window' }).selectOption('90');
  await page.locator('#revenue .ui-card__header').getByText('Last 90 days', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Growth', exact: true }).click();
  await page.getByRole('button', { name: 'Show counts', exact: true }).click();
  await page.getByRole('button', { name: 'Show percentages', exact: true }).waitFor();
  const cohort = page.getByRole('button', { name: /2026-05 month 0:/ });
  await cohort.click();
  await page.getByRole('status').filter({ hasText: '2026-05 cohort:' }).waitFor();
  const nav = page.getByRole('navigation', { name: 'SaaS product navigation' });
  await nav.locator('summary').click();
  await nav.getByRole('link', { name: 'AI platform', exact: true }).waitFor();
  await page.keyboard.press('Escape');
  for (const href of await page.locator('a[href^="#"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))) assert.equal(await page.locator(href).count(), 1);
  for (const href of new Set(await page.locator('a[href^="/"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href'))))) assert.ok((await page.request.get(`${base}${href}`)).ok(), href);
  assert.deepEqual(errors, []);
  console.log('PASS SaaS premium: 8 responsive/theme cases, real dashboard images, pricing, six FAQs, revenue/cohort controls, menu and links');
} finally { await browser.close(); }
