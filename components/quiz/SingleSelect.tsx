'use client';
import { motion } from 'framer-motion';
import type { OptionSpec, CardVariant } from '@/lib/questions';
import { OptionCard } from './OptionCard';
import { OptionRow } from './OptionRow';
import { SplitPhotoSelect } from './SplitPhotoSelect';
import { resolveIcon } from '@/components/icons';

interface Props {
  options: OptionSpec[];
  selected?: string;
  variant: CardVariant;
  /** Required when variant === 'split-photo'. Path to the matched character pose. */
  splitPhotoSrc?: string;
  onPick: (value: string, optionId: string) => void;
}

function gridClass(variant: CardVariant): string {
  if (variant === 'icon-row') return 'flex flex-col gap-3';
  if (variant === 'wide') return 'grid grid-cols-1 gap-3';
  // 2-col grids: when the option count is odd, the trailing single card centers
  // itself at the same width as a regular column.
  return 'grid grid-cols-2 gap-3 [&>:last-child:nth-child(odd)]:col-span-2 [&>:last-child:nth-child(odd)]:w-[calc(50%-0.375rem)] [&>:last-child:nth-child(odd)]:justify-self-center';
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' as const } },
};

export function SingleSelect({ options, selected, variant, splitPhotoSrc, onPick }: Props) {
  if (variant === 'split-photo') {
    return (
      <SplitPhotoSelect
        mode="single"
        options={options}
        selected={selected}
        imageSrc={splitPhotoSrc ?? ''}
        onPick={onPick}
      />
    );
  }
  return (
    <motion.div
      className={gridClass(variant)}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {options.map((opt) => (
        <motion.div key={opt.id} variants={item}>
          {variant === 'icon-row' ? (
            <OptionRow
              icon={resolveIcon(opt.icon)}
              label={opt.label}
              sub={opt.sub}
              tone={opt.tone}
              selected={selected === opt.value}
              onClick={() => onPick(opt.value, opt.id)}
            />
          ) : (
            <OptionCard
              imageUrl={opt.imageUrl ?? ''}
              imageAlt={opt.label}
              label={opt.label}
              sub={opt.sub}
              selected={selected === opt.value}
              onClick={() => onPick(opt.value, opt.id)}
              variant={variant}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
