'use client';

import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@/components/icons';
import { MiniProjectionChart } from './MiniProjectionChart';
import { TestimonialCard } from './TestimonialCard';
import { pickProjectionTestimonial } from '@/lib/testimonials';
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

  const testimonial = pickProjectionTestimonial(gender, kgDelta);

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

      {/* Testimonial — anchors the abstract curve to a real face */}
      {testimonial && (
        <motion.div variants={item}>
          <p
            className="mb-2 text-[11px] font-extrabold uppercase text-[var(--color-text-strong)]"
            style={{ letterSpacing: '0.16em' }}
          >
            Като теб са успели
          </p>
          <TestimonialCard testimonial={testimonial} />
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
