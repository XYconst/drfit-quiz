// Walk to step 26 calculating screen for m2 and f3 and screenshot mid-load.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const out = '/tmp/drfit-walk/calc';
await mkdir(out, { recursive: true });

const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

async function tour(p, opts) {
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'networkidle' });
  await p.getByRole('button', { name: opts.gender }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: opts.goal }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: opts.bodyType }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: opts.age }).first().click();
  await p.waitForTimeout(400);
  await p.getByRole('button', { name: 'Корем' }).click();
  await p.getByRole('button', { name: /^Продължи/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /Почти не се движа/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /Седяща работа/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /5-6 часа/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /Висок/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /1-2 литра/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /Опитвам се да внимавам/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /Фитнес зала/ }).click();
  await p.getByRole('button', { name: /^Продължи/ }).click();
  await p.waitForTimeout(450);
  await p.getByRole('button', { name: /^Продължи/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /Вечер/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /Падам следобед/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /Сладко/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /Понякога/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /Нормално/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /5-10 кг/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /^Продължи/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /За здраве/ }).click();
  await p.getByRole('button', { name: /^Продължи/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /^Продължи/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /Нямам план/ }).click();
  await p.getByRole('button', { name: /^Продължи/ }).click();
  await p.waitForTimeout(350);
  // Step 24 metrics
  await p.getByRole('button', { name: /^Продължи/ }).click();
  await p.waitForTimeout(450);
  // Step 25 projection-preview
  await p.getByRole('button', { name: /Виж моя план/ }).click();
  // Now on calculating screen, snap at intervals
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/${opts.code}-early.png`, fullPage: false });
  await p.waitForTimeout(2200);
  await p.screenshot({ path: `${out}/${opts.code}-mid.png`, fullPage: false });
  await p.waitForTimeout(3500);
  await p.screenshot({ path: `${out}/${opts.code}-late.png`, fullPage: false });
}

const p1 = await ctx.newPage();
await tour(p1, {
  code: 'm2',
  gender: /^Мъж/,
  goal: /Сваля сериозно тегло/,
  bodyType: /С наднормено тегло/,
  age: '30-39',
});

const p2 = await ctx.newPage();
await tour(p2, {
  code: 'f3',
  gender: /^Жена/,
  goal: /Сваля сериозно тегло/,
  bodyType: /С наднормено тегло/,
  age: '40-49',
});

console.log('done');
await b.close();
