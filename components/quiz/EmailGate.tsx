'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LockIcon, ArrowRightIcon } from '@/components/icons';

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
    <div className="flex flex-col gap-6">
      {/* Blurred plan teaser */}
      <PlanTeaser />

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
            'group mt-2 w-full h-14 rounded-full font-extrabold text-white',
            'flex items-center justify-center gap-2',
            'motion-safe:transition-[transform,background-color,box-shadow,opacity] motion-safe:duration-200 motion-safe:ease-out',
            'motion-safe:active:scale-[0.98] motion-safe:active:duration-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
            valid && !submitting
              ? 'bg-brand-gradient shadow-brand-red cursor-pointer motion-safe:hover:shadow-[0_18px_30px_-12px_rgba(165,0,21,0.5)]'
              : 'bg-[var(--color-surface-200)] text-[var(--color-text-muted)] cursor-not-allowed',
          ].join(' ')}
        >
          <span style={{ letterSpacing: '0.01em' }}>{submitting ? 'Изпращаме…' : ctaLabel}</span>
          {!submitting && (
            <ArrowRightIcon
              width={18}
              height={18}
              className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out group-hover:motion-safe:translate-x-0.5"
            />
          )}
        </button>
      </form>
    </div>
  );
}

/**
 * Blurred preview of the user's plan — three faux content cards rendered with a heavy
 * blur, surfaced behind a single lock + reveal CTA. Designed to read as "your plan
 * is ready behind this screen — drop your email to unlock it."
 */
function PlanTeaser() {
  return (
    <div className="relative">
      {/* Blurred mock content stack */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
        className="space-y-3 select-none pointer-events-none"
        style={{ filter: 'blur(7px)' }}
        aria-hidden
      >
        {/* Card 1: profile / avatar summary */}
        <div className="rounded-2xl bg-[var(--color-paper-warm)] border border-[var(--color-line)] p-4 flex items-center gap-3">
          <div className="size-12 rounded-full bg-[var(--color-brand-red)]/35" />
          <div className="flex-1 space-y-2">
            <div className="h-3 rounded-full bg-[var(--color-text-strong)]/35" style={{ width: '62%' }} />
            <div className="h-2 rounded-full bg-[var(--color-line)]" style={{ width: '42%' }} />
          </div>
          <div className="h-6 w-12 rounded-full bg-[var(--color-brand-red)]/30" />
        </div>

        {/* Card 2: BMI projection mini-chart */}
        <div className="rounded-2xl bg-[var(--color-paper-warm)] border border-[var(--color-line)] p-4">
          <div className="flex items-baseline justify-between mb-3">
            <div className="h-3 rounded-full bg-[var(--color-text-strong)]/35" style={{ width: '46%' }} />
            <div className="h-3 rounded-full bg-[var(--color-brand-red)]/40" style={{ width: '22%' }} />
          </div>
          <svg viewBox="0 0 220 60" className="w-full h-14" preserveAspectRatio="none">
            <defs>
              <linearGradient id="teaserCurve" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(229,9,20,0.45)" />
                <stop offset="100%" stopColor="rgba(229,9,20,0)" />
              </linearGradient>
            </defs>
            <path
              d="M0 50 C 40 44, 80 36, 110 28 S 180 12, 220 6 L 220 60 L 0 60 Z"
              fill="url(#teaserCurve)"
            />
            <path
              d="M0 50 C 40 44, 80 36, 110 28 S 180 12, 220 6"
              fill="none"
              stroke="#A50015"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Card 3: weekly program grid */}
        <div className="rounded-2xl bg-[var(--color-paper-warm)] border border-[var(--color-line)] p-4">
          <div className="flex items-baseline justify-between mb-3">
            <div className="h-3 rounded-full bg-[var(--color-text-strong)]/35" style={{ width: '52%' }} />
            <div className="h-2 rounded-full bg-[var(--color-line)]" style={{ width: '24%' }} />
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-md ${
                  i === 1 || i === 3 || i === 5
                    ? 'bg-[var(--color-brand-red)]/45'
                    : 'bg-[var(--color-line)]'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Lock + reveal CTA — perfectly centered overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.42, delay: 0.14, ease: [0.22, 0.61, 0.36, 1] }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4"
      >
        <div
          className="size-14 rounded-full bg-white shadow-xl border border-[var(--color-line)] grid place-items-center"
          style={{ boxShadow: '0 14px 30px -10px rgba(165,0,21,0.35), 0 4px 10px rgba(0,0,0,0.08)' }}
        >
          <LockIcon width={22} height={22} className="text-[var(--color-brand-red)]" />
        </div>
        <div
          className="px-4 py-2 rounded-full bg-[var(--color-brand-red)] text-white font-extrabold uppercase shadow-brand-red text-[11px]"
          style={{ letterSpacing: '0.18em' }}
        >
          Открий пълния план
        </div>
        <p
          className="text-[13px] text-[var(--color-text-body)] font-medium text-center max-w-[28ch]"
          style={{ textWrap: 'pretty' }}
        >
          Профил, BMI проекция и седмична програма. Отключи всичко с email-а си.
        </p>
      </motion.div>
    </div>
  );
}
