import type { AvatarId } from '@/lib/avatars';
import { pickTestimonials, type Testimonial } from '@/lib/testimonials';

interface Props {
  avatar: AvatarId;
}

function Stars() {
  return (
    <span aria-label="5 от 5" className="inline-flex gap-0.5 text-[var(--color-brand-red)]">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden>★</span>
      ))}
    </span>
  );
}

function Card({ t }: { t: Testimonial }) {
  const initial = t.name[0] ?? '?';
  const isLoss = t.kgChange < 0;
  const kgLabel = `${isLoss ? '−' : '+'}${Math.abs(t.kgChange)} кг за ${t.days} дни`;

  return (
    <article className="snap-start shrink-0 w-[88%] sm:w-auto sm:max-w-[20rem] rounded-2xl bg-[var(--color-paper-warm)] border border-[var(--color-line)] overflow-hidden">
      {/* photo / initial */}
      <div className="aspect-square w-full bg-[var(--color-graphite)] flex items-center justify-center relative">
        {/* When we have real photos, render before/after split here. */}
        <span
          className="text-white/85 leading-none"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 12vw, 5rem)', fontStyle: 'italic' }}
        >
          {initial}
        </span>
        <span
          className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-white/95 text-[var(--color-brand-red)] text-xs font-bold"
          style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
        >
          {kgLabel}
        </span>
      </div>

      {/* meta + quote */}
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-semibold text-[var(--color-text-headline)]">
            {t.name} · {t.city}
          </p>
          <p
            className="text-xs text-[var(--color-text-muted)]"
            style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
          >
            {t.age} г.
          </p>
        </div>

        <div className="mt-1 text-sm">
          <Stars />
        </div>

        <p className="mt-3 min-h-[3em] text-sm leading-snug text-[var(--color-text-body)]">
          {t.quote ?? (
            <span className="italic text-[var(--color-text-muted)]">
              Реален отзив очакваме.
            </span>
          )}
        </p>

        {t.mechanism && (
          <p
            className="mt-3 text-xs text-[var(--color-brand-red)]"
            style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600 }}
          >
            *{t.mechanism}*
          </p>
        )}
      </div>
    </article>
  );
}

export function TestimonialsBlock({ avatar }: Props) {
  const picks = pickTestimonials(avatar);
  if (picks.length === 0) return null;

  return (
    <div
      className="-mx-5 px-5 flex gap-3 overflow-x-auto snap-x snap-mandatory sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible"
      style={{ scrollbarWidth: 'thin' }}
    >
      {picks.map((t) => (
        <Card key={t.id} t={t} />
      ))}
    </div>
  );
}
