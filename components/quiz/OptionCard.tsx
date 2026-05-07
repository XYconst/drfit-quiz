'use client';
import { CheckIcon } from '@/components/icons';

export type OptionCardVariant = 'portrait' | 'square' | 'wide';

export interface OptionCardProps {
  imageUrl: string;
  imageAlt?: string;
  label: string;
  sub?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  variant?: OptionCardVariant;
  /** Reserved — historically toggled aria role; now always renders as a toggle button. */
  role?: 'button' | 'checkbox';
  /** Index hint reserved for future stagger work. */
  index?: number;
}

const ASPECT: Record<OptionCardVariant, string> = {
  portrait: 'aspect-[4/5]',
  square: 'aspect-square',
  wide: 'aspect-[16/9]',
};

export function OptionCard({
  imageUrl,
  imageAlt,
  label,
  sub,
  selected = false,
  disabled = false,
  onClick,
  variant = 'square',
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={[
        'group relative w-full text-left rounded-2xl overflow-hidden bg-[var(--color-paper-warm)]',
        'border-2 transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
        selected
          ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red-tint)]'
          : 'border-[var(--color-line)] hover:border-[var(--color-text-muted)]',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <div className={[ASPECT[variant], 'w-full bg-[var(--color-surface-100)] overflow-hidden'].join(' ')}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={imageAlt ?? ''}
          className="w-full h-full object-cover"
          loading="lazy"
          draggable={false}
        />
      </div>
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[15px] leading-snug text-[var(--color-text-headline)] line-clamp-2">
            {label}
          </p>
          {sub && (
            <p className="mt-1 text-[13px] leading-snug text-[var(--color-text-muted)] line-clamp-2">
              {sub}
            </p>
          )}
        </div>
      </div>
      {selected && (
        <span
          aria-hidden
          className="absolute top-3 right-3 size-7 rounded-full bg-[var(--color-brand-red)] grid place-items-center shadow-sm"
        >
          <CheckIcon width={16} height={16} className="text-white" />
        </span>
      )}
    </button>
  );
}
