'use client';
import type { NumericInputSpec } from '@/lib/questions';
import { useState } from 'react';
import { ArrowRightIcon } from '@/components/icons';
import { HorizontalWheelPicker } from './HorizontalWheelPicker';

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
      <div className="flex flex-col">
        {inputs.map((inp, idx) => (
          <NumericRow
            key={inp.name}
            spec={inp}
            value={values[inp.name]}
            isFirst={idx === 0}
            isLast={idx === inputs.length - 1}
            onChange={(v) => setValues((p) => ({ ...p, [inp.name]: v }))}
          />
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

interface RowProps {
  spec: NumericInputSpec;
  value: number;
  onChange: (v: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

function NumericRow({ spec, value, onChange, isFirst, isLast }: RowProps) {
  const atMin = value <= spec.min;
  const atMax = value >= spec.max;
  const nudge = (delta: number) => {
    const next = Math.min(spec.max, Math.max(spec.min, value + delta));
    if (next !== value) onChange(next);
  };
  const stepBtn = (
    delta: -1 | 1,
    label: string,
    disabled: boolean,
  ) => (
    <button
      type="button"
      onClick={() => nudge(delta)}
      disabled={disabled}
      aria-label={label}
      className={[
        'shrink-0 size-11 rounded-full border border-[var(--color-line)] bg-white select-none',
        'flex items-center justify-center text-2xl font-light text-[var(--color-text-strong)]',
        'motion-safe:transition-[transform,background-color,box-shadow] motion-safe:duration-150',
        'motion-safe:active:scale-90',
        disabled
          ? 'opacity-30 cursor-not-allowed'
          : 'hover:bg-[var(--color-paper-warm)] hover:border-[var(--color-text-muted)] cursor-pointer',
      ].join(' ')}
    >
      {delta < 0 ? '−' : '+'}
    </button>
  );

  return (
    <div
      className={[
        'py-5',
        isFirst ? 'pt-2' : '',
        isLast ? '' : 'border-b border-[var(--color-line)]',
      ].join(' ')}
    >
      <div className="flex items-baseline justify-between mb-3">
        <span
          className="text-[11px] uppercase font-bold text-[var(--color-text-muted)]"
          style={{ letterSpacing: '0.22em' }}
        >
          {spec.label}
        </span>
        <span
          className="font-extrabold tabular-nums text-[var(--color-text-headline)]"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1.875rem, 8vw, 2.375rem)',
            letterSpacing: '-0.035em',
            lineHeight: 1,
          }}
        >
          {value}
          {spec.suffix && (
            <span className="ml-1 text-[13px] font-semibold text-[var(--color-text-muted)] uppercase">
              {spec.suffix}
            </span>
          )}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {stepBtn(-1, `Намали ${spec.label.toLowerCase()}`, atMin)}
        <div className="flex-1 min-w-0">
          <HorizontalWheelPicker
            min={spec.min}
            max={spec.max}
            value={value}
            onChange={onChange}
            visibleCols={3}
            colWidth={56}
            height={68}
          />
        </div>
        {stepBtn(1, `Увеличи ${spec.label.toLowerCase()}`, atMax)}
      </div>
    </div>
  );
}
