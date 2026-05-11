'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, LockIcon } from '@/components/icons';

interface Props {
  open: boolean;
  /** Eyebrow chip (e.g. "Лична оферта" or "Изчакай малко"). */
  eyebrow: string;
  /** Discount percentage label, e.g. "30%". */
  percent: string;
  /** Headline rendered under the % (e.g. "Активирай отстъпката си"). */
  headline: string;
  /** One-line body explaining the offer. */
  body: string;
  /** Pre-discount price label, e.g. "49,00 EUR". */
  fromPrice: string;
  /** Post-discount price label, e.g. "34,30 EUR". */
  toPrice: string;
  /** Per-day display after discount, e.g. "0,38 EUR/ден". */
  perDay: string;
  /** Accept-button label (e.g. "Активирай и плати"). */
  acceptLabel: string;
  onAccept: () => void;
  /** Render the X close button when set. */
  onClose?: () => void;
}

export function PreCheckoutModal({
  open,
  eyebrow,
  percent,
  headline,
  body,
  fromPrice,
  toPrice,
  perDay,
  acceptLabel,
  onAccept,
  onClose,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 bg-black/55 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="w-full max-w-md bg-white rounded-3xl border border-[var(--color-line)] shadow-[0_24px_60px_-20px_rgba(25,33,38,0.45)] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[var(--color-brand-red)] to-[#FF3B47] text-white px-5 py-3 flex items-center justify-between gap-3">
              <span className="text-[11px] font-extrabold uppercase" style={{ letterSpacing: '0.22em' }}>
                {eyebrow}
              </span>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Затвори офертата"
                  className="size-7 rounded-full grid place-items-center text-white/85 hover:bg-white/15 motion-safe:transition-[background-color] motion-safe:duration-150"
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              )}
            </div>
            <div className="px-6 pt-6 pb-7">
              <p className="text-[14px] font-semibold text-[var(--color-text-strong)] mb-1">{body}</p>
              <h3
                className="font-extrabold text-[var(--color-text-headline)] mt-1"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1.625rem, 7vw, 2.125rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                }}
              >
                {percent ? (
                  <>
                    {percent} <span className="text-[var(--color-brand-red)]">{headline}</span>
                  </>
                ) : (
                  <span className="text-[var(--color-brand-red)]">{headline}</span>
                )}
              </h3>

              <div className="mt-5 rounded-2xl bg-[var(--color-paper-warm)] border border-[var(--color-line)] px-4 py-3 flex items-baseline justify-between gap-3">
                <div>
                  <p
                    className="text-[10px] uppercase font-bold text-[var(--color-text-muted)]"
                    style={{ letterSpacing: '0.2em' }}
                  >
                    Твоята цена
                  </p>
                  <p className="mt-1 flex items-baseline gap-2">
                    <span className="text-[12px] text-[var(--color-text-muted)] line-through tabular-nums">
                      {fromPrice}
                    </span>
                    <span className="text-[26px] font-extrabold text-[var(--color-brand-red)] tabular-nums leading-none">
                      {toPrice}
                    </span>
                  </p>
                </div>
                <p className="text-[13px] font-bold text-[var(--color-text-strong)] tabular-nums text-right shrink-0">
                  {perDay}
                </p>
              </div>

              <button
                type="button"
                onClick={onAccept}
                className={[
                  'mt-5 w-full h-14 rounded-full font-extrabold text-white bg-brand-gradient shadow-brand-red',
                  'flex items-center justify-center gap-2',
                  'motion-safe:transition-[transform,box-shadow] motion-safe:duration-200',
                  'motion-safe:hover:-translate-y-[2px] motion-safe:active:scale-[0.98]',
                ].join(' ')}
              >
                <span>{acceptLabel}</span>
                <ArrowRightIcon width={18} height={18} />
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-[var(--color-text-muted)]">
                <LockIcon width={12} height={12} aria-hidden />
                Сигурно плащане през Stripe
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
