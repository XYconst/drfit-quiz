'use client';
import type { NumericInputSpec } from '@/lib/questions';
import { useCallback, useEffect, useRef, useState } from 'react';
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

const SWIPE_PX_PER_UNIT = 6; // pixels of horizontal drag per +/-1 step
const HOLD_INITIAL_DELAY_MS = 360;
const HOLD_TICK_MS = [110, 70, 40]; // accelerates as the user holds

function NumericRow({ spec, value, onChange, isFirst, isLast }: RowProps) {
  const valueRef = useRef(value);
  valueRef.current = value;
  const change = useCallback(
    (delta: number) => {
      const next = Math.min(spec.max, Math.max(spec.min, Math.round(valueRef.current + delta)));
      if (next !== valueRef.current) onChange(next);
    },
    [onChange, spec.min, spec.max],
  );

  // ---- Hold-to-repeat on the +/- buttons --------------------------------
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopHold = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (holdInterval.current) clearInterval(holdInterval.current);
    holdTimer.current = null;
    holdInterval.current = null;
  }, []);
  useEffect(() => () => stopHold(), [stopHold]);

  const startHold = (delta: number) => {
    stopHold();
    holdTimer.current = setTimeout(() => {
      let phase = 0;
      const tick = () => change(delta);
      tick();
      const advance = () => {
        if (holdInterval.current) clearInterval(holdInterval.current);
        holdInterval.current = setInterval(() => {
          tick();
          // Move to a faster phase after a short while.
          if (phase < HOLD_TICK_MS.length - 1 && Math.random() > 0.85) {
            phase += 1;
            advance();
          }
        }, HOLD_TICK_MS[phase]);
      };
      advance();
    }, HOLD_INITIAL_DELAY_MS);
  };

  // ---- Horizontal swipe on the number ---------------------------------
  const dragRef = useRef<{ startX: number; startVal: number; active: boolean }>({
    startX: 0,
    startVal: value,
    active: false,
  });

  const handleSwipeStart = (clientX: number) => {
    dragRef.current = { startX: clientX, startVal: valueRef.current, active: true };
  };
  const handleSwipeMove = (clientX: number) => {
    if (!dragRef.current.active) return;
    const dx = clientX - dragRef.current.startX;
    const steps = Math.trunc(dx / SWIPE_PX_PER_UNIT);
    const next = Math.min(spec.max, Math.max(spec.min, dragRef.current.startVal + steps));
    if (next !== valueRef.current) onChange(next);
  };
  const handleSwipeEnd = () => {
    dragRef.current.active = false;
  };

  const atMin = value <= spec.min;
  const atMax = value >= spec.max;

  return (
    <div
      className={[
        'py-7',
        isFirst ? 'pt-3' : '',
        isLast ? '' : 'border-b border-[var(--color-line)]',
      ].join(' ')}
    >
      <span
        className="block text-[11px] uppercase font-bold text-[var(--color-text-muted)] mb-3"
        style={{ letterSpacing: '0.22em' }}
      >
        {spec.label}
      </span>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            change(-1);
            startHold(-1);
          }}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          disabled={atMin}
          aria-label={`Намали ${spec.label.toLowerCase()}`}
          className={[
            'size-12 rounded-full border border-[var(--color-line)] select-none',
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
        <div
          role="slider"
          aria-label={spec.label}
          aria-valuemin={spec.min}
          aria-valuemax={spec.max}
          aria-valuenow={value}
          tabIndex={0}
          onPointerDown={(e) => {
            (e.target as Element).setPointerCapture(e.pointerId);
            handleSwipeStart(e.clientX);
          }}
          onPointerMove={(e) => handleSwipeMove(e.clientX)}
          onPointerUp={handleSwipeEnd}
          onPointerCancel={handleSwipeEnd}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              e.preventDefault();
              change(-1);
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              e.preventDefault();
              change(1);
            }
          }}
          className={[
            'flex items-baseline gap-1.5 tabular-nums px-6 py-2 rounded-2xl select-none',
            'cursor-ew-resize touch-none',
            'motion-safe:transition-colors motion-safe:duration-150',
            'hover:bg-[var(--color-paper-warm)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)]/60',
          ].join(' ')}
          style={{ transformOrigin: 'center' }}
        >
          <span
            className="font-extrabold text-[var(--color-text-headline)]"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.75rem, 12vw, 3.75rem)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            {value}
          </span>
          {spec.suffix && (
            <span className="text-[15px] font-semibold text-[var(--color-text-muted)] uppercase">
              {spec.suffix}
            </span>
          )}
        </div>
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            change(1);
            startHold(1);
          }}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          disabled={atMax}
          aria-label={`Увеличи ${spec.label.toLowerCase()}`}
          className={[
            'size-12 rounded-full border border-[var(--color-line)] select-none',
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
}
