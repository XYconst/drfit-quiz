'use client';
import { motion } from 'framer-motion';
import { CheckIcon } from '@/components/icons';

interface Props {
  imageUrl: string;
  imageAlt?: string;
  label: string;
  sub?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

/**
 * Horizontal photo card. Photo on the left (square ~104px), label + sub on the
 * right. Used when there are exactly 3 photo options and we want everything to
 * fit on one screen without scrolling.
 */
export function PhotoRow({ imageUrl, imageAlt, label, sub, selected = false, disabled = false, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={selected}
      style={{ transformOrigin: 'center' }}
      className={[
        'group relative w-full text-left rounded-2xl overflow-hidden bg-[var(--color-paper-warm)]',
        'border-2 flex items-stretch gap-3',
        'motion-safe:transition-[border-color,background-color] motion-safe:duration-200 motion-safe:ease-out',
        'motion-safe:active:scale-[0.99] motion-safe:active:duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
        selected
          ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red-tint)]'
          : 'border-[var(--color-line)] hover:border-[var(--color-text-muted)]',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <div className="relative shrink-0 w-[104px] h-[112px] bg-[var(--color-surface-100)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={imageAlt ?? ''}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 18%' }}
          loading="lazy"
          draggable={false}
        />
      </div>
      <div className="flex-1 min-w-0 py-3 pr-4 flex items-center">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[15px] leading-snug text-[var(--color-text-headline)] line-clamp-2">
            {label}
          </p>
          {sub && (
            <p className="mt-0.5 text-[13px] leading-snug text-[var(--color-text-muted)] line-clamp-2">
              {sub}
            </p>
          )}
        </div>
        <span
          aria-hidden
          className={[
            'shrink-0 size-6 rounded-md border-2 grid place-items-center ml-3',
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
      </div>
    </button>
  );
}
