'use client';
import { useState } from 'react';

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

export function DateStep({ initial, onContinue }: Props) {
  const [date, setDate] = useState(initial ?? addMonthsIso(3));
  const [chip, setChip] = useState<string | null>('3m');

  const onChip = (id: string, addMonths: number) => {
    setChip(id);
    setDate(addMonthsIso(addMonths));
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {QUICK_CHIPS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onChip(c.id, c.addMonths)}
            className={[
              'rounded-full px-4 py-2.5 text-sm font-medium border transition-all active:scale-95',
              chip === c.id
                ? 'bg-[var(--color-brand-red)] border-[var(--color-brand-red)] text-white'
                : 'bg-white border-[var(--color-line)] text-[var(--color-text-strong)]',
            ].join(' ')}
          >
            {c.label}
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-2 mb-6">
        <span className="text-sm font-semibold text-[var(--color-text-strong)]">Или избери дата</span>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => { setDate(e.target.value); setChip(null); }}
          className="rounded-2xl border border-[var(--color-line)] bg-white px-4 h-14 text-base text-[var(--color-text-headline)] outline-none focus:border-[var(--color-brand-red)]"
        />
      </label>

      <div className="mt-auto pt-4 sticky bottom-0 bg-[var(--color-brand-bg)]">
        <button
          type="button"
          onClick={() => onContinue(date, chip ?? 'custom')}
          className="w-full h-14 rounded-full font-bold text-white bg-brand-gradient shadow-brand-red active:scale-[0.99] transition-transform"
        >
          Продължи →
        </button>
      </div>
    </>
  );
}
