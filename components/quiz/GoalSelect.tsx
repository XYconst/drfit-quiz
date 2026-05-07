'use client';
import { motion } from 'framer-motion';
import type { OptionSpec } from '@/lib/questions';
import { CheckIcon } from '@/components/icons';

interface Props {
  options: OptionSpec[];
  selected?: string;
  onPick: (value: string, optionId: string) => void;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: 'easeOut' as const } },
};

export function GoalSelect({ options, selected, onPick }: Props) {
  return (
    <motion.div
      className="flex flex-col gap-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {options.map((opt, i) => {
        const isSelected = selected === opt.value;
        const num = String(i + 1).padStart(2, '0');
        return (
          <motion.div key={opt.id} variants={item}>
            <button
              type="button"
              onClick={() => onPick(opt.value, opt.id)}
              aria-pressed={isSelected}
              style={{ transformOrigin: 'center' }}
              className={[
                'group relative w-full text-left rounded-2xl bg-[var(--color-paper-warm)]',
                'border-2 px-5 py-5 min-h-[96px] flex items-center gap-5',
                'motion-safe:transition-[transform,border-color,background-color,box-shadow] motion-safe:duration-200 motion-safe:ease-out',
                'motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[0_10px_24px_-12px_rgba(165,0,21,0.18)]',
                'motion-safe:active:scale-[0.98] motion-safe:active:duration-100',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
                isSelected
                  ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red-tint)]'
                  : 'border-[var(--color-line)] hover:border-[var(--color-text-muted)]',
              ].join(' ')}
            >
              <span
                aria-hidden
                className="shrink-0 font-extrabold text-[var(--color-brand-red)] tabular-nums leading-none"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(2.25rem, 9vw, 3rem)',
                  letterSpacing: '-0.04em',
                }}
              >
                {num}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="font-extrabold text-[var(--color-text-headline)]"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(1.0625rem, 4vw, 1.1875rem)',
                    lineHeight: 1.2,
                    letterSpacing: '-0.015em',
                  }}
                >
                  {opt.label}
                </p>
                {opt.sub && (
                  <p className="mt-1 text-[13px] leading-snug text-[var(--color-text-muted)] font-medium">
                    {opt.sub}
                  </p>
                )}
              </div>
              <span
                aria-hidden
                className={[
                  'shrink-0 size-6 rounded-md border-2 grid place-items-center',
                  isSelected
                    ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red)]'
                    : 'border-[var(--color-line)] bg-transparent',
                ].join(' ')}
              >
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 22, mass: 0.6 }}
                    style={{ transformOrigin: 'center' }}
                  >
                    <CheckIcon width={14} height={14} className="text-white" />
                  </motion.span>
                )}
              </span>
            </button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
