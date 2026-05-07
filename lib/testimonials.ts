// Testimonial pool per docs/DRFIT_BRIEF.md section 3.
//
// IMPORTANT: `quote` is intentionally empty for now. Replace with real
// short quotes from the corresponding /plan testimonial pool BEFORE LAUNCH.
// Do not invent quotes. Photo paths point at /public; placeholders for now.

import type { BodyType } from './avatars';

export type TestimonialGender = 'male' | 'female';

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  age: number;
  gender: TestimonialGender;
  bodyType: BodyType;
  beforeImg?: string;
  afterImg?: string;
  kgChange: number; // negative = lost, positive = gained
  days: number;
  /** One of the brand mechanism IP terms most relevant to this transformation. */
  mechanism?: 'Carb-Cycling' | 'TUT' | 'AfterBurn';
  /** REPLACE before launch. Short BG quote, 1-2 sentences. */
  quote?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  // Men
  {
    id: 'andrey',
    name: 'Андрей',
    city: 'София',
    age: 38,
    gender: 'male',
    bodyType: 'overweight',
    kgChange: -14,
    days: 90,
    mechanism: 'AfterBurn',
  },
  {
    id: 'gabriel',
    name: 'Габриел',
    city: 'Пловдив',
    age: 32,
    gender: 'male',
    bodyType: 'skinny-fat',
    kgChange: -7,
    days: 90,
    mechanism: 'Carb-Cycling',
  },
  {
    id: 'misho',
    name: 'Мишо',
    city: 'Варна',
    age: 28,
    gender: 'male',
    bodyType: 'skinny',
    kgChange: 6,
    days: 90,
    mechanism: 'TUT',
  },
  // Women
  {
    id: 'yoanna',
    name: 'Йоанна',
    city: 'София',
    age: 41,
    gender: 'female',
    bodyType: 'overweight',
    kgChange: -11,
    days: 90,
    mechanism: 'AfterBurn',
  },
  {
    id: 'ralitsa',
    name: 'Ралица',
    city: 'Бургас',
    age: 34,
    gender: 'female',
    bodyType: 'skinny-fat',
    kgChange: -5,
    days: 90,
    mechanism: 'Carb-Cycling',
  },
  {
    id: 'katerina',
    name: 'Катерина',
    city: 'Стара Загора',
    age: 36,
    gender: 'female',
    bodyType: 'skinny-fat',
    kgChange: -6,
    days: 90,
    mechanism: 'TUT',
  },
];

import type { AvatarId } from './avatars';

export const AVATAR_FILTER: Record<AvatarId, { gender: TestimonialGender; bodyType: BodyType }> = {
  '01': { gender: 'male', bodyType: 'overweight' },
  '02': { gender: 'female', bodyType: 'overweight' },
  '03': { gender: 'male', bodyType: 'skinny-fat' },
  '04': { gender: 'female', bodyType: 'skinny-fat' },
  '05': { gender: 'male', bodyType: 'skinny' },
};

/**
 * Pick 3 testimonials prioritized by exact gender+bodyType match,
 * then same-gender same-axis fallback. Deterministic order for SSR stability.
 */
export function pickTestimonials(avatar: AvatarId): Testimonial[] {
  const { gender, bodyType } = AVATAR_FILTER[avatar];
  const exact = TESTIMONIALS.filter((t) => t.gender === gender && t.bodyType === bodyType);
  const sameGender = TESTIMONIALS.filter((t) => t.gender === gender);
  const seen = new Set<string>();
  const picked: Testimonial[] = [];
  for (const t of [...exact, ...sameGender]) {
    if (seen.has(t.id)) continue;
    seen.add(t.id);
    picked.push(t);
    if (picked.length >= 3) break;
  }
  return picked;
}
