'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  /** Total time (ms) the loader holds before onDone fires. */
  durationMs?: number;
  onDone: () => void;
}

const STEPS = [
  'Прилагаме твоята отстъпка',
  'Подготвяме твоя план',
  'Зареждаме плащането',
];

export function PlanLoading({ durationMs = 1800, onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      setProgress(p);
      const idx = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
      setStepIdx(idx);
      if (p < 1) raf = requestAnimationFrame(tick);
      else onDone();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, onDone]);

  return (
    <div className="rounded-3xl bg-white border border-[var(--color-line)] px-6 py-9 flex flex-col items-center text-center">
      <motion.div
        className="size-14 rounded-full border-4 border-[var(--color-paper-warm)] border-t-[var(--color-brand-red)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, ease: 'linear', repeat: Infinity }}
      />
      <motion.p
        key={stepIdx}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-5 text-[15px] font-semibold text-[var(--color-text-strong)]"
      >
        {STEPS[stepIdx]}
      </motion.p>
      <div className="mt-4 h-1.5 w-full max-w-[220px] rounded-full bg-[var(--color-paper-warm)] overflow-hidden">
        <div
          className="h-full bg-brand-gradient"
          style={{ width: `${Math.round(progress * 100)}%`, transition: 'width 80ms linear' }}
        />
      </div>
    </div>
  );
}
