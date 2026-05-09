'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  percent: string;
  code: string;
  initialSeconds: number;
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

/**
 * Sticky strip that confirms the user's discount is active. Pinned to the top
 * of the plan page so the timer + code remain visible while they scroll
 * through the offer.
 */
export function ActiveDiscountStrip({ percent, code, initialSeconds }: Props) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const expired = seconds <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      className="sticky top-0 z-30 -mx-5 mb-5 px-5 py-2.5 bg-gradient-to-r from-[var(--color-brand-red)] to-[#FF3B47] text-white shadow-[0_8px_18px_-12px_rgba(165,0,21,0.6)]"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span aria-hidden className="size-1.5 rounded-full bg-white animate-pulse" />
          <span
            className="text-[11px] font-extrabold uppercase truncate"
            style={{ letterSpacing: '0.18em' }}
          >
            {percent} активирана
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="hidden sm:inline text-[11px] font-bold tabular-nums tracking-[0.14em] opacity-90"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {code}
          </span>
          <span
            className="font-mono tabular-nums text-[12px] font-bold tracking-wider"
          >
            {expired ? '00:00' : `${pad(mins)}:${pad(secs)}`}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
