'use client';
import type { OptionSpec } from '@/lib/questions';
import { motion } from 'framer-motion';

interface Props {
  options: OptionSpec[];
  selected?: string;
  onPick: (value: string, optionId: string) => void;
}

export function SingleSelect({ options, selected, onPick }: Props) {
  return (
    <ul className="flex flex-col gap-3">
      {options.map((opt, i) => {
        const isSelected = selected === opt.value;
        return (
          <motion.li
            key={opt.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <button
              type="button"
              onClick={() => onPick(opt.value, opt.id)}
              aria-pressed={isSelected}
              className={[
                'w-full flex items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left',
                'border transition-all active:scale-[0.99]',
                isSelected
                  ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red-tint)] shadow-brand-red/20'
                  : 'border-[var(--color-line)] bg-white hover:border-[var(--color-text-muted)]',
              ].join(' ')}
            >
              <span className="flex items-center gap-3">
                {opt.emoji && <span aria-hidden className="text-xl">{opt.emoji}</span>}
                {opt.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={opt.imageUrl} alt="" className="w-12 h-16 object-contain" />
                )}
                <span className="font-medium text-[var(--color-text-strong)]">{opt.label}</span>
              </span>
              <span
                className={[
                  'shrink-0 w-5 h-5 rounded-full border-2 transition-colors',
                  isSelected ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red)]' : 'border-[var(--color-surface-200)]',
                ].join(' ')}
                aria-hidden
              />
            </button>
          </motion.li>
        );
      })}
    </ul>
  );
}
