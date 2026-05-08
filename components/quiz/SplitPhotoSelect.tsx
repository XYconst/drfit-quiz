'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { OptionSpec } from '@/lib/questions';
import { OptionRow } from './OptionRow';
import { resolveIcon } from '@/components/icons';

/**
 * Per-slot crop hint. Different poses put the body action at different vertical
 * positions in the frame; the hero crop window keeps all of them anchored on
 * the most expressive region.
 */
const SLOT_CROP: Record<string, string> = {
  'goal':           'center 30%',
  'enc-1':          'center 40%',
  'enc-2':          'center 30%',
  'split-relaxed':  'center 30%',
  'split-stretch':  'center 35%',
  'split-bench':    'center 40%',
  'split-walking':  'center 35%',
  'split-squat':    'center 55%',
  'split-bottle':   'center 35%',
  'split-towel':    'center 30%',
  'split-front':    'center 35%',
  'split-lunge':    'center 55%',
  'split-seated':   'center 50%',
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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' as const } },
};

export function SplitPhotoSelect(props: Props) {
  const { options, imageSrc, imageAlt = '' } = props;

  // imageSrc may 404 (pose generation pending). Detect once, fall back to neutral state.
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

  // The model floats on the right of the option list. At narrow widths the
  // photo is anchored to the right margin and clipped if needed; at wider
  // widths the column gets more breathing room. Background-removed cutouts
  // (transparent PNG) sit on the brand-bg directly so there's no card chrome.
  const showPhoto = imageOk && Boolean(imageSrc);
  return (
    <div className="relative">
      {showPhoto ? (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.06 }}
          className="pointer-events-none absolute right-[-12px] top-[-8px] sm:right-0 w-[140px] sm:w-[200px] h-[420px] sm:h-[480px] z-0"
          style={{
            objectPosition: cropForSrc(imageSrc),
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-contain object-bottom"
          />
        </motion.div>
      ) : null}

      <motion.div
        className={[
          'relative z-10 flex flex-col gap-3',
          showPhoto ? 'pr-[124px] sm:pr-[176px]' : '',
        ].join(' ')}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {options.map((opt) => {
          const isMulti = props.mode === 'multi';
          const isSelected = isMulti
            ? props.selectedMulti.includes(opt.value)
            : props.selected === opt.value;
          return (
            <motion.div key={opt.id} variants={item}>
              <OptionRow
                icon={resolveIcon(opt.icon)}
                label={opt.label}
                sub={opt.sub}
                tone={opt.tone}
                selected={isSelected}
                onClick={() => {
                  if (isMulti) {
                    props.onToggle(opt.value);
                  } else {
                    props.onPick(opt.value, opt.id);
                  }
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {props.mode === 'multi' ? (
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
    <div className="mt-4 pt-4 sticky bottom-0 bg-[var(--color-brand-bg)] pb-2 -mx-5 px-5 border-t border-[var(--color-line)]/40">
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
