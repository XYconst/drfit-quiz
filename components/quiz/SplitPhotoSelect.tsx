'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { OptionSpec } from '@/lib/questions';
import { CheckIcon, resolveIcon } from '@/components/icons';

/**
 * Two-column option grid with the matched character cutout below. Designed to
 * fit a 390x844 mobile viewport without scrolling, so option cards are compact
 * and the photo fills the remaining vertical space.
 */

const SLOT_CROP: Record<string, string> = {
  goal: 'center 30%',
  'enc-1': 'center 40%',
  'enc-2': 'center 30%',
  'split-relaxed': 'center 30%',
  'split-stretch': 'center 35%',
  'split-bench': 'center 40%',
  'split-walking': 'center 35%',
  'split-squat': 'center 55%',
  'split-bottle': 'center 35%',
  'split-towel': 'center 30%',
  'split-front': 'center 35%',
  'split-lunge': 'center 55%',
  'split-seated': 'center 50%',
  'split-food': 'center 35%',
};

function cropForSrc(imageSrc: string): string {
  const m = imageSrc.match(/\/photo\/([^/]+)\//);
  if (m && SLOT_CROP[m[1]]) return SLOT_CROP[m[1]];
  return 'center 35%';
}

interface BaseProps {
  options: OptionSpec[];
  imageSrc: string;
  imageAlt?: string;
}

interface SingleProps extends BaseProps {
  mode: 'single';
  selected?: string;
  onPick: (value: string, optionId: string) => void;
}

interface MultiProps extends BaseProps {
  mode: 'multi';
  selectedMulti: string[];
  minSelect: number;
  maxSelect?: number;
  onToggle: (value: string) => void;
  onContinue: () => void;
}

type Props = SingleProps | MultiProps;

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
};

const cell = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' as const } },
};

export function SplitPhotoSelect(props: Props) {
  const { options, imageSrc, imageAlt = '' } = props;

  const [imageOk, setImageOk] = useState(true);
  useEffect(() => {
    setImageOk(true);
    if (!imageSrc) {
      setImageOk(false);
      return;
    }
    const img = new Image();
    img.onload = () => setImageOk(true);
    img.onerror = () => setImageOk(false);
    img.src = imageSrc;
  }, [imageSrc]);

  const showPhoto = imageOk && Boolean(imageSrc);
  const isMulti = props.mode === 'multi';

  // With 5+ options the option grid alone takes 3 rows; drop the photo entirely
  // to keep everything inside the mobile viewport.
  const tallGrid = options.length >= 5;
  // Odd option counts read better as a single stacked column than as a 2-col
  // grid with a lonely centered last card.
  const stack = options.length % 2 === 1;

  return (
    <div className="flex flex-col h-full gap-4 min-h-0">
      <motion.div
        className={
          stack
            ? 'flex flex-col gap-2.5'
            : 'grid grid-cols-2 gap-2.5 [&>:last-child:nth-child(odd)]:col-span-2 [&>:last-child:nth-child(odd)]:w-[calc(50%-0.3125rem)] [&>:last-child:nth-child(odd)]:justify-self-center'
        }
        variants={grid}
        initial="hidden"
        animate="show"
      >
        {options.map((opt) => {
          const isSelected = isMulti
            ? props.selectedMulti.includes(opt.value)
            : props.selected === opt.value;
          // In single-column (stack) mode, lay icon + text out horizontally so
          // there's no dead vertical whitespace inside the card. In 2-col grid
          // mode, keep the stacked layout because the cards are narrower.
          return (
            <motion.button
              type="button"
              key={opt.id}
              variants={cell}
              onClick={() => {
                if (isMulti) {
                  props.onToggle(opt.value);
                } else {
                  props.onPick(opt.value, opt.id);
                }
              }}
              aria-pressed={isSelected}
              className={[
                'relative rounded-2xl border-2 text-left',
                stack
                  ? 'px-4 py-3 min-h-[56px] flex items-center gap-3'
                  : 'p-3 min-h-[80px] flex flex-col justify-between gap-2',
                'motion-safe:transition-[transform,border-color,background-color] motion-safe:duration-200',
                'motion-safe:active:scale-[0.97]',
                isSelected
                  ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red-tint)]'
                  : 'border-[var(--color-line)] bg-[var(--color-paper-warm)] hover:border-[var(--color-text-muted)]',
              ].join(' ')}
            >
              <span
                className={[
                  'shrink-0 grid place-items-center rounded-full',
                  stack ? 'size-9' : 'size-7',
                  isSelected ? 'bg-white text-[var(--color-brand-red)]' : 'bg-[var(--color-surface-100)] text-[var(--color-text-strong)]',
                ].join(' ')}
              >
                {resolveIcon(opt.icon)}
              </span>
              <span className={stack ? 'min-w-0 flex-1' : 'block'}>
                <span className="block font-semibold text-[14px] leading-tight text-[var(--color-text-headline)]">
                  {opt.label}
                </span>
                {opt.sub && (
                  <span className="block mt-0.5 text-[12px] leading-snug text-[var(--color-text-muted)] line-clamp-2">
                    {opt.sub}
                  </span>
                )}
              </span>
              {isSelected && (
                <span
                  aria-hidden
                  className={[
                    'absolute size-5 rounded-md bg-[var(--color-brand-red)] grid place-items-center',
                    stack ? 'top-1/2 right-3 -translate-y-1/2' : 'top-2 right-2',
                  ].join(' ')}
                >
                  <CheckIcon width={12} height={12} className="text-white" />
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {showPhoto && !tallGrid ? (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-md flex justify-center items-end pointer-events-none"
          style={{ height: 'calc(100dvh - 360px)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="block h-full w-auto object-contain object-bottom"
            style={{ objectPosition: cropForSrc(imageSrc) }}
          />
        </motion.div>
      ) : null}

      {isMulti ? (
        <ContinueBar
          selectedCount={props.selectedMulti.length}
          minSelect={props.minSelect}
          onContinue={props.onContinue}
        />
      ) : null}
    </div>
  );
}

function ContinueBar({
  selectedCount,
  minSelect,
  onContinue,
}: {
  selectedCount: number;
  minSelect: number;
  onContinue: () => void;
}) {
  const canContinue = selectedCount >= minSelect;
  return (
    <div className="pt-3 pb-2 sticky bottom-0 bg-[var(--color-brand-bg)] -mx-5 px-5 border-t border-[var(--color-line)]/40">
      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className={[
          'w-full h-14 rounded-full font-bold text-white transition-all',
          canContinue
            ? 'bg-brand-gradient shadow-brand-red active:scale-[0.99]'
            : 'bg-[var(--color-surface-200)] text-[var(--color-text-muted)] cursor-not-allowed',
        ].join(' ')}
      >
        Продължи
      </button>
      {!canContinue && (
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">
          Избери поне {minSelect}
        </p>
      )}
    </div>
  );
}

export type { Props as SplitPhotoSelectProps };
