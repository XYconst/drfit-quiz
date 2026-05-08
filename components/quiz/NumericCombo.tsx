'use client';
import type { NumericInputSpec } from '@/lib/questions';
import { useState } from 'react';
import { ArrowRightIcon } from '@/components/icons';
import { WheelPicker } from './WheelPicker';

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
      <div className="flex flex-col gap-3">
        {inputs.map((inp) => (
          <div
            key={inp.name}
            className="rounded-2xl bg-[var(--color-paper-warm)] border border-[var(--color-line)] px-4 py-3"
          >
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-[var(--color-text-strong)]">{inp.label}</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] font-bold">
                {inp.min}–{inp.max} {inp.suffix}
              </span>
            </div>
            <div className="-mx-1 mt-1">
              <WheelPicker
                min={inp.min}
                max={inp.max}
                value={values[inp.name]}
                suffix={inp.suffix}
                onChange={(v) => setValues((p) => ({ ...p, [inp.name]: v }))}
                visibleRows={1}
                rowHeight={42}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-2 sticky bottom-0 bg-[var(--color-brand-bg)]">
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
