'use client';

export function ProgressBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value * 100));
  return (
    <div
      className="h-1 w-full bg-[var(--color-surface-200)] overflow-hidden"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-brand-gradient origin-left motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-out"
        style={{ transform: `scaleX(${pct / 100})` }}
      />
    </div>
  );
}
