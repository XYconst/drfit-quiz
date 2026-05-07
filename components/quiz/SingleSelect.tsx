'use client';
import { motion } from 'framer-motion';
import type { OptionSpec, CardVariant } from '@/lib/questions';
import { OptionCard } from './OptionCard';

interface Props {
  options: OptionSpec[];
  selected?: string;
  variant: CardVariant;
  onPick: (value: string, optionId: string) => void;
}

function gridClass(variant: CardVariant): string {
  if (variant === 'wide') return 'grid grid-cols-1 gap-3';
  return 'grid grid-cols-2 gap-3';
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' as const } },
};

export function SingleSelect({ options, selected, variant, onPick }: Props) {
  return (
    <motion.div
      className={gridClass(variant)}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {options.map((opt) => (
        <motion.div key={opt.id} variants={item}>
          <OptionCard
            imageUrl={opt.imageUrl ?? ''}
            imageAlt={opt.label}
            label={opt.label}
            sub={opt.sub}
            selected={selected === opt.value}
            onClick={() => onPick(opt.value, opt.id)}
            variant={variant}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
