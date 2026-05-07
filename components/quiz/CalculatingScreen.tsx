'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MidLoadingQuestion, type MidQuestionOption } from './MidLoadingQuestion';

export interface MidQuestion {
  id: string;
  atProgress: number;
  headline: string;
  options: MidQuestionOption[];
}

interface Props {
  headline: string;
  milestones: string[];
  durationMs: number;
  onDone: () => void;
  midQuestions?: MidQuestion[];
  onMidAnswer?: (stepId: string, value: string, optionId: string) => void;
  /** "26 / 27" style label for the step counter eyebrow. */
  stepLabel?: string;
}

const HORMONES = [
  { id: 'insulin', label: 'Инсулин', en: 'Insulin', angle: -90, value: '104.2', unit: 'mIU/L' },
  { id: 'leptin', label: 'Лептин', en: 'Leptin', angle: 0, value: '12.8', unit: 'ng/mL' },
  { id: 'ghrelin', label: 'Грелин', en: 'Ghrelin', angle: 90, value: '28.5', unit: 'pg/mL' },
  { id: 'cortisol', label: 'Кортизол', en: 'Cortisol', angle: 180, value: '16.4', unit: 'µg/dL' },
] as const;

const FINAL_PROFILES = 10847;

export function CalculatingScreen({
  headline,
  milestones,
  durationMs,
  onDone,
  midQuestions = [],
  onMidAnswer,
  stepLabel,
}: Props) {
  const [progress, setProgress] = useState(0);
  const [milestoneIdx, setMilestoneIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<MidQuestion | null>(null);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(() => new Set());
  const startRef = useRef<number | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (paused) return;
    if (startRef.current === null) startRef.current = performance.now();

    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - (startRef.current ?? t)) / durationMs);

      // Trigger any unanswered mid-question whose threshold we've just crossed.
      const next = midQuestions.find(
        (q) => p >= q.atProgress && !answeredIds.has(q.id) && q.atProgress > progressRef.current,
      );
      if (next) {
        progressRef.current = next.atProgress;
        setProgress(next.atProgress);
        const idx = Math.min(milestones.length - 1, Math.floor(next.atProgress * milestones.length));
        setMilestoneIdx(idx);
        setPendingQuestion(next);
        setPaused(true);
        return;
      }

      progressRef.current = p;
      setProgress(p);
      const idx = Math.min(milestones.length - 1, Math.floor(p * milestones.length));
      setMilestoneIdx(idx);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 600);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, durationMs, milestones.length, onDone, midQuestions, answeredIds]);

  const handleAnswer = (value: string, optionId: string) => {
    if (!pendingQuestion) return;
    onMidAnswer?.(pendingQuestion.id, value, optionId);
    const answeredId = pendingQuestion.id;
    setAnsweredIds((prev) => {
      const next = new Set(prev);
      next.add(answeredId);
      return next;
    });
    // Resume from the threshold by adjusting the effective start time.
    startRef.current = performance.now() - pendingQuestion.atProgress * durationMs;
    progressRef.current = pendingQuestion.atProgress + 0.0001;
    setPendingQuestion(null);
    setPaused(false);
  };

  const profilesCount = Math.round(FINAL_PROFILES * progress);
  const cx = 160;
  const cy = 160;
  const ringR = 110;

  return (
    <div
      className="relative min-h-dvh flex flex-col text-white overflow-hidden"
      style={{
        background:
          'radial-gradient(80% 50% at 50% 28%, rgba(229,9,20,0.14) 0%, rgba(229,9,20,0) 55%), radial-gradient(140% 100% at 50% 100%, #0d1115 0%, #1a2027 45%, #2b3138 100%)',
      }}
    >
      {/* Subtle dot-grid overlay — lab/scientific texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      {/* Top vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%)' }}
      />
      {/* Bottom vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)' }}
      />

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
          className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[var(--color-brand-bright)] mb-3"
          style={{ textShadow: '0 0 18px rgba(229,9,20,0.55)' }}
        >
          {stepLabel ? `Анализ · стъпка ${stepLabel}` : 'Анализ'}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 0.61, 0.36, 1] }}
          className="font-extrabold mb-8"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1.875rem, 7.5vw, 2.625rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textWrap: 'balance',
            maxWidth: '22ch',
            margin: '0 auto 2rem',
            textShadow: '0 1px 22px rgba(0,0,0,0.55)',
          }}
        >
          {headline}
        </motion.h2>

        <svg viewBox="0 0 320 320" className="w-72 sm:w-80 h-auto" role="img" aria-label="4-те хормона">
          <defs>
            <radialGradient id="silhGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(229,9,20,0.45)" />
              <stop offset="60%" stopColor="rgba(229,9,20,0.10)" />
              <stop offset="100%" stopColor="rgba(229,9,20,0)" />
            </radialGradient>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Pulsing halo around center */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={70}
            fill="url(#silhGrad)"
            initial={false}
            animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {/* Subtle scan ring */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={ringR + 18}
            fill="none"
            stroke="rgba(229,9,20,0.18)"
            strokeWidth="0.8"
            strokeDasharray="3 6"
            initial={false}
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {/* Body silhouette */}
          <g
            transform={`translate(${cx - 22} ${cy - 56})`}
            fill="rgba(255,255,255,0.88)"
            stroke="none"
          >
            <circle cx="22" cy="14" r="11" />
            <path d="M5 30 Q22 22 39 30 L42 70 Q22 76 2 70 Z" />
            <path d="M14 70 L10 110 L18 110 L22 80 L26 110 L34 110 L30 70 Z" />
          </g>

          {/* Hormone nodes */}
          {HORMONES.map((h, i) => {
            const rad = (h.angle * Math.PI) / 180;
            const x = cx + Math.cos(rad) * ringR;
            const y = cy + Math.sin(rad) * ringR;
            const active = i <= milestoneIdx && progress > 0;
            const wasJustActivated = i === milestoneIdx && progress > 0;
            return (
              <g key={h.id}>
                <motion.line
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke="#E50914"
                  strokeWidth="1.4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: active ? 1 : 0,
                    opacity: active ? 0.7 : 0,
                  }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                />
                <motion.circle
                  cx={x}
                  cy={y}
                  r={22}
                  fill={active ? '#E50914' : 'transparent'}
                  stroke={active ? '#FF3B47' : 'rgba(255,255,255,0.32)'}
                  strokeWidth="1.5"
                  filter={active ? 'url(#nodeGlow)' : undefined}
                  initial={false}
                  animate={{
                    scale: active ? [0.85, 1.12, 1] : 1,
                  }}
                  transition={{ duration: 0.45 }}
                />
                {wasJustActivated && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={22}
                    fill="none"
                    stroke="#FF3B47"
                    strokeWidth="1.5"
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: 2 }}
                  />
                )}
                <text
                  x={x}
                  y={y + 42}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="0.18em"
                  style={{ textTransform: 'uppercase' }}
                  fill={active ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.45)'}
                >
                  {h.label}
                </text>
                {active ? (
                  <motion.text
                    x={x}
                    y={y + 58}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#FF3B47"
                    style={{ fontFamily: 'var(--font-mono)' }}
                    initial={{ opacity: 0, y: y + 64 }}
                    animate={{ opacity: 1, y: y + 58 }}
                    transition={{ duration: 0.32, delay: 0.15 }}
                  >
                    {h.value} {h.unit}
                  </motion.text>
                ) : (
                  <text
                    x={x}
                    y={y + 58}
                    textAnchor="middle"
                    fontSize="10"
                    fill="rgba(255,255,255,0.28)"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {h.en}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <motion.p
          key={milestoneIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
          className="mt-6 text-[15px] text-white/90 min-h-[1.5em] max-w-[28ch] font-medium"
          style={{ textShadow: '0 1px 12px rgba(0,0,0,0.45)' }}
        >
          {milestones[milestoneIdx]}
        </motion.p>
      </div>

      {/* Bottom: profile counter + progress bar */}
      <div className="relative px-6 pb-10">
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
            Анализирани профили
          </p>
          <p
            className="text-base text-white"
            style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
          >
            {profilesCount.toLocaleString('bg-BG')}
          </p>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #A50015 0%, #E50914 60%, #FF3B47 100%)',
              boxShadow: '0 0 14px rgba(229,9,20,0.7)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Mid-loading question overlay */}
      <AnimatePresence>
        {pendingQuestion && (
          <MidLoadingQuestion
            key={pendingQuestion.id}
            headline={pendingQuestion.headline}
            options={pendingQuestion.options}
            onAnswer={handleAnswer}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
