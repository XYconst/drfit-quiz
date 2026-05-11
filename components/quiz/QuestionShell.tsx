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
          <a href="/" aria-label="Dr.Fit" className="inline-flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/drfit-logo.svg" alt="Dr.Fit" width={84} height={27} />
          </a>
          <span className="size-10" aria-hidden />
        </div>
        <ProgressBar value={progress} />
      </header>

      <main className="flex-1 px-5 pt-4 pb-8 max-w-md w-full mx-auto flex flex-col">
        {headline && (
          <h1
            className="font-extrabold text-[var(--color-text-headline)] text-center mb-3"
            style={{
              fontSize: 'clamp(1.75rem, 6.5vw, 2.625rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              textWrap: 'balance',
            }}
          >
            {headline}
          </h1>
        )}
        {subheadline && (
          <p
            className="text-[var(--color-text-body)] text-center mb-8"
            style={{
              fontSize: 'clamp(1rem, 3.4vw, 1.125rem)',
              lineHeight: 1.45,
              textWrap: 'pretty',
            }}
          >
            {subheadline}
          </p>
        )}
        <div className="flex-1 flex flex-col">{children}</div>
      </main>
    </div>
  );
}
