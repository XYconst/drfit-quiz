'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { CheckIcon } from '@/components/icons';

export type OptionRowTone = 'default' | 'red' | 'amber' | 'dark';

const TONE_CLASSES: Record<OptionRowTone, string> = {
  default: 'bg-[var(--color-surface-100)] text-[var(--color-text-strong)]',
  red: 'bg-[var(--color-brand-red-tint)] text-[var(--color-brand-red)]',
  amber: 'bg-[var(--color-amber-bg)] text-[var(--color-amber-text)]',
  dark: 'bg-[var(--color-brand-dark)] text-white',
};

export interface OptionRowProps {
  icon?: ReactNode;
  label: string;
  sub?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  /** Color-codes the icon badge. Use sparingly to differentiate emotionally-loaded choices. */
  tone?: OptionRowTone;
}

export function OptionRow({ icon, label, sub, selected = false, disabled = false, onClick, tone = 'default' }: OptionRowProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={selected}
      style={{ transformOrigin: 'center' }}
      className={[
        'group relative w-full text-left rounded-2xl bg-[var(--color-paper-warm)]',
        'border-2 px-4 py-3 min-h-[56px] flex items-center gap-3',
        'motion-safe:transition-[transform,border-color,background-color,box-shadow] motion-safe:duration-200 motion-safe:ease-out',
        'motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[0_10px_24px_-12px_rgba(165,0,21,0.18)]',
        'motion-safe:active:scale-[0.98] motion-safe:active:duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
        selected
          ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red-tint)]'
          : 'border-[var(--color-line)] hover:border-[var(--color-text-muted)]',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      {icon && (
        <span
          aria-hidden
          className={[
            'shrink-0 grid place-items-center size-9 rounded-full',
            selected ? 'bg-white text-[var(--color-brand-red)]' : TONE_CLASSES[tone],
          ].join(' ')}
        >
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[15px] leading-tight text-[var(--color-text-headline)]">{label}</p>
        {sub && (
          <p className="mt-0.5 text-[12.5px] leading-snug text-[var(--color-text-muted)]">{sub}</p>
        )}
      </div>
      <span
        aria-hidden
        className={[
          'shrink-0 size-6 rounded-md border-2 grid place-items-center',
          selected
            ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red)]'
            : 'border-[var(--color-line)] bg-transparent',
        ].join(' ')}
      >
        {selected && (
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
  );
}
