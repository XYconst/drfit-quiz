'use client';
import { motion } from 'framer-motion';

interface Props {
  number: string;
  title: string;
  children: React.ReactNode;
}

export function NumberedSection({ number, title, children }: Props) {
  return (
    <motion.section
      className="mt-10 pt-8 border-t border-[var(--color-line)]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <div className="flex items-baseline gap-3 mb-4">
        <span
          className="text-3xl font-extrabold text-[var(--color-brand-red)]"
          style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
        >
          {number}
        </span>
        <h2
          className="text-xl font-extrabold leading-tight text-[var(--color-text-headline)]"
          style={{ textWrap: 'balance' }}
        >
          {title}
        </h2>
      </div>
      <div>{children}</div>
    </motion.section>
  );
}
