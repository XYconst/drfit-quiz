'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon } from '@/components/icons';
import type { Gender } from '@/lib/avatars';

/**
 * BetterMe-style anatomical multi-select for problem areas. Front-view silhouette
 * with named regions. Tap to toggle from the chip list, OR tap directly on the
 * body region. Selected regions glow brand-red.
 */

export interface BodyRegion {
  id: string;
  label: string;
  d: string;
  d2?: string;
}

// Each body is built as a list of independent SVG elements (head + neck + torso + 2 arms + 2 legs).
// Simpler than one big compound path and avoids fill-rule oddities.
interface SilhouetteShape { tag: 'circle' | 'path'; props: Record<string, string | number> }

const SILHOUETTE_M: SilhouetteShape[] = [
  // Head
  { tag: 'circle', props: { cx: 100, cy: 36, r: 16 } },
  // Neck
  { tag: 'path', props: { d: 'M93 50 L93 60 Q100 62 107 60 L107 50 Z' } },
  // Torso (broad shoulders, V-taper)
  { tag: 'path', props: { d: 'M70 64 Q100 58 130 64 L138 96 L142 128 L132 178 Q100 184 68 178 L58 128 L62 96 Z' } },
  // Left arm
  { tag: 'path', props: { d: 'M58 92 Q52 96 50 110 L46 178 Q42 188 36 184 L32 178 L40 108 Q44 92 58 92 Z' } },
  // Right arm
  { tag: 'path', props: { d: 'M142 92 Q148 96 150 110 L154 178 Q158 188 164 184 L168 178 L160 108 Q156 92 142 92 Z' } },
  // Left leg
  { tag: 'path', props: { d: 'M76 178 L72 240 L72 272 L88 272 L94 240 L94 178 Z' } },
  // Right leg
  { tag: 'path', props: { d: 'M124 178 L128 240 L128 272 L112 272 L106 240 L106 178 Z' } },
];

const SILHOUETTE_F: SilhouetteShape[] = [
  // Head
  { tag: 'circle', props: { cx: 100, cy: 36, r: 14 } },
  // Neck
  { tag: 'path', props: { d: 'M94 48 L94 58 Q100 60 106 58 L106 48 Z' } },
  // Torso (narrow waist, defined hips)
  { tag: 'path', props: { d: 'M74 62 Q100 56 126 62 L132 92 Q126 110 122 130 Q126 142 132 156 L138 196 Q100 202 62 196 L68 156 Q74 142 78 130 Q74 110 68 92 Z' } },
  // Left arm
  { tag: 'path', props: { d: 'M62 90 Q56 94 54 108 L48 170 Q44 178 38 174 L36 168 L42 106 Q46 90 62 90 Z' } },
  // Right arm
  { tag: 'path', props: { d: 'M138 90 Q144 94 146 108 L152 170 Q156 178 162 174 L164 168 L158 106 Q154 90 138 90 Z' } },
  // Left leg
  { tag: 'path', props: { d: 'M76 196 Q78 220 76 244 L74 272 L92 272 L96 244 L98 196 Z' } },
  // Right leg
  { tag: 'path', props: { d: 'M124 196 Q122 220 124 244 L126 272 L108 272 L104 244 L102 196 Z' } },
];

// All region paths use the same coordinate space as the silhouette (200x300 viewbox).
// Coordinates are anchored on the front-view torso.

const MALE_REGIONS: BodyRegion[] = [
  {
    id: 'chest',
    label: 'Гърди',
    d: 'M70 88 Q100 80 130 88 Q132 110 116 116 Q100 119 84 116 Q68 110 70 88 Z',
  },
  {
    id: 'belly',
    label: 'Корем',
    d: 'M82 122 Q100 118 118 122 Q120 158 100 165 Q80 158 82 122 Z',
  },
  {
    id: 'love-handles',
    label: 'Любовни дръжки',
    d: 'M58 130 Q66 144 74 158 Q66 162 58 154 Q54 144 58 130 Z',
    d2: 'M142 130 Q134 144 126 158 Q134 162 142 154 Q146 144 142 130 Z',
  },
  {
    id: 'back',
    label: 'Гръб',
    d: 'M70 70 Q100 62 130 70 Q132 84 100 84 Q68 84 70 70 Z',
  },
  {
    id: 'arms',
    label: 'Ръце',
    d: 'M44 100 Q50 96 56 100 L48 175 Q42 178 38 172 Z',
    d2: 'M156 100 Q150 96 144 100 L152 175 Q158 178 162 172 Z',
  },
  {
    id: 'whole-body',
    label: 'Цялото тяло',
    d: 'M58 64 Q100 56 142 64 L162 170 L138 270 L62 270 L38 170 Z',
  },
];

const FEMALE_REGIONS: BodyRegion[] = [
  {
    id: 'belly',
    label: 'Корем',
    d: 'M84 132 Q100 128 116 132 Q118 158 100 164 Q82 158 84 132 Z',
  },
  {
    id: 'waist',
    label: 'Талия',
    d: 'M62 134 Q70 144 74 154 Q66 158 60 150 Q56 142 62 134 Z',
    d2: 'M138 134 Q130 144 126 154 Q134 158 140 150 Q144 142 138 134 Z',
  },
  {
    id: 'hips',
    label: 'Ханш',
    d: 'M58 165 Q100 158 142 165 L146 200 Q100 196 54 200 Z',
  },
  {
    id: 'thighs',
    label: 'Бедра',
    d: 'M72 198 Q88 205 92 252 L78 256 Q66 230 72 198 Z',
    d2: 'M128 198 Q112 205 108 252 L122 256 Q134 230 128 198 Z',
  },
  {
    id: 'arms',
    label: 'Ръце',
    d: 'M48 100 Q54 96 60 100 L52 168 Q46 172 42 166 Z',
    d2: 'M152 100 Q146 96 140 100 L148 168 Q154 172 158 166 Z',
  },
  {
    id: 'whole-body',
    label: 'Цялото тяло',
    d: 'M54 64 Q100 56 146 64 L160 160 Q150 200 142 252 L130 270 L70 270 L58 252 Q50 200 40 160 Z',
  },
];

interface Props {
  gender: Gender;
  selected: string[];
  minSelect: number;
  maxSelect?: number;
  onToggle: (value: string) => void;
  onContinue: () => void;
}

export function BodyDiagram({ gender, selected, minSelect, maxSelect, onToggle, onContinue }: Props) {
  const regions = gender === 'female' ? FEMALE_REGIONS : MALE_REGIONS;
  const silhouette = gender === 'female' ? SILHOUETTE_F : SILHOUETTE_M;
  const canContinue = selected.length >= minSelect;
  const atCap = typeof maxSelect === 'number' && selected.length >= maxSelect;

  return (
    <div className="flex flex-col gap-5">
      {/* Body diagram on top — takes up its own breathing room */}
      <div className="flex justify-center">
        <svg
          viewBox="0 0 200 300"
          className="w-[180px] sm:w-[220px] h-auto"
          role="img"
          aria-label="Анатомична карта"
        >
          <defs>
            <linearGradient id="bodyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(31,41,55,0.06)" />
              <stop offset="100%" stopColor="rgba(31,41,55,0.13)" />
            </linearGradient>
            <radialGradient id="regionGlow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="rgba(229,9,20,0.55)" />
              <stop offset="100%" stopColor="rgba(229,9,20,0.30)" />
            </radialGradient>
          </defs>

          <g
            fill="url(#bodyFill)"
            stroke="rgba(31,41,55,0.45)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          >
            {silhouette.map((s, i) =>
              s.tag === 'circle' ? (
                // eslint-disable-next-line react/jsx-no-undef
                <circle key={i} cx={s.props.cx as number} cy={s.props.cy as number} r={s.props.r as number} />
              ) : (
                <path key={i} d={s.props.d as string} />
              ),
            )}
          </g>

          <AnimatePresence>
            {regions.map((r) => {
              const isOn = selected.includes(r.id);
              if (!isOn) return null;
              return (
                <motion.g
                  key={r.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  style={{ transformOrigin: 'center' }}
                >
                  <path d={r.d} fill="url(#regionGlow)" stroke="rgba(229,9,20,0.95)" strokeWidth="1.4" strokeLinejoin="round" />
                  {r.d2 && (
                    <path d={r.d2} fill="url(#regionGlow)" stroke="rgba(229,9,20,0.95)" strokeWidth="1.4" strokeLinejoin="round" />
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>

          {/* Tappable hit-areas (rendered last, transparent fill) */}
          {regions.map((r) => {
            const isOn = selected.includes(r.id);
            const disabled = atCap && !isOn;
            return (
              <g
                key={`${r.id}-hit`}
                onClick={() => !disabled && onToggle(r.id)}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
              >
                <path d={r.d} fill="transparent" />
                {r.d2 && <path d={r.d2} fill="transparent" />}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Chip list — wrap to a 2-column grid on narrow widths so no item gets too wide */}
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
