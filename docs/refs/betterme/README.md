# BetterMe Reference Screenshots

This folder is the index of BetterMe quiz screenshots used as inspiration for the Dr.Fit visual direction. Drop the actual image files into this directory using the filenames below — `docs/HANDOFF.md` and `docs/DESIGN_BRIEF.md` reference these names.

The screenshots were captured from BetterMe's calisthenics quiz funnel. They are reference material only — we are not cloning the design.

## Filename map

| Filename | What the screenshot shows | Pattern referenced |
|---|---|---|
| `01-age-photo-grid.png` | "CALISTHENICS WORKOUT PLAN — based on your age" with 4 photo cards (men, ages 18–29 / 30–39 / 40–49 / 50+) on dark bg, paper-warm pill at the bottom of each card | Photo-card grid layout |
| `02-stat-interstitial.png` | "Over 780,000 men in their 30s have already tried our Calisthenics Workout Plan" — text + group photo of 3 men + "As featured in" Forbes / GQ / Garage Gym Reviews logo strip | Stat / social-proof interstitial |
| `03-encouragement-pushup.png` | "You're going to crush this!" — text + photo of single male model in side-plank/pushup pose | Encouragement interstitial |
| `04-goal-split-photo.png` | "What's your main goal?" — 4 stacked text option pills on left ("Gain muscle" / "Lose weight" / "Lose fat and gain muscle" [selected, cream pill] / "Improve overall fitness"), full-bleed model photo on right | Half-screen photo + stacked text options |
| `05-app-mockup.png` | "The perfect solution is right here!" — text + 3 tilted phone-mockups showing the Calisthenics app UI ("Day 1, Day 2..." carousel, "Main Goal: Gain muscle and lose fat", side-plank workout) | App-mockup credibility interstitial |
| `06-bodytype-photo-grid.png` | "How would you describe your physical build?" — 4 photo cards (Slender / Medium build / Stocky / Significantly overweight [selected]) on dark bg, paper-warm pill labels at bottom of each card | Photo-card grid for body-type assessment |
| `07-bodygoal-photo-grid.png` | "What's your body goal?" — 4 photo cards (A few sizes smaller / Athletic / Shredded / Swole [selected]) — DIFFERENT from body-type, this is target physique | Photo-card grid for body GOAL (a step we don't currently have) |
| `08-pastbest-split-photo.png` | "How long ago were you in the best shape of your life?" — 4 stacked text pills ("Less than a year ago" / "1 to 2 years ago" / "More than 3 years ago" [selected] / "Never"), model photo on right | Half-screen for past-best step (our step 19) |
| `09-weightchange-split-photo.png` | "How does your weight typically change?" — 3 stacked text pills ("I struggle to gain weight or muscle" / "I gain and lose weight easily" / "I gain weight fast but lose it slowly" [selected]), dynamic running-pose model on right | Half-screen split photo |
| `10-endomorph-diagnosis.png` | "Looks like you have the endomorph body type" — text diagnosis copy + plank-pose model photo | Diagnosis-style encouragement interstitial |
| `11-squats-split-photo.png` | "How many squats can you do in a row?" — 4 stacked text pills ("I can't do squats" / "11–20 squats" / "21–40 squats" [selected] / "40+ squats"), squatting model on right | Half-screen split photo (fitness assessment) |
| `12-workouts-3mo-split-photo.png` | "How many times have you worked out in the last 3 months?" — 4 stacked text pills ("Almost every day" / "Several times a week" [selected] / "Several times a month" / "I don't work out"), high-knee running pose model on right | Half-screen split photo |
| `13-encouragement-flex.png` | "Achieve greater results with our plan" — text + flexing-arm photo of model | Encouragement interstitial |
| `14-targetzones-anatomical.png` | "What are your target zones?" — 6 stacked text checkboxes ("Belly" / "Pecs" [selected, cream] / "Arms" [selected, cream] / "Legs" / "Back" / "Full body"), anatomical model on right with red-highlighted muscle groups (pecs + arms shown highlighted) | Anatomical multi-select highlight |
| `15-trainfreq-split-photo.png` | "How many times per week would you like to train?" — 3 stacked text pills ("1–2 times" / "3–4 times" / "5+ times" [selected]), squatting wide-stance model on right | Half-screen split photo |
| `16-workoutlength-split-photo.png` | "How long do you want your workouts to be?" — 5 stacked text pills ("10–15 min" / "15–20 min" / "20–25 min" [selected] / "25+ min" / "I don't know"), dumbbell-curl model on right | Half-screen split photo |
| `17-model-stretch-pose.png` | Stretching/lunge dynamic pose of single male model on dark bg — used as a hero / split-photo backdrop | Single-model continuity reference |

## Notes for use

- Same male model appears across most photos — this is BetterMe's continuity strategy. We adopt it: we'll commission/generate ONE male reference ("Стефан") and ONE female reference ("Мария") and reuse them across our screens.
- Photo backgrounds are nearly black. Our brand uses warm cream (#F8F4EE) instead — see `DESIGN_BRIEF.md` for our adaptation.
- Option pills are dark graphite with white text by default; selected = cream/paper-warm with dark text + filled checkmark badge. We mirror this selection contrast.
- The app-mockup and anatomical patterns are documented as Tier 2/3 work in `HANDOFF.md`.

## How to drop the images

```
docs/refs/betterme/
  ├─ README.md              ← this file
  ├─ 01-age-photo-grid.png
  ├─ 02-stat-interstitial.png
  ├─ ...
  └─ 17-model-stretch-pose.png
```

PNG, JPG, or WebP all fine. Keep them under ~1 MB each (compress before committing).
