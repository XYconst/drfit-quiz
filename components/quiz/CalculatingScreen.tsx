'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  headline: string;
  milestones: string[];
  durationMs: number;
  onDone: () => void;
}

const HORMONES = [
  { id: 'insulin', label: 'Инсулин', en: 'Insulin', angle: -90 },
  { id: 'leptin', label: 'Лептин', en: 'Leptin', angle: 0 },
  { id: 'ghrelin', label: 'Грелин', en: 'Ghrelin', angle: 90 },
  { id: 'cortisol', label: 'Кортизол', en: 'Cortisol', angle: 180 },
] as const;

const FINAL_PROFILES = 10847;

export function CalculatingScreen({ headline, milestones, durationMs, onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [milestoneIdx, setMilestoneIdx] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      setProgress(p);
      // 4 hormones aligned to milestones; advance idx each quarter.
      const idx = Math.min(milestones.length - 1, Math.floor(p * milestones.length));
      setMilestoneIdx(idx);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 600);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, milestones.length, onDone]);

  const profilesCount = Math.round(FINAL_PROFILES * progress);
  // SVG viewBox 320x320, centered. Diagram radius 110.
  const cx = 160;
  const cy = 160;
  const ringR = 110;

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--color-graphite)] text-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-brand-red)] mb-3">
          Анализ · стъпка 25 / 26
        </p>
        <h2
          className="text-2xl sm:text-3xl mb-8 max-w-[18ch] leading-tight"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
        >
          {headline}
        </h2>

        <svg viewBox="0 0 320 320" className="w-72 sm:w-80 h-auto" role="img" aria-label="4-те хормона">
          <defs>
            <radialGradient id="silhGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(229,9,20,0.20)" />
              <stop offset="100%" stopColor="rgba(229,9,20,0)" />
            </radialGradient>
          </defs>

          {/* central halo */}
          <circle cx={cx} cy={cy} r={64} fill="url(#silhGrad)" />

          {/* body silhouette — placeholder neutral form */}
          <g
            transform={`translate(${cx - 22} ${cy - 56})`}
            fill="rgba(255,255,255,0.78)"
            stroke="none"
          >
            <circle cx="22" cy="14" r="11" />
            <path d="M5 30 Q22 22 39 30 L42 70 Q22 76 2 70 Z" />
            <path d="M14 70 L10 110 L18 110 L22 80 L26 110 L34 110 L30 70 Z" />
          </g>

          {/* hormone nodes */}
          {HORMONES.map((h, i) => {
            const rad = (h.angle * Math.PI) / 180;
            const x = cx + Math.cos(rad) * ringR;
            const y = cy + Math.sin(rad) * ringR;
            const active = i <= milestoneIdx && progress > 0;
            const wasJustActivated = i === milestoneIdx && progress > 0;
            return (
              <g key={h.id}>
                {/* connecting line */}
                <motion.line
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke="#E50914"
                  strokeWidth="1.2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: active ? 1 : 0,
                    opacity: active ? 0.6 : 0,
                  }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                />
                {/* node */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={22}
                  fill={active ? '#E50914' : 'transparent'}
                  stroke={active ? '#E50914' : 'rgba(255,255,255,0.32)'}
                  strokeWidth="1.5"
                  initial={false}
                  animate={{
                    scale: active ? [0.9, 1.1, 1] : 1,
                    fill: active ? '#E50914' : 'rgba(0,0,0,0)',
                  }}
                  transition={{ duration: 0.45 }}
                />
                {/* pulse on the most-recently-activated */}
                {wasJustActivated && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={22}
                    fill="none"
                    stroke="#E50914"
                    strokeWidth="1.5"
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 1.2, repeat: 1 }}
                  />
                )}
                {/* label */}
                <text
                  x={x}
                  y={y + 42}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="0.18em"
                  style={{ textTransform: 'uppercase' }}
                  fill={active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)'}
                >
                  {h.label}
                </text>
                <text
                  x={x}
                  y={y + 56}
                  textAnchor="middle"
                  fontSize="9"
                  fill={active ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)'}
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {h.en}
                </text>
              </g>
            );
          })}
        </svg>

        <motion.p
          key={milestoneIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-sm text-white/85 min-h-[1.5em] max-w-[28ch]"
        >
          {milestones[milestoneIdx]}
        </motion.p>
      </div>

      {/* Bottom: profile counter + progress bar */}
      <div className="px-6 pb-10">
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
            Анализирани профили
          </p>
          <p
            className="text-base text-white"
            style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
          >
            {profilesCount.toLocaleString('bg-BG')}
          </p>
        </div>
        <div className="h-1 w-full bg-white/15 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--color-brand-red)] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}
