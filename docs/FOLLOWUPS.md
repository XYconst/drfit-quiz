# Dr.Fit Quiz — Open Followups

State as of 2026-05-12 after the Dancho-review polish pass.

## 1. Route testimonial photos by viewer profile

**What Dancho asked for:** the before/after photos shown on the interstitial screens (step 7, step 14 "над 50 000 души", step 100 quote, step 20 "92%", step 24 commit) should match who is taking the quiz — same gender, similar age band, similar starting body — so the user sees themselves in the success story.

**Current state:** the interstitials pick photos by gender only. Path is `/images/photo/testimonials/{gender}-{N}.jpg` where N is hardcoded per step. The pool in `lib/testimonials.ts` has six entries with metadata (gender, age, bodyType, kgChange, days, mechanism), but only `pickProjectionTestimonial()` actually uses them, and only on the final projection screen.

**Why we can't finish it today:** to route by profile we need a fuller photo pool. With six total testimonials (3 male × 3 female across age bands and body types) most viewer profiles will land on a poor match. Anyone in their 40s sees a 28-year-old; anyone underweight sees a weight-loss arc; anyone trying to gain mass has no on-brand match.

**What we need from Dancho before this ships:**

Ideal coverage matrix is gender × age band × starting body type:

| | Overweight | Skinny-fat | Underweight |
| --- | --- | --- | --- |
| Male 18-29 | needed | needed | needed |
| Male 30-39 | have (Andrey) | have (Gabriel) | — |
| Male 40-49 | needed | needed | — |
| Male 50+ | needed | needed | — |
| Female 18-29 | needed | needed | needed |
| Female 30-39 | have (Yoanna) | have (Ralitsa) | — |
| Female 40-49 | needed | needed | — |
| Female 50+ | needed | needed | — |

Minimum viable set to roll this out is **12 new before/after photos** (one per missing cell, the underweight column can wait). Each photo needs: real client, gender + age + starting body type tagged, 12+ kg of change documented, before + after frame, written consent to use the photo on the marketing site.

Until that pool exists, hardcoding by gender is the best we can do without making it worse.

**Engineering plan once photos arrive:**

1. Expand `lib/testimonials.ts` with the new entries (each gets a stable `id`, gender, ageBand, bodyType, kgChange).
2. Generalise `pickProjectionTestimonial(gender, kgDelta)` into `pickByProfile({ gender, ageBand, bodyType, kgDelta })` with a nearest-neighbour fallback so we always render something even on partial matches.
3. Replace the static `imageUrl: '/images/photo/testimonials/{gender}-N.jpg'` template in `lib/questions.ts` step 7 / 14 / 100 / 20 / 24 with a slot key (e.g. `testimonialSlot: 'social-proof'`) that the renderer resolves at runtime from the pool.
4. Update `QuizContainer` to pass the user's age band + body type into the interstitial render.

Estimated effort once we have the photos: half a day.
