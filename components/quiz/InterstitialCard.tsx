'use client';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@/components/icons';

interface Props {
  headline: string;
  body: string;
  ctaLabel: string;
  /** Optional matched-character pose. When present, renders as a hero photo above the headline. */
  imageSrc?: string;
  imageAlt?: string;
  onContinue: () => void;
}

export function InterstitialCard({ headline, body, ctaLabel, imageSrc, imageAlt = '', onContinue }: Props) {
  return (
    <div className="relative flex flex-col items-center text-center gap-7 py-2 px-1">
      {/* Atmospheric backdrop — soft warm wash behind the focal area */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-20px] top-[-20px] h-[420px] -z-10 rounded-b-[40px]"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, rgba(229,9,20,0.06) 0%, rgba(229,9,20,0) 60%), linear-gradient(180deg, var(--color-paper-warm) 0%, rgba(248,244,238,0) 100%)',
        }}
      />

      {imageSrc ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative w-full h-[240px] sm:h-[280px] -mb-2 rounded-3xl overflow-hidden bg-[var(--color-graphite)] shadow-[0_18px_40px_-18px_rgba(25,33,38,0.45)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
        </motion.div>
      ) : null}

      {/* Headline — Manrope ExtraBold, oversized, very tight tracking */}
      <motion.h2
        className="font-extrabold text-[var(--color-text-headline)]"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(1.5rem, 6.5vw, 2.25rem)',
          lineHeight: 1.12,
          letterSpacing: '-0.025em',
          textWrap: 'balance',
          maxWidth: '20ch',
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.46, delay: 0.08, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {headline}
      </motion.h2>

      {/* Hairline accent divider — signature touch */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.22, ease: 'easeOut' }}
        style={{ transformOrigin: 'center' }}
        className="flex items-center gap-2"
      >
        <span className="block h-px w-12 bg-[var(--color-brand-red)]/40" />
        <span className="size-1 rounded-full bg-[var(--color-brand-red)]" />
        <span className="block h-px w-12 bg-[var(--color-brand-red)]/40" />
      </motion.div>

      {/* Supporting body */}
      <motion.p
        className="text-[var(--color-text-body)]"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(1.0625rem, 4vw, 1.25rem)',
          lineHeight: 1.5,
          fontWeight: 500,
          maxWidth: '32ch',
          textWrap: 'pretty',
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.28, ease: 'easeOut' }}
      >
        {body}
      </motion.p>

      {/* CTA — full-width within max, lifted with red glow */}
      <motion.button
        type="button"
        onClick={onContinue}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.36, ease: 'easeOut' }}
        style={{ transformOrigin: 'center' }}
        className={[
          'group w-full max-w-sm h-16 rounded-full font-extrabold text-white bg-brand-gradient shadow-brand-red mt-2',
          'flex items-center justify-center gap-2.5',
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
    </div>
  );
}
