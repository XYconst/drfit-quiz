interface Props {
  without: string[];
  withDrFit: string[];
}

export function ComparisonBlock({ without, withDrFit }: Props) {
  const rows = Math.max(without.length, withDrFit.length);
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-[var(--color-surface-100)] p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Без план</p>
        <ul className="space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-body)]">
              <span className="text-[var(--color-brand-red)] font-bold leading-none mt-0.5">✕</span>
              <span>{without[i] ?? ''}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl bg-[var(--color-success-50)] p-4 border border-[var(--color-success-400)]/30">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-success-700)] mb-3">С Dr.Fit</p>
        <ul className="space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-strong)]">
              <span className="text-[var(--color-success-600)] font-bold leading-none mt-0.5">✓</span>
              <span>{withDrFit[i] ?? ''}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
