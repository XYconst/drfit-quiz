// Routing-architecture preview page: pick gender + age band + body type and
// see which avatar archetype (old-you / new-you) and which testimonial slot
// would render. Photos and quote text mirrored from Yordan's
// dr-fit-marketing repo (5 avatars × 3 testimonials each).
//
// Intent of this page: an internal preview surface to share with Dancho.
// Not part of the public funnel — visit /architecture directly to view.

import Link from 'next/link';

type Gender = 'male' | 'female';
type AgeBand = '18-29' | '30-39' | '40-49' | '50+';
type BodyType = 'overweight' | 'skinny-fat' | 'skinny';

interface Avatar {
  slug: string;
  name: string;
  gender: Gender;
  bodyType: BodyType;
  oldYou: string;
  newYou: string;
  testimonials: Array<{ name: string; image: string; quote: string }>;
}

const BASE = '/images/yordan';

const AVATARS: Avatar[] = [
  {
    slug: 'avatar-1',
    name: 'Avatar 1 — Overweight Male',
    gender: 'male',
    bodyType: 'overweight',
    oldYou: `${BASE}/68e26a411f6dd53e569ef69d_overweight-male.webp`,
    newYou: `${BASE}/68e26a528035418b5737d879_fit-male.webp`,
    testimonials: [
      {
        name: 'Danny',
        image: `${BASE}/68e26adae4e3f1f610d35388_testimonial-1-image-.jpg`,
        quote: 'Преди се криех под широки дрехи, а сега нося прилепнали всеки ден.',
      },
      {
        name: 'Alex',
        image: `${BASE}/68e26ade1548c8d62f65c76e_testimonial-2-image-.jpg`,
        quote: 'Преди постоянно сменях диети и никога не издържах. Сега съм надолу.',
      },
      {
        name: 'Stefan',
        image: `${BASE}/68e26ae1cabcac682915e874_testimonial-3-image-.jpg`,
        quote: 'За първи път в живота си се чувствам уверен, когато сваля тениската.',
      },
    ],
  },
  {
    slug: 'avatar-2',
    name: 'Avatar 2 — Overweight Female',
    gender: 'female',
    bodyType: 'overweight',
    oldYou: `${BASE}/68e26db494f0ac3ba259d0ef_overweight-female.avif`,
    newYou: `${BASE}/68e26dbcd2184c53067c2373_fit-female.webp`,
    testimonials: [
      {
        name: 'Maria',
        image: `${BASE}/68e271640fa91a57973ee27f_testimonial-1-avatar-2-image-.avif`,
        quote: 'Пробвах толкова много диети, но нищо не проработи задълго. Програмата на Dr.Fit работи.',
      },
      {
        name: 'Emma',
        image: `${BASE}/68e2716b7782e21e4d9afc1b_testimonial-2-avatar-2-image-.avif`,
        quote: 'Преди се криех в широки дрехи, надявайки се никой да не ме забележи.',
      },
      {
        name: 'Mia',
        image: `${BASE}/68e2717578675ff9623dfe53_testimonial-3-avatar-2-image-.avif`,
        quote: 'Това не беше просто физическа промяна. Върна ми енергията и увереността.',
      },
    ],
  },
  {
    slug: 'avatar-3',
    name: 'Avatar 3 — Skinny-Fat Male',
    gender: 'male',
    bodyType: 'skinny-fat',
    oldYou: `${BASE}/68e272ac2a3959987f553747_skinny-fat-male.webp`,
    newYou: `${BASE}/68e26a528035418b5737d879_fit-male.webp`,
    testimonials: [
      {
        name: 'Marco',
        image: `${BASE}/68e28d68a33d56fbe96310e3_testimonial-1-avatar-3-image-.jpg`,
        quote: 'Колкото и да тренирах, винаги изглеждах мек. Сега имам видими плочки.',
      },
      {
        name: 'Alex',
        image: `${BASE}/68e28d8a4966bd93556030bd_testimonial-2-avatar-3-image-.jpg`,
        quote: 'Преди се криех под широки тениски, защото изглеждах посредствено.',
      },
      {
        name: 'Stefan',
        image: `${BASE}/68e28d82ba4ee29c2ed90b87_testimonial-3-avatar-3-image-.jpg`,
        quote: 'Години наред качвах и свалях, но никога не изглеждах по-добре. Сега ръцете ми...',
      },
    ],
  },
  {
    slug: 'avatar-4',
    name: 'Avatar 4 — Skinny-Fat Female',
    gender: 'female',
    bodyType: 'skinny-fat',
    oldYou: `${BASE}/68e28e7413023b83990fe2c5_skinny-fat-female.webp`,
    newYou: `${BASE}/68e26dbcd2184c53067c2373_fit-female.webp`,
    testimonials: [
      {
        name: 'Maria',
        image: `${BASE}/68e28fb28a57a7b5bddb5822_testimonial-1-avatar-4-image-.jpg`,
        quote: 'Винаги изглеждах „ок" с дрехи, но мразех колко отпусната се чувствах.',
      },
      {
        name: 'Emma',
        image: `${BASE}/68e28fb74ba94799003a1ed9_testimonial-2-avatar-4-image-.jpg`,
        quote: 'Нямах нужда да свалям много килограми — просто исках да се чувствам уверена.',
      },
      {
        name: 'Mia',
        image: `${BASE}/68e28fc1b534a5ce6167a2e3_testimonial-3-avatar-4-image-.jpg`,
        quote: 'Преди си мислех, че кардиото е решението, но пак се чувствах отпусната.',
      },
    ],
  },
  {
    slug: 'avatar-5',
    name: 'Avatar 5 — Skinny Male (wants to gain)',
    gender: 'male',
    bodyType: 'skinny',
    oldYou: `${BASE}/68e291134c60e2add24a07e6_skinny-male.webp`,
    newYou: `${BASE}/68e26a528035418b5737d879_fit-male.webp`,
    testimonials: [
      {
        name: 'Marco',
        image: `${BASE}/68e291e5715f79d3ce95f6c2_testimonial-1-avatar-5-image-.jpg`,
        quote: 'Преди се чувствах невидим — просто слаб мъж без присъствие.',
      },
      {
        name: 'Alex',
        image: `${BASE}/68e291eafc9ee3be3c16ebf0_testimonial-2-avatar-5-image-.jpg`,
        quote: 'Никога не съм изглеждал зле, просто малък. Сега раменете ми са по-широки.',
      },
      {
        name: 'Stefan',
        image: `${BASE}/68e291f369618cca6277bef1_testimonial-3-avatar-5-image-.jpg`,
        quote: 'Опитах се да покачвам, тренирах здраво, но нищо не се задържаше.',
      },
    ],
  },
];

const AGE_BANDS: AgeBand[] = ['18-29', '30-39', '40-49', '50+'];
const BODY_TYPES: BodyType[] = ['overweight', 'skinny-fat', 'skinny'];

function pickAvatar(gender: Gender, bodyType: BodyType): Avatar | null {
  // Skinny + female isn't in Yordan's pool today; gracefully fall back.
  const exact = AVATARS.find((a) => a.gender === gender && a.bodyType === bodyType);
  if (exact) return exact;
  const sameGender = AVATARS.find((a) => a.gender === gender);
  return sameGender ?? null;
}

interface PageProps {
  searchParams: Promise<{ g?: string; age?: string; bt?: string }>;
}

export default async function ArchitecturePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const gender: Gender = sp.g === 'female' ? 'female' : 'male';
  const ageBand: AgeBand = (AGE_BANDS as readonly string[]).includes(sp.age ?? '')
    ? (sp.age as AgeBand)
    : '30-39';
  const bodyType: BodyType = (BODY_TYPES as readonly string[]).includes(sp.bt ?? '')
    ? (sp.bt as BodyType)
    : 'overweight';

  const avatar = pickAvatar(gender, bodyType);

  const linkClass = (active: boolean) =>
    `inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors ${
      active
        ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red)] text-white'
        : 'border-[var(--color-line)] bg-white text-[var(--color-text-strong)] hover:border-[var(--color-text-muted)]'
    }`;

  return (
    <main className="max-w-3xl mx-auto px-5 py-8">
      <header className="mb-6">
        <p
          className="text-[10px] font-extrabold uppercase text-[var(--color-brand-red)] mb-2"
          style={{ letterSpacing: '0.22em' }}
        >
          Internal preview · not public funnel
        </p>
        <h1 className="text-[28px] font-extrabold text-[var(--color-text-headline)] leading-tight">
          Testimonial routing — пробна архитектура
        </h1>
        <p className="mt-2 text-[14px] text-[var(--color-text-muted)] max-w-[60ch]">
          Pick a gender / age / starting body type. The page shows which avatar
          archetype (old-you → new-you) and which three social-proof testimonials
          would render on the social-proof interstitials. Photos pulled from
          YordanBahov-bg/dr-fit-marketing (avatar-1 … avatar-5).
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--color-line)] bg-white p-5 mb-6">
        <div className="mb-4">
          <p
            className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)] mb-2"
            style={{ letterSpacing: '0.22em' }}
          >
            Gender
          </p>
          <div className="flex gap-2 flex-wrap">
            {(['male', 'female'] as Gender[]).map((g) => (
              <Link
                key={g}
                href={`?g=${g}&age=${ageBand}&bt=${bodyType}`}
                className={linkClass(gender === g)}
              >
                {g === 'male' ? 'Мъж' : 'Жена'}
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p
            className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)] mb-2"
            style={{ letterSpacing: '0.22em' }}
          >
            Age band
          </p>
          <div className="flex gap-2 flex-wrap">
            {AGE_BANDS.map((a) => (
              <Link
                key={a}
                href={`?g=${gender}&age=${a}&bt=${bodyType}`}
                className={linkClass(ageBand === a)}
              >
                {a}
              </Link>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
            Age band currently informs which character m1-m4 / f1-f4 is used for
            in-quiz body-type photos. Yordan's testimonial photo pool is NOT yet
            split by age; same testimonial fires across ages within a body-type.
          </p>
        </div>

        <div>
          <p
            className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)] mb-2"
            style={{ letterSpacing: '0.22em' }}
          >
            Starting body type
          </p>
          <div className="flex gap-2 flex-wrap">
            {BODY_TYPES.map((b) => (
              <Link
                key={b}
                href={`?g=${gender}&age=${ageBand}&bt=${b}`}
                className={linkClass(bodyType === b)}
              >
                {b === 'overweight' ? 'Наднормено' : b === 'skinny-fat' ? 'Слаб с мазнини' : 'Сух / иска маса'}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {!avatar ? (
        <div className="rounded-2xl border-2 border-dashed border-[var(--color-brand-red)] p-6 text-center">
          <p className="font-bold text-[var(--color-brand-red)]">No matching avatar.</p>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
            Yordan's pool covers male overweight/skinny-fat/skinny and female
            overweight/skinny-fat. Female skinny + age-band gaps need new photos.
          </p>
        </div>
      ) : (
        <>
          <section className="rounded-2xl border border-[var(--color-line)] bg-white p-5 mb-6">
            <p
              className="text-[10px] font-extrabold uppercase text-[var(--color-brand-red)] mb-1"
              style={{ letterSpacing: '0.22em' }}
            >
              Matched avatar
            </p>
            <h2 className="text-[18px] font-extrabold text-[var(--color-text-headline)] mb-4">
              {avatar.name} <span className="text-[var(--color-text-muted)] font-normal text-[14px]">({avatar.slug})</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Old you', src: avatar.oldYou },
                { label: 'New you', src: avatar.newYou },
              ].map((slot) => (
                <div key={slot.label} className="rounded-xl overflow-hidden border border-[var(--color-line)]">
                  <div className="aspect-[3/4] bg-[var(--color-surface-100)] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slot.src}
                      alt={slot.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="px-3 py-2 text-center">
                    <p
                      className="text-[10px] uppercase font-bold text-[var(--color-text-muted)]"
                      style={{ letterSpacing: '0.2em' }}
                    >
                      {slot.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
            <p
              className="text-[10px] font-extrabold uppercase text-[var(--color-brand-red)] mb-1"
              style={{ letterSpacing: '0.22em' }}
            >
              Social-proof testimonials (3 slots)
            </p>
            <p className="text-[13px] text-[var(--color-text-muted)] mb-4">
              Each social-proof interstitial in the quiz would draw one of these
              three. Today the quiz hardcodes by gender only; this matrix routes
              by gender + body-type.
            </p>
            <div className="flex flex-col gap-4">
              {avatar.testimonials.map((t, i) => (
                <article key={i} className="flex gap-4 items-start border-t border-[var(--color-line)] pt-4 first:border-t-0 first:pt-0">
                  <div className="shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-[var(--color-surface-100)] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.image}
                      alt={t.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[15px] text-[var(--color-text-headline)]">{t.name}</p>
                    <p className="mt-1 text-[13px] text-[var(--color-text-body)] leading-snug">{t.quote}</p>
                    <p
                      className="mt-2 text-[10px] uppercase font-bold text-[var(--color-text-muted)]"
                      style={{ letterSpacing: '0.2em' }}
                    >
                      Source: Yordan, {avatar.slug}, testimonial-{i + 1}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-2xl border-2 border-dashed border-[var(--color-text-muted)] p-5">
            <p
              className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)] mb-2"
              style={{ letterSpacing: '0.22em' }}
            >
              What we still need from Dancho
            </p>
            <ul className="text-[13px] text-[var(--color-text-body)] leading-relaxed list-disc pl-5">
              <li>Female skinny avatar (currently no avatar-6 / skinny female in the pool).</li>
              <li>Age-band split — same body type but with 18-29 / 40-49 / 50+ specific photos so a 22-year-old doesn't see a 45-year-old in the proof slot, and vice versa.</li>
              <li>Real before+after pairs (the avatar archetypes are model stand-ins, not real client transformations).</li>
              <li>Permission to use the photos on the funnel.</li>
            </ul>
            <p className="mt-3 text-[12px] text-[var(--color-text-muted)]">
              Detailed matrix in docs/FOLLOWUPS.md inside the repo.
            </p>
          </section>
        </>
      )}
    </main>
  );
}
