'use client';
import type { OptionSpec, CardVariant } from '@/lib/questions';
import { OptionCard } from './OptionCard';

interface Props {
  options: OptionSpec[];
  selected?: string;
  variant: CardVariant;
  onPick: (value: string, optionId: string) => void;
}

function gridClass(variant: CardVariant, count: number): string {
  if (variant === 'wide') return 'grid grid-cols-1 gap-3';
  if (count >= 5) return 'grid grid-cols-2 gap-3';
  return 'grid grid-cols-2 gap-3';
}

export function SingleSelect({ options, selected, variant, onPick }: Props) {
  const cls = gridClass(variant, options.length);
  return (
    <div className={cls}>
      {options.map((opt, i) => (
        <OptionCard
          key={opt.id}
          imageUrl={opt.imageUrl ?? ''}
          imageAlt={opt.label}
          label={opt.label}
          sub={opt.sub}
          selected={selected === opt.value}
          onClick={() => onPick(opt.value, opt.id)}
          variant={variant}
          index={i}
        />
      ))}
    </div>
  );
}
