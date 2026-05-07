'use client';
import type { OptionSpec } from '@/lib/questions';
import { motion } from 'framer-motion';

interface Props {
  options: OptionSpec[];
  selected: string[];
  minSelect: number;
  onToggle: (value: string) => void;
  onContinue: () => void;
}

export function MultiSelect({ options, selected, minSelect, onToggle, onContinue }: Props) {
  const canContinue = selected.length >= minSelect;
  return (
    <>
      <ul className="flex flex-wrap gap-2 mb-6">
        {options.map((opt, i) => {
          const isOn = selected.includes(opt.value);
          return (
            <motion.li
              key={opt.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <button
                type="button"
                onClick={() => onToggle(opt.value)}
                aria-pressed={isOn}
                className={[
                  'rounded-full px-4 py-2.5 text-sm font-medium border transition-all active:scale-95',
                  isOn
                    ? 'bg-[var(--color-brand-red)] border-[var(--color-brand-red)] text-white'
                    : 'bg-white border-[var(--color-line)] text-[var(--color-text-strong)]',
                ].join(' ')}
              >
                {opt.label}
              </button>
            </motion.li>
          );
        })}
      </ul>
      <div className="mt-auto pt-4 sticky bottom-0 bg-[var(--color-brand-bg)]">
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className={[
            'w-full h-14 rounded-full font-bold text-white transition-all',
            canContinue
              ? 'bg-brand-gradient shadow-brand-red active:scale-[0.99]'
              : 'bg-[var(--color-surface-200)] text-[var(--color-text-muted)] cursor-not-allowed',
          ].join(' ')}
        >
          Продължи →
        </button>
        {!canContinue && (
          <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">
            Избери поне {minSelect}
          </p>
        )}
      </div>
    </>
  );
}
