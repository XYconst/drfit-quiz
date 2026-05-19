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

const SPLIT = '/images/photo/testimonials/generated/split';

export const TESTIMONIALS: Testimonial[] = [
  // Real photos from Dancho's shoots.
  {
    id: 'viktoria',
    name: 'Виктория',
    city: 'Пловдив',
    age: 29,
    gender: 'female',
    bodyType: 'overweight',
    kgChange: -15,
    days: 150,
    mechanism: 'AfterBurn',
    beforeImg: '/images/photo/testimonials/real/female_ba1_before.jpg',
    afterImg: '/images/photo/testimonials/real/female_ba1_after.jpg',
    quote:
      'Качих 14 кг след бременността и не можех да ги сваля. За 5 месеца върнах формата си и за първи път от години се чувствам като себе си.',
  },
  {
    id: 'nikolay',
    name: 'Николай',
    city: 'Велико Търново',
    age: 33,
    gender: 'male',
    bodyType: 'overweight',
    kgChange: -18,
    days: 120,
    mechanism: 'Въглехидратна ротация',
    beforeImg: '/images/photo/testimonials/real/male_ba1_before.jpg',
    afterImg: '/images/photo/testimonials/real/male_ba1_after.jpg',
    quote:
      'Цял живот стоях зад камерата и започваше да ми писва. Тази снимка е от връх Мальовица, около 4 месеца след като започнах с Dr.Fit. Оттогава се чувствам като нов човек.',
  },
  // New B/A pairs.
  {
    id: 'magdalena',
    name: 'Магдалена',
    city: 'Пловдив',
    age: 32,
    gender: 'female',
    bodyType: 'overweight',
    kgChange: -14,
    days: 150,
    mechanism: 'AfterBurn',
    beforeImg: `${SPLIT}/magdalena_before.jpg`,
    afterImg: `${SPLIT}/magdalena_after.jpg`,
    quote:
      'След второто дете не можех да позная себе си в огледалото. Пет месеца по-късно отново съм аз — със същите дрехи и същата усмивка отпреди.',
  },
  {
    id: 'stefan',
    name: 'Стефан',
    city: 'Велико Търново',
    age: 41,
    gender: 'male',
    bodyType: 'overweight',
    kgChange: -11,
    days: 120,
    mechanism: 'AfterBurn',
    beforeImg: `${SPLIT}/stefan_before.jpg`,
    afterImg: `${SPLIT}/stefan_after.jpg`,
    quote:
      'Приятелите ми обичат да казват, че на моите години човек е по-добре щастлив и пълен, отколкото с плочки на корема и нещастен. Истината е, че плочки нямам, но и шкембе вече нямам. А със сина ми сега ходим на планина и никога не съм се чувствал по-добре.',
  },
  {
    id: 'boyan',
    name: 'Боян',
    city: 'София',
    age: 35,
    gender: 'male',
    bodyType: 'overweight',
    kgChange: -10,
    days: 100,
    mechanism: 'Въглехидратна ротация',
    beforeImg: `${SPLIT}/boyan_before.jpg`,
    afterImg: `${SPLIT}/boyan_after.jpg`,
    quote:
      'Колегата ми направи тази снимка, за да ми покаже колко съм залепен за бюрото. Никога не съм се чувствал по-фокусиран, отколкото сега с Dr.Fit. Разликата изглежда само 10-15 кг, но с тяхна помощ изобщо не беше борба.',
  },
  {
    id: 'kaloyan',
    name: 'Калоян',
    city: 'Варна',
    age: 28,
    gender: 'male',
    bodyType: 'skinny',
    kgChange: 7,
    days: 100,
    mechanism: 'TUT',
    beforeImg: `${SPLIT}/kaloyan_before.jpg`,
    afterImg: `${SPLIT}/kaloyan_after.jpg`,
    quote:
      'Винаги бях най-слабият на компанията. След три месеца качих чисто, без шкембе. За първи път в живота си се събличам без да мисля.',
  },
  {
    id: 'radina',
    name: 'Радина',
    city: 'София',
    age: 32,
    gender: 'female',
    bodyType: 'overweight',
    kgChange: -7,
    days: 92,
    mechanism: 'AfterBurn',
    beforeImg: `${SPLIT}/radina_before.jpg`,
    afterImg: `${SPLIT}/radina_after.jpg`,
    quote:
      'Тренировките са по 25 минути, не повече. Не съм правила нищо радикално, а за три месеца дрехите от преди две години отново ми стоят.',
  },
  {
    id: 'denitsa',
    name: 'Деница',
    city: 'Стара Загора',
    age: 29,
    gender: 'female',
    bodyType: 'overweight',
    kgChange: -4,
    days: 90,
    mechanism: 'AfterBurn',
    beforeImg: `${SPLIT}/denitsa_before.jpg`,
    afterImg: `${SPLIT}/denitsa_after.jpg`,
    quote:
      'Не съм гладувала и един ден. Само следвах какво ям и кога. Талията ми се появи отново за по-малко от три месеца.',
  },
  {
    id: 'elena',
    name: 'Елена',
    city: 'Русе',
    age: 57,
    gender: 'female',
    bodyType: 'overweight',
    kgChange: -6,
    days: 90,
    mechanism: 'TUT',
    beforeImg: `${SPLIT}/elena_before.jpg`,
    afterImg: `${SPLIT}/elena_after.jpg`,
    quote:
      'Мислех, че след 45 нищо повече не може да се направи. След три месеца съм по-силна, отколкото бях преди десет години.',
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
