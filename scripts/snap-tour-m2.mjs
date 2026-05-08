// Tour all photo-led screens for M2 (male 30-39) so we can confirm the cast
// reaches every relevant step.
import { chromium } from 'playwright';

const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();

const out = '/tmp/drfit-walk/tour-m2';
await import('node:fs/promises').then((m) => m.mkdir(out, { recursive: true }));

await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.clear());
await p.reload({ waitUntil: 'networkidle' });

// Pick male, lose-major, overweight, age 30-39 -> M2
await p.getByRole('button', { name: /^Мъж/ }).click();
await p.waitForTimeout(450);
await p.getByRole('button', { name: /Сваля сериозно тегло/ }).click();
await p.waitForTimeout(450);
await p.getByRole('button', { name: /С наднормено тегло/ }).click();
await p.waitForTimeout(450);
await p.screenshot({ path: `${out}/04-age.png`, fullPage: true });
await p.getByRole('button', { name: '30-39' }).click();
await p.waitForTimeout(500);

// Step 5 problem area
await p.getByRole('button', { name: 'Корем' }).click();
await p.getByRole('button', { name: /^Продължи/ }).click();
await p.waitForTimeout(450);
// 6 activity
await p.getByRole('button', { name: /Почти не се движа/ }).click();
await p.waitForTimeout(450);
// 7 desk
await p.getByRole('button', { name: /Седяща работа/ }).click();
await p.waitForTimeout(700);

// 8 sleep -> first split-photo (split-relaxed)
await p.screenshot({ path: `${out}/08-sleep.png`, fullPage: true });
await p.getByRole('button', { name: /5-6 часа/ }).click();
await p.waitForTimeout(700);
// 9 stress (split-stretch)
await p.screenshot({ path: `${out}/09-stress.png`, fullPage: true });
await p.getByRole('button', { name: /Висок/ }).click();
await p.waitForTimeout(450);
// 10 water
await p.getByRole('button', { name: /1-2 литра/ }).click();
await p.waitForTimeout(700);
// 11 dietStyle (split-bench)
await p.screenshot({ path: `${out}/11-dietStyle.png`, fullPage: true });
await p.getByRole('button', { name: /Опитвам се да внимавам/ }).click();
await p.waitForTimeout(450);
// 12 pastAttempts
await p.getByRole('button', { name: /Фитнес зала/ }).click();
await p.getByRole('button', { name: /^Продължи/ }).click();
await p.waitForTimeout(450);
// 13 interstitial
await p.getByRole('button', { name: /^Продължи/ }).click();
await p.waitForTimeout(700);
// 14 mealTiming (split-walking)
await p.screenshot({ path: `${out}/14-mealTiming.png`, fullPage: true });
await p.getByRole('button', { name: /Вечер/ }).click();
await p.waitForTimeout(700);
// 15 energy (split-squat)
await p.screenshot({ path: `${out}/15-energy.png`, fullPage: true });
await p.getByRole('button', { name: /Падам следобед/ }).click();
await p.waitForTimeout(700);
// 16 cravings (split-bottle)
await p.screenshot({ path: `${out}/16-cravings.png`, fullPage: true });
await p.getByRole('button', { name: /Сладко/ }).click();
await p.waitForTimeout(450);
// 17 bloating
await p.getByRole('button', { name: /Понякога/ }).click();
await p.waitForTimeout(700);
// 18 bodyTemp (split-towel)
await p.screenshot({ path: `${out}/18-bodyTemp.png`, fullPage: true });
await p.getByRole('button', { name: /Нормално/ }).click();
await p.waitForTimeout(700);
// 19 pastBest (split-front)
await p.screenshot({ path: `${out}/19-pastBest.png`, fullPage: true });
await p.getByRole('button', { name: /5-10 кг/ }).click();
await p.waitForTimeout(450);
// 20 interstitial
await p.getByRole('button', { name: /^Продължи/ }).click();
await p.waitForTimeout(700);
// 21 motivation (split-lunge)
await p.screenshot({ path: `${out}/21-motivation.png`, fullPage: true });
await p.getByRole('button', { name: /За здраве/ }).click();
await p.getByRole('button', { name: /^Продължи/ }).click();
await p.waitForTimeout(450);
// 22 targetDate
await p.getByRole('button', { name: /^Продължи/ }).click();
await p.waitForTimeout(700);
// 23 blockers (split-seated)
await p.screenshot({ path: `${out}/23-blockers.png`, fullPage: true });

console.log('done');
await b.close();
