// 8-character cast routing. The user's gender (step 1) plus age tier (step 4)
// pick exactly one of m1..m4 / f1..f4. That character's photos are then served
// across every photo-led screen for the rest of the quiz.
//
// Pose assets live at /public/images/photo/{slot}/{code}-{pose}.png. See
// docs/PHOTO_GENERATION_GUIDE.md for the slot map.

import type { Gender } from './avatars';

export type CharacterCode = 'm1' | 'm2' | 'm3' | 'm4' | 'f1' | 'f2' | 'f3' | 'f4';

export type AgeTier = '18-29' | '30-39' | '40-49' | '50+';

const AGE_TO_INDEX: Record<AgeTier, 1 | 2 | 3 | 4> = {
  '18-29': 1,
  '30-39': 2,
  '40-49': 3,
  '50+': 4,
};

/** Returns the matched character code, or null if either input is missing. */
export function pickCharacter(
  gender: Gender | null | undefined,
  age: string | null | undefined,
): CharacterCode | null {
  if (!gender || !age) return null;
  const idx = AGE_TO_INDEX[age as AgeTier];
  if (!idx) return null;
  return `${gender === 'male' ? 'm' : 'f'}${idx}` as CharacterCode;
}

/** Default character used when gender or age is not yet known. */
export const FALLBACK_CHARACTER: CharacterCode = 'm2';

/**
 * Build the file path for a given character + slot. Slots are documented in
 * docs/PHOTO_GENERATION_GUIDE.md (e.g. 'ref', 'goal', 'split-relaxed',
 * 'split-stretch', 'enc-1', 'enc-2', 'results').
 */
export function characterImagePath(code: CharacterCode, slot: string): string {
  if (slot === 'ref') return `/images/photo/ref/${code}.png`;
  return `/images/photo/${slot}/${code}.png`;
}

export const CHARACTER_LABELS: Record<CharacterCode, string> = {
  m1: '18-29 male',
  m2: '30-39 male',
  m3: '40-49 male',
  m4: '50+ male',
  f1: '18-29 female',
  f2: '30-39 female',
  f3: '40-49 female',
  f4: '50+ female',
};
