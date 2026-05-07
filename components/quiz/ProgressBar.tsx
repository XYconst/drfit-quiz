'use client';
import { motion } from 'framer-motion';

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1 w-full bg-[var(--color-surface-200)] overflow-hidden">
      <motion.div
        className="h-full bg-brand-gradient"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}
