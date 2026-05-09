'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  /** Bumped percentage label, e.g. "50%". */
  bumpedPercent: string;
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * Shown when the user closes the discount banner. Offers a higher discount
 * to keep them in the flow ("if you stay, take 50% instead of 30%").
 */
export function EscalationModal({ open, bumpedPercent, onAccept, onDecline }: Props) {
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
            <div className="bg-gradient-to-r from-[var(--color-brand-red)] to-[#FF3B47] text-white px-5 py-3">
              <span
                className="text-[11px] font-extrabold uppercase"
                style={{ letterSpacing: '0.22em' }}
              >
                Изчакай малко
              </span>
            </div>
            <div className="px-6 pt-6 pb-7 text-center">
              <h3
                className="font-extrabold text-[var(--color-text-headline)]"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1.5rem, 6vw, 1.875rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                }}
              >
                Вземи {bumpedPercent} отстъпка
              </h3>
              <p className="mt-3 text-[14px] text-[var(--color-text-body)] leading-relaxed max-w-[34ch] mx-auto">
                Не искаме да си тръгваш с празни ръце. Остани сега и ще получиш{' '}
                <span className="font-bold text-[var(--color-brand-red)]">{bumpedPercent}</span>{' '}
                отстъпка вместо досегашната.
              </p>

              <button
                type="button"
                onClick={onAccept}
                className={[
                  'mt-6 w-full h-14 rounded-full font-extrabold text-white bg-brand-gradient shadow-brand-red',
                  'flex items-center justify-center',
                  'motion-safe:transition-[transform,box-shadow] motion-safe:duration-200',
                  'motion-safe:hover:-translate-y-[2px] motion-safe:active:scale-[0.98]',
                ].join(' ')}
              >
                Активирай {bumpedPercent} отстъпка
              </button>
              <button
                type="button"
                onClick={onDecline}
                className="mt-3 text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text-body)] motion-safe:transition-colors"
              >
                Не, благодаря
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
