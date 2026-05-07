// Capture a multi-step quiz funnel for STRUCTURAL analysis only.
// Output: per-step PNG + HTML + meta.json. No copy is reproduced downstream.

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const URL = process.env.QUIZ_URL || 'https://betterme-wallpilates.com/generated-questionary-brand-palette?flow=1416';
const RUN_NAME = process.env.RUN_NAME || 'run-01';
const STRATEGY = (process.env.STRATEGY || 'first').toLowerCase(); // first | last | middle | random
const MAX_STEPS = Number(process.env.MAX_STEPS || 60);
const OUT_DIR = join(process.env.HOME, 'drfit-quiz', 'captures', RUN_NAME);
const SETTLE_MS = 1500;
const POST_CLICK_MS = 1200;
const FAKE_EMAIL = 'analysis+drfit@example.com';

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();

const log = [];
const stepRecord = async (idx, label) => {
  const padded = String(idx).padStart(3, '0');
  await page.waitForTimeout(SETTLE_MS);
  const png = join(OUT_DIR, `step-${padded}.png`);
  const html = join(OUT_DIR, `step-${padded}.html`);
  await page.screenshot({ path: png, fullPage: true });
  const dom = await page.content();
  await writeFile(html, dom);
  const url = page.url();
  const title = await page.title();
  // Detect basic structure
  const meta = await page.evaluate(() => {
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.1;
    };
    const buttons = Array.from(document.querySelectorAll('button, [role="button"], label, a[href]'))
      .filter(visible)
      .map(el => ({
        tag: el.tagName,
        role: el.getAttribute('role') || null,
        type: el.getAttribute('type') || null,
        ariaLabel: el.getAttribute('aria-label') || null,
        rect: (() => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; })(),
        // text length only — not the text itself, to keep analysis structural
        textLen: (el.innerText || '').trim().length,
        hasImg: !!el.querySelector('img, svg'),
        classes: el.className && typeof el.className === 'string' ? el.className.split(/\s+/).slice(0, 6) : [],
      }))
      .filter(b => b.rect.w > 30 && b.rect.h > 20);
    const inputs = Array.from(document.querySelectorAll('input, textarea, select'))
      .filter(visible)
      .map(el => ({
        tag: el.tagName,
        type: el.getAttribute('type') || null,
        name: el.getAttribute('name') || null,
        placeholderLen: (el.getAttribute('placeholder') || '').length,
        required: el.hasAttribute('required'),
      }));
    const progressBars = Array.from(document.querySelectorAll('[role="progressbar"], progress, .progress, [class*="progress" i]'))
      .filter(visible)
      .map(el => ({ tag: el.tagName, classes: (el.className && typeof el.className === 'string') ? el.className.split(/\s+/).slice(0, 4) : [] }));
    const stickyBars = Array.from(document.querySelectorAll('*'))
      .filter(el => visible(el))
      .filter(el => { const cs = getComputedStyle(el); return (cs.position === 'fixed' || cs.position === 'sticky') && el.getBoundingClientRect().width > 200; })
      .slice(0, 8)
      .map(el => ({ tag: el.tagName, classes: (el.className && typeof el.className === 'string') ? el.className.split(/\s+/).slice(0, 4) : [], rect: (() => { const r = el.getBoundingClientRect(); return { y: Math.round(r.y), h: Math.round(r.height) }; })() }));
    return {
      title: document.title,
      h1Count: document.querySelectorAll('h1').length,
      h2Count: document.querySelectorAll('h2').length,
      imgCount: document.querySelectorAll('img').length,
      buttonCount: buttons.length,
      buttons: buttons.slice(0, 12),
      inputs,
      progressBars,
      stickyBars,
      bodyLen: document.body.innerText.length,
    };
  });
  log.push({ idx, label, url, title, meta });
  console.log(`[${padded}] ${label} | url=${url.slice(0, 80)} | btns=${meta.buttonCount} inp=${meta.inputs.length}`);
  return meta;
};

const pickButton = (buttons, strategy) => {
  // Filter out nav/back/close-style buttons by aspect ratio + size heuristics
  const candidates = buttons.filter(b => {
    const tooSmall = b.rect.w < 60 || b.rect.h < 30;
    const closeIcon = b.rect.w < 80 && b.rect.h < 80 && b.textLen < 3 && !b.hasImg;
    return !tooSmall && !closeIcon;
  });
  if (!candidates.length) return null;
  // Heuristic: prefer larger buttons (real options) over tiny header icons
  const sorted = [...candidates].sort((a, b) => (b.rect.w * b.rect.h) - (a.rect.w * a.rect.h));
  const top = sorted.slice(0, Math.max(1, Math.min(8, sorted.length)));
  if (strategy === 'first') return top[0];
  if (strategy === 'last') return top[top.length - 1];
  if (strategy === 'middle') return top[Math.floor(top.length / 2)];
  if (strategy === 'random') return top[Math.floor(Math.random() * top.length)];
  return top[0];
};

async function fillInputs() {
  const inputs = await page.$$('input:not([type=hidden]), textarea');
  for (const inp of inputs) {
    const type = (await inp.getAttribute('type')) || 'text';
    const name = (await inp.getAttribute('name')) || '';
    const placeholder = (await inp.getAttribute('placeholder')) || '';
    const visible = await inp.isVisible();
    if (!visible) continue;
    if (type === 'email' || /email/i.test(name) || /email/i.test(placeholder)) {
      await inp.fill(FAKE_EMAIL).catch(() => {});
    } else if (type === 'tel' || /phone|tel/i.test(name)) {
      await inp.fill('+359888123456').catch(() => {});
    } else if (type === 'number' || /weight/i.test(name) || /weight/i.test(placeholder)) {
      await inp.fill('80').catch(() => {});
    } else if (/height/i.test(name) || /height/i.test(placeholder)) {
      await inp.fill('170').catch(() => {});
    } else if (/age/i.test(name) || /age/i.test(placeholder)) {
      await inp.fill('35').catch(() => {});
    }
  }
}

try {
  console.log(`Opening ${URL}`);
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  // Dismiss cookie consent if present
  for (const sel of ['button:has-text("Accept")', 'button:has-text("Agree")', 'button:has-text("OK")', 'button:has-text("Allow")', '#onetrust-accept-btn-handler']) {
    const btn = await page.$(sel);
    if (btn && await btn.isVisible().catch(() => false)) {
      console.log(`Dismissing consent: ${sel}`);
      await btn.click().catch(() => {});
      await page.waitForTimeout(800);
      break;
    }
  }

  // Hide consent overlay completely so it stops polluting the button picker
  await page.addStyleTag({ content: `
    #onetrust-consent-sdk, #onetrust-banner-sdk, .onetrust-pc-dark-filter, .ot-sdk-container,
    [id*="onetrust" i], [class*="onetrust" i] { display: none !important; visibility: hidden !important; }
  `}).catch(() => {});

  // Tap the entry CTA if a hero "Get started"-style button exists
  for (const sel of ['button:has-text("Get started")', 'button:has-text("Start")', 'button:has-text("Continue")', 'button:has-text("Take")', 'a:has-text("Get started")']) {
    const btn = await page.$(sel);
    if (btn && await btn.isVisible().catch(() => false)) {
      console.log(`Entering quiz via: ${sel}`);
      await btn.tap().catch(async () => btn.click().catch(() => {}));
      await page.waitForTimeout(1500);
      break;
    }
  }

  let lastUrl = '';
  let stallCount = 0;

  for (let i = 1; i <= MAX_STEPS; i++) {
    const meta = await stepRecord(i, `step-${i}`);
    await fillInputs();

    // Detect paywall: presence of "price"-shaped patterns (multiple price-like strings in DOM)
    const looksLikePaywall = await page.evaluate(() => {
      const text = document.body.innerText.slice(0, 3000);
      const priceMatches = (text.match(/\$\s?\d|€\s?\d|\d+[\.,]\d{2}/g) || []).length;
      const hasPlanWords = /per\s+month|per\s+week|trial|guarantee|money-back/i.test(text);
      return priceMatches >= 3 && hasPlanWords;
    });
    if (looksLikePaywall) {
      console.log(`[${String(i).padStart(3,'0')}] PAYWALL detected — capturing scroll, then stopping.`);
      // Scroll capture for the paywall (it's tall)
      await page.waitForTimeout(2000);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      const paywallScrollPath = join(OUT_DIR, `step-${String(i).padStart(3,'0')}-paywall-full.png`);
      await page.screenshot({ path: paywallScrollPath, fullPage: true });
      break;
    }

    // SPA-specific selectors discovered by inspecting DOM
    const SINGLE = '[data-test*="singleSelectQuestion__option"]';
    const MULTI = '[data-test*="multiSelectQuestion__option"]';
    const CONTINUE = '[data-test*="continueButton" i], [data-test*="continue" i], [data-test*="floatingButton" i], button:has-text("Continue"):not([id*="onetrust" i])';

    const singles = await page.locator(SINGLE).all();
    const multis = await page.locator(MULTI).all();
    const continueBtn = page.locator(CONTINUE).first();
    const continueCount = await continueBtn.count();
    console.log(`     selectors: single=${singles.length} multi=${multis.length} cont=${continueCount}`);

    const tapElement = async (loc) => {
      // Triple-fallback: tap → click(force) → JS click + dispatchEvent
      try { await loc.tap({ timeout: 2000 }); return true; } catch {}
      try { await loc.click({ force: true, timeout: 2000 }); return true; } catch {}
      try {
        const handle = await loc.elementHandle();
        if (handle) {
          await handle.evaluate(el => {
            el.click();
            ['pointerdown','mousedown','pointerup','mouseup','click'].forEach(t =>
              el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true })));
          });
          return true;
        }
      } catch {}
      return false;
    };

    let advanced = false;
    if (singles.length > 0) {
      const idx = STRATEGY === 'last' ? singles.length - 1
        : STRATEGY === 'middle' ? Math.floor(singles.length / 2)
        : STRATEGY === 'random' ? Math.floor(Math.random() * singles.length)
        : 0;
      advanced = await tapElement(singles[idx]);
      console.log(`     → tapped single[${idx}] ok=${advanced}`);
    } else if (multis.length > 0) {
      const pick = Math.min(2, multis.length);
      for (let k = 0; k < pick; k++) await tapElement(multis[k]);
      await page.waitForTimeout(500);
      if (continueCount > 0) advanced = await tapElement(continueBtn);
      console.log(`     → multi×${pick} + continue ok=${advanced}`);
    } else if (continueCount > 0) {
      advanced = await tapElement(continueBtn);
      console.log(`     → continue-only ok=${advanced}`);
    } else {
      const submit = await page.$('button[type=submit]');
      if (submit && await submit.isVisible().catch(() => false)) {
        await submit.click({ force: true }).catch(() => {});
        advanced = true;
      }
    }

    if (!advanced) {
      stallCount++;
      if (stallCount > 2) { console.log('No advance for 3 steps — stopping.'); break; }
    } else {
      stallCount = 0;
    }
    await page.waitForTimeout(POST_CLICK_MS);

    // If URL didn't change and DOM looks the same, try pressing Enter (form submit)
    const newUrl = page.url();
    if (newUrl === lastUrl) {
      await page.keyboard.press('Enter').catch(() => {});
      await page.waitForTimeout(POST_CLICK_MS);
    }
    lastUrl = newUrl;
  }
} catch (err) {
  console.error('CAPTURE ERROR', err.message);
} finally {
  await writeFile(join(OUT_DIR, 'log.json'), JSON.stringify(log, null, 2));
  await browser.close();
  console.log(`Done. Output: ${OUT_DIR}`);
}
