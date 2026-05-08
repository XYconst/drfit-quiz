// Walk to interstitial-1 (step 13) and interstitial-2 (step 20) for two
// different characters so we can confirm matched-character photos.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const out = '/tmp/drfit-walk/interstitials';
await mkdir(out, { recursive: true });

const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

async function tour(p, opts) {
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'networkidle' });
  await p.getByRole('button', { name: opts.gender }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: opts.goal }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: opts.bodyType }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: opts.age }).first().click();
  await p.waitForTimeout(500);
  await p.getByRole('button', { name: opts.problem }).click();
  await p.getByRole('button', { name: /^Продължи/ }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: /Почти не се движа/ }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: /Седяща работа/ }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: /5-6 часа/ }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: /Висок/ }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: /1-2 литра/ }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: /Опитвам се да внимавам/ }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: /Фитнес зала/ }).click();
  await p.getByRole('button', { name: /^Продължи/ }).click();
  await p.waitForTimeout(900);
  // Step 13 interstitial-1
  await p.screenshot({ path: `${out}/${opts.code}-step13.png`, fullPage: true });
  await p.getByRole('button', { name: /^Продължи/ }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: /Вечер/ }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: /Падам следобед/ }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: /Сладко/ }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: /Понякога/ }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: /Нормално/ }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: /5-10 кг/ }).click();
  await p.waitForTimeout(900);
  // Step 20 interstitial-2
  await p.screenshot({ path: `${out}/${opts.code}-step20.png`, fullPage: true });
}

const p1 = await ctx.newPage();
await tour(p1, {
  code: 'm2',
  gender: /^Мъж/,
  goal: /Сваля сериозно тегло/,
  bodyType: /С наднормено тегло/,
  age: '30-39',
  problem: 'Корем',
});

const p2 = await ctx.newPage();
await tour(p2, {
  code: 'f3',
  gender: /^Жена/,
  goal: /Сваля сериозно тегло/,
  bodyType: /С наднормено тегло/,
  age: '40-49',
  problem: 'Корем',
});

console.log('done');
await b.close();
