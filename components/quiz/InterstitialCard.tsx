'use client';
import { motion } from 'framer-motion';

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
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="rounded-3xl bg-[var(--color-brand-dark)] text-white p-8 shadow-xl"
      >
        <span className="eyebrow text-white/80" style={{ color: 'rgba(255,255,255,.8)' }}>Dr.Fit</span>
        <h2 className="mt-3 text-2xl font-extrabold leading-tight">{headline}</h2>
        <p className="mt-4 text-base text-white/85 leading-relaxed">{body}</p>
      </motion.div>

      <button
        type="button"
        onClick={onContinue}
        className="w-full h-14 rounded-full font-bold text-white bg-brand-gradient shadow-brand-red active:scale-[0.99] transition-transform"
      >
        {ctaLabel} →
      </button>
    </div>
  );
}
