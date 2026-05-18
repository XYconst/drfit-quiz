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
  mechanism?: 'Въглехидратна ротация' | 'TUT' | 'AfterBurn';
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
    afterImg: '/images/photo/testimonials/male-1.jpg',
    quote:
      'Първите две седмици бяха тежки. После тялото свикна и теглото просто си тръгна. Спя по-добре, дишам по-леко.',
  },
  {
    id: 'gabriel',
    name: 'Габриел',
    city: 'Пловдив',
    age: 32,
    gender: 'male',
    bodyType: 'skinny-fat',
    kgChange: -7,
    days: 120,
    mechanism: 'Въглехидратна ротация',
    afterImg: '/images/photo/testimonials/male-3.jpg',
    quote:
      'Не съм гладувал нито ден. Научих кога да ям въглехидрати и кога не и това промени всичко за корема ми.',
  },
  {
    id: 'misho',
    name: 'Мишо',
    city: 'Варна',
    age: 28,
    gender: 'male',
    bodyType: 'skinny',
    kgChange: 22,
    days: 180,
    mechanism: 'TUT',
    afterImg: '/images/photo/testimonials/male-4.jpg',
    quote:
      'Цял живот бях кльощав. За 6 месеца качих 22 кг, без шкембе. Само чиста маса и сила.',
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
    afterImg: '/images/photo/testimonials/female-2.jpg',
    quote:
      'Имам две деца и време почти нямам. Тренировките са кратки, но след всяка усещам, че тялото работи още часове.',
  },
  {
    id: 'ralitsa',
    name: 'Ралица',
    city: 'Бургас',
    age: 34,
    gender: 'female',
    bodyType: 'skinny-fat',
    kgChange: -5,
    days: 60,
    mechanism: 'Въглехидратна ротация',
    afterImg: '/images/photo/testimonials/female-3.jpg',
    quote:
      'Дрехите от миналото лято пак ми станаха. Не съм броила калории нито веднъж, просто следвах плана.',
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
    afterImg: '/images/photo/testimonials/female-1.jpg',
    quote:
      'Видях разлика още на третата седмица. Талията ми се появи отново, а ръцете ми се стегнаха.',
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

/**
 * Pick a SINGLE testimonial that best matches the user's gender and kg trajectory
 * (loss vs gain) for the projection-preview screen. Picks the testimonial whose
 * `kgChange` is in the same direction and closest in magnitude to the user's
 * desired delta. Falls back to gender-only match, then to the first entry.
 *
 * @param gender 'male' | 'female'
 * @param kgDelta signed: positive = user wants to lose, negative = user wants to gain
 *                (mirrors weight - targetWeight from quiz answers)
 */
export function pickProjectionTestimonial(
  gender: TestimonialGender,
  kgDelta: number,
): Testimonial | null {
  const all = pickProjectionTestimonials(gender, kgDelta);
  return all[0] ?? null;
}

/**
 * Pick up to N testimonials matching the user's gender and the direction of
 * their goal (loss vs gain). Ordered by how closely their kgChange magnitude
 * matches the user's target — best match first, gentler matches after, so
 * a horizontal carousel reads as "closest to you → less close" left-to-right.
 */
export function pickProjectionTestimonials(
  gender: TestimonialGender,
  kgDelta: number,
  limit = 3,
): Testimonial[] {
  if (TESTIMONIALS.length === 0) return [];
  const sameGender = TESTIMONIALS.filter((t) => t.gender === gender);
  if (sameGender.length === 0) return TESTIMONIALS.slice(0, limit);

  const wantsLoss = kgDelta > 0;
  const directionMatch = sameGender.filter((t) => (wantsLoss ? t.kgChange < 0 : t.kgChange > 0));
  const pool = directionMatch.length > 0 ? directionMatch : sameGender;
  const target = Math.abs(kgDelta);
  const ranked = [...pool].sort(
    (a, b) =>
      Math.abs(Math.abs(a.kgChange) - target) - Math.abs(Math.abs(b.kgChange) - target),
  );

  // Fill from the same-gender pool if we don't have enough direction-matches.
  const seen = new Set(ranked.map((t) => t.id));
  for (const t of sameGender) {
    if (ranked.length >= limit) break;
    if (!seen.has(t.id)) {
      ranked.push(t);
      seen.add(t.id);
    }
  }
  return ranked.slice(0, limit);
}
