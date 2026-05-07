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
const SVG_H = 180;
const PAD_L = 40;
const PAD_R = 20;
const PAD_T = 18;
const PAD_B = 28;
const INNER_W = SVG_W - PAD_L - PAD_R;
const INNER_H = SVG_H - PAD_T - PAD_B;

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

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-warm)] p-4">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="h-auto w-full"
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
    </div>
  );
}
