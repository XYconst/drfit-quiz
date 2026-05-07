'use client';
import type { NumericInputSpec } from '@/lib/questions';
import { useState } from 'react';
import { ArrowRightIcon } from '@/components/icons';

interface Props {
  inputs: NumericInputSpec[];
  initial: Record<string, number>;
  onContinue: (values: Record<string, number>) => void;
}

export function NumericCombo({ inputs, initial, onContinue }: Props) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const out: Record<string, number> = {};
    for (const inp of inputs) out[inp.name] = initial[inp.name] ?? inp.default ?? inp.min;
    return out;
  });

  const valid = inputs.every((inp) => {
    const v = values[inp.name];
    return Number.isFinite(v) && v >= inp.min && v <= inp.max;
  });

  return (
    <>
      <div className="flex flex-col gap-5">
        {inputs.map((inp) => (
          <label key={inp.name} className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[var(--color-text-strong)]">{inp.label}</span>
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-line)] bg-white px-4 h-14 focus-within:border-[var(--color-brand-red)]">
              <input
                type="number"
                inputMode="numeric"
                min={inp.min}
                max={inp.max}
                value={values[inp.name]}
                onChange={(e) => setValues((p) => ({ ...p, [inp.name]: Number(e.target.value) }))}
                className="flex-1 bg-transparent text-lg font-semibold text-[var(--color-text-headline)] outline-none"
              />
              {inp.suffix && <span className="text-sm text-[var(--color-text-muted)] font-medium">{inp.suffix}</span>}
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">
              {inp.min} - {inp.max} {inp.suffix}
            </span>
          </label>
        ))}
      </div>
      <div className="mt-auto pt-6 sticky bottom-0 bg-[var(--color-brand-bg)]">
        <button
          type="button"
          onClick={() => onContinue(values)}
          disabled={!valid}
          style={{ transformOrigin: 'center' }}
          className={[
            'w-full h-14 rounded-full font-bold text-white',
            'flex items-center justify-center gap-2',
            'motion-safe:transition-[transform,background-color,box-shadow,opacity] motion-safe:duration-200 motion-safe:ease-out',
            'motion-safe:active:scale-[0.98] motion-safe:active:duration-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
            valid
              ? 'bg-brand-gradient shadow-brand-red cursor-pointer motion-safe:hover:shadow-[0_18px_30px_-12px_rgba(165,0,21,0.5)]'
              : 'bg-[var(--color-surface-200)] text-[var(--color-text-muted)] cursor-not-allowed',
          ].join(' ')}
        >
          <span>Продължи</span>
          <ArrowRightIcon width={18} height={18} />
        </button>
      </div>
    </>
  );
}
