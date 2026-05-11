'use client';

import type { Testimonial } from '@/lib/testimonials';
import { StarIcon } from '@/components/icons';

interface Props {
  testimonial: Testimonial;
  /** Optional photo override. Falls back to the initial inside a graphite block. */
  imgSrc?: string;
}

export function TestimonialCard({ testimonial: t, imgSrc }: Props) {
  const isLoss = t.kgChange < 0;
  const kgLabel = `${isLoss ? '−' : '+'}${Math.abs(t.kgChange)} кг · ${t.days} дни`;
  const initial = t.name[0] ?? '?';

  return (
    <article className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-warm)] overflow-hidden flex items-stretch">
      {/* Photo (or initial fallback) — left, square */}
      <div className="relative shrink-0 w-24 sm:w-28 bg-[var(--color-graphite)] flex items-center justify-center">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={t.name}
            width={112}
            height={112}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'right center' }}
            loading="lazy"
          />
        ) : (
          <span
            aria-hidden
            className="text-white/85 leading-none"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 8vw, 3rem)',
              fontStyle: 'italic',
            }}
          >
            {initial}
          </span>
        )}
      </div>

      {/* Meta — right */}
      <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-center gap-1">
        <div className="flex items-baseline justify-between gap-2 min-w-0">
          <p className="text-[14px] font-semibold text-[var(--color-text-headline)] truncate">
            {t.name} · {t.city}
          </p>
          <p
            className="shrink-0 text-[11px] text-[var(--color-text-muted)]"
            style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
          >
            {t.age} г.
          </p>
        </div>

        <span aria-label="5 от 5" className="inline-flex gap-0.5 text-[var(--color-brand-red)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} width={12} height={12} aria-hidden />
          ))}
        </span>

        <p
          className="mt-0.5 text-[12px] font-bold text-[var(--color-brand-red)]"
          style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}
        >
          {kgLabel}
        </p>

        {t.mechanism && (
          <p
            className="text-[11px] text-[var(--color-text-muted)] truncate"
            style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
          >
            *{t.mechanism}*
          </p>
        )}
      </div>
    </article>
  );
}
