'use client';
import { motion } from 'framer-motion';
import type { Gender } from '@/lib/avatars';

interface Props {
  /** Motivation codes the user picked (e.g. ['kids', 'photos']). */
  codes: string[];
  /** Gender drives which gender-aware visual we render per slot. */
  gender: Gender;
}

/** Headline text that frames why we're showing the user this image. */
const SLOT_COPY: Record<string, { eyebrow: string; line: string }> = {
  health: { eyebrow: 'За здраве', line: 'По-добра форма, повече години активност.' },
  partner: { eyebrow: 'За половинката си', line: 'Уверен/-а до човека, който обичаш.' },
  photos: { eyebrow: 'За снимки и огледало', line: 'Тялото, което искаш да виждаш.' },
  kids: { eyebrow: 'За децата', line: 'Силна/-силен пример, неуморен/-а в играта.' },
  event: { eyebrow: 'За конкретното събитие', line: 'Готов/-а в деня, който очакваш.' },
  prove: { eyebrow: 'Стига вече', line: 'Този път стига до края.' },
};

const KNOWN = new Set(Object.keys(SLOT_COPY));

export function MotivationVisuals({ codes, gender }: Props) {
  const valid = codes.filter((c) => KNOWN.has(c));
  if (valid.length === 0) return null;

  return (
    <section>
      <p
        className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)] mb-3"
        style={{ letterSpacing: '0.22em' }}
      >
        Защо точно сега
      </p>
      <div className="flex flex-col gap-3">
        {valid.map((code, i) => {
          const copy = SLOT_COPY[code];
          const src = `/images/photo/motivations/${code}-${gender}.png`;
          return (
            <motion.article
              key={code}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: i * 0.06, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-graphite)] aspect-[16/10]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={copy.eyebrow}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center 30%' }}
                loading="lazy"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.78) 100%)',
                }}
              />
              <div className="absolute left-4 right-4 bottom-4 text-white">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-white/85"
                  style={{ letterSpacing: '0.22em' }}
                >
                  <span aria-hidden className="size-1 rounded-full bg-[var(--color-brand-bright)]" />
                  {copy.eyebrow}
                </span>
                <p
                  className="mt-1 font-extrabold leading-tight"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(1.0625rem, 4.4vw, 1.25rem)',
                    letterSpacing: '-0.015em',
                    textShadow: '0 1px 12px rgba(0,0,0,0.55)',
                  }}
                >
                  {copy.line}
                </p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
