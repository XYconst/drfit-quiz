// Walk the Dr.Fit quiz happy path and screenshot every step.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const OUT = '/tmp/drfit-walk';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  // Bypass framer-motion entry/stagger transitions so screenshots capture the
  // final layout state without timing-dependent flakiness. Real-browser visual
  // verification of the animations is a separate manual step.
  reducedMotion: 'reduce',
});
const page = await ctx.newPage();

const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

const log = [];
async function snap(label) {
  await page.waitForTimeout(800);
  const f = `${OUT}/${String(log.length).padStart(2, '0')}-${label}.png`;
  await page.screenshot({ path: f, fullPage: true });
  log.push({ label, file: f, url: page.url() });
}

try {
  await page.goto('http://localhost:3010/', { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.reload({ waitUntil: 'networkidle' });
  await snap('s01-gender');

  // Step 1: Мъж
  await page.getByRole('button', { name: /Мъж/ }).click();
  await snap('s02-goal');

  // Step 2: lose-major
  await page.getByRole('button', { name: /Искам да сваля сериозно/ }).click();
  await snap('s03-bodytype');

  // Step 3: overweight
  await page.getByRole('button', { name: /С наднормено тегло/ }).click();
  await snap('s04-age');

  // Step 4: 30-39
  await page.getByRole('button', { name: '30-39' }).click();
  await snap('s05-problem-areas');

  // Step 5 multi-select
  await page.getByRole('button', { name: 'Корем' }).click();
  await page.getByRole('button', { name: 'Любовни дръжки' }).click();
  await page.getByRole('button', { name: /Продължи/ }).click();
  await snap('s06-activity');

  await page.getByRole('button', { name: /Почти не се движа/ }).click();
  await snap('s07-job');
  await page.getByRole('button', { name: /Седяща работа/ }).click();
  await snap('s08-sleep');
  await page.getByRole('button', { name: /5-6 часа/ }).click();
  await snap('s09-stress');
  await page.getByRole('button', { name: /Висок/ }).click();
  await snap('s10-water');
  await page.getByRole('button', { name: /1-2 литра/ }).click();
  await snap('s11-diet');
  await page.getByRole('button', { name: /Опитвам се да внимавам/ }).click();
  await snap('s12-pastattempts');

  await page.getByRole('button', { name: /Фитнес зала/ }).click();
  await page.getByRole('button', { name: /Диети/ }).click();
  await page.getByRole('button', { name: /Продължи/ }).click();
  await snap('s13-interstitial-1');

  await page.getByRole('button', { name: /Продължи/ }).click();
  await snap('s14-meal-timing');
  await page.getByRole('button', { name: /Вечер/ }).click();
  await snap('s15-energy');
  await page.getByRole('button', { name: /Падам следобед/ }).click();
  await snap('s16-cravings');
  await page.getByRole('button', { name: /^Сладко/ }).click();
  await snap('s17-bloating');
  await page.getByRole('button', { name: /Понякога/ }).click();
  await snap('s18-temp');
  await page.getByRole('button', { name: /Нормално/ }).click();
  await snap('s19-pastbest');
  await page.getByRole('button', { name: /5-10 кг/ }).click();
  await snap('s20-interstitial-2');

  await page.getByRole('button', { name: /Продължи/ }).click();
  await snap('s21-motivation');
  await page.getByRole('button', { name: /За здраве/ }).click();
  await page.getByRole('button', { name: /Стига вече/ }).click();
  await page.getByRole('button', { name: /^Продължи/ }).click();
  await snap('s22-targetdate');
  await page.getByRole('button', { name: /^Продължи/ }).click();
  await snap('s23-blockers');
  await page.getByRole('button', { name: /Нямам време/ }).click();
  await page.getByRole('button', { name: /Нямам план/ }).click();
  await page.getByRole('button', { name: /^Продължи/ }).click();
  await snap('s24-metrics');

  // Numeric combo: defaults are 170/80/70; confirm and continue
  await page.getByRole('button', { name: /^Продължи/ }).click();
  await snap('s25-calculating');
  // Wait through calc screen (9s) + 600ms tail
  await page.waitForTimeout(10000);
  await snap('s26-email');

  await page.fill('input[type=email]', 'walkthrough@example.com');
  await page.fill('input[type=tel]', '+359888112233');
  await page.getByRole('button', { name: /Виж моя план/ }).click();

  await page.waitForURL(/\/plan/, { timeout: 8000 });
  await snap('s27-plan');

  console.log('\n=== ALL STEPS COMPLETED ===');
  console.log(`steps captured: ${log.length}`);
  console.log(`final url: ${page.url()}`);
} catch (err) {
  console.error('WALK FAILED:', err.message);
  await snap('FAIL');
}

console.log('errors:', errors);
console.log('files:', log.map(x => x.file).join('\n'));

await browser.close();
