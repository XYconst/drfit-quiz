'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AvatarId } from '@/lib/avatars';
import { pickProjectionTestimonials, type Testimonial } from '@/lib/testimonials';
import type { Gender } from '@/lib/avatars';
import { StarIcon, CheckIcon, LockIcon } from '@/components/icons';

interface Props {
  avatarId: AvatarId;
  gender: Gender;
  /** Used to pick "closest to you" testimonials. positive = wants to lose */
  kgDelta: number;
}

/** The five VSL headlines verbatim (one per avatar) — surfaced as the user's
 *  personal "we know exactly why you're here" beat at the top of the extras. */
const AVATAR_HEADLINE: Record<AvatarId, string> = {
  '01':
    'Истината защо повечето мъже с наднормено тегло се провалят и как хиляди други свалиха излишните килограми с 3 прости стъпки.',
  '02':
    'Истината защо повечето жени с наднормено тегло се провалят и как хиляди други върнаха здравословното си тегло с 3 прости стъпки.',
  '03':
    'Истината защо изглеждаш мек и неоформен дори ако тренираш, и как хиляди други мъже постигнаха супер тяло с 3 прости стъпки.',
  '04':
    'Истината защо изглеждаш мека и неоформена дори ако тренираш, и как хиляди други жени постигнаха супер тяло с 3 прости стъпки.',
  '05':
    'Истината защо не можеш да качиш мускулна маса въпреки че ядеш много и тренираш, и как само 15 минути на ден активират "Режим на Растеж".',
};

const FEATURES = [
  {
    eyebrow: 'Прогресивни програми',
    body:
      '4 структурирани програми с над 120 тренировъчни шаблона. Всяка сесия надгражда предишната.',
  },
  {
    eyebrow: 'Персонално хранене',
    body:
      'Дневни менюта с изчислени макроси, съобразени с тялото и целите ти — отслабване, мускулна маса или поддръжка.',
  },
  {
    eyebrow: '28-дневни цикли',
    body:
      'Структурирани 28-дневни цикли с вградена прогресия. Правиш нова оценка и растеш с всяка следваща фаза.',
  },
] as const;

const DEEP_FEATURES = [
  {
    title: 'Интелигентно генериране на тренировки',
    body:
      'Въвеждаш нивото си, целите и екипировката. Алгоритъмът избира от библиотека с над 100 упражнения и изгражда перфектната програма със загряване, целенасочени упражнения и вградена прогресия.',
  },
  {
    title: 'Хранене, което пасва на живота ти',
    body:
      'Без строги диети. Получаваш дневни менюта с истинска храна, изчислени макроси и насоки за порциите. Менюто се обновява всеки ден, за да имаш разнообразие без усилие.',
  },
  {
    title: 'Адаптира се към тялото ти',
    body:
      'Споделяш контузиите, екипировката и предпочитанията си. Приложението автоматично избягва неподходящите упражнения и вгражда безопасни алтернативи във всяка тренировка.',
  },
] as const;

const WORKOUT_TAGS = ['Сила', 'HIIT', 'Корем', 'Цяло тяло', 'Горна част', 'Долна част', 'Дупе', 'Загряване'];

const FAQS = [
  {
    q: 'Какво е Dr.Fit?',
    a: 'Dr.Fit е платформа за фитнес тренировки, която ти дава структурирани програми и хранителни планове през мобилно приложение. Всяка програма е изградена на базата на спортна наука, не на трендове.',
  },
  {
    q: 'Трябва ли ми екипировка?',
    a: 'Не непременно. Dr.Fit изгражда програмата ти спрямо наличната екипировка, без значение дали тренираш в зала, с дъмбели вкъщи или само с тежестта на тялото си.',
  },
  {
    q: 'Как се персонализират програмите?',
    a: 'Въвеждаш нивото си, целите и наличната екипировка. Алгоритъмът изгражда прогресивен тренировъчен план точно за теб със загряване, структурирани тренировки и вградено възстановяване.',
  },
  {
    q: 'Има ли хранителен план?',
    a: 'Да. Всеки план включва дневно хранително меню с изчислени макронутриенти, базирани на твоите цели: отслабване, покачване на мускулна маса или поддръжка.',
  },
  {
    q: 'Колко дълги са програмите?',
    a: 'Всеки тренировъчен цикъл е 28 дни. В края на всеки цикъл правиш нова оценка и получаваш програма, която прогресира заедно с теб.',
  },
  {
    q: 'Мога ли да откажа по всяко време?',
    a: 'Разбира се. Отказваш абонамента си по всяко време директно от приложението или с един линк, без обаждания и без усложнения.',
  },
];

export function PlanExtras({ avatarId, gender, kgDelta }: Props) {
  const testimonials = pickProjectionTestimonials(gender, kgDelta, 3);
  const headline = AVATAR_HEADLINE[avatarId];

  return (
    <div className="flex flex-col gap-8 mt-2">
      <PersonalHook headline={headline} />
      <FeaturesGrid />
      <DeepFeatures />
      <WorkoutTags />
      {testimonials.length > 0 && <TransformationStack testimonials={testimonials} />}
      <GuaranteeBand />
      <FaqAccordion />
    </div>
  );
}

function PersonalHook({ headline }: { headline: string }) {
  return (
    <section
      className="relative rounded-[22px] overflow-hidden px-5 py-6"
      style={{
        fontFamily: 'var(--font-sans)',
        background: 'linear-gradient(160deg, #FFF1ED 0%, #FFFFFF 55%, #FFF6F1 100%)',
        boxShadow:
          '0 1px 0 rgba(165,0,21,0.10) inset, 0 14px 32px -22px rgba(165,0,21,0.35)',
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[22px]"
        style={{
          padding: 1,
          background: 'linear-gradient(135deg, rgba(229,9,20,0.45), rgba(165,0,21,0.08))',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div className="relative">
        <p
          className="text-[10px] font-extrabold uppercase mb-2"
          style={{ letterSpacing: '0.22em', color: '#A50015' }}
        >
          Защо точно за теб
        </p>
        <p
          className="font-extrabold text-[var(--color-text-headline)]"
          style={{
            fontSize: 'clamp(1.0625rem, 4.4vw, 1.25rem)',
            letterSpacing: '-0.015em',
            lineHeight: 1.3,
            textWrap: 'balance',
          }}
        >
          {headline}
        </p>
      </div>
    </section>
  );
}

function FeaturesGrid() {
  return (
    <section>
      <SectionEyebrow>Какво получаваш</SectionEyebrow>
      <h2
        className="font-extrabold text-[var(--color-text-headline)] mt-1 mb-4"
        style={{ fontSize: 'clamp(1.375rem, 6vw, 1.75rem)', letterSpacing: '-0.02em', textWrap: 'balance' }}
      >
        Твоят треньор. Твоята програма. Твоите резултати.
      </h2>
      <div className="flex flex-col gap-3">
        {FEATURES.map((f) => (
          <article
            key={f.eyebrow}
            className="rounded-2xl bg-white border border-[var(--color-line)] px-5 py-4"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-0.5 shrink-0 size-9 rounded-full bg-[var(--color-brand-red-tint)] grid place-items-center text-[var(--color-brand-red)]"
              >
                <CheckIcon width={16} height={16} />
              </span>
              <div className="min-w-0">
                <p
                  className="font-extrabold text-[14px] text-[var(--color-text-headline)] leading-tight"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  {f.eyebrow}
                </p>
                <p className="mt-1 text-[13px] text-[var(--color-text-body)] leading-snug">{f.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DeepFeatures() {
  return (
    <section>
      <SectionEyebrow>Всичко, от което имаш нужда</SectionEyebrow>
      <h2
        className="font-extrabold text-[var(--color-text-headline)] mt-1 mb-4"
        style={{ fontSize: 'clamp(1.375rem, 6vw, 1.75rem)', letterSpacing: '-0.02em', textWrap: 'balance' }}
      >
        Нищо излишно.
      </h2>
      <div className="flex flex-col gap-4">
        {DEEP_FEATURES.map((f, i) => (
          <article
            key={f.title}
            className="rounded-2xl bg-[var(--color-paper-warm)] border border-[var(--color-line)] px-5 py-4"
          >
            <p
              className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)] mb-1.5"
              style={{ letterSpacing: '0.22em', fontFamily: 'var(--font-mono)' }}
            >
              0{i + 1}
            </p>
            <p
              className="font-extrabold text-[15.5px] text-[var(--color-text-headline)] leading-tight"
              style={{ letterSpacing: '-0.015em' }}
            >
              {f.title}
            </p>
            <p className="mt-1.5 text-[13px] text-[var(--color-text-body)] leading-snug">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function WorkoutTags() {
  return (
    <section>
      <SectionEyebrow>Повече начини да тренираш</SectionEyebrow>
      <p className="mt-1 mb-3 text-[13px] text-[var(--color-text-body)]">
        От силови кръгове до HIIT финишъри, всеки тип тренировка е покрит.
      </p>
      <div className="flex flex-wrap gap-2">
        {WORKOUT_TAGS.map((t) => (
          <span
            key={t}
            className="rounded-full bg-white border border-[var(--color-line)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--color-text-strong)]"
          >
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

function TransformationStack({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section>
      <SectionEyebrow>Истински трансформации</SectionEyebrow>
      <h2
        className="font-extrabold text-[var(--color-text-headline)] mt-1 mb-4"
        style={{ fontSize: 'clamp(1.375rem, 6vw, 1.75rem)', letterSpacing: '-0.02em', textWrap: 'balance' }}
      >
        Хора с твоя профил, които вече стигнаха целта.
      </h2>
      <div className="flex flex-col gap-4">
        {testimonials.map((t) => {
          const isLoss = t.kgChange < 0;
          const kgLabel = `${isLoss ? '−' : '+'}${Math.abs(t.kgChange)} кг · ${t.days} дни`;
          return (
            <article
              key={t.id}
              className="rounded-2xl bg-white border border-[var(--color-line)] overflow-hidden"
            >
              {t.afterImg && (
                <div className="relative w-full bg-[var(--color-graphite)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.afterImg}
                    alt={t.name}
                    className="block w-full h-auto"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-extrabold text-[15px] text-[var(--color-text-headline)]">
                    {t.name}{' '}
                    <span className="font-bold text-[var(--color-text-muted)]">· {t.city}</span>
                  </p>
                  <p
                    className="text-[11px] text-[var(--color-text-muted)] tabular-nums"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {t.age} г.
                  </p>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span aria-label="5 от 5" className="inline-flex gap-0.5 text-[var(--color-brand-red)]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} width={12} height={12} aria-hidden />
                    ))}
                  </span>
                  <span
                    className="text-[11px] font-extrabold uppercase text-[var(--color-brand-red)]"
                    style={{ letterSpacing: '0.14em', fontFamily: 'var(--font-mono)' }}
                  >
                    {kgLabel}
                  </span>
                </div>
                {t.quote && (
                  <p
                    className="mt-2 text-[13px] leading-snug text-[var(--color-text-body)]"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      textWrap: 'pretty',
                    }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function GuaranteeBand() {
  return (
    <section
      className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-warm)] px-5 py-4 flex items-start gap-3"
    >
      <span
        aria-hidden
        className="mt-0.5 shrink-0 size-10 rounded-full bg-white grid place-items-center text-[var(--color-brand-red)] border border-[var(--color-line)]"
      >
        <LockIcon width={18} height={18} />
      </span>
      <div className="min-w-0">
        <p
          className="text-[10px] font-extrabold uppercase text-[var(--color-brand-red)] mb-0.5"
          style={{ letterSpacing: '0.2em' }}
        >
          Без риск
        </p>
        <p className="text-[13.5px] font-semibold text-[var(--color-text-headline)] leading-snug">
          Отказваш с един клик от приложението или с линк. Без обаждания, без усложнения.
        </p>
      </div>
    </section>
  );
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section>
      <SectionEyebrow>Въпроси? Отговори.</SectionEyebrow>
      <h2
        className="font-extrabold text-[var(--color-text-headline)] mt-1 mb-4"
        style={{ fontSize: 'clamp(1.375rem, 6vw, 1.75rem)', letterSpacing: '-0.02em' }}
      >
        Често задавани въпроси
      </h2>
      <div className="flex flex-col gap-2">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className="rounded-2xl bg-white border border-[var(--color-line)] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="font-extrabold text-[14.5px] text-[var(--color-text-headline)]">
                  {f.q}
                </span>
                <span
                  aria-hidden
                  className="shrink-0 size-6 rounded-full bg-[var(--color-paper-warm)] grid place-items-center text-[var(--color-brand-red)] motion-safe:transition-transform motion-safe:duration-200"
                  style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1.5 V10.5 M1.5 6 H10.5"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24, ease: 'easeOut' }}
                  >
                    <p className="px-5 pb-4 text-[13px] text-[var(--color-text-body)] leading-snug">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)]"
      style={{ letterSpacing: '0.22em' }}
    >
      {children}
    </p>
  );
}
