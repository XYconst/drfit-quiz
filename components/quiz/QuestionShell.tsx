'use client';
import { ProgressBar } from './ProgressBar';

interface Props {
  progress: number; // 0..1
  onBack?: () => void;
  children: React.ReactNode;
  headline?: string;
  subheadline?: string;
}

export function QuestionShell({ progress, onBack, children, headline, subheadline }: Props) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-10 bg-[var(--color-brand-bg)]">
        <div className="flex items-center justify-between px-4 h-12">
          <button
            type="button"
            onClick={onBack}
            disabled={!onBack}
            className="text-2xl text-[var(--color-text-muted)] disabled:opacity-30 active:scale-95 transition-transform"
            aria-label="Назад"
          >
            ←
          </button>
          <span className="text-xs uppercase tracking-widest font-bold text-[var(--color-text-muted)]">
            Dr.Fit
          </span>
          <span className="w-6" />
        </div>
        <ProgressBar value={progress} />
      </header>

      <main className="flex-1 px-5 py-6 max-w-md w-full mx-auto flex flex-col">
        {headline && (
          <h1 className="text-2xl font-extrabold text-[var(--color-text-headline)] mb-2 leading-tight">
            {headline}
          </h1>
        )}
        {subheadline && (
          <p className="text-base text-[var(--color-text-body)] mb-6">{subheadline}</p>
        )}
        <div className="flex-1 flex flex-col">{children}</div>
      </main>
    </div>
  );
}
