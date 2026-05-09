'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@/components/icons';

export type PricingTone = 'slate' | 'red' | 'emerald';

export interface PricingPlan {
  id: string;
  label: string;
  durationLabel: string;
  /** Pre-discount sticker price (used for the strike-through). */
  oldPrice: number;
  /** Currently active price after applying the live discount %. */
  price: number;
  /** Currently active per-day price after applying the live discount %. */
  perDay: number;
  /** Plan duration in days, used to recompute perDay when discount changes. */
  days: number;
  recommended?: boolean;
  /** Short uppercase ribbon, e.g. "Най-често избиран". */
  tagLabel?: string;
  /** Color treatment of the card + ribbon. */
  tone?: PricingTone;
}

interface Props {
  plans: PricingPlan[];
  defaultId?: string;
  onChange?: (id: string) => void;
}

const fmt = (n: number) => n.toFixed(2).replace('.', ',');

interface ToneStyles {
  ribbon: string; // CSS gradient
  ringOn: string; // border + bg when selected
  ringOff: string; // border + bg when idle
  tintOff: string; // subtle background tint when idle
  radio: string; // selected radio fill
  price: string; // price color
  shadow: string; // soft shadow when selected
}

const TONES: Record<PricingTone, ToneStyles> = {
  slate: {
    ribbon: 'linear-gradient(135deg, #2B3138 0%, #4B5563 100%)',
    ringOn: 'border-[#2B3138]',
    ringOff: 'border-[var(--color-line)]',
    tintOff: 'linear-gradient(160deg, #FFFFFF 0%, #F6F7F9 100%)',
    radio: '#2B3138',
    price: '#1F2937',
    shadow: '0 16px 30px -22px rgba(43,49,56,0.45)',
  },
  red: {
    ribbon: 'linear-gradient(135deg, #E50914 0%, #A50015 100%)',
    ringOn: 'border-[var(--color-brand-red)]',
    ringOff: 'border-[var(--color-line)]',
    tintOff: 'linear-gradient(160deg, #FFFFFF 0%, #FFF5F6 100%)',
    radio: 'var(--color-brand-red)',
    price: 'var(--color-brand-red)',
    shadow: '0 18px 34px -22px rgba(165,0,21,0.55)',
  },
  emerald: {
    ribbon: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
    ringOn: 'border-[#047857]',
    ringOff: 'border-[var(--color-line)]',
    tintOff: 'linear-gradient(160deg, #FFFFFF 0%, #F1FAF5 100%)',
    radio: '#047857',
    price: '#047857',
    shadow: '0 16px 30px -22px rgba(4,120,87,0.45)',
  },
};

export function PricingPlans({ plans, defaultId, onChange }: Props) {
  const [selected, setSelected] = useState<string>(
    defaultId ?? plans.find((p) => p.recommended)?.id ?? plans[0].id,
  );

  const pick = (id: string) => {
    setSelected(id);
    onChange?.(id);
  };

  return (
    <div className="flex flex-col gap-4">
      {plans.map((p) => {
        const isOn = selected === p.id;
        const tone = TONES[p.tone ?? 'red'];
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => pick(p.id)}
            aria-pressed={isOn}
            className={[
              'relative w-full text-left rounded-2xl border-2 px-5 py-4',
              'flex items-center justify-between gap-3',
              'motion-safe:transition-[border-color,box-shadow,transform] motion-safe:duration-200',
              isOn ? tone.ringOn : `${tone.ringOff} hover:border-[var(--color-text-muted)]`,
            ].join(' ')}
            style={{
              background: isOn ? '#FFFFFF' : tone.tintOff,
              boxShadow: isOn ? tone.shadow : 'none',
              transformOrigin: 'center',
            }}
          >
            {p.tagLabel && (
              <span
                className="absolute -top-2.5 left-5 inline-flex items-center gap-1.5 rounded-full text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase"
                style={{
                  letterSpacing: '0.18em',
                  background: tone.ribbon,
                  boxShadow: tone.shadow,
                }}
              >
                {p.tagLabel}
              </span>
            )}
            <div className="flex items-center gap-3 min-w-0">
              <span
                aria-hidden
                className="shrink-0 size-6 rounded-full border-2 grid place-items-center"
                style={{
                  borderColor: isOn ? tone.radio : 'var(--color-line)',
                  background: isOn ? tone.radio : 'transparent',
                }}
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
              <p
                className="text-[22px] font-extrabold tabular-nums leading-tight"
                style={{ color: tone.price }}
              >
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
