# Design Brief: Dr.Fit Quiz Redesign

> **You are a senior product designer.** Your job is to design the complete end-to-end UX/UI for a 27-step Bulgarian fitness quiz. The output should be a coherent design system across every screen, with strong visual hierarchy and conversion-focused emotional beats. Treat this as a flagship project — show what you would actually ship.

---

## 1. Product

**Dr.Fit** is a Bulgarian-language 90-day fitness program. The user lands on a website, takes a 27-step quiz, and at the end is asked for their email to receive a personalized plan. Behind the email gate is a fully-refundable 49 EUR one-time payment that the user gets back on completion of the program (the offer is "send before/after photos and a short video at day 90, get your 49 EUR back + community access").

The quiz output is a **personalized 90-day plan** that uses Dr.Fit's branded mechanism IP:

- **Carb-Cycling / Въглехидратна ротация** — alternating low/high carb days
- **Time-Under-Tension / Време под напрежение** — controlled rep tempo
- **AfterBurn / Последващо изгаряне** — 48-hour post-workout fat-burn window
- **The Four Hormones / 4-те хормона** — insulin, leptin, ghrelin, cortisol balancing

The quiz routes the user into one of **5 avatars** that drive plan personalization:

| Avatar | Profile | Program angle |
|---|---|---|
| 01 | Overweight Man | Fat-loss (AfterBurn-led) |
| 02 | Overweight Woman | Fat-loss (female metabolism focus) |
| 03 | Skinny-Fat Man | Recomposition (lose fat + build muscle) |
| 04 | Skinny-Fat Woman | Lean-tone (definition without major weight loss) |
| 05 | Skinny Man | Lean-gain (controlled mass for hardgainers) |

---

## 2. Audience

- **Country:** Bulgaria. Language: Bulgarian, informal "ти" pronoun throughout.
- **Age:** 25–55, mixed genders.
- **Mindset:** Has tried fitness apps, gym memberships, diets — none stuck. Skeptical of generic "lose weight in 30 days" promises but motivated by social proof and personalization. Pays attention to numbers ("how much can I actually lose?") and community ("did people like me do this?").
- **Device:** ~85% mobile (375–414 px wide), ~15% desktop. Mobile-first non-negotiable.
- **Cultural notes:** Bulgarian fitness culture borrows English jargon ("кардио", "ват", "сет", "реп") but resists overly American hype. Soft confidence beats hard sell.

---

## 3. Brand DNA

**What Dr.Fit IS:**
- Product brand, not coach brand. There is **no founder face**. The mechanism is the hero, not a person.
- Anti-blame framing: *"Не е била волята. Било е биологията."* ("It wasn't your willpower. It was your biology.")
- Specific, concrete numbers in copy. ("15+ кг", "90 дни", "10 000 души".)
- Honest pricing, loud: 49 EUR upfront, fully refundable. This is the #1 differentiator from BetterMe-style funnels with hidden trials.

**What Dr.Fit IS NOT:**
- Not a Founder Story. Don't invent or reference a coach persona.
- Not medical. Use mechanical metaphors ("ресет", "рестартираш"), not "лекува" / "лечение".
- Not BetterMe-cloned. We're inspired by their visual fluency but our brand is warmer: cream/paper canvas, single brand-red punch, editorial-magazine confidence.

**Visual identity:**
- **Background:** off-white `#FAFAFA` page background. Cards on warm cream `#F8F4EE` ("paper-warm").
- **Primary accent:** brand-red `#A50015` (deep) → `#E50914` (bright). One color, used sparingly: selected state, CTAs, eyebrow rules, key data emphasis.
- **Dark surfaces (sparingly):** charcoal `#2B3138` for the calculation/loading screen and contrast moments.
- **Typography (already chosen, you can reuse or replace):** Manrope (sans, headings + body), Playfair Display (display serif, used sparingly for editorial moments), Geist Mono (numbers, data, eyebrow labels).
- **No teal, no cyan, no purple gradients.** No glass morphism. No "AI feature card" aesthetic.

---

## 4. What we want from you

A **complete design system** for the 27-step quiz, delivered as:

1. **High-fidelity mockups** for every distinct screen template (you can group similar question types — e.g. one mockup per layout pattern, not one per question, but make sure every distinct layout pattern is shown).
2. **A single canonical screen** (your hero / signature shot) that captures the brand at its strongest.
3. **A motion / interaction note** per pattern: how does selection feel? How do screens transition? How does the loader build tension?
4. **Trust beats**: where exactly do you place social proof, testimonials, projection visuals, and reassurance copy across the 27 steps to maximize conversion at the email gate?
5. **A short rationale** (max 200 words per pattern) explaining the design choices you made and the alternatives you rejected.

You may use any visual style or framework that fits the brand. We're not asking you to replicate any reference — we want to see what you would do.

---

## 5. Visual references (inspiration, not prescription)

The user has been studying **BetterMe's calisthenics quiz** as a benchmark. The patterns they consistently respond to:

- **Half-screen photo + stacked text options:** model photo on the right (or as a background fade), dark option pills on the left. Used on most question screens.
- **Photo-card grid:** body type / age / body goal screens — 4 photo cards in a 2×2, one per option, with a small label pill at the bottom of each card.
- **Encouragement interstitials:** between question clusters, screens like *"You're going to crush this!"* or *"Looks like you have endomorph body type"* — bold headline + supporting paragraph + a single photo.
- **Stat / social-proof interstitial:** *"Over 780,000 men in their 30s have already tried..."* + group photo + AS FEATURED IN logo strip.
- **App mockup screen:** *"The perfect solution is right here!"* with three tilted phone mockups showing the actual app UI.
- **Anatomical muscle-highlight:** *"What are your target zones?"* — a model with selected muscle groups overlaid in red.
- **Single consistent model across the entire flow:** the same face/body in every photo, posing differently per question. This continuity is the BetterMe move that makes the quiz feel like a journey with one guide, not a stack of disconnected screens.

We do NOT want to clone BetterMe. Specifically reject:
- Pure black backgrounds (too aggressive for our paper-cream brand).
- English-only fitness jargon ("Swole", "Shredded") — use natural Bulgarian.
- Generic copy ("burn fat", "get in shape") — keep our specific 4-hormone / AfterBurn / Carb-Cycling IP.

---

## 6. The full 27-step quiz

Below is every step in order. For each: the step type (informs layout choice), the headline (BG), and the option list / input shape. Where the answer differs by gender, both sets are listed. **The Bulgarian copy is the production copy — design AROUND it, do not translate it.**

### Step 1 · gender · single-select (2 options)
**Headline:** "Започваме с теб"
**Subheadline:** "Кой/коя си?"
- Мъж (male)
- Жена (female)

### Step 2 · goal · single-select (3 options per gender)
**Headline:** "Каква е твоята цел?"

**Male:**
- Сваля сериозно тегло — *15+ кг за 90 дни*
- Свали + изгради мускули — *Преоформяне на тялото*
- Качи чиста маса — *Програма за хардгейнъри*

**Female:**
- Сваля сериозно тегло — *15+ кг за 90 дни*
- Свали малко + се стегни — *Лек дефицит + тонизиране*
- Само се стегни и дефинирай — *Без сваляне на тегло*

### Step 3 · bodyType · single-select (3 male / 2 female)
**Headline:** "Кое тяло описва теб днес?"

**Male:** С наднормено тегло / Слаб с малко мазнини / Слаб
**Female:** С наднормено тегло / Стройна, но не стегната

### Step 4 · age · single-select (4 options)
**Headline:** "На колко си?"
- 18-29 / 30-39 / 40-49 / 50+

### Step 5 · problemAreas · multi-select (6 options per gender, min 1)
**Headline:** "Кои зони те притесняват най-много?"

**Male:** Корем / Любовни дръжки / Гърди / Гръб / Ръце / Цялото тяло
**Female:** Корем / Талия / Ханш / Бедра / Ръце / Цялото тяло

### Step 6 · activity · single-select (4 options)
**Headline:** "Колко активен/-на си през седмицата?"
- Почти не се движа — *Седяща работа, без спорт*
- Лек активен/-на — *Рядко тренировки*
- Умерено — *2-3 тренировки седмично*
- Много активен/-на — *4+ тренировки седмично*

### Step 7 · jobMovement · single-select (3 options)
**Headline:** "Какво описва твоя ден?"
- Седяща работа, 8+ часа на стол — *Малко движение през деня*
- Прав/-а през повечето време — *Без редовни тренировки*
- Физическа работа — *Активен ден*

### Step 8 · sleep · single-select (5 options)
**Headline:** "Как спиш?"
- Под 5 часа — *Хронично недоспиване*
- 5-6 часа — *Под минимума*
- 6-7 часа — *На границата*
- 7-8 часа — *Здравословно*
- Над 8 часа — *Дълъг сън*

### Step 9 · stress · single-select (4 options)
**Headline:** "Колко стрес имаш?"
- Нисък — *Спокоен/-йна съм*
- Среден — *Има моменти*
- Висок — *Често съм напрегнат/-а*
- Изгарящ — *Не мога да се отпусна*

### Step 10 · water · single-select (4 options)
**Headline:** "Колко вода пиеш на ден?"
- Под 1 литър — *Често забравяш*
- 1-2 литра — *Стандартно*
- 2-3 литра — *Стабилен прием*
- Над 3 литра — *Активен/-на си*

### Step 11 · dietStyle · single-select (5 options)
**Headline:** "Как се храниш сега?"
- Ям каквото ми се яде — *Без правила*
- Опитвам се да внимавам — *Гледам по-чисто, без строг план*
- Следвам конкретен план — *Имам ясна структура*
- Опитвам, но не издържам — *Тръгвам силно, после спирам*
- Нямам никаква система — *Храня се хаотично*

### Step 12 · pastAttempts · multi-select (6 options, min 1)
**Headline:** "Какво си пробвал/-а досега?"
- Фитнес зала — *Карта или абонамент*
- Диети — *Кето, IF, нискокалорично*
- YouTube програми — *Безплатни тренировки*
- Хранителни добавки — *Протеин, креатин, витамини*
- Личен треньор — *Платена индивидуална работа*
- Нищо още — *Започвам отначало*

### Step 13 · interstitial-1 · social-proof interstitial
**Headline:** "Над 10 000 души преминаха същия път с Dr.Fit"
**Body:** "98% казват, че проблемът не беше волята им. Беше планът."
**CTA:** "Продължи"

This is a stat-driven trust beat. **Place a community photo + AS-FEATURED-IN trust strip** here (e.g. Forbes-style, GQ-style, Bulgarian publication stand-ins). The user has explicitly liked this pattern.

### Step 14 · mealTiming · single-select (4 options)
**Headline:** "Кога ядеш повечето си храна?"
- Сутрин — *Закуската е най-голяма*
- На обяд — *Балансирано в средата*
- Вечер — *Често пропускам закуска*
- Хапвам по малко цял ден — *Без ясна структура*

### Step 15 · energy · single-select (4 options)
**Headline:** "Как е енергията ти?"
- Стабилна — *Издържам докрай*
- Падам следобед — *Имам ясен спад*
- Уморен/-а съм почти винаги — *Хронична умора*
- Държа се с кафе — *Без него не мога*

### Step 16 · cravings · single-select (4 options)
**Headline:** "След ядене ти се иска още?"
- Сладко — *Десерт или плод*
- Солено — *Нещо хрупкаво*
- И двете — *В различни моменти*
- Не, наситен/-а съм — *Спирам без усилие*

### Step 17 · bloating · single-select (4 options)
**Headline:** "Подуваш ли се след хранене?"
- Често — *Почти всеки ден*
- Понякога — *След тежки храни*
- Рядко — *Изключения са*
- Никога — *Нямам проблем*

### Step 18 · bodyTemp · single-select (3 options)
**Headline:** "Как си с температурата?"
- Често ми е студено — *Особено ръце и крака*
- Нормално — *Без отклонения*
- Често ми е топло — *Потя се лесно*

### Step 19 · pastBest · single-select (5 options)
**Headline:** "Колко тегло си свалял/-а в най-добрата си форма?"
- Под 5 кг / 5-10 кг / 10-20 кг / Над 20 кг / Никога не съм опитвал/-а сериозно

### Step 20 · interstitial-2 · result-promise interstitial
**Headline:** "92% от хората с твоя профил виждат първи резултати в първите 30 дни"
**Body:** "Това е силата на персонализацията. Ще ти покажем точно защо."
**CTA:** "Продължи"

This is a results-promise trust beat. **Place a single transformation testimonial here** — one face, name, age, kg lost, days. Anchors the 92% claim to a real person.

### Step 21 · motivation · multi-select (6 options, min 1)
**Headline:** "Защо искаш да се промениш точно сега?"
- За здраве — *Дълъг и активен живот*
- За половинката си — *Иска ми се да впечатля*
- За да се харесвам на снимки — *Да съм уверен/-а*
- За децата — *Да съм пример*
- Имам конкретно събитие — *Сватба, ваканция, рожден ден*
- Стига вече — *Готов/-а съм за промяна*

### Step 22 · targetDate · date input
**Headline:** "До кога искаш да достигнеш целта?"
Quick-pick chips: 1 месец / 3 месеца / 6 месеца / 1 година. Plus a freeform date picker for precise dates.

The user already accepted a strong design here: a hero "date card" showing the chosen date in giant Manrope mono, with a metadata pill below ("≈ 14 седмици · 90 дни"). You can keep this or propose better.

### Step 23 · blockers · multi-select (7 options, min 1)
**Headline:** "Какво те спира досега?"
- Нямам време — *Дните минават бързо*
- Нямам план — *Без ясна структура*
- Нямам подкрепа — *Сам/сама съм в това*
- Скъпо ми е — *Бюджетът е стегнат*
- Не знам откъде да започна — *Прекалено много информация*
- Страх ме е, че няма да издържа — *Притеснява ме провал*
- Пробвал/-а съм и не върви — *Не получавам резултат*

### Step 24 · metrics · numeric inputs (3 inputs)
**Headline:** "Последна стъпка: твоите числа"
- Височина (140–220 см)
- Тегло сега (40–200 кг)
- Целево тегло (40–200 кг)

### Step 25 · projection-preview · trust + visualization beat (NEW)
**Headline:** "Така изглежда твоят път"
**Subheadline:** "Готови сме с плана. Един последен поглед, преди да се захванем."
**Reassurance line:** "Планът ти е готов след минута."
**CTA:** "Виж моя план"

This is the **pre-paywall conversion moment**. It needs to:
- Show the user's specific kg-delta and target date as a giant readable result ("Свали 15 кг до 15 август").
- Show a projection chart (curve from current → target weight over 90 days, eased).
- Show ONE testimonial card — someone like them who lost a similar amount — to anchor the abstract curve to a real face.
- Have a small italic reassurance line above the CTA so the user feels the loader is the last step.

This screen is THE most important conversion beat before the email gate. Design it like a flagship moment.

### Step 26 · calculating · loading screen with mid-flow questions (12 seconds)
**Headline:** "Анализираме твоя метаболитен профил"
**Milestones (cycled during loading):**
- "Изчисляваме BMI и метаболитна възраст"
- "Сравняваме с 10 000+ подобни профила"
- "Подбираме оптималната тренировъчна програма"
- "Готово"

**The loader is interrupted twice with quick questions** that feel like personalization-in-progress:

- **At 30% progress:** "Кога предпочиташ да тренираш?" → Сутрин / Обед / Вечер
- **At 65% progress:** "С какво оборудване разполагаш?" → Само у дома / Зала / И двете

Design the loader as a "lab analysis" moment. The current implementation uses a 4-hormone diagram (insulin / leptin / ghrelin / cortisol nodes around a central body silhouette, activating one by one as progress advances, with realistic-looking metric values appearing under each node like "104.2 mIU/L"). Feel free to keep this or propose better. The mid-flow questions should feel like a natural beat in the analysis, not a jarring interrupt.

### Step 27 · email · email gate (final paywall)
**Headline:** "Твоят 90-дневен план е готов"
**Subheadline:** "Въведи email-а си и ти изпращаме плана плюс достъп до приложението"
**Inputs:** Email (required) + Phone (optional)
**Reassurance:** "Без спам. Можеш да се отпишеш с един клик."
**CTA:** "Виж моя план"

This is the final paywall before the user sees their personalized plan. Design it to feel **earned, not blocked**. The user has just completed 26 steps and seen their projection — this is the natural payoff moment, not a wall.

A pattern that has tested well: a **blurred preview** of 3 plan cards (avatar profile / BMI projection / weekly program grid) sitting above the form, with a centered lock icon + "Открий пълния план" badge. The user sees the shape of their plan and feels it's already built, just locked. Keep this idea or propose something better.

---

## 7. Constraints

- **Bulgarian language only.** All copy in BG. (Don't translate; keep what's above.)
- **Mobile-first.** Design for 375 × 812 viewport first. Tablet (768) and desktop (1280) are graceful upgrades.
- **No native browser confirms or alerts.** Custom in-app dialogs only.
- **Respect `prefers-reduced-motion`.** Provide a static fallback for any animation.
- **Accessibility:** WCAG AA minimum. Touch targets ≥ 44 px. Visible focus rings. No color-only state indicators.
- **Performance:** keep total quiz JS payload under ~200 kB initial. SVG illustrations preferred over photos for option cards if photo assets aren't available, but the projection-preview, interstitials, and email-gate teaser should use real photos when possible.
- **No founder photo.** No real-person attribution. Testimonials are pseudonymous BG names ("Андрей, 38, София") with photos.

---

## 8. Specific user-validated preferences

These are decisions the user has already made — design AROUND them, don't relitigate:

- **Half-screen photo + text options is the preferred layout for non-visual question types** (sleep, stress, dietStyle, energy, cravings, bloating, mealTiming, motivation, blockers, pastBest). The model is on the right; the option pills stack on the left.
- **Photo cards are the preferred layout for visual-identifying question types** (gender, bodyType, age, problemAreas, possibly a NEW "body goal" step you can propose).
- **Encouragement / diagnosis interstitials between question clusters** add empathic beats. Two suggested insertion points: after the activity cluster ("Готов/-а си за това!") and after the body-type cluster ("Имаш X тип тяло").
- **A single consistent model per gender** across all photo slots creates BetterMe-style continuity. We're committing to two reference faces: a Dr.Fit Male and a Dr.Fit Female.
- **The projection-preview screen (step 25) goes BEFORE the calculating loader, not after.** The user wants motivation to land first, then the loader feels earned.
- **Mid-loading questions (workoutTime, equipment) are non-negotiable** — they're load-bearing for the "personalization-in-progress" feel.
- **No icons in the goal step (step 2).** The user has tried icons there and rejected them. Current design uses positional numbers (01 / 02 / 03) on each card with just typographic differentiation. You may propose better but should avoid icons or color-coded badges per option.

---

## 9. Open questions for the designer

We genuinely don't have a final answer on these — propose your best take:

1. **The body-type step (step 3) and a possible NEW "body goal" step.** The user is open to splitting the body-type assessment into "what you are now" and "what you want to be" (4 photo cards: Тонизиран / Атлетичен / Стегнат и сух / Мускулест for males, parallel female set). Worth doing? Or does it pad the quiz too much?
2. **The anatomical muscle-highlight pattern** for the problemAreas step (step 5) — model on the right with selected muscle groups overlaid in red. Visually beautiful but high effort. Worth the build, or stick with photo cards?
3. **App-mockup interstitial** somewhere near the end (showing tilted phone screenshots of the actual /plan page) — credibility moment vs. extra step. Where would you place it, if at all?
4. **The 4-hormone calculating screen** — keep, simplify, or replace entirely with something else (e.g. a body-composition meter, or a simple progress ring)?
5. **The email gate's blurred preview** — useful pattern, or have you seen something better?
6. **Anywhere we're padding the quiz?** Look at the 27 steps and tell us which feel redundant or low-information.

---

## 10. Deliverable format

Whichever fits your tooling:

- High-fidelity Figma frames (preferred — 1 frame per pattern, named clearly).
- HTML / React / Tailwind code in a single file we can paste.
- Annotated wireframes if you want to be looser at the visual layer.

Plus the per-pattern rationale (max 200 words each) and the trust-beat placement map (which steps carry which trust beat: social proof / testimonial / projection / app-mockup / encouragement).

Show your work. We want to compare your take against what we've built.
