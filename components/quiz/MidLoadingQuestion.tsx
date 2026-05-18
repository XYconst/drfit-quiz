'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export interface MidQuestionOption {
  id: string;
  label: string;
  value: string;
  /** If set, picking this option shows the note + a "continue anyway" CTA
   *  instead of advancing immediately. Used to flag "this product probably
   *  isn't for you" without hard-blocking the user. */
  disqualifyNote?: string;
}

interface Props {
  headline: string;
  options: MidQuestionOption[];
  onAnswer: (value: string, optionId: string) => void;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: 'easeOut' as const },
  },
};

export function MidLoadingQuestion({ headline, options, onAnswer }: Props) {
  const [warned, setWarned] = useState<MidQuestionOption | null>(null);

  const pick = (opt: MidQuestionOption) => {
    if (opt.disqualifyNote && warned?.id !== opt.id) {
      setWarned(opt);
      return;
    }
    onAnswer(opt.value, opt.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-30 flex items-end sm:items-center justify-center px-5 pb-8 sm:pb-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mid-q-headline"
      style={{
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] as const }}
        className="w-full max-w-md rounded-3xl bg-[var(--color-paper-warm)] border border-[var(--color-line)] p-6"
        style={{ boxShadow: '0 28px 64px -20px rgba(0,0,0,0.55), 0 8px 18px -8px rgba(165,0,21,0.22)' }}
      >
        <p
          className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase text-[var(--color-brand-red)] mb-3"
          style={{ letterSpacing: '0.2em' }}
        >
          <span aria-hidden className="size-1.5 rounded-full bg-[var(--color-brand-red)]" />
          Последни въпроси
        </p>

        <h3
          id="mid-q-headline"
          className="font-extrabold text-[var(--color-text-headline)] mb-5"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1.375rem, 5vw, 1.75rem)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textWrap: 'balance',
          }}
        >
          {headline}
        </h3>

        {warned ? (
          <div className="flex flex-col gap-3">
            <div
              className="rounded-2xl border border-[var(--color-amber-text)]/30 bg-[var(--color-amber-bg)] px-4 py-3.5"
            >
              <p
                className="text-[10px] font-extrabold uppercase text-[var(--color-amber-text)] mb-1.5"
                style={{ letterSpacing: '0.2em' }}
              >
                Кратко предупреждение
              </p>
              <p className="text-[13px] leading-snug text-[var(--color-text-strong)]">
                {warned.disqualifyNote}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAnswer(warned.value, warned.id)}
              className="w-full h-12 rounded-full bg-brand-gradient text-white font-extrabold text-[14px] shadow-brand-red"
            >
              Все пак ми покажи плана
            </button>
            <button
              type="button"
              onClick={() => setWarned(null)}
              className="w-full text-[12px] font-bold text-[var(--color-text-muted)] underline underline-offset-4 hover:no-underline"
            >
              Избери друг отговор
            </button>
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-2.5"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {options.map((opt) => (
              <motion.button
                key={opt.id}
                variants={item}
                type="button"
                onClick={() => pick(opt)}
                style={{ transformOrigin: 'center' }}
                className={[
                  'group w-full text-left rounded-2xl bg-white border-2',
                  opt.disqualifyNote
                    ? 'border-[var(--color-amber-text)]/30'
                    : 'border-[var(--color-line)]',
                  'px-5 py-4 min-h-[60px] flex items-center justify-between gap-3',
                  'motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-180 motion-safe:ease-out',
                  'motion-safe:hover:border-[var(--color-brand-red)] motion-safe:hover:-translate-y-[1px] motion-safe:hover:shadow-[0_8px_18px_-10px_rgba(165,0,21,0.35)]',
                  'motion-safe:active:scale-[0.98] motion-safe:active:duration-100',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
                ].join(' ')}
              >
                <span className="font-semibold text-[16px] text-[var(--color-text-headline)]">
                  {opt.label}
                </span>
                <span
                  aria-hidden
                  className="shrink-0 size-6 rounded-full border-2 border-[var(--color-line)] grid place-items-center motion-safe:transition-colors motion-safe:duration-180 group-hover:border-[var(--color-brand-red)]"
                />
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
