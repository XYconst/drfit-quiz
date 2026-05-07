# Dr.Fit — Quiz Funnel Spec

**Version:** v0.1 draft
**Stack:** Next.js 16 + Tailwind + shadcn/ui + Framer Motion, deployed on Vercel
**Voice:** „Ти", direct, urgency-driven, concrete numbers, no medical claims
**Hook:** „Защо метаболизмът ти не работи + как да го поправиш за 90 дни"
**End CTA:** existing Stripe checkout URL (with `avatar=NN` appended for tracking)

---

## Avatar router (Steps 1-3)

| # | Gender | Goal | Body-type | → Avatar |
|---|---|---|---|---|
| 1 | M | Сваля сериозно тегло | Overweight | **01 Overweight Man** |
| 2 | M | Сваля + изгражда мускули | Skinny-Fat | **03 Skinny-Fat Man** |
| 3 | M | Качва маса | Skinny | **05 Skinny Man** |
| 4 | F | Сваля сериозно тегло | Overweight | **02 Overweight Woman** |
| 5 | F | Стяга се / малко сваляне | Skinny-Fat or Skinny | **04 Skinny-Fat Woman** |

Edge cases:
- Skinny + Female → Avatar 04 (toning track), no separate bucket
- Skinny + Male + "сваля тегло" goal → contradiction; show "Не виждам как да ти помогна с тази комбинация" gate с link към основния сайт
- All other contradictions resolved by goal taking priority over body-type

---

## Step list

### 1. Gender
**Headline:** „Започваме с теб"
**Q:** „Кой/коя си?"
**Type:** image-card single-select, auto-advance
**Options:**
- 👤 Мъж
- 👤 Жена

---

### 2. Main goal
**Headline:** „Каква е твоята цел?"
**Type:** vertical button single-select, auto-advance
**Options (M):**
- 🔥 Искам да сваля сериозно тегло (15+ кг)
- ⚖️ Искам да сваля малко и да изградя мускули
- 💪 Искам да кача чиста мускулна маса
**Options (F):**
- 🔥 Искам да сваля сериозно тегло (15+ кг)
- ✨ Искам да се стегна и да отслабна малко
- 💃 Искам само да се стегна и да дефинирам формите

---

### 3. Body-type self-ID
**Headline:** „Кое тяло описва теб днес?"
**Type:** silhouette image picker (3 за М, 2 за Ж)
**Options (M):** Overweight / Skinny-Fat / Skinny silhouettes
**Options (F):** Overweight / Skinny-Fat silhouettes
*(При липса на фит за Skinny F → routes to Avatar 04)*

→ **AVATAR LOCKED** at end of Step 3.

---

### 4. Age
**Headline:** „На колко си?"
**Type:** vertical bucket, auto-advance
**Options:**
- 18-29
- 30-39
- 40-49
- 50-59
- 60+

---

### 5. Problem areas (multi-select)
**Headline:** „Кои зони те притесняват най-много?"
**Type:** body diagram + chips, multi-select, „Продължи" button
**Options (M):** Корем · Любовни дръжки · Гърди · Ръце · Цялото тяло
**Options (F):** Корем · Талия · Ханш · Бедра · Ръце · Цялото тяло

---

### 6. Activity level
**Headline:** „Колко активен/-на си през седмицата?"
**Type:** auto-advance
**Options:**
- 🛋️ Почти не се движа
- 🚶 Лек активен/-на — рядко тренировки
- 🏃 Умерено — 2-3 тренировки седмично
- 💪 Много — 4+ тренировки седмично

---

### 7. Daily movement
**Headline:** „Какво описва твоя ден?"
**Type:** auto-advance
**Options:**
- 💻 Седяща работа, 8+ часа на стол
- 🚶 Прав/-а през повечето време
- 🔨 Физическа работа

---

### 8. Sleep
**Headline:** „Как спиш?"
**Type:** auto-advance
**Options:**
- 😴 По-малко от 5 часа
- 😐 5-6 часа
- 🙂 6-7 часа
- 😌 7-8 часа
- ✨ Над 8 часа

---

### 9. Stress
**Headline:** „Колко стрес имаш?"
**Type:** auto-advance
**Options:**
- 🧘 Нисък
- 😅 Среден — има моменти
- 😰 Висок — често съм напрегнат/-а
- 🔥 Изгарящ — не мога да се отпусна

---

### 10. Water intake
**Headline:** „Колко вода пиеш на ден?"
**Type:** auto-advance
**Options:**
- Под 1 литър
- 1-2 литра
- 2-3 литра
- Над 3 литра

---

### 11. Diet style
**Headline:** „Как се храниш сега?"
**Type:** auto-advance
**Options:**
- 🍕 Ям каквото ми се яде
- 🥗 Опитвам се да внимавам
- 📋 Следвам конкретен план
- 🔄 Карам йо-йо диети
- 🤷 Нямам никаква система

---

### 12. What you've tried (multi-select)
**Headline:** „Какво си пробвал/-а досега?"
**Type:** multi-select chips, „Продължи" button
**Options:**
- Фитнес зала
- Диети
- YouTube програми
- Хранителни добавки
- Личен треньор
- Нищо още

---

### 13. INTERSTITIAL CARD
**No question** — full-screen card.
**Visual:** stat or photo collage
**Headline:** „💪 Над 10 000 души преминаха същия път с Dr.Fit"
**Body:** „98% казват, че проблемът не беше волята им. Беше планът."
**CTA:** „Продължи →"

---

### 14. Hunger pattern
**Headline:** „Кога ядеш повечето си храна?"
**Type:** auto-advance
**Options:**
- 🌅 Сутрин — закуската е най-голяма
- ☀️ На обяд
- 🌙 Вечер — често пропускам закуска
- 🍴 Хапвам по малко цял ден

---

### 15. Energy levels
**Headline:** „Как е енергията ти?"
**Type:** auto-advance
**Options:**
- ⚡ Стабилна — издържам докрай
- 🔋 Падам следобед
- 😴 Уморен/-а съм почти винаги
- ☕ Държа се с кафе

---

### 16. Cravings
**Headline:** „След ядене ти се иска още?"
**Type:** auto-advance
**Options:**
- 🍫 Сладко
- 🥨 Солено
- 🍰 И двете
- ✋ Не — наситен/-а съм

---

### 17. Bloating
**Headline:** „Подуваш ли се след хранене?"
**Type:** auto-advance
**Options:**
- Често
- Понякога
- Рядко
- Никога

---

### 18. Body temperature
**Headline:** „Как си с температурата?"
**Type:** auto-advance
**Options:**
- 🥶 Често ми е студено (особено ръце/крака)
- 🌡️ Нормално
- 🥵 Често ми е топло, потя се лесно

---

### 19. Past best result
**Headline:** „Колко тегло си свалял/-а в най-добрата си форма?"
*(skip за Avatar 05)*
**Type:** auto-advance
**Options:**
- Под 5 кг
- 5-10 кг
- 10-20 кг
- Над 20 кг
- Никога не съм опитвал/-а сериозно

---

### 20. INTERSTITIAL STAT CARD
**No question** — full-screen card.
**Headline:** „🎯 92% от хората с твоя профил виждат първи резултати в първите 30 дни"
**Body:** „Това е силата на персонализацията. Ще ти покажем точно защо."
**CTA:** „Продължи →"

---

### 21. Motivation (multi-select)
**Headline:** „Защо искаш да се промениш точно сега?"
**Type:** multi-select chips
**Options:**
- За здраве
- За партньора/-ката
- За да се харесвам на снимки
- За децата
- Имам конкретно събитие
- Стига вече

---

### 22. Target date
**Headline:** „До кога искаш да достигнеш целта?"
**Type:** date picker + quick chips
**Quick chips:**
- 1 месец
- 3 месеца
- 6 месеца
- 1 година

---

### 23. Blockers (multi-select)
**Headline:** „Какво те спира досега?"
**Type:** multi-select chips
**Options:**
- Нямам време
- Нямам план
- Нямам подкрепа
- Скъпо ми е
- Не знам откъде да започна
- Страх ме е, че няма да издържа
- Пробвал/-а съм и не върви

---

### 24. Height / weight / target
**Headline:** „Последна стъпка — твоите числа"
**Type:** combined 3-input screen
**Inputs:**
- Височина (см) — slider 140-220
- Тегло сега (кг) — input 40-200
- Целево тегло (кг) — input 40-200 *(skip за Avatar 05 → „Колко искаш да качиш?" с буфер)*
**Toggle:** см/кг ↔ inches/lbs

---

### 25. CALCULATING SCREEN
**Animated 8-12s, sticky red countdown stops, full-screen overlay**
**Headline:** „Анализираме твоя метаболитен профил..."
**Progress milestones (auto-cycling):**
1. „Изчисляваме BMI и метаболитна възраст..."
2. „Сравняваме с 10 000+ подобни профила..."
3. „Подбираме оптималната тренировъчна програма..."
4. „Готово ✓"

---

### 26. EMAIL CAPTURE
**Headline:** „Твоят 90-дневен план е готов"
**Sub:** „Въведи email-а си — изпращаме ти плана + достъп до приложението"
**Fields:**
- Email (required)
- Телефон (optional)
**Microcopy под бутона:** „🔒 Без спам. Можеш да се отпишеш с един клик."
**Bтн:** „Виж моя план →"

→ POST to `/api/lead` → email + KV/JSON store → Result page.

---

## Result + Paywall page (`/plan`)

Layout reuses live `/book` design language (numbered sections, sticky countdown, red gradient CTA, бонус blocks, ✓/✗ comparison).

### Hero — personalized headline by avatar

| Avatar | Headline | Sub |
|---|---|---|
| 01 Overweight Man | „Готов си да свалиш **[X] кг** за 90 дни" | „Без глад. Без зала. С план." |
| 02 Overweight Woman | „Готова си да свалиш **[X] кг** за 90 дни" | „Без йо-йо. Без забрани. С план който работи за жени." |
| 03 Skinny-Fat Man | „Готов си да трансформираш тялото си за 90 дни" | „Едновременно сваляш мазнини и изграждаш мускули." |
| 04 Skinny-Fat Woman | „Готова си да се стегнеш за 90 дни" | „Стегнат корем, дефинирани форми, без екстремни диети." |
| 05 Skinny Man | „Готов си да качиш **[X] кг** чиста мускулна маса за 90 дни" | „Контролирана анаболна програма за хардгейнъри." |

### Visual: BMI + projected curve
Chart.js line chart: тегло сега → 30 / 60 / 90 дни

### 01 — Защо стандартните програми не работят за теб
4 bullets generated from avatar + answers:
- „Спал/-а си {sleep_answer} часа" → лош метаболитен сигнал
- „{stress_level} стрес" → завишен кортизол
- „{diet_style}" → инсулинов дисбаланс
- „{past_attempts}" → не са таргетирали хормоналния корен

### 02 — Какво включва твоят 90-дневен план
- ✓ Индивидуален хранителен план
- ✓ Персонализирана тренировъчна програма
- ✓ Неограничен чат с треньор *(бонус за първите 10 днес)*
- ✓ Достъп до `app.dr-fit.co`

### 03 — Без план срещу С Dr.Fit план
Comparison block (✗ / ✓), 5 реда — генерирани от blockers + past attempts.

### 04 — Гаранция: плащаш 0 EUR
- Регистрираш се с 49 EUR
- Завършваш 90 дни
- Качваш видео отзив + преди/след снимки
- Връщаме ти 49 EUR

### 05 — Истории като твоята
3 testimonial cards, филтрирани по gender + body-type (избираеми от пула: Andrey, Gabriel, Misho, Yoanna, Ralitsa, Katerina).

### Sticky red urgency bar (top)
„Само за първите 10 абонати днес — изтича след `09:42`"

### Final CTA
Red gradient button: „Започни моите 90 дни →"
→ `https://app.dr-fit.co/checkout?productId=prod_SUUVgFxdaBvsl1&flow=full_price&regularPriceId=price_1Skjf0GDcYd0F03cY92YRDRX&lang=bg&avatar=01`

---

## Tracking events

| Event | When | Payload |
|---|---|---|
| `ViewContent` | every step view | `step_id`, `avatar` (when known) |
| `Lead` | email submit | `email`, `avatar`, all answers |
| `InitiateCheckout` | CTA click on `/plan` | `avatar`, target Stripe ID |
| `Purchase` | Stripe success (webhook) | order details |

Pixel ID: `1054275422812594` (Meta). Server-side CAPI: token TBD.

---

## What's still TBD

- GA4 ID
- Meta CAPI access token + test event code
- Silhouette images (3 male + 2 female) — need brand-consistent illustrations
- Body-diagram SVG with tappable zones
- Subdomain (`quiz.dr-fit.co` recommended)
- Stripe checkout product split for Avatar 05 (Skinny Man) if separate SKU later
