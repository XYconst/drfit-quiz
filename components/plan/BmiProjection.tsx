'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { AvatarId } from '@/lib/avatars';

interface Props {
  heightCm: number;
  currentKg: number;
  targetKg: number;
  targetDate?: string; // ISO date or quick-chip label like "3 месеца"
  avatar: AvatarId;
}

type BmiCategory = 'under' | 'normal' | 'over' | 'obese';

const SCALE_MIN = 15;
const SCALE_MAX = 40;
const TICKS = [18.5, 25, 30, 40] as const;

const SEGMENT_FILLS: Record<BmiCategory, string> = {
  under: '#E5E5E5',
  normal: '#34D399',
  over: '#FED7AA',
  obese: '#A50015',
};

const CATEGORY_LABELS_BG: Record<BmiCategory, string> = {
  under: 'Недотегло',
  normal: 'Нормално',
  over: 'Наднормено',
  obese: 'Затлъстяване',
};

// Avatar-aware copy per category. Avatar 05 (gain mass) gets a different "under" line.
function categoryCopyBg(cat: BmiCategory, avatar: AvatarId): string {
  if (cat === 'under' && avatar === '05') return 'Под нормата. Целта е чиста анаболна маса, не дефицит.';
  if (cat === 'under') return 'Под нормата. Целта е чиста маса, не дефицит.';
  if (cat === 'normal') return 'В нормата. Стегни се без екстремен дефицит.';
  if (cat === 'over') return 'Над нормата. Започваме с инсулин и AfterBurn.';
  return 'Сериозно над нормата. 4-те хормона са изхода.';
}

function classify(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'under';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'over';
  return 'obese';
}

function bmiToPercent(bmi: number): number {
  const clamped = Math.max(SCALE_MIN, Math.min(SCALE_MAX, bmi));
  return ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
}

// Polyline through dense ease-curve samples reads as a smooth curve at 19 points.
function buildCurvePath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  return points.reduce(
    (acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`),
    '',
  );
}

// easeOutQuad: faster at the start (typical fat-loss curve), slower toward the goal.
function easeOutQuad(t: number): number {
  return t * (2 - t);
}

export function BmiProjection({ heightCm, currentKg, targetKg, targetDate, avatar }: Props) {
  const bmi = useMemo(() => {
    if (!heightCm || !currentKg) return 0;
    const m = heightCm / 100;
    return currentKg / (m * m);
  }, [heightCm, currentKg]);

  const cat = classify(bmi);
  const markerLeft = bmiToPercent(bmi);

  // Dense sample for the curve path (19 pts, every 5 days), eased.
  const densePoints = useMemo(() => {
    const out: { day: number; kg: number }[] = [];
    for (let d = 0; d <= 90; d += 5) {
      const t = d / 90;
      out.push({ day: d, kg: currentKg + (targetKg - currentKg) * easeOutQuad(t) });
    }
    return out;
  }, [currentKg, targetKg]);

  // 4 milestone dots at days 0/30/60/90, on the same eased curve so they sit on the line.
  const milestonePoints = useMemo(() => {
    const days = [0, 30, 60, 90];
    return days.map((d) => ({
      day: d,
      kg: currentKg + (targetKg - currentKg) * easeOutQuad(d / 90),
    }));
  }, [currentKg, targetKg]);

  // SVG layout
  const svgW = 600;
  const svgH = 280;
  const padL = 40;
  const padR = 24;
  const padT = 24;
  const padB = 36;
  const innerW = svgW - padL - padR;
  const innerH = svgH - padT - padB;

  const allKgs = [...densePoints.map((p) => p.kg), currentKg, targetKg];
  const minWeight = Math.min(...allKgs);
  const maxWeight = Math.max(...allKgs);
  const yPad = (maxWeight - minWeight) * 0.12 || 2;
  const yMin = minWeight - yPad;
  const yMax = maxWeight + yPad;

  const xForDay = (d: number) => padL + (d / 90) * innerW;
  const yForKg = (kg: number) => padT + ((yMax - kg) / (yMax - yMin)) * innerH;

  const svgDensePoints = densePoints.map((p) => ({ x: xForDay(p.day), y: yForKg(p.kg) }));
  const svgMilestonePoints = milestonePoints.map((p) => ({ x: xForDay(p.day), y: yForKg(p.kg) }));
  const path = buildCurvePath(svgDensePoints);

  // Gradient fill below curve — close the path to bottom.
  const fillPath =
    path && `${path} L ${svgDensePoints[svgDensePoints.length - 1].x} ${padT + innerH} L ${svgDensePoints[0].x} ${padT + innerH} Z`;

  // Optional event marker on the timeline if targetDate is a known quick-chip ("3 месеца") or an ISO date.
  const eventDayOffset = useMemo(() => {
    if (!targetDate) return null;
    // Quick chip values from quiz step 22 are stored as labels — best effort parse.
    const map: Record<string, number> = {
      '1 месец': 30,
      '3 месеца': 90,
      '6 месеца': 90, // cap at 90 so the pin stays inside the chart
      '1 година': 90,
    };
    if (map[targetDate] != null) return map[targetDate];
    const d = new Date(targetDate);
    if (!Number.isNaN(d.getTime())) {
      const diffDays = Math.round((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return Math.max(0, Math.min(90, diffDays));
    }
    return null;
  }, [targetDate]);

  const isAscending = targetKg > currentKg; // Avatar 05 path
  const direction = isAscending ? 'качи' : 'свали';
  const deltaKg = Math.abs(targetKg - currentKg).toFixed(0);

  return (
    <div className="rounded-2xl bg-[var(--color-brand-red-tint)] p-5 sm:p-7">
      {/* === BMI scale === */}
      <div>
        <div className="flex items-baseline justify-between">
          <p className="eyebrow">Твоят BMI</p>
          <p
            className="text-3xl font-semibold leading-none text-[var(--color-text-headline)]"
            style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
          >
            {bmi ? bmi.toFixed(1) : '—'}
          </p>
        </div>

        {/* Category chips above the bar */}
        <div className="mt-4 grid grid-cols-4 gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          <span>{CATEGORY_LABELS_BG.under}</span>
          <span>{CATEGORY_LABELS_BG.normal}</span>
          <span>{CATEGORY_LABELS_BG.over}</span>
          <span>{CATEGORY_LABELS_BG.obese}</span>
        </div>

        {/* The bar itself */}
        <div className="relative mt-2 h-3 w-full overflow-hidden rounded-full">
          <div className="absolute inset-y-0 left-0" style={{ width: '14%', background: SEGMENT_FILLS.under }} />
          <div
            className="absolute inset-y-0"
            style={{ left: '14%', width: '26%', background: SEGMENT_FILLS.normal }}
          />
          <div
            className="absolute inset-y-0"
            style={{ left: '40%', width: '20%', background: SEGMENT_FILLS.over }}
          />
          <div
            className="absolute inset-y-0"
            style={{ left: '60%', width: '40%', background: SEGMENT_FILLS.obese }}
          />
        </div>

        {/* Tick numerals */}
        <div className="relative mt-1 h-4 text-[11px] text-[var(--color-text-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
          {TICKS.map((t) => (
            <span
              key={t}
              className="absolute -translate-x-1/2"
              style={{ left: `${bmiToPercent(t)}%` }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Marker — animated triangle + label */}
        <motion.div
          initial={{ left: '0%', opacity: 0 }}
          animate={{ left: `${markerLeft}%`, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.15 }}
          className="relative mt-3 h-5"
          style={{ width: '100%' }}
        >
          <span
            className="absolute -translate-x-1/2 rounded-md bg-[var(--color-brand-red)] px-1.5 py-0.5 text-[11px] font-semibold leading-tight text-white"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Ти {bmi.toFixed(1)}
          </span>
        </motion.div>

        <p className="mt-3 text-sm font-medium text-[var(--color-text-strong)]">
          {categoryCopyBg(cat, avatar)}
        </p>
      </div>

      {/* === Projected curve === */}
      <div className="mt-6 rounded-xl bg-[var(--color-graphite)] p-3 sm:p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
            90 дни · прогноза
          </p>
          <p
            className="text-sm font-semibold text-white"
            style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
          >
            {direction} {deltaKg} кг
          </p>
        </div>

        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="mt-2 h-auto w-full"
          role="img"
          aria-label={`Прогноза за 90 дни: ${direction} ${deltaKg} кг`}
        >
          {/* Dotted grid */}
          <defs>
            <pattern id="bmiGrid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.08)" />
            </pattern>
            <linearGradient id="curveFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#E50914" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x={padL} y={padT} width={innerW} height={innerH} fill="url(#bmiGrid)" />

          {/* Y-axis weight ticks (current + target) */}
          <text
            x={padL - 8}
            y={yForKg(currentKg) + 4}
            textAnchor="end"
            fontSize="11"
            fill="rgba(255,255,255,0.5)"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {currentKg.toFixed(0)}
          </text>
          <text
            x={padL - 8}
            y={yForKg(targetKg) + 4}
            textAnchor="end"
            fontSize="11"
            fill="rgba(255,255,255,0.5)"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {targetKg.toFixed(0)}
          </text>

          {/* X-axis day ticks */}
          {[0, 30, 60, 90].map((d) => (
            <text
              key={d}
              x={xForDay(d)}
              y={padT + innerH + 22}
              textAnchor="middle"
              fontSize="11"
              fill="rgba(255,255,255,0.5)"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Ден {d}
            </text>
          ))}

          {/* Event pin */}
          {eventDayOffset != null && eventDayOffset > 0 && eventDayOffset < 90 && (
            <g>
              <line
                x1={xForDay(eventDayOffset)}
                x2={xForDay(eventDayOffset)}
                y1={padT}
                y2={padT + innerH}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
            </g>
          )}

          {/* Filled area under curve */}
          {fillPath && (
            <motion.path
              d={fillPath}
              fill="url(#curveFill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            />
          )}

          {/* Curve line — draw-on animation */}
          <motion.path
            d={path}
            fill="none"
            stroke="#E50914"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
          />

          {/* Milestone dots — only at days 0/30/60/90 */}
          {svgMilestonePoints.map((p, i) => {
            const isEnd = i === svgMilestonePoints.length - 1;
            return (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={isEnd ? 6 : 4}
                fill="#E50914"
                stroke="white"
                strokeWidth={isEnd ? 2 : 1.5}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.18 }}
              />
            );
          })}

          {/* End-node pulse */}
          <motion.circle
            cx={svgMilestonePoints[svgMilestonePoints.length - 1].x}
            cy={svgMilestonePoints[svgMilestonePoints.length - 1].y}
            r={6}
            fill="none"
            stroke="#E50914"
            strokeWidth="2"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ delay: 1.6, duration: 1.6, repeat: Infinity, repeatDelay: 0.6 }}
          />
        </svg>

        <p className="mt-3 text-[11px] leading-snug text-white/55">
          Илюстративна проекция, базирана на данни от 10 000+ потребителя. Преди да започнеш програмата, говори с лекаря си.
        </p>
      </div>
    </div>
  );
}
