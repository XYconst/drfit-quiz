'use client';
import { useState } from 'react';
import { LockIcon } from '@/components/icons';

interface FieldSpec {
  name: string;
  type: 'email' | 'tel';
  label: string;
  placeholder?: string;
  required: boolean;
}

interface Props {
  fields: FieldSpec[];
  ctaLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<void> | void;
}

export function EmailGate({ fields, ctaLabel, onSubmit }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.name, ''])));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = fields.every((f) => !f.required || (values[f.name] && (f.type !== 'email' || /\S+@\S+\.\S+/.test(values[f.name]))));

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!valid || submitting) return;
        setError(null);
        setSubmitting(true);
        try {
          await onSubmit(values);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Нещо се обърка. Опитай пак.');
          setSubmitting(false);
        }
      }}
      className="flex flex-col gap-4"
    >
      {fields.map((f) => (
        <label key={f.name} className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[var(--color-text-strong)]">{f.label}</span>
          <input
            type={f.type}
            name={f.name}
            placeholder={f.placeholder}
            required={f.required}
            value={values[f.name]}
            onChange={(e) => setValues((p) => ({ ...p, [f.name]: e.target.value }))}
            autoComplete={f.type === 'email' ? 'email' : 'tel'}
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 h-14 text-base text-[var(--color-text-headline)] outline-none focus:border-[var(--color-brand-red)]"
          />
        </label>
      ))}

      <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
        <LockIcon width={12} height={12} aria-hidden />
        <span>Без спам. Можеш да се отпишеш с един клик.</span>
      </p>

      {error && <p className="text-sm text-[var(--color-brand-red)]">{error}</p>}

      <button
        type="submit"
        disabled={!valid || submitting}
        style={{ transformOrigin: 'center' }}
        className={[
          'mt-2 w-full h-14 rounded-full font-bold text-white',
          'motion-safe:transition-[transform,background-color,box-shadow,opacity] motion-safe:duration-200 motion-safe:ease-out',
          'motion-safe:active:scale-[0.98] motion-safe:active:duration-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
          valid && !submitting
            ? 'bg-brand-gradient shadow-brand-red cursor-pointer motion-safe:hover:shadow-[0_18px_30px_-12px_rgba(165,0,21,0.5)]'
            : 'bg-[var(--color-surface-200)] text-[var(--color-text-muted)] cursor-not-allowed',
        ].join(' ')}
      >
        {submitting ? 'Изпращаме...' : ctaLabel}
      </button>
    </form>
  );
}
