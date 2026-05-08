// Walk to step 4 (age) and screenshot the photo cards for both genders.
import { chromium } from 'playwright';

const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();

// Male path
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.clear());
await p.reload({ waitUntil: 'networkidle' });
await p.getByRole('button', { name: /^Мъж/ }).click();
await p.waitForTimeout(500);
await p.getByRole('button', { name: /Сваля сериозно тегло/ }).click();
await p.waitForTimeout(500);
await p.getByRole('button', { name: /С наднормено тегло/ }).click();
await p.waitForTimeout(900);
await p.screenshot({ path: '/tmp/drfit-walk/age-male-photos.png', fullPage: true });

// Female path
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.clear());
await p.reload({ waitUntil: 'networkidle' });
await p.getByRole('button', { name: /^Жена/ }).click();
await p.waitForTimeout(500);
await p.getByRole('button', { name: /Сваля сериозно тегло/ }).click();
await p.waitForTimeout(500);
await p.getByRole('button', { name: /С наднормено тегло/ }).click();
await p.waitForTimeout(900);
await p.screenshot({ path: '/tmp/drfit-walk/age-female-photos.png', fullPage: true });

console.log('done');
await b.close();
