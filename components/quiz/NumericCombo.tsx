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

  const set = (name: string, v: number, min: number, max: number) =>
    setValues((p) => ({ ...p, [name]: Math.min(max, Math.max(min, Math.round(v))) }));

  return (
    <>
      <div className="flex flex-col">
        {inputs.map((inp, idx) => {
          const v = values[inp.name];
          const atMin = v <= inp.min;
          const atMax = v >= inp.max;
          return (
            <div
              key={inp.name}
              className={[
                'py-7',
                idx === 0 ? 'pt-3' : '',
                idx === inputs.length - 1 ? '' : 'border-b border-[var(--color-line)]',
              ].join(' ')}
            >
              <span
                className="block text-[11px] uppercase font-bold text-[var(--color-text-muted)] mb-3"
                style={{ letterSpacing: '0.22em' }}
              >
                {inp.label}
              </span>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => set(inp.name, v - 1, inp.min, inp.max)}
                  disabled={atMin}
                  aria-label={`Намали ${inp.label.toLowerCase()}`}
                  className={[
                    'size-12 rounded-full border border-[var(--color-line)]',
                    'flex items-center justify-center text-2xl font-light text-[var(--color-text-strong)]',
                    'motion-safe:transition-[transform,background-color] motion-safe:duration-150',
                    'motion-safe:active:scale-90',
                    atMin
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:bg-[var(--color-paper-warm)] cursor-pointer',
                  ].join(' ')}
                >
                  −
                </button>
                <div className="flex items-baseline gap-1.5 tabular-nums">
                  <span
                    className="font-extrabold text-[var(--color-text-headline)]"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(2.75rem, 12vw, 3.75rem)',
                      lineHeight: 1,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {v}
                  </span>
                  {inp.suffix && (
                    <span className="text-[15px] font-semibold text-[var(--color-text-muted)] uppercase">
                      {inp.suffix}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => set(inp.name, v + 1, inp.min, inp.max)}
                  disabled={atMax}
                  aria-label={`Увеличи ${inp.label.toLowerCase()}`}
                  className={[
                    'size-12 rounded-full border border-[var(--color-line)]',
                    'flex items-center justify-center text-2xl font-light text-[var(--color-text-strong)]',
                    'motion-safe:transition-[transform,background-color] motion-safe:duration-150',
                    'motion-safe:active:scale-90',
                    atMax
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:bg-[var(--color-paper-warm)] cursor-pointer',
                  ].join(' ')}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
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
