# Dr.Fit Quiz — Handoff

> Last updated: end of Phase D · Tier 1 work session.
> Branch: `feat/cards-redesign`. Dev: `PORT=3010 npm run dev`.

## TL;DR

The quiz funnel is structurally complete and visually upgraded across three landed phases (A/B/C/D-Tier-1). What remains is **adopting the full BetterMe-style photo-led pattern (Tier 2)**, generating + dropping in the actual photo assets, and optional Tier 3 polish (anatomical highlight, blurred-preview swap on the email gate). Everything below is paste-ready guidance for the next builder.

---

## What's done

### Phase A/B/C — Foundation
- Icon-row variant + `OptionRow` component for non-visual question types
- `GoalSelect` numbered editorial cards for step 2 (the goal step rejects icons and color tones; positional 01/02/03 numbers are the visual)
- `ConfirmDialog` (replaces native `window.confirm`) — fires on back-from-email-gate to prevent re-running the analysing screen
- `genderize()` helper resolves Bulgarian `/-` shorthand into proper male/female forms across every headline, sub, label
- `classifyAvatar` is now a safety net — never returns `'blocked'`. Every gender × goal × bodyType lands on a real avatar.
- `/blocked` page deleted. The redirect was removed from `QuizContainer`.
- Card centering rule (last odd item in a 2-col grid centers itself at one-column width via `[&>:last-child:nth-child(odd)]:col-span-2 ...:w-[calc(50%-0.375rem)]:justify-self-center`).
- Consistent OptionCard min-height was REVERTED — image cards across the quiz no longer have unwanted empty space below text.

### Phase D · Tier 1 — Pre-paywall trust + mid-loading personalisation
- `lib/projection.ts` — shared `easeOutQuad`, `projectWeight`, `denseProjection`, `milestoneProjection`, `buildCurvePath`. Both the full plan-page `BmiProjection` and the new compact `MiniProjectionChart` consume from here.
- `components/quiz/MiniProjectionChart.tsx` — compact (≤ 360 px wide) projection curve, paper-warm card, brand-red curve with end-node pulse.
- `components/quiz/TestimonialCard.tsx` — horizontal card. Photo-or-initial on left, name + city + age + 5★ + kg/days stat + mechanism on right.
- `lib/testimonials.ts` got `pickProjectionTestimonial(gender, kgDelta)` — picks the testimonial whose `kgChange` is in the same direction and closest in magnitude to the user's desired delta.
- `components/quiz/ProjectionPreview.tsx` — new screen between metrics (24) and calculating (now 26). Hero kg/date line, mini chart, testimonial, italic reassurance, big red CTA.
- `components/quiz/MidLoadingQuestion.tsx` — full-screen overlay rendered ON TOP of the calculating screen. Eyebrow + headline + 3 large option pills.
- `components/quiz/CalculatingScreen.tsx` — pause logic via `paused` state + `progressRef`. Pauses RAF at unanswered milestones, surfaces the question, resumes on answer with `start = performance.now() - atProgress * durationMs`.
- `lib/questions.ts` — added `'projection'` to `StepType`, inserted step 25 (projection-preview), renumbered calculating 25→26 and email 26→27. Bumped calculating duration from 9s to 12s. Added `midQuestions` array with `workoutTime` (at 30%) and `equipment` (at 65%).
- `components/quiz/QuizContainer.tsx` — new dispatch branch for `'projection'`. `CalculatingScreen` now receives midQuestions + onMidAnswer + a live stepLabel.
- BG copy polish (5 lines): step 2 subs, Avatar 05 sub, BmiProjection categoryCopyBg lines.

Typecheck green. Manual walkthrough pending — the user said they'd verify in-browser themselves.

---

## What's next — Phase D Tier 2

The big remaining work is the **BetterMe photo-led layout adoption**. Reference: `docs/refs/betterme/README.md`.

### Tier 2.1 — `SplitPhotoSelect` component (priority)

The dominant BetterMe layout: half-screen photo on the right, stacked text options on the left.

**File:** `components/quiz/SplitPhotoSelect.tsx`

Props:
```ts
interface Props {
  options: OptionSpec[];
  selected?: string;                // for single-select
  selectedMulti?: string[];         // for multi-select
  onPick?: (value: string, optionId: string) => void;
  onToggle?: (value: string) => void;
  onContinue?: () => void;
  multiSelect?: boolean;
  imageSrc: string;                 // step-level photo
  imageAlt?: string;
}
```

Layout:
- **< 640 px:** photo absolutely positioned full-bleed in the card, options stacked over a left-fade gradient. Or stack: text options on top, photo below — depends on photo aspect.
- **≥ 640 px:** 2-col grid `1fr 1fr`, options on left, photo on right.
- Option pills: dark graphite (`var(--color-graphite)`) bg with white text. Selected = brand-red bg with white text (matching existing OptionRow selected state).

**Steps to switch to `cardVariant: 'split-photo'`:**
- Step 8 sleep
- Step 9 stress
- Step 11 dietStyle
- Step 14 mealTiming
- Step 15 energy
- Step 16 cravings
- Step 18 bodyTemp
- Step 19 pastBest
- Step 21 motivation (multi-select)
- Step 23 blockers (multi-select)

Add `'split-photo'` to `CardVariant` type in `lib/questions.ts`. Add `image: string` field to `StepSpec`. Dispatch the new variant in `SingleSelect` / `MultiSelect`.

### Tier 2.2 — `PhotoOptionCard` for body type / age / NEW body goal

**File:** `components/quiz/PhotoOptionCard.tsx`

Layout (refs `01-age-photo-grid.png`, `06-bodytype-photo-grid.png`, `07-bodygoal-photo-grid.png`):
- 2×2 grid (or 4×1 on wide desktops)
- Each card: full-bleed photo, paper-warm pill at bottom-left containing label + radio circle (or check when selected)
- Photo aspect: 3:4

**Apply to:**
- Step 3 bodyType — replace placeholder silhouettes with real photos (Slots D–G in prompt library below)
- Step 4 age — replace placeholder SVG with real age-tier photos (Slots H–K)
- **NEW step:** body goal — "Каква форма искаш да постигнеш?" with 4 photo cards (Слот L–O). Insert as step 4 (renumber forward).

For body-goal, use `optionsByGender` because male and female aesthetic targets differ.

### Tier 2.3 — Encouragement interstitials between clusters

Pattern (refs `03-encouragement-pushup.png`, `10-endomorph-diagnosis.png`, `13-encouragement-flex.png`):
```
[ Bold headline (Manrope ExtraBold, clamp 2rem-3rem) ]
[ One-paragraph supporting copy with key phrase bolded ]
[ Photo card — model in pose that matches the message ]
[ CTA pill ]
```

**File:** `components/quiz/EncouragementCard.tsx`. Refactor `InterstitialCard` to dispatch by a new `interstitialKind: 'stat' | 'encouragement' | 'app-mockup'` field on `StepSpec`.

**Insert two:**

**E1 — after step 6 activity:**
```
Headline: "Готов/-а си за това!"
Body: "Програмата ни работи **за всяко ниво на форма**. Не е нужно да си трениран/-а — започваме оттам, където си днес."
Image: Slot P (model in plank/pushup pose)
CTA: "Продължи"
```

**E2 — after body type / body goal cluster:**
```
Headline: "Имаш ${bodyType} тип тяло"  (dynamic from answer)
Body: "Това означава, че ${programAngle-specific copy}. Планът ти е настроен точно за това."
Image: Slot Q (model in confident-stance pose)
CTA: "Продължи"
```

### Tier 2.4 — Visual upgrade to existing stat interstitials

**Step 13** ("Над 10 000 души преминаха същия път"):
- Add `image: '/images/photo/interstitial/community.webp'` (Slot R — group photo of 3 BG models)
- Add an "AS FEATURED IN"-style trust strip below the image: 3 monochrome SVG-text marks (e.g. `Forbes`, `GQ`, a Bulgarian fitness/wellness publication like `bTV Health`), divided by thin vertical lines

**Step 20** ("92% от хората с твоя профил..."):
- Add `image: '/images/photo/interstitial/results.webp'` (Slot S — single transformed model)
- Add a `testimonial` field on the step that drops in a `<TestimonialCard>` so the % claim is anchored to a face

### Tier 2.5 — App-mockup interstitial (NEW)

Pattern (ref `05-app-mockup.png`):
```
[ Eyebrow ]
[ Big headline ("Ето как изглежда твоят план") ]
[ Body copy ("персонализиран за теб" bolded) ]
[ Tilted phone-mockup card showing 2-3 phones at angles displaying actual /plan UI ]
[ CTA pill "Виж го целия" → next step ]
```

Insert as step ~25 (just before metrics — push everything else forward) OR right before the projection preview. Decide based on flow. The current renumbering table proposes step ~28 if added late.

For v1 the asset can be a simple SVG composite of phone frames + low-res screenshots of `/plan`. Let the user replace with a 3D render later.

### Tier 3 — Optional

#### Tier 3.1 — Anatomical highlight for problemAreas (step 5)

Pattern (ref `14-targetzones-anatomical.png`):

`components/quiz/AnatomicalSelect.tsx` — half-screen layout, anatomical SVG of male/female torso + arms + legs. Each muscle region (belly / chest / arms / back / legs / full body) is a separate `<g>` with red fill that toggles opacity based on selection.

**Asset:** 2 anatomical SVGs (male + female) with named groups for each region. Hand-drafting simplified shapes (rounded rectangles roughly placed on body regions) is fine for v1; commission proper anatomical line art later.

If this is too much scope, ship the existing image-card variant for problemAreas and revisit in a follow-up.

#### Tier 3.2 — Replace EmailGate's blurred preview with real "future you"

The `EmailGate` currently uses a `PlanTeaser` with abstract blurred mock cards. Once Slot F (the "future you" portrait) is generated, swap one of the abstract cards for the actual photo, blurred. The lock + reveal CTA stays.

One-component edit. Low risk. Ship after the photos are in hand.

---

## AI Image Prompt Library

The quiz uses a single consistent male model ("Стефан") and a single consistent female model ("Мария") across the flow — BetterMe's continuity strategy. Generate ONE base portrait per gender first; use Midjourney's `--cref <portrait-url>` (character reference) or Sora's character-consistency to lock the same face in every subsequent prompt. Testimonial slots use *different* faces (Иван, Десислава, plus a community group) to imply real-user diversity.

### Style anchor for ALL prompts

```
Photographic, editorial fitness-magazine grade, photoreal sharp.
Lighting: soft natural daylight or controlled studio light, mild rim light.
Background: solid charcoal grey (#2B3138) OR plain warm cream (#F8F4EE) — match the card it goes into.
Subject: Bulgarian / Eastern European in features, varied skin tones across slots.
Wardrobe: matte-black or charcoal athletic wear (T-shirts, joggers, shorts), no logos.
NO text overlays, NO logos, NO on-camera branded apparel.
Output: high-resolution PNG with alpha if photo card has paper-warm bg, otherwise full JPG.
```

### Reference portraits

#### Slot 0 — "Стефан" base reference (male)
```
Studio portrait of a Bulgarian / Eastern European man, 32 years old. Lean athletic build,
visible muscle definition without bodybuilder bulk (recomp aesthetic). Short dark brown hair,
clean shave or light stubble, brown eyes, natural skin tone. Plain charcoal-grey backdrop
(#2B3138). Wearing matte-black fitted athletic T-shirt, no logos. Three-quarter framing,
chest up, neutral confident expression. Soft natural daylight from camera-front-left, mild
rim light. Editorial fitness-magazine grade. 4:5 aspect ratio. Photoreal, sharp, no text.
```

Save as: `public/images/photo/ref/stefan.webp`.

#### Slot 0F — "Мария" base reference (female)
```
Studio portrait of a Bulgarian / Eastern European woman, 30 years old. Toned athletic
build, defined arms and core (lost ~12kg appearance, not chiselled). Shoulder-length
dark hair, brown eyes, natural skin tone. Plain warm cream backdrop (#F8F4EE). Wearing
minimal black athletic top, no logos, no jewellery. Three-quarter framing, chest up,
subtle confident smile. Soft natural daylight from camera-front, even fill. Editorial
fitness-magazine grade. 4:5 aspect ratio. Photoreal, sharp, no text.
```

Save as: `public/images/photo/ref/maria.webp`.

### Step photo slots

#### Slot A — Step 2 goal screen backdrop (Стефан, hands on hips, half-body)
```
[Стефан reference] standing relaxed, hands on hips, three-quarter body framing. Chest up
to thighs visible. Same charcoal backdrop. Same wardrobe. Calm confident gaze toward
camera. 9:16 portrait aspect.
```
Save as: `public/images/photo/step02-goal/m.webp` (and parallel `f.webp` from Мария).

#### Slot B — Generic split-photo backdrop (Стефан, three-quarter relaxed)
Used on step 8 sleep, step 11 dietStyle, etc.
```
[Стефан reference] standing in three-quarter view, arms relaxed at sides, looking off-camera
to the right. Full body framing. Same backdrop and wardrobe. 9:16 portrait.
```
Save as: `public/images/photo/split/m-relaxed.webp`.

#### Slot C — Energetic split-photo backdrop (Стефан, dynamic stretch)
Used on step 9 stress, step 15 energy.
```
[Стефан reference] mid-stretch (dynamic warm-up pose, one arm overhead), three-quarter
body. Same backdrop and wardrobe. Energetic but not strained expression. 9:16 portrait.
```
Save as: `public/images/photo/split/m-stretch.webp`.

#### Slots D–F — Step 3 bodyType male photo cards
- **D — "С наднормено тегло":** Bulgarian man, mid-30s, visibly overweight build (soft midsection, broad torso). Charcoal backdrop. Matte-black joggers, no shirt, neutral expression. Three-quarter body framing, chest to thighs. 3:4 aspect.
  Save as: `public/images/photo/step03-bodytype/m-overweight.webp`.
- **E — "Слаб с малко мазнини":** Bulgarian man, late 20s, skinny-fat build (slim limbs, slight midsection softness). Same backdrop + wardrobe. 3:4.
  Save as: `public/images/photo/step03-bodytype/m-skinny-fat.webp`.
- **F — "Слаб":** Bulgarian man, mid-20s, slim build. Same backdrop + wardrobe. 3:4.
  Save as: `public/images/photo/step03-bodytype/m-skinny.webp`.

#### Slot G — Step 3 bodyType FEMALE variant
```
Studio shot of a Bulgarian / Eastern European woman, mid-30s, visibly overweight build
(softer figure, broader silhouette). Warm-cream backdrop. Wearing matte-black athletic
top and joggers, no logos. Three-quarter body framing, neutral confident expression. 3:4.
```
Save as: `public/images/photo/step03-bodytype/f-overweight.webp`. Plus `f-skinny-fat.webp` per the female option list.

#### Slots H–K — Step 4 age photo cards (different model per tier)
Generate a different model per age range — three-quarter body, charcoal backdrop, matte-black athletic wear:
- **H — Age 18–29:** young athletic Bulgarian man, ~22yo
- **I — Age 30–39:** lean fit Bulgarian man, mid-30s
- **J — Age 40–49:** still lean, slightly more weathered, mid-40s
- **K — Age 50+:** silver-haired, fit, defined Bulgarian man, ~55

3:4 aspect each. Save as: `public/images/photo/step04-age/{18-29,30-39,40-49,50-plus}.webp`.

#### Slots L–O — NEW body-goal step photo cards (male)
4 target physiques. Same model basis where possible; vary physique by composition. 3:4 aspect, charcoal backdrop, matte-black shorts/joggers, no shirt:
- **L — "Тонизиран":** lean fit, no major muscle bulk
- **M — "Атлетичен":** balanced muscular athletic
- **N — "Стегнат и сух":** lean with high definition (cut)
- **O — "Мускулест":** muscular bulk (still natural, not bodybuilder)

Save as: `public/images/photo/step04b-bodygoal/m-{toned,athletic,shredded,bulk}.webp`. Female parallel set with feminine target physiques and warm-cream backdrop.

#### Slot P — Encouragement interstitial E1 ("Готов/-а си за това!")
```
[Стефан reference] in a low-impact plank or pushup hold pose on a charcoal mat, charcoal
backdrop. Three-quarter body framing, side angle. Calm focused expression, not strained.
4:3 aspect.
```
Save as: `public/images/photo/interstitial/encouragement-1.webp`.

#### Slot Q — Encouragement interstitial E2 ("Имаш X тип тяло")
```
[Стефан reference] standing confidently with arms crossed, three-quarter framing. Same
backdrop and wardrobe. Subtle smile. 4:3 aspect.
```
Save as: `public/images/photo/interstitial/encouragement-2.webp`.

#### Slot R — Step 13 community photo
```
Studio shot of three Bulgarian / Eastern European men standing shoulder to shoulder on
charcoal backdrop. Mixed ages 28–48 and mixed body types: lean muscular in the centre,
fit-but-larger on each side. Wearing matte-black athletic shorts, no shirts. Confident
neutral expressions. Soft daylight from front-left, mild rim. 3:2 aspect.
```
Save as: `public/images/photo/interstitial/community.webp`.

#### Slot S — Step 20 single transformation photo (Иван)
```
Studio portrait of a Bulgarian / Eastern European man, ~30, recomp athletic build (lean
with visible muscle definition). Charcoal backdrop. Wearing fitted matte-black T-shirt,
no logos. Three-quarter framing, direct confident gaze. 4:5 aspect.
```
Save as: `public/images/photo/interstitial/results.webp`.

#### Testimonial slot photos (square 1:1)
Used by `TestimonialCard.tsx`. Drop into `public/images/photo/testimonials/{id}.webp` matching the IDs in `lib/testimonials.ts`:
- `andrey.webp` — overweight male, 38, 90-day cut
- `gabriel.webp` — skinny-fat male, 32, 90-day recomp
- `misho.webp` — skinny male, 28, lean-gain
- `yoanna.webp` — overweight female, 41, 90-day cut
- `ralitsa.webp` — skinny-fat female, 34, lean-tone
- `katerina.webp` — skinny-fat female, 36, lean-tone

Each: a different face, square crop, 1:1 aspect. Backdrop matches gender (charcoal for males, warm cream for females). Subjects matching the listed kg-change profile.

#### Slot T — App-mockup interstitial (Tier 2.5)
```
3D rendering of three smartphone screens at ~15° tilt angles, slightly overlapping in a
group. Each phone displays a screenshot of the Dr.Fit /plan page. Phone bodies are
matte-black. Background: dark charcoal with soft directional lighting. 4:3 aspect.
```
Save as: `public/images/photo/interstitial/app-mockup.webp`.

For v1 you can take three screenshots of the actual `/plan` page on different scroll positions and composite them into a phone-frame template (Figma + Mockuuups Studio works fine).

---

## Renumbering plan after Tier 2 lands

Current (after Tier 1): 27 steps. After Tier 2 inserts (NEW body-goal step + 2 encouragement interstitials + app-mockup interstitial):

| New # | id | Notes |
|---|---|---|
| 1 | gender | unchanged |
| 2 | goal | unchanged |
| 3 | bodyType | photo-card grid |
| 4 | bodyGoal | **NEW** photo-card grid |
| 5 | age | photo-card grid |
| 6 | problemAreas | optionally upgraded to anatomical (Tier 3) |
| 7 | activity | unchanged |
| 8 | enc-1 | **NEW** encouragement interstitial |
| 9 | jobMovement | |
| 10–14 | sleep, stress, water, dietStyle, pastAttempts | sleep/stress/water/dietStyle move to split-photo |
| 15 | interstitial-1 | now stat + image + trust strip |
| 16–22 | mealTiming–interstitial-2 | several move to split-photo |
| 23 | enc-2 | **NEW** encouragement interstitial |
| 24 | motivation | unchanged or split-photo |
| 25 | targetDate | unchanged |
| 26 | blockers | optionally split-photo multi-select |
| 27 | metrics | unchanged |
| 28 | app-mockup | **NEW** "Ето как изглежда твоят план" |
| 29 | projection-preview | (Tier 1 — already shipped) |
| 30 | calculating | (Tier 1 — already shipped) |
| 31 | email | (existing) |

---

## Verification checklist for next session

- `cd ~/drfit-quiz && npx tsc --noEmit` → green.
- `cd ~/drfit-quiz && PORT=3010 npm run dev`. Walk the quiz at 375×812 mobile AND 1280×800 desktop.
- Verify Tier 1 still works: projection preview → calculating with two pause-questions → email gate.
- Verify renumbering doesn't break — `getStep(n)` is numeric so insertions need every later step's `step` field bumped.
- Verify previously-blocked combos (M + lose-major + skinny → Avatar 03; M + gain-mass + overweight → Avatar 01).
- All photo placeholders should fall back gracefully when the asset is missing — paper-warm card with a small "Generated portrait" caption is the recommended fallback inside `PhotoOptionCard` and `SplitPhotoSelect`.
- BG copy review — read the polished phrases aloud, they should feel native.

---

## Repo layout reminders

- Quiz step config: `lib/questions.ts`
- Avatar classification + per-avatar copy: `lib/avatars.ts`
- Testimonial pool + pickers: `lib/testimonials.ts`
- Projection math (shared): `lib/projection.ts`
- Genderize (BG `/-` resolver): `lib/genderize.ts`
- Plan-page projection chart: `components/plan/BmiProjection.tsx`
- Plan-page testimonials carousel: `components/plan/TestimonialsBlock.tsx`
- Quiz container + dispatch: `components/quiz/QuizContainer.tsx`
- Question shell (sticky header + progress + headline + sub): `components/quiz/QuestionShell.tsx`
- Card components: `OptionCard.tsx` (image card), `OptionRow.tsx` (icon-row), `GoalSelect.tsx` (numbered editorial)
- Calculating screen: `components/quiz/CalculatingScreen.tsx`
- Mid-loading overlay: `components/quiz/MidLoadingQuestion.tsx`
- Projection preview: `components/quiz/ProjectionPreview.tsx`
- Mini projection chart: `components/quiz/MiniProjectionChart.tsx`
- Standalone testimonial card: `components/quiz/TestimonialCard.tsx`
- Email gate + blurred plan teaser: `components/quiz/EmailGate.tsx`
- Confirm dialog (back-to-restart on email gate): `components/quiz/ConfirmDialog.tsx`

---

## Where to find context

- **Brand & positioning:** `docs/DRFIT_BRIEF.md` — voice, offer, mechanism IP, target customer.
- **Visual system (current):** `docs/DESIGN_SYSTEM.md` — tokens, type, motion.
- **Design brief for fresh-eyes redesign:** `docs/DESIGN_BRIEF.md` — paste-ready prompt for handing the project to a fresh design pass (Claude Design / Figma / etc.).
- **BetterMe references:** `docs/refs/betterme/README.md` — filename map for the inspiration screenshots. Drop the actual PNGs alongside the README using the documented filenames.
- **Quiz spec (logic + step list):** `quiz-spec.md` at repo root.

When `DRFIT_BRIEF.md` and `quiz-spec.md` conflict, brand wins on voice/offer; spec wins on mechanics. When this handoff conflicts with either, this handoff wins on the post-Phase-D state.
