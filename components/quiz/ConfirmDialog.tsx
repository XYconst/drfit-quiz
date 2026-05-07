'use client';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Optional icon shown in the header pill. */
  icon?: ReactNode;
  /** When true, the confirm button uses the brand-red destructive treatment. Default true. */
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  icon,
  destructive = true,
}: Props) {
  // Escape closes the dialog; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          onClick={onCancel}
        >
          {/* Backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative w-full max-w-sm rounded-3xl bg-white border border-[var(--color-line)] p-6 text-center"
            style={{ boxShadow: '0 28px 64px -20px rgba(0,0,0,0.45), 0 8px 18px -8px rgba(165,0,21,0.18)' }}
          >
            {icon && (
              <div className="mx-auto size-14 rounded-full bg-[var(--color-paper-warm)] border border-[var(--color-line)] grid place-items-center mb-4 text-[var(--color-brand-red)]">
                {icon}
              </div>
            )}

            <h3
              id="confirm-dialog-title"
              className="font-extrabold text-[var(--color-text-headline)] mb-2"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.375rem, 5vw, 1.625rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                textWrap: 'balance',
              }}
            >
              {title}
            </h3>

            {body && (
              <p
                className="text-[14px] text-[var(--color-text-body)] leading-relaxed mb-6 max-w-[30ch] mx-auto font-medium"
                style={{ textWrap: 'pretty' }}
              >
                {body}
              </p>
            )}

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={onConfirm}
                autoFocus
                style={{ transformOrigin: 'center' }}
                className={[
                  'h-12 rounded-full font-extrabold text-white',
                  'motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 motion-safe:ease-out',
                  'motion-safe:hover:-translate-y-[1px]',
                  'motion-safe:active:scale-[0.98] motion-safe:active:duration-100',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand-red)]',
                  destructive
                    ? 'bg-brand-gradient shadow-brand-red motion-safe:hover:shadow-[0_18px_30px_-12px_rgba(165,0,21,0.5)]'
                    : 'bg-[var(--color-text-headline)] motion-safe:hover:shadow-[0_12px_24px_-12px_rgba(0,0,0,0.4)]',
                ].join(' ')}
              >
                {confirmLabel}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="h-12 rounded-full font-bold text-[var(--color-text-body)] hover:text-[var(--color-text-headline)] hover:bg-[var(--color-surface-100)] motion-safe:transition-colors motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2"
              >
                {cancelLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
