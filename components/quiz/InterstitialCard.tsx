'use client';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@/components/icons';

interface Props {
  headline: string;
  body: string;
  ctaLabel: string;
  onContinue: () => void;
}

export function InterstitialCard({ headline, body, ctaLabel, onContinue }: Props) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.36, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ transformOrigin: 'center' }}
        className="rounded-3xl bg-[var(--color-brand-dark)] text-white p-8 shadow-xl"
      >
        <span className="eyebrow text-white/80" style={{ color: 'rgba(255,255,255,.8)' }}>Dr.Fit</span>
        <motion.h2
          className="mt-3 text-2xl font-extrabold leading-tight"
          style={{ textWrap: 'balance' }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.08, ease: 'easeOut' }}
        >
          {headline}
        </motion.h2>
        <motion.p
          className="mt-4 text-base text-white/85 leading-relaxed"
          style={{ textWrap: 'pretty' }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.16, ease: 'easeOut' }}
        >
          {body}
        </motion.p>
      </motion.div>

      <button
        type="button"
        onClick={onContinue}
        style={{ transformOrigin: 'center' }}
        className={[
          'group w-full h-14 rounded-full font-bold text-white bg-brand-gradient shadow-brand-red',
          'flex items-center justify-center gap-2',
          'motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 motion-safe:ease-out',
          'motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[0_18px_30px_-12px_rgba(165,0,21,0.5)]',
          'motion-safe:active:scale-[0.98] motion-safe:active:duration-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
        ].join(' ')}
      >
        <span>{ctaLabel}</span>
        <ArrowRightIcon
          width={18}
          height={18}
          className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out group-hover:motion-safe:translate-x-0.5"
        />
      </button>
    </div>
  );
}
