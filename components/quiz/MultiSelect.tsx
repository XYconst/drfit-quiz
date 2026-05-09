'use client';
import { motion } from 'framer-motion';
import type { OptionSpec, CardVariant } from '@/lib/questions';
import { OptionCard } from './OptionCard';
import { OptionRow } from './OptionRow';
import { PhotoRow } from './PhotoRow';
import { SplitPhotoSelect } from './SplitPhotoSelect';
import { ArrowRightIcon, resolveIcon } from '@/components/icons';

interface Props {
  options: OptionSpec[];
  selected: string[];
  minSelect: number;
  maxSelect?: number;
  variant: CardVariant;
  splitPhotoSrc?: string;
  onToggle: (value: string) => void;
  onContinue: () => void;
}

function gridClass(variant: CardVariant): string {
  if (variant === 'icon-row') return 'flex flex-col gap-3 mb-6';
  if (variant === 'wide') return 'grid grid-cols-1 gap-3 mb-6';
  // 2-col grids: when the option count is odd, the trailing single card centers
  // itself at the same width as a regular column.
  return 'grid grid-cols-2 gap-3 mb-6 [&>:last-child:nth-child(odd)]:col-span-2 [&>:last-child:nth-child(odd)]:w-[calc(50%-0.375rem)] [&>:last-child:nth-child(odd)]:justify-self-center';
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' as const } },
};

export function MultiSelect({
  options,
  selected,
  minSelect,
  maxSelect,
  variant,
  splitPhotoSrc,
  onToggle,
  onContinue,
}: Props) {
  const canContinue = selected.length >= minSelect;
  const atCap = typeof maxSelect === 'number' && selected.length >= maxSelect;

  if (variant === 'split-photo') {
    return (
      <SplitPhotoSelect
        mode="multi"
        options={options}
        selectedMulti={selected}
        minSelect={minSelect}
        maxSelect={maxSelect}
        imageSrc={splitPhotoSrc ?? ''}
        onToggle={onToggle}
        onContinue={onContinue}
      />
    );
  }

  const usePhotoRow =
    options.length === 3 &&
    (variant === 'portrait' || variant === 'square') &&
    options.every((o) => Boolean(o.imageUrl));

  return (
    <>
      <motion.div
        className={usePhotoRow ? 'flex flex-col gap-3 mb-6' : gridClass(variant)}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {options.map((opt) => {
          const isOn = selected.includes(opt.value);
          const disabled = atCap && !isOn;
          return (
            <motion.div key={opt.id} variants={item}>
              {variant === 'icon-row' ? (
                <OptionRow
                  icon={resolveIcon(opt.icon)}
                  label={opt.label}
                  sub={opt.sub}
                  tone={opt.tone}
                  selected={isOn}
                  disabled={disabled}
                  onClick={() => onToggle(opt.value)}
                />
              ) : usePhotoRow ? (
                <PhotoRow
                  imageUrl={opt.imageUrl ?? ''}
                  imageAlt={opt.label}
                  label={opt.label}
                  sub={opt.sub}
                  selected={isOn}
                  disabled={disabled}
                  onClick={() => onToggle(opt.value)}
                />
              ) : (
                <OptionCard
                  imageUrl={opt.imageUrl ?? ''}
                  imageAlt={opt.label}
                  label={opt.label}
                  sub={opt.sub}
                  selected={isOn}
                  disabled={disabled}
                  onClick={() => onToggle(opt.value)}
                  variant={variant}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>
      <div className="mt-auto pt-4 sticky bottom-0 bg-[var(--color-brand-bg)]">
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          style={{ transformOrigin: 'center' }}
          className={[
            'w-full h-14 rounded-full font-bold text-white',
            'flex items-center justify-center gap-2',
            'motion-safe:transition-[transform,background-color,box-shadow,opacity] motion-safe:duration-200 motion-safe:ease-out',
            'motion-safe:active:scale-[0.98] motion-safe:active:duration-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
            canContinue
              ? 'bg-brand-gradient shadow-brand-red cursor-pointer motion-safe:hover:shadow-[0_18px_30px_-12px_rgba(165,0,21,0.5)]'
              : 'bg-[var(--color-surface-200)] text-[var(--color-text-muted)] cursor-not-allowed',
          ].join(' ')}
        >
          <span>Продължи</span>
          <ArrowRightIcon
            width={18}
            height={18}
            className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out group-hover:motion-safe:translate-x-0.5"
          />
        </button>
        {!canContinue && (
          <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">
            Избери поне {minSelect}
          </p>
        )}
      </div>
    </>
  );
}
