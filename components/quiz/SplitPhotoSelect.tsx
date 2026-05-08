'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { OptionSpec } from '@/lib/questions';
import { OptionRow } from './OptionRow';
import { resolveIcon } from '@/components/icons';

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

  return (
    <div className="flex flex-col gap-4">
      {/* Photo: top quarter on mobile, side panel on wider screens */}
      {imageOk && imageSrc ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
          className="relative w-full h-[200px] sm:h-[260px] rounded-2xl overflow-hidden bg-[var(--color-graphite)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 28%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
        </motion.div>
      ) : null}

      <motion.div
        className="flex flex-col gap-3"
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
    <div className="mt-2 sticky bottom-4">
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
