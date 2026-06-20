let chromium;
try {
  const playwright = await import('playwright');
  chromium = playwright.chromium ?? playwright.default?.chromium;
} catch {
  const playwright = await import('/tmp/blp-orchestration-pw/node_modules/playwright/index.js');
  chromium = playwright.chromium ?? playwright.default?.chromium ?? playwright['module.exports']?.chromium;
}
if (!chromium) throw new Error('Playwright chromium export not found');
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const outDir = process.env.OUT_DIR || path.resolve(process.cwd(), '../../.hermes/screenshots/latest');
const stages = ['landing', 'onboard', 'course', 'skill', 'lesson', 'explain', 'complete'];
const viewports = [
  { name: 'desktop', width: 1440, height: 1100, isMobile: false },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const manifest = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.isMobile,
    deviceScaleFactor: viewport.isMobile ? 2 : 1,
  });

  for (const stage of stages) {
    const page = await context.newPage();
    const logs = [];
    page.on('console', (msg) => logs.push({ type: msg.type(), text: msg.text() }));
    page.on('pageerror', (error) => logs.push({ type: 'pageerror', text: error.message }));
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.evaluate(({ stage }) => {
      localStorage.setItem('blp:stage', stage);
      localStorage.setItem('blp:level', stage === 'lesson' ? '1' : '0');
    }, { stage });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    const bodyText = await page.locator('body').innerText().catch(() => '');
    const premiumText = /Premium|Start trial|Offer ends|Unlock all learning|Try Premium/i.test(bodyText);
    const file = path.join(outDir, `${viewport.name}-${stage}.png`);
    await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
    const metrics = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      return {
        title: document.title,
        scrollWidth: Math.max(body.scrollWidth, html.scrollWidth),
        clientWidth: html.clientWidth,
        scrollHeight: Math.max(body.scrollHeight, html.scrollHeight),
        clientHeight: html.clientHeight,
        overflowingX: Math.max(body.scrollWidth, html.scrollWidth) > html.clientWidth + 2,
      };
    });
    manifest.push({ stage, viewport: viewport.name, width: viewport.width, height: viewport.height, file, premiumText, metrics, logs });
    await page.close();
  }
  await context.close();
}

await browser.close();
console.log(JSON.stringify({ outDir, count: manifest.length, manifest }, null, 2));
