'use client';

import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@/components/icons';
import { MiniProjectionChart } from './MiniProjectionChart';
import { pickProjectionTestimonials, type Testimonial } from '@/lib/testimonials';
import { StarIcon } from '@/components/icons';
import type { Gender } from '@/lib/avatars';

interface Props {
  headline?: string;
  subheadline?: string;
  reassure?: string;
  ctaLabel: string;
  heightCm: number;
  currentKg: number;
  targetKg: number;
  /** signed: positive = user wants to lose, negative = user wants to gain */
  kgDelta: number;
  /** End-date label from the targetDate step (e.g. "3 месеца" or "15 август 2026 г.") */
  targetDateLabel?: string;
  gender: Gender;
  onContinue: () => void;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 0.61, 0.36, 1] as const },
  },
};

function formatDateShort(label: string | undefined): string | undefined {
  if (!label) return undefined;
  // If it's already a Bulgarian-readable label (e.g. "3 месеца"), pass through.
  if (/[а-я]/i.test(label)) return label;
  // Otherwise try to format an ISO date as "15 авг."
  const d = new Date(label);
  if (Number.isNaN(d.getTime())) return label;
  return d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'short' });
}

export function ProjectionPreview({
  headline,
  subheadline,
  reassure,
  ctaLabel,
  currentKg,
  targetKg,
  kgDelta,
  targetDateLabel,
  gender,
  onContinue,
}: Props) {
  const isLoss = kgDelta > 0;
  const kgAbs = Math.abs(kgDelta).toFixed(0);
  const heroVerb = isLoss ? 'Свали' : 'Качи';
  const heroDate = formatDateShort(targetDateLabel);

  const testimonials = pickProjectionTestimonials(gender, kgDelta, 3);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5 pb-2"
    >
      {/* Headline + subhead are rendered by QuestionShell; this screen leads with the hero metric. */}
      {headline && (
        <motion.h2
          variants={item}
          className="text-center font-extrabold text-[var(--color-text-headline)] sr-only"
        >
          {headline}
        </motion.h2>
      )}
      {subheadline && (
        <motion.p
          variants={item}
          className="sr-only"
        >
          {subheadline}
        </motion.p>
      )}

      {/* Hero metric — the kg-delta and date as a single decisive line */}
      <motion.div
        variants={item}
        className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-warm)] px-5 py-5 text-center"
      >
        <p
          className="text-[10px] font-extrabold uppercase text-[var(--color-brand-red)]"
          style={{ letterSpacing: '0.22em' }}
        >
          Твоят път
        </p>
        <p
          className="mt-2 font-extrabold text-[var(--color-text-headline)] tabular-nums"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(1.625rem, 6.5vw, 2.25rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}
        >
          {heroVerb} {kgAbs} кг
          {heroDate ? <span className="text-[var(--color-text-strong)]"> · {heroDate}</span> : null}
        </p>
        <p className="mt-1 text-[13px] text-[var(--color-text-muted)] font-medium">
          {isLoss
            ? 'Постижимо при съответен дефицит и активност.'
            : 'Постижимо при контролиран профицит и тренировки.'}
        </p>
      </motion.div>

      {/* Mini projection curve */}
      <motion.div variants={item}>
        <MiniProjectionChart
          currentKg={currentKg}
          targetKg={targetKg}
          endDateLabel={heroDate}
        />
      </motion.div>

      {/* Testimonials stacked vertically — full-bleed photos so each face
          reads clearly; same gradient + hairline border treatment used on the
          realism verdict card so the visual language stays consistent. */}
      {testimonials.length > 0 && (
        <motion.div variants={item} className="flex flex-col gap-4">
          <p
            className="text-[11px] font-extrabold uppercase text-[var(--color-text-strong)]"
            style={{ letterSpacing: '0.16em' }}
          >
            Като теб са успели
          </p>
          {testimonials.map((t) => (
            <BigTestimonialCard key={t.id} testimonial={t} />
          ))}
        </motion.div>
      )}

      {/* Reassurance — small and italic, just above the CTA */}
      {reassure && (
        <motion.p
          variants={item}
          className="text-center text-[13px] text-[var(--color-text-muted)] italic"
        >
          {reassure}
        </motion.p>
      )}

      {/* CTA */}
      <motion.button
        variants={item}
        type="button"
        onClick={onContinue}
        style={{ transformOrigin: 'center' }}
        className={[
          'group w-full h-16 rounded-full font-extrabold text-white bg-brand-gradient shadow-brand-red',
          'flex items-center justify-center gap-2.5 mt-1',
          'motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 motion-safe:ease-out',
          'motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[0_18px_32px_-12px_rgba(165,0,21,0.55)]',
          'motion-safe:active:scale-[0.98] motion-safe:active:duration-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
        ].join(' ')}
      >
        <span style={{ letterSpacing: '0.01em' }}>{ctaLabel}</span>
        <ArrowRightIcon
          width={18}
          height={18}
          className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out group-hover:motion-safe:translate-x-0.5"
        />
      </motion.button>
    </motion.div>
  );
}

/**
 * Full-bleed vertical testimonial card. Same gradient surface + hairline
 * gradient border as the realism verdict on the plan page, so the projection
 * screen reads as the same visual family.
 */
function BigTestimonialCard({ testimonial: t }: { testimonial: Testimonial }) {
  const isLoss = t.kgChange < 0;
  const kgLabel = `${isLoss ? '−' : '+'}${Math.abs(t.kgChange)} кг · ${t.days} дни`;
  return (
    <article
      className="relative rounded-[22px] overflow-hidden"
      style={{
        fontFamily: 'var(--font-sans)',
        background: 'linear-gradient(160deg, #FFF1ED 0%, #FFFFFF 50%, #FFF6F1 100%)',
        boxShadow:
          '0 1px 0 rgba(165,0,21,0.10) inset, 0 14px 32px -22px rgba(165,0,21,0.35)',
      }}
    >
      {/* Hairline gradient border */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[22px]"
        style={{
          padding: 1,
          background:
            'linear-gradient(135deg, rgba(229,9,20,0.45), rgba(165,0,21,0.08))',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

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

      <div className="relative px-5 pt-4 pb-5">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="size-2 rounded-full"
            style={{
              background: '#E50914',
              boxShadow: '0 0 0 4px rgba(229,9,20,0.18)',
            }}
          />
          <p
            className="text-[10px] font-extrabold uppercase"
            style={{ letterSpacing: '0.22em', color: '#A50015' }}
          >
            {kgLabel}
          </p>
        </div>

        <div className="mt-2 flex items-baseline justify-between gap-3">
          <h3
            className="font-extrabold text-[var(--color-text-headline)] leading-tight"
            style={{
              fontSize: 'clamp(1.125rem, 4.4vw, 1.3125rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {t.name}{' '}
            <span className="font-bold text-[var(--color-text-muted)]">· {t.city}</span>
          </h3>
          <p
            className="shrink-0 text-[12px] text-[var(--color-text-muted)] tabular-nums"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {t.age} г.
          </p>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span aria-label="5 от 5" className="inline-flex gap-0.5 text-[var(--color-brand-red)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} width={13} height={13} aria-hidden />
            ))}
          </span>
          {t.mechanism && (
            <span
              className="text-[12px] text-[var(--color-text-body)]"
              style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
            >
              · {t.mechanism}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
