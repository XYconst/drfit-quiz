'use client';
import { ProgressBar } from './ProgressBar';
import { ChevronLeftIcon } from '@/components/icons';

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
        <div className="flex items-center justify-between px-3 h-14">
          <button
            type="button"
            onClick={onBack}
            disabled={!onBack}
            style={{ transformOrigin: 'center' }}
            className="size-10 grid place-items-center rounded-full text-[var(--color-text-body)] disabled:opacity-30 hover:bg-[var(--color-surface-100)] motion-safe:transition-[background-color,transform] motion-safe:duration-150 motion-safe:ease-out motion-safe:active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)]"
            aria-label="Назад"
          >
            <ChevronLeftIcon width={22} height={22} />
          </button>
          <span
            className="text-[13px] uppercase font-bold text-[var(--color-text-headline)]"
            style={{ letterSpacing: '0.18em' }}
          >
            DR.FIT
          </span>
          <span className="size-10" aria-hidden />
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
