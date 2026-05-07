# Dr.Fit Quiz Photo Generation Guide

> Audience: whoever is generating the AI photo assets that Niki's Tier 2 layout consumes.
> Tooling: kie.ai (Nano Banana Pro / Gemini 3.0 Pro image gen). Same setup as the Cocosolis generator (`~/Desktop/23/ai-team/`), `KIE_API_KEY` in `.env`.

This guide replaces the looser "ONE Стефан + ONE Мария" plan in `HANDOFF.md`. We are now generating a full cast of 8 characters (4 ages × 2 genders) and reusing them across every photo slot in the funnel.

---

## 1. The cast

Eight anchors total. Each character is generated ONCE as a base reference portrait, then reused as a character-reference image for every scene that calls for them.

| Code | Name | Gender | Age tier | Build | Hair | Eyes | Distinctive |
|---|---|---|---|---|---|---|---|
| **M1** | Алекс | M | 18-29 | Lean athletic, low body fat, defined but not bulky | Short dark brown, side-parted, slight texture | Brown | Light stubble, clean jawline |
| **M2** | Стефан | M | 30-39 | Recomp athletic, visible abs and shoulder caps, balanced | Short dark brown, neat fade, no part | Brown | Full short beard, trimmed |
| **M3** | Иван | M | 40-49 | Mature athletic, broader shoulders, lean torso, slight forearm definition | Salt-and-pepper short crop | Hazel | Clean shave, light grey at temples |
| **M4** | Боян | M | 50+ | Lean and wiry, fit-for-age, defined arms, no excess | Silver-grey, short cropped, slightly receded | Blue-grey | Trim grey beard |
| **F1** | Дария | F | 18-29 | Toned athletic, defined arms, soft core | Long dark brown, low ponytail | Brown | Natural makeup, freckles across nose |
| **F2** | Мария | F | 30-39 | Lean athletic, defined arms and core (looks like she lost ~12kg) | Shoulder-length dark brown, soft waves | Brown | Subtle confident smile, small mole on left cheek |
| **F3** | Елена | F | 40-49 | Strong athletic, toned legs and arms, healthy soft mid | Medium-length dark brown with caramel highlights, half-up | Hazel | Light crow's feet at corners (looks lived-in, not aged) |
| **F4** | Снежана | F | 50+ | Lean toned, defined arms, healthy posture, looks 5-10 years younger than age | Silver-blonde bob, sleek | Grey-blue | Minimal jewellery, no makeup |

**Why eight, not two.** The funnel runs 31 photo-led screens after Tier 2 lands. Rotating across 8 anchors stops the user feeling like they're being sold a single influencer. Age-tier matching also lets the age-step cards pull a face the user can actually identify with.

**All eight read as Bulgarian / Eastern European.** Skin tones vary inside that range (M1 mid-tan, M2 neutral, M3 olive, M4 fair; F1 olive, F2 neutral, F3 mid-tan, F4 fair) so the cast does not look monoethnic or pulled from a single stock library.

---

## 2. Branding rules

**Premise.** Men shirtless. Women in athletic top + bottom. Branding has to be present but small enough that the photo could pass as an editorial fitness shoot, not a uniform shoot.

**Mark.** A flat wordmark "DR.FIT" in brand red `#A50015` on black, or white on black. No icons, no full lockup. Treat it like a designer label: visible to the eye that looks for it, invisible to the eye that doesn't.

**Where it goes:**

| Surface | Placement | Notes |
|---|---|---|
| Men's athletic shorts (matte-black) | Embroidered wordmark on the left thigh hem, ~3 cm wide, brand red on black | Standard for every male shot |
| Men's joggers (matte-black) | Same wordmark on the left thigh seam, lower third | Used in stretch/dynamic poses |
| Men's wristband (optional, black silicone) | Tone-on-tone debossed wordmark | Add to every shot, cheap continuity anchor |
| Women's sports bra (matte-black) | Small wordmark stamp center-chest, brand red, ~2 cm wide | Standard for every female shot |
| Women's leggings or shorts (matte-black) | Wordmark on the right hip seam, lower third | Used when bra alone would feel under-dressed |
| Water bottle prop (optional, matte-black) | Larger wordmark on the bottle, brand red | Use sparingly, only in scenes where a prop reads naturally |

**Hard rules.**
- No third-party logos anywhere. No Nike swoosh, no Adidas stripes, no Lululemon, no Gymshark.
- No printed graphics or text on garments other than the DR.FIT wordmark.
- No watches, no headphones, no phones in shot.
- Exactly one DR.FIT mark per shot is enough. Two is the cap. Branding should never dominate.
- The mark is matte cloth-on-cloth or embroidered, never glossy or reflective.

---

## 3. Universal style anchor

Paste this block at the bottom of every prompt verbatim:

```
Photographic, editorial fitness-magazine grade, photoreal sharp.
Lighting: soft natural daylight from camera-front-left with mild rim from camera-back-right.
Color grade: warm neutral, slight contrast lift, no heavy filters.
Background: solid charcoal grey #2B3138 (for male shots) OR plain warm cream #F8F4EE (for female shots) unless otherwise specified.
Wardrobe: matte-black athletic wear ONLY. Shorts or joggers for men (shirtless above the waist), sports bra and shorts/leggings for women. NO third-party logos. ONE DR.FIT wordmark per shot, brand red #A50015, in the placement specified for the shot.
Composition: subject sharp, background plain, no clutter, no props unless specified.
Output: 4:5 portrait at 1280×1600 minimum, PNG, no text overlays, no watermarks.
```

---

## 4. Base reference portraits (generate these eight first)

Run these prompts in kie.ai with Nano Banana Pro, no reference image, raw text. Save each output to `public/images/photo/ref/<code>.webp` (e.g. `m1-aleks.webp`). These eight files are the character references you will pass into every subsequent generation.

Tip: generate 4-6 variants per character, pick the one with the cleanest face geometry, then run a single high-resolution upscale of the chosen variant. That upscaled portrait becomes the canonical reference.

### M1 · Алекс (18-29)
```
Studio portrait of a Bulgarian man, 23 years old. Lean athletic build, defined but not bulky,
visible deltoids and chest, mid-tan skin. Short dark brown side-parted hair with slight
texture, light stubble, clean jawline, brown eyes. Three-quarter framing, chest up. Wearing
matte-black athletic shorts (DR.FIT wordmark in brand red on left thigh hem) and matching
black silicone wristband on right wrist. Shirtless. Calm confident neutral expression,
direct gaze to camera. Charcoal grey backdrop #2B3138.
```
+ universal style anchor.

### M2 · Стефан (30-39)
```
Studio portrait of a Bulgarian man, 34 years old. Recomp athletic build, visible abs,
shoulder caps, balanced V-taper, neutral skin tone. Short dark brown neat fade, full short
trimmed beard, brown eyes. Three-quarter framing, chest up. Wearing matte-black athletic
shorts (DR.FIT wordmark in brand red on left thigh hem) and black silicone wristband on
right wrist. Shirtless. Calm confident neutral expression, slight subtle smile.
Charcoal grey backdrop #2B3138.
```
+ universal style anchor.

### M3 · Иван (40-49)
```
Studio portrait of a Bulgarian man, 45 years old. Mature athletic build, broader shoulders,
lean torso, slight forearm and chest definition, olive skin tone. Salt-and-pepper short crop,
clean shave, hazel eyes, light grey at the temples. Three-quarter framing, chest up.
Wearing matte-black athletic shorts (DR.FIT wordmark in brand red on left thigh hem)
and black silicone wristband on right wrist. Shirtless. Composed steady expression,
direct confident gaze. Charcoal grey backdrop #2B3138.
```
+ universal style anchor.

### M4 · Боян (50+)
```
Studio portrait of a Bulgarian man, 56 years old. Lean wiry fit-for-age build, defined
arms and chest, no excess weight, fair skin. Silver-grey short cropped hair slightly
receded at the temples, trim grey beard, blue-grey eyes. Three-quarter framing, chest up.
Wearing matte-black athletic shorts (DR.FIT wordmark in brand red on left thigh hem)
and black silicone wristband on right wrist. Shirtless. Quietly confident expression,
warm direct gaze. Charcoal grey backdrop #2B3138.
```
+ universal style anchor.

### F1 · Дария (18-29)
```
Studio portrait of a Bulgarian woman, 24 years old. Toned athletic build, defined arms,
soft core, olive skin. Long dark brown hair pulled back into a low ponytail, freckles
across the bridge of her nose, brown eyes, natural light makeup. Three-quarter framing,
chest up. Wearing a matte-black sports bra (small DR.FIT wordmark stamp center-chest,
brand red) and matte-black athletic leggings. Calm confident neutral expression, subtle
soft smile. Warm cream backdrop #F8F4EE.
```
+ universal style anchor.

### F2 · Мария (30-39)
```
Studio portrait of a Bulgarian woman, 32 years old. Lean athletic build, defined arms
and core (post 12kg loss aesthetic), neutral skin tone. Shoulder-length dark brown hair
in soft waves, small mole on left cheek, brown eyes, minimal makeup. Three-quarter
framing, chest up. Wearing a matte-black sports bra (small DR.FIT wordmark stamp
center-chest, brand red) and matte-black athletic leggings. Subtle confident smile,
direct warm gaze. Warm cream backdrop #F8F4EE.
```
+ universal style anchor.

### F3 · Елена (40-49)
```
Studio portrait of a Bulgarian woman, 46 years old. Strong athletic build, toned legs
and arms, healthy and lived-in midsection (not chiselled), mid-tan skin. Medium-length
dark brown hair with caramel highlights, half-up style, hazel eyes, light crow's feet
at the corners (gives a lived-in not aged look). Three-quarter framing, chest up.
Wearing a matte-black sports bra (small DR.FIT wordmark stamp center-chest, brand red)
and matte-black athletic shorts. Composed warm expression, knowing confident smile.
Warm cream backdrop #F8F4EE.
```
+ universal style anchor.

### F4 · Снежана (50+)
```
Studio portrait of a Bulgarian woman, 58 years old. Lean toned build, defined arms,
healthy posture, looks 5-10 years younger than her age, fair skin. Silver-blonde sleek
bob, no makeup, grey-blue eyes, no jewellery. Three-quarter framing, chest up. Wearing
a matte-black sports bra (small DR.FIT wordmark stamp center-chest, brand red) and
matte-black athletic leggings. Quietly confident expression, soft smile.
Warm cream backdrop #F8F4EE.
```
+ universal style anchor.

---

## 5. Scene template

Once the eight reference portraits exist, every other shot follows this structure. Always pass the reference portrait as the input image to kie.ai and put the scene prompt in the text field.

```
[Reference portrait of <character code>, e.g. M2 · Стефан]
Same person, same face, same hair, same wardrobe rule. <Pose description>.
<Framing>. <Backdrop>. Apply identical style anchor as the reference.
<Universal style anchor block>
```

Concrete example for Slot A (step 2 goal backdrop, Стефан):

```
[input image: m2-stefan.webp]
Same person, same face, same hair. Standing relaxed, hands on hips, three-quarter body
framing from chest to thighs. Same matte-black athletic shorts with DR.FIT wordmark on
left thigh, same black silicone wristband. Shirtless. Calm confident expression, direct
gaze. Charcoal grey backdrop #2B3138. 9:16 portrait aspect.
[universal style anchor]
```

---

## 6. Slot map

This table tells you which character to use, which pose, and where the file goes. File paths match what `lib/questions.ts` and the Tier 2 components will reference.

### Step 2 goal backdrop
| Slot | Char | Pose | File |
|---|---|---|---|
| A-M | M2 Стефан | Hands on hips, three-quarter body | `public/images/photo/step02-goal/m.webp` |
| A-F | F2 Мария | Hands on hips, three-quarter body | `public/images/photo/step02-goal/f.webp` |

### Step 3 bodyType cards (current state, before-transformation aesthetic)
This step asks the user "what does your body look like NOW?". The 8-character cast is post-transformation. We do NOT use the cast here. Keep the existing silhouette SVGs (`public/silhouettes/*.svg`) until a separate "before" model set is generated. Mark this as a Tier 2.5 follow-up.

### Step 4 age cards (the headline use of the cast)
| Slot | Char | Pose | File |
|---|---|---|---|
| H | M1 Алекс | Three-quarter body, relaxed stance, direct gaze | `public/images/photo/step04-age/m-18-29.webp` |
| I | M2 Стефан | Three-quarter body, relaxed stance, direct gaze | `public/images/photo/step04-age/m-30-39.webp` |
| J | M3 Иван | Three-quarter body, relaxed stance, direct gaze | `public/images/photo/step04-age/m-40-49.webp` |
| K | M4 Боян | Three-quarter body, relaxed stance, direct gaze | `public/images/photo/step04-age/m-50-plus.webp` |
| H-F | F1 Дария | Three-quarter body, relaxed stance, direct gaze | `public/images/photo/step04-age/f-18-29.webp` |
| I-F | F2 Мария | Three-quarter body, relaxed stance, direct gaze | `public/images/photo/step04-age/f-30-39.webp` |
| J-F | F3 Елена | Three-quarter body, relaxed stance, direct gaze | `public/images/photo/step04-age/f-40-49.webp` |
| K-F | F4 Снежана | Three-quarter body, relaxed stance, direct gaze | `public/images/photo/step04-age/f-50-plus.webp` |

### Step 4b body-goal cards (NEW step, target physique)
4 target physiques per gender. Use one character at four different pose/framing variants to imply progression, OR rotate across the cast. Easier and more honest: rotate across the cast (the user picks which "after" they want).

| Slot | Goal | M char | F char | Pose | File pattern |
|---|---|---|---|---|---|
| L | Toned | M1 Алекс | F1 Дария | Relaxed stance, side-quarter framing emphasising lean lines | `step04b-bodygoal/{m,f}-toned.webp` |
| M | Athletic | M2 Стефан | F2 Мария | Front-three-quarter, arms slightly flexed, balanced V-taper visible | `step04b-bodygoal/{m,f}-athletic.webp` |
| N | Shredded | M3 Иван | F3 Елена | Side-three-quarter, slight ab pose, clean definition | `step04b-bodygoal/{m,f}-shredded.webp` |
| O | Strong | M4 Боян | F4 Снежана | Confident front stance, broader frame visible | `step04b-bodygoal/{m,f}-strong.webp` |

(Niki's HANDOFF used "Bulk" for the fourth bucket. "Strong" reads better for a 50+ aspirational target. Discuss with Niki before generating.)

### Encouragement interstitials
| Slot | Char | Pose | File |
|---|---|---|---|
| P | M2 Стефан | Side-plank or low-impact pushup hold on charcoal mat, side-three-quarter, calm focus | `interstitial/encouragement-1.webp` |
| Q | M3 Иван | Standing, arms crossed, three-quarter framing, subtle smile | `interstitial/encouragement-2.webp` |
| P-F | F2 Мария | Side-plank or low-impact pushup hold | `interstitial/encouragement-1-f.webp` |
| Q-F | F3 Елена | Standing, arms crossed, three-quarter, subtle smile | `interstitial/encouragement-2-f.webp` |

The funnel chooses the gendered version based on the user's step-1 answer. Generate both.

### Stat / community interstitials
| Slot | Description | Pose | File |
|---|---|---|---|
| R | Three-male community | M1 + M2 + M3 standing shoulder-to-shoulder | `interstitial/community-m.webp` |
| R-F | Three-female community | F1 + F2 + F3 standing shoulder-to-shoulder | `interstitial/community-f.webp` |
| S | Single transformation | M3 Иван direct gaze, fitted matte-black T-shirt acceptable here (only place a shirt is allowed) | `interstitial/results-m.webp` |
| S-F | Single transformation | F2 Мария direct gaze, sports bra | `interstitial/results-f.webp` |

For the community shots, generate by stitching three single-character shots with the same backdrop and lighting (kie.ai compositing or Photoshop merge). Avoid prompting "three people" raw, face fidelity drops on group prompts.

### Split-photo step backdrops (rotate the cast)
For each split-photo step, pick a character + pose. Aim for variety so the user sees different ages on the way down.

| Step | M char | F char | Pose | File pattern |
|---|---|---|---|---|
| 8 sleep | M1 | F1 | Relaxed stance, three-quarter, looking off-camera right | `split/m1-relaxed.webp` / `f1-relaxed.webp` |
| 9 stress | M2 | F2 | Mid-stretch dynamic warm-up, one arm overhead | `split/m2-stretch.webp` / `f2-stretch.webp` |
| 11 dietStyle | M3 | F3 | Seated on bench, towel around neck, confident steady gaze | `split/m3-bench.webp` / `f3-bench.webp` |
| 14 mealTiming | M4 | F4 | Walking pose, three-quarter body in motion, calm expression | `split/m4-walking.webp` / `f4-walking.webp` |
| 15 energy | M1 | F1 | Squat hold three-quarter framing, energetic expression | `split/m1-squat.webp` / `f1-squat.webp` |
| 16 cravings | M2 | F2 | Side profile drinking from DR.FIT branded matte-black bottle | `split/m2-bottle.webp` / `f2-bottle.webp` |
| 18 bodyTemp | M3 | F3 | Towel on shoulders post-workout, neutral gaze | `split/m3-towel.webp` / `f3-towel.webp` |
| 19 pastBest | M4 | F4 | Front three-quarter, hands relaxed at sides | `split/m4-front.webp` / `f4-front.webp` |
| 21 motivation | M1 | F1 | Lunge stretch dynamic pose | `split/m1-lunge.webp` / `f1-lunge.webp` |
| 23 blockers | M2 | F2 | Seated on floor, knees up, contemplative confident gaze | `split/m2-seated.webp` / `f2-seated.webp` |

If this assignment feels uneven (M2 and M3 carry more shots), redistribute. The constraint is: every shot must be the SAME character as the reference portrait, NEVER a generic stand-in.

### Testimonial portraits
The testimonial pool in `lib/testimonials.ts` uses different names: Andrey, Gabriel, Misho, Yoanna, Ralitsa, Katerina. To keep the cast tight while implying real-user diversity, you have two choices:

A. Reuse the cast under the testimonial names. Map: Andrey = M3, Gabriel = M2, Misho = M1, Yoanna = F3, Ralitsa = F2, Katerina = F1. Shoot square 1:1 portraits at chest framing.
B. Generate six DIFFERENT faces specifically for testimonials (the BetterMe approach). More honest in feel, more work.

Recommendation: B for production launch. A is fine for a soft-launch / staging build. Discuss with Valentin before committing.

### App-mockup interstitial
| Slot | Description | File |
|---|---|---|
| T | Three matte-black phones at ~15° tilt on charcoal background, each showing a real `/plan` page screenshot | `interstitial/app-mockup.webp` |

Generate by:
1. Take three actual screenshots of `/plan` at different scroll positions (hero / projection / CTA).
2. Composite them into phone frames in Figma using a free Mockuuups Studio template.
3. Export 4:3 1600×1200.

No AI generation needed for this slot.

---

## 7. Tool choice: kie.ai vs ChatGPT image gen 2

Both tools work for this cast. Pick one and stay on it for the whole batch (mixing tools mid-cast leaks face drift). Quick comparison:

| Aspect | kie.ai (Nano Banana Pro / Gemini 3.0 Pro image) | ChatGPT image gen 2 (GPT-4o image) |
|---|---|---|
| Cost per generation | ~$0.04–$0.06 | ~$0.04 in-app, included in Plus/Pro plans up to monthly cap |
| Character consistency from ref image | Strong, especially with "same person, same face" wording | Strong out of the box, often slightly better at preserving fine facial structure |
| Wardrobe + branding fidelity | Good, follow prompt closely | Sometimes drifts on tiny logo placement, expect to retry the wordmark a few times |
| Batch automation | Easy via API, already wired in `~/Desktop/23/ai-team/` | No public batch API yet, manual chat-by-chat |
| Iteration speed in-chat | API only | Native, conversational, fastest for one-off retries |
| Best for | Volume work (40+ shots), automated pipeline | Hero shots where fine facial fidelity matters more than throughput |

**Pragmatic split.** Generate the eight base reference portraits in ChatGPT image gen 2 (face fidelity matters most here, low volume, ~8 shots), then run the high-volume scene shots through kie.ai using those ChatGPT-generated portraits as the reference image. Best of both.

**ChatGPT image gen 2 workflow:**
1. New chat in ChatGPT (Plus or Pro plan).
2. Upload your reference portrait as an attachment + paste the scene prompt from section 5/6.
3. Tell it "use the attached portrait as a strict character reference, do not alter the face."
4. Generate, review, ask for tweaks in natural language ("tighten the framing to chest-up", "remove the wristband", "the wordmark should be on the left thigh, not the right").
5. Right-click "Save image as" once you're happy. Export at the largest size offered.
6. Run through the same upscale + webp pipeline as kie.ai outputs.

**Caveats:**
- ChatGPT does not always honor exact hex colors on tiny garment details. Verify the wordmark is brand red `#A50015` after generation; if drift is heavy, regenerate with a tighter callout: "the DR.FIT wordmark must be exactly brand red #A50015, embroidered, matte cloth-on-cloth."
- Plus plan caps daily image generations. If you hit it mid-batch, switch to Pro for the remainder.
- Save the conversation thread per character. ChatGPT carries the persona forward inside the same thread, which boosts consistency for follow-up shots.

## 8. kie.ai workflow (Nano Banana Pro)

Reusing the Cocosolis pattern. The flow:

1. **Auth.** `KIE_API_KEY` already in `~/Desktop/23/ai-team/.env`. Same key works for the Dr.Fit set, no separate account.
2. **Base portraits.** For each of the 8 anchors, send a text-only request with the prompt from section 4. Save the chosen output to `public/images/photo/ref/`.
3. **Scene shots.** For every other slot, send the relevant base reference image + the scene prompt from section 5/6. Nano Banana Pro respects character continuity well when the reference is high-resolution and the prompt explicitly says "same person, same face, same hair, same wardrobe rule."
4. **Iterate fast.** Generate 4-6 variants per slot, pick the best, regenerate with tighter pose language for the rejects.
5. **Upscale.** Final picks go through a single high-res upscale (Topaz, Magnific, or kie.ai's own upscaler) to land at 1600×2000 for portrait shots, 1600×1200 for landscape interstitials.
6. **Convert to webp.** `cwebp -q 88 input.png -o output.webp` keeps file size under 200 KB without visible degradation.
7. **Drop into the repo.** File paths in section 6 already match what Niki's components will look up.

A small Python script at `~/Desktop/23/ai-team/drfit_batch.py` (mirror of `cocosolis` demo) would let you run the full slot map as a batch. Worth ~30 minutes to write if you're generating 80+ shots.

---

## 9. QC checklist before committing assets

Run through this for every shot before saving it as final:

- [ ] Face matches the base reference (same eye spacing, same nose, same jaw, same hair texture)
- [ ] Skin tone matches the reference within one stop
- [ ] Wardrobe matches: matte-black, no third-party logos, exactly one DR.FIT mark, in the spec'd placement
- [ ] No watches, headphones, phones, jewellery beyond what the character spec allows
- [ ] No printed text or graphics on the body (tattoos OK if continuous from base reference, otherwise none)
- [ ] No grain, no artifacts at the face, no extra fingers or limbs
- [ ] Background is the spec'd backdrop (charcoal #2B3138 for men, warm cream #F8F4EE for women) unless the slot says otherwise
- [ ] Composition leaves enough negative space for the layout: split-photo shots should have the subject offset to the right third, age-card shots centered
- [ ] File is webp, ≤ 250 KB, at the spec'd dimensions
- [ ] File path matches the slot map exactly

Reject the shot if more than one item fails. The cast loses its power the moment a face drifts.

---

## 10. Order of operations

Do this in batches so you have something usable at every stop, not just at the end.

**Batch 1 (Day 1).** Eight base reference portraits. Section 4 prompts. Output: `public/images/photo/ref/`.

**Batch 2 (Day 1-2).** Step 4 age cards (8 shots) + step 2 goal backdrops (2 shots). This is the minimum visible improvement that ships a "the funnel has photos now" story.

**Batch 3 (Day 2-3).** Encouragement interstitials (4 shots) + stat/community interstitials (4 shots). After this, the trust beats land.

**Batch 4 (Day 3-4).** All split-photo step backdrops (20 shots, 10 per gender). This is the volume work.

**Batch 5 (Day 4).** Body-goal cards (8 shots) + testimonial portraits (6 shots, if going option B).

**Batch 6 (Day 4-5).** App-mockup interstitial (compositing, no AI).

Total: ~60 shots if every slot ships, ~50 if testimonials reuse the cast.

---

## 11. Budget guard

Nano Banana Pro on kie.ai is roughly $0.04-$0.06 per generation depending on resolution. With 4-6 variants per slot and 60 slots, expect 300-360 generations, $12-22. Upscales add another $5-10. Whole pipeline lands under $35.

---

## 12. What to ask Valentin before generating

- Approve the eight character names (Алекс, Стефан, Иван, Боян, Дария, Мария, Елена, Снежана) or swap.
- Approve "Strong" vs "Bulk" for body-goal Slot O.
- Decide testimonial strategy: A (reuse cast) or B (generate six new faces).
- Confirm the wordmark format: "DR.FIT" all-caps, brand red `#A50015` on black. Or supply a logo SVG to attach as the embroidery reference.
- Confirm whether the women's set should include shorts at all, or stick to leggings only (the spec uses leggings as default and shorts only on F3 since it suggests an older-active confidence cue).
- Decide whether `interstitial/results-m.webp` (Slot S) is allowed to break the shirtless rule for a fitted T-shirt. The "as featured in" social-proof framing reads better with a shirt.

Once those are settled, generate Batch 1 and review the eight portraits before proceeding.
