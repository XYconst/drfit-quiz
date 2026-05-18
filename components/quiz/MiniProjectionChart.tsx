'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  buildCurvePath,
  denseProjection,
  milestoneProjection,
  TOTAL_DAYS,
} from '@/lib/projection';

interface Props {
  currentKg: number;
  targetKg: number;
  /** Free-form label for the end of the timeline, e.g. "15 август" or "3 месеца". */
  endDateLabel?: string;
}

const SVG_W = 320;
const SVG_H = 220;
const PAD_L = 40;
const PAD_R = 20;
const PAD_T = 18;
// Bigger bottom padding because we render a phase ribbon below the axis.
const PAD_B = 64;
const INNER_W = SVG_W - PAD_L - PAD_R;
const INNER_H = SVG_H - PAD_T - PAD_B;

/** Phases of a sane fat-loss program, mapped as fractions of the timeline. */
const PHASES = [
  { id: 'kickstart', label: 'Старт', from: 0, to: 0.2, color: '#E50914' },
  { id: 'steady', label: 'Устойчиво', from: 0.2, to: 0.78, color: '#A50015' },
  { id: 'stabilize', label: 'Стабилизация', from: 0.78, to: 1, color: '#2B3138' },
] as const;

export function MiniProjectionChart({ currentKg, targetKg, endDateLabel }: Props) {
  const dense = useMemo(() => denseProjection(currentKg, targetKg), [currentKg, targetKg]);
  const milestones = useMemo(() => milestoneProjection(currentKg, targetKg), [currentKg, targetKg]);

  const allKgs = [...dense.map((p) => p.kg), currentKg, targetKg];
  const minWeight = Math.min(...allKgs);
  const maxWeight = Math.max(...allKgs);
  const yPad = (maxWeight - minWeight) * 0.18 || 2;
  const yMin = minWeight - yPad;
  const yMax = maxWeight + yPad;

  const xForDay = (d: number) => PAD_L + (d / TOTAL_DAYS) * INNER_W;
  const yForKg = (kg: number) => PAD_T + ((yMax - kg) / (yMax - yMin)) * INNER_H;

  const svgDense = dense.map((p) => ({ x: xForDay(p.day), y: yForKg(p.kg) }));
  const svgMilestones = milestones.map((p) => ({ x: xForDay(p.day), y: yForKg(p.kg) }));
  const path = buildCurvePath(svgDense);
  const fillPath =
    path &&
    `${path} L ${svgDense[svgDense.length - 1].x} ${PAD_T + INNER_H} L ${svgDense[0].x} ${PAD_T + INNER_H} Z`;

  const endX = xForDay(TOTAL_DAYS);
  const endY = yForKg(targetKg);

  const totalKg = Math.abs(currentKg - targetKg);
  const totalWeeks = TOTAL_DAYS / 7;
  const perWeek = totalKg / totalWeeks;
  const losing = currentKg > targetKg;

  return (
    <div
      className="relative rounded-[22px] overflow-hidden p-5"
      style={{
        fontFamily: 'var(--font-sans)',
        background:
          'linear-gradient(160deg, #FFF1ED 0%, #FFFFFF 50%, #FFF6F1 100%)',
        boxShadow:
          '0 1px 0 rgba(165,0,21,0.10) inset, 0 14px 32px -22px rgba(165,0,21,0.35)',
      }}
    >
      {/* Hairline gradient border — same treatment as the realism verdict */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[22px]"
        style={{
          padding: 1,
          background:
            'linear-gradient(135deg, rgba(229,9,20,0.45), rgba(165,0,21,0.08))',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <div className="relative">
        {/* Pace hero — eyebrow with dot + big gradient number + кг на седмица */}
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="relative inline-flex size-2 rounded-full"
            style={{
              background: '#E50914',
              boxShadow: '0 0 0 4px rgba(229,9,20,0.18)',
            }}
          />
          <p
            className="text-[10px] font-extrabold uppercase"
            style={{ letterSpacing: '0.22em', color: '#A50015' }}
          >
            {losing ? 'Темпо на сваляне' : 'Темпо на качване'}
          </p>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span
            className="font-extrabold tabular-nums leading-none"
            style={{
              fontSize: 'clamp(2.625rem, 12vw, 3.5rem)',
              letterSpacing: '-0.045em',
              background: 'linear-gradient(180deg, #E50914 0%, #A50015 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {perWeek.toFixed(2).replace('.', ',')}
          </span>
          <span
            className="font-bold text-[var(--color-text-strong)] leading-tight"
            style={{ fontSize: 'clamp(0.8125rem, 3.4vw, 0.9375rem)', letterSpacing: '-0.01em' }}
          >
            кг<br />на седмица
          </span>
        </div>

        <p className="mt-2 text-[12.5px] text-[var(--color-text-body)] leading-snug">
          {losing
            ? 'В здравословния диапазон — устойчиво темпо без шок и без отскок.'
            : 'Контролиран профицит — растеж на чиста мускулна маса, без излишни мазнини.'}
        </p>
      </div>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="relative h-auto w-full mt-4"
        role="img"
        aria-label={`Прогноза: от ${currentKg.toFixed(0)} кг до ${targetKg.toFixed(0)} кг`}
      >
        <defs>
          <linearGradient id="miniCurveFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#E50914" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis weight labels (current + target) */}
        <text
          x={PAD_L - 8}
          y={yForKg(currentKg) + 4}
          textAnchor="end"
          fontSize="11"
          fill="var(--color-text-muted)"
          style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
        >
          {currentKg.toFixed(0)} кг
        </text>
        <text
          x={PAD_L - 8}
          y={yForKg(targetKg) + 4}
          textAnchor="end"
          fontSize="11"
          fill="var(--color-brand-red)"
          fontWeight="700"
          style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
        >
          {targetKg.toFixed(0)} кг
        </text>

        {/* X-axis labels: today + end-date */}
        <text
          x={xForDay(0)}
          y={PAD_T + INNER_H + 18}
          textAnchor="start"
          fontSize="11"
          fill="var(--color-text-muted)"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Днес
        </text>
        {endDateLabel && (
          <text
            x={endX}
            y={PAD_T + INNER_H + 18}
            textAnchor="end"
            fontSize="11"
            fill="var(--color-text-strong)"
            fontWeight="700"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {endDateLabel}
          </text>
        )}

        {/* Filled area under curve */}
        {fillPath && (
          <motion.path
            d={fillPath}
            fill="url(#miniCurveFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          />
        )}

        {/* Curve */}
        <motion.path
          d={path}
          fill="none"
          stroke="#A50015"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.0, delay: 0.18, ease: 'easeInOut' }}
        />

        {/* Milestone dots */}
        {svgMilestones.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill="#A50015"
            stroke="var(--color-paper-warm)"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.32, delay: 0.4 + i * 0.14, ease: 'backOut' }}
            style={{ transformOrigin: `${p.x}px ${p.y}px` }}
          />
        ))}

        {/* Phase bands behind the curve — subtle vertical tint for each phase */}
        {PHASES.map((ph, i) => {
          const x1 = xForDay(ph.from * TOTAL_DAYS);
          const x2 = xForDay(ph.to * TOTAL_DAYS);
          return (
            <rect
              key={`band-${ph.id}`}
              x={x1}
              y={PAD_T}
              width={Math.max(0, x2 - x1)}
              height={INNER_H}
              fill={ph.color}
              opacity={0.05 + i * 0.02}
            />
          );
        })}

        {/* Phase ribbon under the chart with the phase name + week range */}
        {PHASES.map((ph) => {
          const x1 = xForDay(ph.from * TOTAL_DAYS);
          const x2 = xForDay(ph.to * TOTAL_DAYS);
          const cx = (x1 + x2) / 2;
          const ribbonY = PAD_T + INNER_H + 24;
          const weekFrom = Math.round(ph.from * totalWeeks) || 1;
          const weekTo = Math.round(ph.to * totalWeeks);
          return (
            <g key={`ribbon-${ph.id}`}>
              <rect
                x={x1 + 1}
                y={ribbonY}
                width={Math.max(0, x2 - x1 - 2)}
                height={10}
                rx={3}
                fill={ph.color}
                opacity={0.85}
              />
              <text
                x={cx}
                y={ribbonY + 24}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="800"
                fill={ph.color}
                style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.06em' }}
              >
                {ph.label.toUpperCase()}
              </text>
              <text
                x={cx}
                y={ribbonY + 35}
                textAnchor="middle"
                fontSize="8.5"
                fill="var(--color-text-muted)"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {weekFrom === weekTo ? `седм. ${weekTo}` : `седм. ${weekFrom}-${weekTo}`}
              </text>
            </g>
          );
        })}

        {/* End-node pulse ring (signature touch — same beat as full BmiProjection) */}
        <motion.circle
          cx={endX}
          cy={endY}
          r="6"
          fill="none"
          stroke="#E50914"
          strokeWidth="1.5"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 2.2, 1], opacity: [0.55, 0, 0] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            repeatDelay: 0.6,
            delay: 1.4,
            ease: 'easeOut',
          }}
          style={{ transformOrigin: `${endX}px ${endY}px` }}
        />
      </svg>

      {/* Phase explainer — "how exactly are we going to do it" */}
      <div className="relative mt-3 grid grid-cols-1 gap-2 text-[12px] leading-snug">
        <PhaseLine
          color={PHASES[0].color}
          label="Старт"
          body={
            losing
              ? 'Първите 2 седмици: бърз спад (вода + калориен дефицит), за да усетиш напредък.'
              : 'Първите 2 седмици: лек профицит и техника на тренировка, за да задвижим мускула.'
          }
        />
        <PhaseLine
          color={PHASES[1].color}
          label="Устойчиво"
          body={
            losing
              ? 'Седмици 3-10: стабилен дефицит, AfterBurn тренировки, рефийд дни срещу плато.'
              : 'Седмици 3-10: контролиран профицит, обемна работа, прогресивно натоварване.'
          }
        />
        <PhaseLine
          color={PHASES[2].color}
          label="Стабилизация"
          body="Последните 2-3 седмици: фиксираме навиците, отварят се калориите към поддръжка, теглото се задържа."
        />
      </div>
    </div>
  );
}

function PhaseLine({ color, label, body }: { color: string; label: string; body: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        aria-hidden
        className="mt-1 shrink-0 size-1.5 rounded-full"
        style={{ background: color }}
      />
      <p className="text-[var(--color-text-body)]">
        <span className="font-extrabold text-[var(--color-text-strong)]" style={{ color }}>
          {label}.
        </span>{' '}
        {body}
      </p>
    </div>
  );
}
