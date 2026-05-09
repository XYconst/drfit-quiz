'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@/components/icons';

export interface PricingPlan {
  id: string;
  label: string;
  durationLabel: string;
  oldPrice: number;
  price: number;
  perDay: number;
  recommended?: boolean;
}

interface Props {
  plans: PricingPlan[];
  defaultId?: string;
  onChange?: (id: string) => void;
}

const fmt = (n: number) =>
  n.toFixed(2).replace('.', ',');

export function PricingPlans({ plans, defaultId, onChange }: Props) {
  const [selected, setSelected] = useState<string>(
    defaultId ?? plans.find((p) => p.recommended)?.id ?? plans[0].id,
  );

  const pick = (id: string) => {
    setSelected(id);
    onChange?.(id);
  };

  return (
    <div className="flex flex-col gap-3">
      {plans.map((p) => {
        const isOn = selected === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => pick(p.id)}
            aria-pressed={isOn}
            className={[
              'relative w-full text-left rounded-2xl border-2 px-5 py-4',
              'flex items-center justify-between gap-3',
              'motion-safe:transition-[border-color,background-color] motion-safe:duration-150',
              isOn
                ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red-tint)]'
                : 'border-[var(--color-line)] bg-white hover:border-[var(--color-text-muted)]',
            ].join(' ')}
            style={{ transformOrigin: 'center' }}
          >
            {p.recommended && (
              <span
                className="absolute -top-2.5 left-5 inline-flex items-center gap-1.5 rounded-full bg-brand-gradient text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase shadow-brand-red"
                style={{ letterSpacing: '0.18em' }}
              >
                Препоръчан
              </span>
            )}
            <div className="flex items-center gap-3 min-w-0">
              <span
                aria-hidden
                className={[
                  'shrink-0 size-6 rounded-full border-2 grid place-items-center',
                  isOn
                    ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red)]'
                    : 'border-[var(--color-line)] bg-transparent',
                ].join(' ')}
              >
                {isOn && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                  >
                    <CheckIcon width={12} height={12} className="text-white" />
                  </motion.span>
                )}
              </span>
              <div className="min-w-0">
                <p className="font-extrabold text-[16px] text-[var(--color-text-headline)] leading-tight">
                  {p.label}
                </p>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">
                  {p.durationLabel}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-[var(--color-text-muted)] line-through tabular-nums">
                {fmt(p.oldPrice)} EUR
              </p>
              <p className="text-[22px] font-extrabold text-[var(--color-brand-red)] tabular-nums leading-tight">
                {fmt(p.perDay)}
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)] ml-1">EUR/ден</span>
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] tabular-nums">
                общо {fmt(p.price)} EUR
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
