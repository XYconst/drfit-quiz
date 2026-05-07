'use client';
import type { OptionSpec, CardVariant } from '@/lib/questions';
import { OptionCard } from './OptionCard';
import { ArrowRightIcon } from '@/components/icons';

interface Props {
  options: OptionSpec[];
  selected: string[];
  minSelect: number;
  maxSelect?: number;
  variant: CardVariant;
  onToggle: (value: string) => void;
  onContinue: () => void;
}

function gridClass(variant: CardVariant): string {
  if (variant === 'wide') return 'grid grid-cols-1 gap-3 mb-6';
  return 'grid grid-cols-2 gap-3 mb-6';
}

export function MultiSelect({
  options,
  selected,
  minSelect,
  maxSelect,
  variant,
  onToggle,
  onContinue,
}: Props) {
  const canContinue = selected.length >= minSelect;
  const atCap = typeof maxSelect === 'number' && selected.length >= maxSelect;
  const cls = gridClass(variant);

  return (
    <>
      <div className={cls}>
        {options.map((opt, i) => {
          const isOn = selected.includes(opt.value);
          const disabled = atCap && !isOn;
          return (
            <OptionCard
              key={opt.id}
              imageUrl={opt.imageUrl ?? ''}
              imageAlt={opt.label}
              label={opt.label}
              sub={opt.sub}
              selected={isOn}
              disabled={disabled}
              onClick={() => onToggle(opt.value)}
              variant={variant}
              role="checkbox"
              index={i}
            />
          );
        })}
      </div>
      <div className="mt-auto pt-4 sticky bottom-0 bg-[var(--color-brand-bg)]">
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className={[
            'w-full h-14 rounded-full font-bold text-white transition-colors',
            'flex items-center justify-center gap-2',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
            canContinue
              ? 'bg-brand-gradient shadow-brand-red cursor-pointer'
              : 'bg-[var(--color-surface-200)] text-[var(--color-text-muted)] cursor-not-allowed',
          ].join(' ')}
        >
          <span>Продължи</span>
          <ArrowRightIcon width={18} height={18} />
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
