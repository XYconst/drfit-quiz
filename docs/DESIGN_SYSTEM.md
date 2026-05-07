# Dr.Fit Design System

Source of truth for all design decisions on this codebase. Synthesized from:
- The Dr.Fit brief (`docs/DRFIT_BRIEF.md`)
- The Part B / Part C plan (`~/.claude/plans/im-working-on-another-async-canyon.md`)
- Output of the `ui-ux-pro-max` skill v2.2.3 (queried `2026-05-07`)

When the skill output and our locked brand decisions disagree, our brand decisions win — the skill's defaults assume a generic healthcare brand and recommend cyan/teal palettes, neumorphism, and a search-marketplace pattern, none of which fit our anti-blame, mechanism-driven, editorial-clinic positioning. Where the skill agrees with us (font pairing, anti-patterns, accessibility checklist) we adopt its language as the canonical reference.

---

## 1. Brand fundamentals (locked)

| Token | Value | Use |
|---|---|---|
| `--color-brand-red` | `#A50015` | Primary CTA, selected card border, eyebrow rule, mechanism-IP italic emphasis |
| `--color-brand-red-tint` | `#FFF5F6` | Selected card background fill, hero wash on `/plan` |
| `--color-brand-dark` | `#192126` | Near-black headings on warm-paper |
| `--color-graphite` | `#2B3138` | Lab-readout surfaces (BMI scale, projected curve, sticky countdown, 4-хормона diagram bg) |
| `--color-paper-warm` | `#F8F4EE` | Risograph card surfaces, OptionCard background, testimonial cards |
| `--color-brand-bg` | `#FAFAFA` | Page background |
| `--color-line` | `#DEDEDF` | Default borders |
| `--color-text-headline` | `#0F172A` | Heading body color (matches skill's slate-900 contrast guidance) |
| `--color-text-body` | `#1F2937` | Paragraph color |
| `--color-text-muted` | `#475569` | Helper / placeholder copy (matches skill's slate-600 minimum) |
| Gold gradient | existing tokens | **Reserved for one place only**: 49 EUR guarantee seal and the 1px sticky-bar underline. Never used as a CTA. |

Skill recommended cyan/teal `#0891B2` for healthcare. **Rejected** — that's the BetterMe-clone trap. We intentionally invert by holding to brand red on warm paper.

---

## 2. Typography (locked, validated)

| Role | Font | Weights | Cyrillic | Status |
|---|---|---|---|---|
| Display serif | Playfair Display | 400 / 700 / 700 italic | yes (subset loaded) | locked |
| Body sans | Manrope | 400 / 500 / 700 / 800 | yes (subset loaded) | locked |
| Mono numeric | Geist Mono | 400 / 500 / 600 | latin | locked |

The skill's "Classic Elegant" pairing recommends Playfair Display + Inter for editorial-luxury; we keep Playfair, swap Inter → Manrope to avoid the "generic AI font" smell while keeping similar geometric sans personality and full Cyrillic.

**Cyrillic delight rule:** wrap `Ти`, `биологията`, `метаболизмът` in `<em>` for Playfair italic emphasis when they appear in headline copy.

**Type scale (mobile-first, fluid):**
- Hero display: `clamp(2rem, 6vw, 3.5rem)` Playfair 700, line-height 1.05, tracking `-0.02em`
- Step headline: `clamp(1.5rem, 4.5vw, 2rem)` Manrope 800, line-height 1.15, tracking `-0.01em`
- Section eyebrow: `0.6875rem` Manrope 700 uppercase 0.18em tracking
- Body: `1rem` Manrope 400, line-height 1.55 (within the skill's 1.5-1.75 guidance)
- Mono stat: `clamp(2.5rem, 8vw, 4.5rem)` Geist Mono 500, line-height 1, tabular-nums

---

## 3. Pattern + style

**Pattern:** `Hero + Features + CTA` (skill match — section ordering: hero, value prop, features, CTA, footer with sticky-CTA reinforcement). Adapted for `/plan`: hero (BMI + curve + headline) → 5 numbered sections → guarantee seal → CTA → testimonials → final CTA.

**Style:** "Editorial Clinic" — our own positioning, not from the skill's 67-style catalog. Closest neighbors: Magazine + Brutalist hints (numerals as artifact, mono lab-readout) + Risograph illustration. We explicitly reject the skill's first-pick recommendation of **Neumorphism** (low contrast, soft-UI, generic wellness — that's the trap of looking like every other meditation app).

**Card-first rule:** every selectable option is an image card (per Part C). No text pills + radio. Image is the primary visual carrier; label is supporting copy. Three OptionCard variants:
- `portrait` (4:5) — gender, body-type, age, problem areas
- `square` (1:1) — most lifestyle/diet questions
- `wide` (16:9) — when a step has 5+ options or needs descriptive sub-line

---

## 4. Anti-patterns (mandatory)

Drawn from the skill's pre-delivery checklist + our brief's rules. Every PR review checks these:

**Visual language:**
- Never emojis as icons (use Lucide SVGs)
- Never em-dashes (`—`); use commas, periods, or restructure
- Never invented coach persona, never founder face
- Never medical-claim verbs (`лекува`, `cure`, `treat`)
- Never gold gradient outside the one approved location
- Never BetterMe-yellow CTA, never shirtless-studio hero photography
- Never AI-purple gradients, never neon, never bento blocks for flair's sake
- Never neumorphism (skill suggests; we reject — too low-contrast, generic wellness)

**Interaction:**
- Never scale transforms that shift layout on hover (use color/opacity)
- Never `outline: none` without a focus replacement
- Never tap targets under 44×44px on mobile
- Never adjacent tap targets without ≥8px spacing
- Never default mobile tap-delay (use `touch-action: manipulation`)
- Never ignore `prefers-reduced-motion: reduce`

**Contrast (skill cites slate-900 / slate-600 minimums):**
- Body text on light backgrounds ≥ 4.5:1 contrast
- Glass/transparent cards ≥ 80% opacity in light mode
- Borders visible in both modes (`--color-line` not `white/10`)

**Voice:**
- Pronoun „Ти" (informal singular) throughout
- Mechanism IP capitalized and Playfair-italicized inline: *Carb-Cycling*, *Time-Under-Tension*, *AfterBurn*, *4-те хормона*

---

## 5. Pre-delivery checklist (run before PR)

Adopted verbatim from the skill, augmented with our own rules:

**Visual quality**
- [ ] No emoji codepoints in `app/`, `components/`, `lib/` (grep returns empty)
- [ ] All icons from a single Lucide / Heroicons set (no mixed sources)
- [ ] No em-dashes anywhere (grep `—` returns empty in user-visible strings)
- [ ] Hover states change color/opacity only, never cause layout shift
- [ ] Theme tokens used directly, no `var()` wrapper around tokens

**Interaction**
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover provides visible feedback within 150–300ms
- [ ] Focus-visible rings on every interactive element
- [ ] Tab order matches visual order
- [ ] `prefers-reduced-motion: reduce` honored — drops scale, keeps color state changes

**Accessibility**
- [ ] Cards expose `aria-pressed` (single-select) or `role="checkbox" aria-checked` (multi-select)
- [ ] Images have meaningful `alt` (defaults to label when imageUrl is decorative)
- [ ] Form inputs have associated labels
- [ ] Color is never the only signal (selection adds checkmark badge, not just border color)

**Light-mode contrast**
- [ ] Body text ≥ 4.5:1 against background
- [ ] Helper text ≥ slate-600 (`#475569`)
- [ ] Borders visible in both modes

**Layout**
- [ ] Responsive at 375 / 768 / 1024 / 1440px
- [ ] No horizontal scroll on mobile
- [ ] Floating elements (sticky countdown, footer CTA) have edge padding
- [ ] No content hidden behind fixed elements

**Build**
- [ ] `next build` clean
- [ ] `npx tsc --noEmit` clean
- [ ] `node scripts/walk-quiz.mjs` runs end-to-end and produces 26 + 1 screenshots
- [ ] Lighthouse on `/plan` ≥ 90 perf / 100 a11y / 100 best-practices on 375px viewport

---

## 6. Stack guidelines

Already on Next.js 16 + React 19 + Tailwind v4 + framer-motion 11 + TypeScript. No charts library. Lucide icons via direct SVG (no npm package import to keep bundle lean — copy SVG markup inline per icon). When adding a new Lucide icon, copy the official SVG from `https://lucide.dev/icons/<name>` into `components/icons/<Name>.tsx` as a typed React component. Icon set authority: Lucide. Brand authority: Simple Icons, when needed.

---

## 7. Hierarchy (master + page overrides)

This file is the master. Page-specific deviations live in `docs/design-system/pages/<page>.md` (e.g. `/plan` may override the wash background tint). When implementing a page, check for an override file first; fall back to this master.

Currently no overrides registered.

---

## 8. Skill output reference

The first auto-recommendation from `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fitness wellness weight-loss healthcare anti-blame metabolism Bulgarian editorial card" --design-system` was:
- Pattern: Marketplace / Directory (rejected — not our funnel shape)
- Style: Neumorphism (rejected — low contrast, generic wellness)
- Colors: cyan `#0891B2` + green CTA (rejected — BetterMe-adjacent / medical generic)
- Typography: Barlow Condensed + Barlow (rejected — sports-athletic feel, not editorial)

We instead derived the system above from targeted searches (`--domain typography "editorial serif magazine"`, `--domain landing "card image grid quiz"`, `--domain ux "accessibility focus reduced-motion touch"`) plus our locked brand. The skill's value here is the **anti-pattern catalog and the pre-delivery checklist**, both of which we've adopted in §4–5.
