# Dr.Fit Quiz Funnel: Brand & Differentiation Brief

Audience: Niki (Tim, @Timscore25), continuing the build.
Purpose: everything you need to know about Dr.Fit before you write copy or change funnel logic, plus the concrete deltas vs the BetterMe quiz that this funnel is structurally inspired by.

This is the source of truth on positioning. The quiz logic and step list live in [`quiz-spec.md`](../quiz-spec.md). When the two conflict, this doc wins on voice and offer; `quiz-spec.md` wins on mechanics.

---

## 1. What Dr.Fit is

A Bulgarian-first metabolism and weight-loss brand. Operated by **Thunder Digital LTD**. Marketing site at `www.dr-fit.co`, app at `app.dr-fit.co`. Anchor Media (Valentin) is a 6% revenue-share growth partner.

Three products live or in build:

1. **Dr.Fit app** (live). Workouts, meal plans, in-app coach chat. Subscription. Multiple Stripe SKUs for trial pricing (4-week, 12-week).
2. **90-day Challenge** (live). 49 EUR commitment fee, fully refunded on completion + before/after photos + short video review. Stripe `prod_SUUVgFxdaBvsl1` / regular price `price_1Skjf0GDcYd0F03cY92YRDRX`. This is what the quiz's `/plan` page sells.
3. **Book "Защо метаболизмът ти е счупен"** (in build). 19.90 EUR (was 39.90 EUR), bundles a 21-day free app trial. Optional hardcover add-on, ships via Econt.

**Target customer.** Bulgarian adults 25-65. Heavy emphasis on people over 35 (the book has a dedicated chapter on what changes after 35). The shared emotional hook across all surfaces is people who have failed multiple diets and blame themselves.

**No personality founder.** Dr.Fit is a product brand, not a coach brand. There is no named "guru" face. Don't invent one.

---

## 2. Voice rules

**Pronoun: "Ти" (informal, second person singular).** Used everywhere. Never "Вие".

**Tone.** Direct, urgency-driven, concrete numbers, anti-blame. The single line that captures the whole brand voice:

> "Не е била волята. Било е биологията."

**Vocabulary preferences.**
- Use everyday Bulgarian. Avoid Latin-derived clinical words where a spoken word exists.
- Mechanical metaphors instead of medical claims: "поправяш", "ресет", "рестартираш" instead of "лекуваш", "третираш".
- Always concrete numbers: "49 EUR", "21 дни", "90 дни", "10 000+ българи", "4 хормона", "48 часа".
- Branded method names get capitalized inline: **Carb-Cycling / Въглехидратна ротация**, **Time-Under-Tension / Време под напрежение**, **AfterBurn / Последващо изгаряне**.

**Hard rules.**
- No medical claims. No "cure", "treat", "лекува". Add a "говори с лекаря си преди да започнеш" disclaimer when discussing chronic conditions.
- No em-dashes anywhere. Use commas, parentheses, colons, or shorter sentences. (This is a global rule on this codebase. The `/plan` page and quiz copy have already been cleaned; keep new copy clean too.)
- No emojis in body copy of polished pages. Emojis are allowed only in quiz answer chips for visual scanning, never in headlines, paragraphs, or CTAs.
- No founder face. No invented coach persona.
- No competitor attacks by name.

**Phrases that work** (use as voice references, copy when it fits):

- "Започваме с теб."
- "Готов си да свалиш [X] кг за 90 дни."
- "Без глад. Без зала. С план."
- "Защо метаболизмът ти е счупен. И как да го рестартираш за 21 дни."
- "Търсим още 10 души от София за това предизвикателство." (city dynamic)
- "Плащаш 49 EUR днес. Трансформираш се за 90 дни. Изпращаш снимки и кратък отзив. Получаваш всяка стотинка обратно. Без уловки."
- "Виновни са 4 хормона." (insulin / leptin / ghrelin / cortisol)
- "Не е била волята. Било е биологията."
- "10 000+ българи. Една и съща система."
- "Това не е още една диета. Това е наръчникът, който трябваше да имаш още първия път."

---

## 3. The 5-avatar model

This is the spine of every Dr.Fit funnel surface. The quiz, the marketing site landing pages (`/lp/avatar-1` through `/lp/avatar-5`), the VSLs, and the book chapters are all keyed to it.

| ID | Label | Goal angle | Stat anchors | Notes |
|---|---|---|---|---|
| 01 | Overweight Man | fat loss | Metabolism / Self-Confidence | AfterBurn emphasis |
| 02 | Overweight Woman | fat loss | Metabolism / Self-Confidence | AfterBurn emphasis, "женски метаболизъм" framing |
| 03 | Skinny-Fat Man | recomp | Fat-Burning / Muscle Mass | AfterBurn + lean gain |
| 04 | Skinny-Fat Woman | tone | Metabolism / Toned Muscle | AfterBurn, "стегни се" |
| 05 | Skinny Man | lean gain | Calorie-Capture / Muscle Mass | Anabolic only, no AfterBurn |

**Routing rules** (already implemented in `lib/avatars.ts`):
- Skinny female routes to Avatar 04 regardless of stated goal.
- Skinny male + "lose major weight" goal is a contradiction; serve `/blocked` with a link back to the main site.
- All other contradictions: goal takes priority over body-type.

**Per-avatar testimonial pool** for the `/plan` testimonials section: men get Andrey, Gabriel, Misho; women get Yoanna, Ralitsa, Katerina. Filter by gender + body type when wiring up section 05 of `/plan` (currently a TODO).

---

## 4. The offer (what the funnel sells)

**The 49 EUR refund-on-completion.** This is the single most important thing to get right in copy. It is not a free trial. It is not a deposit. It is a commitment fee that is fully refunded when the user finishes the 90 days and submits their before/after photos plus a short video review.

Why this matters:
- It is honest. There are no hidden recurring charges.
- It self-selects motivated buyers, which lifts completion rate.
- It doubles as a UGC engine. Every refund request comes with photos and a video.
- It is the strongest available differentiation against BetterMe's hidden-trial pattern. Lean on it.

How to talk about it:
> "Плащаш 49 EUR днес. Завършваш 90 дни. Изпращаш снимки и кратък отзив. Получаваш всяка стотинка обратно. Без уловки."

The three steps belong on every paywall page in this exact order. They are already implemented in `components/plan/GuaranteeBlock.tsx`.

**Stripe URL anatomy** (already in `lib/checkout.ts`):

```
https://app.dr-fit.co/checkout
  ?productId=prod_SUUVgFxdaBvsl1
  &flow=full_price
  &regularPriceId=price_1Skjf0GDcYd0F03cY92YRDRX
  &lang=bg
  &avatar=01..05
```

`avatar` is for tracking only. Do not change product/price IDs without asking; they map to live Stripe products.

---

## 5. Mechanism IP (the three named methods)

These three terms recur across the app, the book, the landing pages, and the VSLs. They are the brand's defensible content moat. Treat them as proper nouns.

1. **Carb-Cycling / Въглехидратна ротация.** Alternating low-carb and high-carb days to re-train insulin response.
2. **Time-Under-Tension / Време под напрежение.** Sound-guided rep tempo. The app has a "звуков timer за тренировки" that delivers this.
3. **AfterBurn / Последващо изгаряне.** The 48-hour post-workout fat-burn window. Used as the central "why this works while you sleep" claim.

Plus the supporting concept "**4-те хормона**" (insulin, leptin, ghrelin, cortisol). Don't add new named methods. Don't translate these in BG copy; keep both forms.

---

## 6. The two parallel funnels

```
┌───────────────────────────────────────────────────────────────┐
│  APP FUNNEL                                                   │
│  Cold ad ─► Avatar landing OR VSL ─► Stripe checkout (49 EUR) │
│                                       │                       │
│                                       ▼                       │
│                                    app.dr-fit.co              │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  QUIZ FUNNEL  ◄─── this repo                                  │
│  Cold ad ─► / (26-step quiz) ─► email gate ─► /plan           │
│                                                │              │
│                                                ▼              │
│                                  Stripe checkout (49 EUR,     │
│                                  same SKU, ?avatar=NN)        │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  BOOK FUNNEL (in build, separate repo)                        │
│  Cold ad ─► Book landing (19.90 EUR)                          │
│         ─► Stripe ─► PDF/EPUB delivery + 21-day app trial     │
└───────────────────────────────────────────────────────────────┘
```

The quiz funnel and the app funnel both end at the same Stripe checkout. The quiz earns its place by lifting personalization and qualifying intent. If you can't show a measurable lift over a direct-to-checkout control, the quiz doesn't ship.

---

## 7. Differentiation from BetterMe

The quiz was structurally inspired by BetterMe's Walpilates funnel (see `scripts/capture-quiz.mjs`, default `QUIZ_URL=https://betterme-wallpilates.com/...`). The structural pattern (gender → goal → body-type → lifestyle → email gate → calculating screen → personalized paywall) is good and worth keeping. Everything else needs to feel different.

| Dimension | BetterMe pattern | Dr.Fit must do |
|---|---|---|
| Offer | Hidden recurring charge after a tiny "trial fee" | 49 EUR up front, fully refunded on completion. Make this loud. |
| Social proof | Anonymized "millions worldwide" | "10 000+ българи. Една и съща система." Ethno-national anchor. |
| Voice | Generic universal English, gentle "you're not alone" | "Ти", direct, anti-blame, hormonal mechanism reframe. |
| Quiz length | Often 40+ steps, padded with redundant questions | 26 steps, hard cap. Every step earns its place by contributing to either avatar routing or the personalized `/plan` bullets. |
| Paywall framing | Charts that promise specific kg loss with weak basis | BMI projection + qualitative "защо стандартните програми не работят за теб" generated from this user's own answers. |
| Pricing tier maze | Multiple plan tiers with dark patterns at the choice | Single 49 EUR option. No upsell maze. |
| Localization | English-first, then translated | Bulgarian-first. EN/RO are secondary. City localization where possible ("Търсим още 10 души от София"). |
| Mechanism naming | Generic ("intermittent fasting", "calorie deficit") | Branded: Carb-Cycling, Time-Under-Tension, AfterBurn. Use BG + EN forms together. |
| Coach access | None, or chatbot | Real coach in chat included with the 90-day program. Mention it on `/plan` as a bonus. |
| Avatars | One generic flow with cosmetic copy swaps | 5 avatars driving real differences in stat labels, testimonials, headline, projected outcome. |

**The single sentence** to keep in your head while building:

> Dr.Fit is what BetterMe would look like if the offer were honest, the voice were Bulgarian, and the mechanism were named.

If a copy choice or a UI choice undercuts any of those three, change it.

---

## 8. What's done in this repo and what's still open

Already in the codebase as of the latest commit on `main`:

- All 26 quiz steps with BG copy in `lib/questions.ts`.
- Avatar classification in `lib/avatars.ts` including the skinny-male contradiction handling.
- Quiz container with state, localStorage persistence, framer-motion transitions.
- All step component types working: SingleSelect, MultiSelect, NumericCombo, DateStep, EmailGate, InterstitialCard, CalculatingScreen, ProgressBar.
- `/plan` paywall page with hero, 4 numbered sections, comparison block, guarantee block, sticky countdown, CTA.
- `/blocked` soft-block page.
- Lead capture API at `/api/lead` (writes JSONL, optional webhook forward).
- Meta Pixel base script + helpers (`Lead`, `InitiateCheckout`, custom `QuizStep`).
- Stripe checkout URL builder in `lib/checkout.ts`.
- Tailwind v4 theme tokens with brand reds, dark, surface, text scale.
- Silhouette SVGs in `public/silhouettes/`. These are placeholders, geometric, gender-distinguishable. Replace with brand-illustrated assets when available (see `~/Documents/proposals/drfit-overweight-m.webp` etc. for closer-to-brand visuals).
- Personalized `/plan` section 01 bullets generated from quiz answers (`lib/personalize.ts`).
- Em-dashes stripped from all user-facing copy.
- Playwright E2E walk script at `scripts/walk-quiz.mjs`. Run it after any change.

Open per the spec, in priority order:

1. **Section 03 ComparisonBlock dynamic from blockers + past_attempts.** Currently hard-coded. Spec calls for 5 rows generated from the user's reported blockers and what they've tried.
2. **Section 05 testimonials.** 3 cards filtered by gender + body-type from the named pool above.
3. **BMI + projected curve chart on `/plan`.** Hero visual. Use a lightweight chart lib or pure SVG; the projection is qualitative, so don't over-engineer.
4. **Avatar 05 metric flow variant.** "Колко искаш да качиш?" instead of target weight. Skip step 19 (past best loss).
5. **Imperial toggle (см/кг ↔ inches/lbs).** Required for EN/RO traffic.
6. **GA4 base script.** Only Meta Pixel is loaded today.
7. **Server-side Meta CAPI.** Token TBD per spec.
8. **Real silhouette illustrations.** Swap the placeholder SVGs for brand-consistent assets.

---

## 9. Where to find more

- Marketing site (live): `https://www.dr-fit.co` and the avatar-keyed pages `/lp/avatar-1..5`.
- Marketing repo: `git@github.com:YordanBahov-bg/dr-fit-marketing.git` (Margarita and Yordan).
- Original quiz spec: [`quiz-spec.md`](../quiz-spec.md).
- This fork: `https://github.com/XYconst/drfit-quiz` (XYconst).
- Upstream: `https://github.com/margarita-dzen/drfit-quiz`.
- Brand assets (proposals folder): `~/Documents/proposals/drfit-*.webp`, `drfit-logo.svg`, `drfit-logo-full.svg`.
- BetterMe reference funnel (structural inspiration only): default URL in `scripts/capture-quiz.mjs`.

If you change anything that affects voice, the offer, or the avatar routing, run `node scripts/walk-quiz.mjs` and post the screenshot diff in the PR.
