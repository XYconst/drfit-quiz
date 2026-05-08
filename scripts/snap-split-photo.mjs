// Walk to step 9 (stress) with M1 (male, 18-29) to verify SplitPhotoSelect renders.
import { chromium } from 'playwright';

const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();

await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.clear());
await p.reload({ waitUntil: 'networkidle' });

// Step 1 male
await p.getByRole('button', { name: /^Мъж/ }).click();
await p.waitForTimeout(500);
// Step 2 lose-major
await p.getByRole('button', { name: /Сваля сериозно тегло/ }).click();
await p.waitForTimeout(500);
// Step 3 overweight
await p.getByRole('button', { name: /С наднормено тегло/ }).click();
await p.waitForTimeout(500);
// Step 4 age 18-29 (M1)
await p.getByRole('button', { name: '18-29' }).click();
await p.waitForTimeout(500);
// Step 5 problem area + continue
await p.getByRole('button', { name: 'Корем' }).click();
await p.getByRole('button', { name: /^Продължи/ }).click();
await p.waitForTimeout(500);
// Step 6 activity
await p.getByRole('button', { name: /Почти не се движа/ }).click();
await p.waitForTimeout(500);
// Step 7 desk
await p.getByRole('button', { name: /Седяща работа/ }).click();
await p.waitForTimeout(800);
// Step 8 sleep — first split-photo step
await p.screenshot({ path: '/tmp/drfit-walk/step8-split-relaxed.png', fullPage: true });

// Pick something to advance
await p.getByRole('button', { name: /5-6 часа/ }).click();
await p.waitForTimeout(800);
// Step 9 stress
await p.screenshot({ path: '/tmp/drfit-walk/step9-split-stretch.png', fullPage: true });

await p.getByRole('button', { name: /Висок/ }).click();
await p.waitForTimeout(500);
// step 10 water (icon-row, not split)
await p.getByRole('button', { name: /1-2 литра/ }).click();
await p.waitForTimeout(800);
// step 11 dietStyle (split)
await p.screenshot({ path: '/tmp/drfit-walk/step11-split-bench.png', fullPage: true });

console.log('done');
await b.close();
