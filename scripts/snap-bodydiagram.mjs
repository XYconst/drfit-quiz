import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const out = '/tmp/drfit-walk/body-diagram';
await mkdir(out, { recursive: true });

const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

async function snap(p, opts) {
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'networkidle' });
  await p.getByRole('button', { name: opts.gender }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /Сваляне на тегло/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: /С наднормено тегло/ }).click();
  await p.waitForTimeout(350);
  await p.getByRole('button', { name: opts.age }).first().click();
  await p.waitForTimeout(500);
  // Step 5
  await p.screenshot({ path: `${out}/${opts.code}-empty.png`, fullPage: false });
  await p.getByRole('button', { name: /Корем/ }).click();
  await p.getByRole('button', { name: /Ръце/ }).click();
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/${opts.code}-selected.png`, fullPage: false });
}

const p1 = await ctx.newPage();
await snap(p1, { code: 'm', gender: /^Мъж/, age: '30-39' });

const p2 = await ctx.newPage();
await snap(p2, { code: 'f', gender: /^Жена/, age: '40-49' });

console.log('done');
await b.close();
