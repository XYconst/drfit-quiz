'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon } from '@/components/icons';
import type { Gender } from '@/lib/avatars';

/**
 * Anatomical multi-select for problem areas. Uses the matched character's
 * 'goal' pose photo (transparent-bg cutout) as the base body, then overlays
 * brand-red highlight blobs at anatomical landmarks for any selected region.
 *
 * Region positions are tuned to the goal pose (hands on hips, three-quarter
 * body framing). Coordinates are percentages of the photo container so they
 * stay anchored as the photo scales.
 */

export interface BodyRegion {
  id: string;
  label: string;
  /** Center of the highlight blob, in [0..1] space relative to the body container. */
  cx: number;
  cy: number;
  /** Width and height of the blob ellipse, in [0..1] space. */
  rx: number;
  ry: number;
  /** Optional second blob for symmetric features (left arm + right arm). */
  cx2?: number;
}

// Coords are tuned against the goal pose (hands-on-hips, three-quarter body).
// In a 3:4 container with the body bottom-anchored, the head sits ~y=0.18,
// chest ~y=0.32, navel ~y=0.55, hip-hand-rest ~y=0.66, thighs ~y=0.85.
const MALE_REGIONS: BodyRegion[] = [
  { id: 'chest',        label: 'Гърди',          cx: 0.50, cy: 0.34, rx: 0.18, ry: 0.07 },
  { id: 'belly',        label: 'Корем',          cx: 0.50, cy: 0.55, rx: 0.12, ry: 0.07 },
  { id: 'love-handles', label: 'Любовни дръжки', cx: 0.32, cy: 0.55, rx: 0.05, ry: 0.06, cx2: 0.68 },
  { id: 'arms',         label: 'Ръце',           cx: 0.20, cy: 0.46, rx: 0.06, ry: 0.12, cx2: 0.80 },
  // 'back' marker: small dot at upper back / nape with subtle ring (front view can't show full back)
  { id: 'back',         label: 'Гръб',           cx: 0.50, cy: 0.30, rx: 0.06, ry: 0.04 },
  { id: 'whole-body',   label: 'Цялото тяло',    cx: 0.50, cy: 0.55, rx: 0.40, ry: 0.42 },
];

const FEMALE_REGIONS: BodyRegion[] = [
  { id: 'belly',       label: 'Корем',       cx: 0.50, cy: 0.55, rx: 0.12, ry: 0.07 },
  { id: 'waist',       label: 'Талия',       cx: 0.30, cy: 0.55, rx: 0.05, ry: 0.06, cx2: 0.70 },
  { id: 'hips',        label: 'Ханш',        cx: 0.50, cy: 0.70, rx: 0.20, ry: 0.06 },
  { id: 'thighs',      label: 'Бедра',       cx: 0.36, cy: 0.84, rx: 0.07, ry: 0.08, cx2: 0.64 },
  { id: 'arms',        label: 'Ръце',        cx: 0.20, cy: 0.46, rx: 0.06, ry: 0.12, cx2: 0.80 },
  { id: 'whole-body',  label: 'Цялото тяло', cx: 0.50, cy: 0.55, rx: 0.40, ry: 0.42 },
];

interface Props {
  gender: Gender;
  /** Path to the matched character's 'goal' pose cutout. Optional — falls back to a neutral block. */
  characterImageSrc?: string;
  selected: string[];
  minSelect: number;
  maxSelect?: number;
  onToggle: (value: string) => void;
  onContinue: () => void;
}

export function BodyDiagram({
  gender,
  characterImageSrc,
  selected,
  minSelect,
  maxSelect,
  onToggle,
  onContinue,
}: Props) {
  const regions = gender === 'female' ? FEMALE_REGIONS : MALE_REGIONS;
  const canContinue = selected.length >= minSelect;
  const atCap = typeof maxSelect === 'number' && selected.length >= maxSelect;

  return (
    <div className="flex flex-col gap-5">
      {/* Anatomical photo with overlays */}
      <div className="relative mx-auto w-full max-w-[260px] aspect-[3/4]">
        {characterImageSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={characterImageSrc}
            alt=""
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
          />
        ) : (
          <div className="absolute inset-0 rounded-2xl bg-[var(--color-surface-100)] grid place-items-center">
            <span className="text-[var(--color-text-muted)] text-sm">Тяло</span>
          </div>
        )}

        {/* Selected region overlays */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <radialGradient id="regionGlow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="rgba(255,59,71,0.85)" />
              <stop offset="60%" stopColor="rgba(229,9,20,0.55)" />
              <stop offset="100%" stopColor="rgba(229,9,20,0)" />
            </radialGradient>
          </defs>
          <AnimatePresence>
            {regions.map((r) => {
              if (!selected.includes(r.id)) return null;
              return (
                <motion.g
                  key={r.id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  style={{ transformOrigin: `${r.cx * 100}px ${r.cy * 100}px` }}
                >
                  <ellipse
                    cx={r.cx * 100}
                    cy={r.cy * 100}
                    rx={r.rx * 100}
                    ry={r.ry * 100}
                    fill="url(#regionGlow)"
                  />
                  {r.cx2 != null && (
                    <ellipse
                      cx={r.cx2 * 100}
                      cy={r.cy * 100}
                      rx={r.rx * 100}
                      ry={r.ry * 100}
                      fill="url(#regionGlow)"
                    />
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>
        </svg>

        {/* Hit areas (tappable) */}
        <div className="absolute inset-0">
          {regions.map((r) => {
            const disabled = atCap && !selected.includes(r.id);
            return (
              <button
                key={`${r.id}-hit`}
                type="button"
                onClick={() => !disabled && onToggle(r.id)}
                disabled={disabled}
                aria-label={r.label}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${r.cx * 100}%`,
                  top: `${r.cy * 100}%`,
                  width: `${Math.max(r.rx, 0.08) * 200}%`,
                  height: `${Math.max(r.ry, 0.08) * 200}%`,
                  background: 'transparent',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Chip list */}
      <div className="grid grid-cols-2 gap-2.5">
        {regions.map((r) => {
          const isOn = selected.includes(r.id);
          const disabled = atCap && !isOn;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => !disabled && onToggle(r.id)}
              disabled={disabled}
              aria-pressed={isOn}
              className={[
                'rounded-xl border-2 px-3 py-2.5 text-sm font-semibold text-left',
                'flex items-center justify-between gap-2 min-h-[48px]',
                'motion-safe:transition-[transform,border-color,background-color] motion-safe:duration-200',
                'motion-safe:active:scale-[0.97]',
                isOn
                  ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red-tint)] text-[var(--color-brand-red)]'
                  : 'border-[var(--color-line)] bg-[var(--color-paper-warm)] text-[var(--color-text-strong)] hover:border-[var(--color-text-muted)]',
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}
            >
              <span className="leading-tight">{r.label}</span>
              <span
                aria-hidden
                className={[
                  'shrink-0 size-5 rounded-md border-2 grid place-items-center',
                  isOn ? 'border-[var(--color-brand-red)] bg-[var(--color-brand-red)]' : 'border-[var(--color-line)] bg-transparent',
                ].join(' ')}
              >
                {isOn && <span className="block size-2 rounded-sm bg-white" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 sticky bottom-0 bg-[var(--color-brand-bg)] pt-3 pb-2">
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className={[
            'w-full h-14 rounded-full font-bold text-white flex items-center justify-center gap-2 transition-all',
            canContinue
              ? 'bg-brand-gradient shadow-brand-red active:scale-[0.99]'
              : 'bg-[var(--color-surface-200)] text-[var(--color-text-muted)] cursor-not-allowed',
          ].join(' ')}
        >
          <span>Продължи</span>
          <ArrowRightIcon width={18} height={18} />
        </button>
        {!canContinue && (
          <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">
            Избери поне {minSelect}
          </p>
        )}
      </div>
    </div>
  );
}
