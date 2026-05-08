// Tour split-photo screens for F3 (female 40-49) to confirm cross-gender works.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const out = '/tmp/drfit-walk/tour-f3';
await mkdir(out, { recursive: true });

const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();

await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.clear());
await p.reload({ waitUntil: 'networkidle' });

await p.getByRole('button', { name: /^Жена/ }).click();
await p.waitForTimeout(450);
await p.getByRole('button', { name: /Сваля сериозно тегло/ }).click();
await p.waitForTimeout(450);
await p.getByRole('button', { name: /С наднормено тегло/ }).click();
await p.waitForTimeout(450);
await p.getByRole('button', { name: '40-49' }).click();
await p.waitForTimeout(500);

await p.getByRole('button', { name: 'Корем' }).click();
await p.getByRole('button', { name: /^Продължи/ }).click();
await p.waitForTimeout(450);
await p.getByRole('button', { name: /Почти не се движа/ }).click();
await p.waitForTimeout(450);
await p.getByRole('button', { name: /Седяща работа/ }).click();
await p.waitForTimeout(700);

// 8 sleep
await p.screenshot({ path: `${out}/08-sleep.png`, fullPage: true });
await p.getByRole('button', { name: /5-6 часа/ }).click();
await p.waitForTimeout(700);
// 9 stress
await p.screenshot({ path: `${out}/09-stress.png`, fullPage: true });
await p.getByRole('button', { name: /Висок/ }).click();
await p.waitForTimeout(450);
await p.getByRole('button', { name: /1-2 литра/ }).click();
await p.waitForTimeout(700);
// 11 dietStyle
await p.screenshot({ path: `${out}/11-dietStyle.png`, fullPage: true });
await p.getByRole('button', { name: /Опитвам се да внимавам/ }).click();
await p.waitForTimeout(450);
await p.getByRole('button', { name: /Фитнес зала/ }).click();
await p.getByRole('button', { name: /^Продължи/ }).click();
await p.waitForTimeout(450);
await p.getByRole('button', { name: /^Продължи/ }).click();
await p.waitForTimeout(700);
// 14 mealTiming
await p.screenshot({ path: `${out}/14-mealTiming.png`, fullPage: true });
await p.getByRole('button', { name: /Вечер/ }).click();
await p.waitForTimeout(700);
// 15 energy (squat)
await p.screenshot({ path: `${out}/15-energy.png`, fullPage: true });
await p.getByRole('button', { name: /Падам следобед/ }).click();
await p.waitForTimeout(700);
// 21 motivation: skip ahead
console.log('done');
await b.close();
