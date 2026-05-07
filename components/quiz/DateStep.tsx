'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@/components/icons';

interface Props {
  initial?: string;
  onContinue: (isoDate: string, label: string) => void;
}

const QUICK_CHIPS: Array<{ id: string; label: string; addMonths: number }> = [
  { id: '1m', label: '1 месец', addMonths: 1 },
  { id: '3m', label: '3 месеца', addMonths: 3 },
  { id: '6m', label: '6 месеца', addMonths: 6 },
  { id: '12m', label: '1 година', addMonths: 12 },
];

function addMonthsIso(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function parts(iso: string) {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleDateString('bg-BG', { month: 'long' });
  const year = d.getFullYear();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.max(0, Math.round((d.getTime() - today.getTime()) / 86400000));
  const diffWeeks = Math.round(diffDays / 7);
  return { day, month, year, diffDays, diffWeeks };
}

export function DateStep({ initial, onContinue }: Props) {
  const [date, setDate] = useState(initial ?? addMonthsIso(3));
  const [chip, setChip] = useState<string | null>('3m');

  const onChip = (id: string, addMonths: number) => {
    setChip(id);
    setDate(addMonthsIso(addMonths));
  };

  const { day, month, year, diffDays, diffWeeks } = parts(date);

  return (
    <>
      {/* Hero date card — the signature element. The day number dominates. */}
      <motion.div
        key={date}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl bg-[var(--color-paper-warm)] border border-[var(--color-line)] px-6 py-7 mb-5"
      >
        {/* Left brand accent rule */}
        <span aria-hidden className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full bg-[var(--color-brand-red)]" />

        <div className="text-center">
          <span
            className="inline-block text-[10px] font-extrabold uppercase text-[var(--color-brand-red)]"
            style={{ letterSpacing: '0.22em' }}
          >
            Твоята дата
          </span>

          <div className="mt-4 flex flex-col items-center">
            <span
              className="font-extrabold text-[var(--color-text-headline)] tabular-nums"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(4.5rem, 19vw, 7rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.05em',
              }}
            >
              {day}
            </span>
            <span
              className="font-semibold text-[var(--color-text-strong)] mt-1 capitalize"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.375rem, 5vw, 1.75rem)',
                letterSpacing: '-0.01em',
              }}
            >
              {month}
            </span>
            <span
              className="text-[13px] text-[var(--color-text-muted)] tabular-nums mt-0.5 font-medium"
              style={{ letterSpacing: '0.04em' }}
            >
              {year}
            </span>
          </div>

          <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-white px-4 py-1.5">
            <span
              className="text-[13px] font-bold text-[var(--color-text-strong)] tabular-nums"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              ≈ {diffWeeks} седмици
            </span>
            <span aria-hidden className="size-1 rounded-full bg-[var(--color-brand-red)]" />
            <span
              className="text-[13px] text-[var(--color-text-muted)] tabular-nums"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {diffDays} дни
            </span>
          </div>
        </div>
      </motion.div>

      {/* Quick-pick chips — 2x2, each showing the projected month */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {QUICK_CHIPS.map((c) => {
          const targetIso = addMonthsIso(c.addMonths);
          const targetMonth = new Date(targetIso).toLocaleDateString('bg-BG', { month: 'long' });
          const isActive = chip === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onChip(c.id, c.addMonths)}
              style={{ transformOrigin: 'center' }}
              className={[
                'group relative rounded-2xl border-2 px-4 py-3.5 text-left',
                'motion-safe:transition-[transform,background-color,border-color,box-shadow] motion-safe:duration-200 motion-safe:ease-out',
                'motion-safe:hover:-translate-y-[2px]',
                'motion-safe:active:scale-[0.97] motion-safe:active:duration-100',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
                isActive
                  ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red-tint)]'
                  : 'border-[var(--color-line)] bg-[var(--color-paper-warm)] hover:border-[var(--color-text-muted)]',
              ].join(' ')}
            >
              <div className="font-extrabold text-[16px] leading-tight text-[var(--color-text-headline)]">
                {c.label}
              </div>
              <div
                className="text-[12px] capitalize mt-1 text-[var(--color-text-muted)] font-medium"
                style={{ letterSpacing: '0.02em' }}
              >
                до {targetMonth}
              </div>
            </button>
          );
        })}
      </div>

      {/* Precision date — small secondary control */}
      <label className="flex items-center justify-between gap-3 mb-6 px-4 py-3 rounded-2xl border border-[var(--color-line)] bg-white">
        <span className="text-[13px] font-semibold text-[var(--color-text-strong)]">
          Или избери конкретна дата
        </span>
        <input
          type="date"
          value={date}
          min={todayIso()}
          onChange={(e) => {
            setDate(e.target.value);
            setChip(null);
          }}
          className="bg-transparent text-[14px] text-[var(--color-text-headline)] tabular-nums outline-none focus:text-[var(--color-brand-red)]"
          style={{ fontFamily: 'var(--font-mono)' }}
        />
      </label>

      <div className="mt-auto pt-4 sticky bottom-0 bg-[var(--color-brand-bg)]">
        <button
          type="button"
          onClick={() => onContinue(date, chip ?? 'custom')}
          style={{ transformOrigin: 'center' }}
          className={[
            'group w-full h-14 rounded-full font-extrabold text-white bg-brand-gradient shadow-brand-red',
            'flex items-center justify-center gap-2',
            'motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 motion-safe:ease-out',
            'motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[0_18px_30px_-12px_rgba(165,0,21,0.5)]',
            'motion-safe:active:scale-[0.98] motion-safe:active:duration-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
          ].join(' ')}
        >
          <span style={{ letterSpacing: '0.01em' }}>Продължи</span>
          <ArrowRightIcon
            width={18}
            height={18}
            className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out group-hover:motion-safe:translate-x-0.5"
          />
        </button>
      </div>
    </>
  );
}
