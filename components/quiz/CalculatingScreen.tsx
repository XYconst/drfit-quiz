'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  headline: string;
  milestones: string[];
  durationMs: number;
  onDone: () => void;
}

export function CalculatingScreen({ headline, milestones, durationMs, onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [milestoneIdx, setMilestoneIdx] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      setProgress(p);
      const idx = Math.min(milestones.length - 1, Math.floor(p * milestones.length));
      setMilestoneIdx(idx);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 600);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, milestones.length, onDone]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center bg-[var(--color-brand-bg)]">
      <h2 className="text-2xl font-extrabold text-[var(--color-text-headline)] mb-8">{headline}</h2>

      <div className="w-32 h-32 mb-8 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="46" stroke="var(--color-surface-200)" strokeWidth="6" fill="none" />
          <motion.circle
            cx="50" cy="50" r="46"
            stroke="url(#g)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={2 * Math.PI * 46}
            animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - progress) }}
            transition={{ duration: 0.1 }}
          />
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E50914" />
              <stop offset="100%" stopColor="#A50015" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-[var(--color-brand-red)]">
          {Math.round(progress * 100)}%
        </div>
      </div>

      <motion.p
        key={milestoneIdx}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-base text-[var(--color-text-body)] min-h-[1.5em]"
      >
        {milestones[milestoneIdx]}
      </motion.p>
    </div>
  );
}
