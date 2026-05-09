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
  /** Path to the matched-character cutout. Falls back to no photo when undefined. */
  characterImageSrc?: string;
}

const HORMONES = [
  { id: 'insulin', label: 'Инсулин', position: 'top' as const, threshold: 0.0 },
  { id: 'leptin', label: 'Лептин', position: 'right' as const, threshold: 0.25 },
  { id: 'ghrelin', label: 'Грелин', position: 'bottom' as const, threshold: 0.5 },
  { id: 'cortisol', label: 'Кортизол', position: 'left' as const, threshold: 0.75 },
];

const FINAL_PROFILES = 10847;

const POSITION_CLASSES: Record<'top' | 'right' | 'bottom' | 'left', string> = {
  top:    'absolute left-1/2 -translate-x-1/2 -top-2',
  right:  'absolute top-1/2 -translate-y-1/2 -right-2',
  bottom: 'absolute left-1/2 -translate-x-1/2 -bottom-2',
  left:   'absolute top-1/2 -translate-y-1/2 -left-2',
};

export function CalculatingScreen({
  headline,
  milestones,
  durationMs,
  onDone,
  midQuestions = [],
  onMidAnswer,
  stepLabel,
  characterImageSrc,
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
      // Hold for 3 seconds on the final 'Готово' state before advancing.
      else setTimeout(onDone, 3000);
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
    startRef.current = performance.now() - pendingQuestion.atProgress * durationMs;
    progressRef.current = pendingQuestion.atProgress + 0.0001;
    setPendingQuestion(null);
    setPaused(false);
  };

  const profilesCount = Math.round(FINAL_PROFILES * progress);

  // Progress ring math.
  const ringR = 132;
  const ringStroke = 6;
  const circumference = 2 * Math.PI * ringR;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      className="relative min-h-dvh flex flex-col text-white overflow-hidden"
      style={{
        background:
          'radial-gradient(60% 40% at 50% 22%, rgba(229,9,20,0.10) 0%, rgba(229,9,20,0) 60%), linear-gradient(180deg, #0a0d11 0%, #14191f 50%, #1c2229 100%)',
      }}
    >
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
          className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[var(--color-brand-bright)] mb-3"
        >
          {stepLabel ? `Анализ · стъпка ${stepLabel}` : 'Анализ'}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 0.61, 0.36, 1] }}
          className="font-extrabold mb-10 text-white"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1.625rem, 6vw, 2.125rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            textWrap: 'balance',
            maxWidth: '22ch',
            margin: '0 auto 2.5rem',
          }}
        >
          {headline}
        </motion.h2>

        {/* Center stage: progress ring + character photo + hormone labels */}
        <div className="relative" style={{ width: 320, height: 320 }}>
          {/* Hormone labels positioned at compass points around the ring */}
          {HORMONES.map((h) => {
            const active = progress >= h.threshold;
            return (
              <motion.div
                key={h.id}
                className={POSITION_CLASSES[h.position]}
                initial={false}
                animate={{
                  opacity: active ? 1 : 0.45,
                  y: h.position === 'top' ? (active ? -4 : 0) : h.position === 'bottom' ? (active ? 4 : 0) : 0,
                  x: h.position === 'left' ? (active ? -4 : 0) : h.position === 'right' ? (active ? 4 : 0) : 0,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-2">
                  <motion.span
                    aria-hidden
                    className="block size-1.5 rounded-full"
                    initial={false}
                    animate={{
                      backgroundColor: active ? '#FF3B47' : 'rgba(255,255,255,0.4)',
                      boxShadow: active ? '0 0 12px rgba(255,59,71,0.85)' : 'none',
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  <span
                    className="text-[11px] font-bold uppercase"
                    style={{
                      letterSpacing: '0.22em',
                      color: active ? '#ffffff' : 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {h.label}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Progress ring (SVG) */}
          <svg
            viewBox="0 0 320 320"
            className="absolute inset-0 w-full h-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A50015" />
                <stop offset="50%" stopColor="#E50914" />
                <stop offset="100%" stopColor="#FF3B47" />
              </linearGradient>
            </defs>

            {/* Track */}
            <circle
              cx={160}
              cy={160}
              r={ringR}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={ringStroke}
            />
            {/* Progress arc — starts at top (12 o'clock), rotates by -90deg */}
            <circle
              cx={160}
              cy={160}
              r={ringR}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth={ringStroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 160 160)"
              style={{
                transition: 'stroke-dashoffset 320ms cubic-bezier(0.22, 0.61, 0.36, 1)',
                filter: 'drop-shadow(0 0 12px rgba(229,9,20,0.55))',
              }}
            />
          </svg>

          {/* Character photo inside the ring — circular portrait, head+shoulders */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative overflow-hidden rounded-full"
              style={{
                width: 240,
                height: 240,
                background: 'radial-gradient(70% 70% at 50% 55%, rgba(229,9,20,0.18) 0%, rgba(229,9,20,0) 70%)',
              }}
            >
              {characterImageSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={characterImageSrc}
                  alt=""
                  className="absolute inset-0 w-full h-full"
                  style={{ objectFit: 'cover', objectPosition: 'center 18%' }}
                />
              ) : null}
            </div>
          </div>
        </div>

        <motion.p
          key={milestoneIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
          className="mt-10 text-[15px] text-white min-h-[1.5em] max-w-[28ch] font-medium"
          style={{ textShadow: '0 1px 12px rgba(0,0,0,0.65)' }}
        >
          {milestones[milestoneIdx]}
        </motion.p>
      </div>

      {/* Bottom: subtle profile counter only — progress is communicated by the ring */}
      <div className="relative px-6 pb-10 flex items-baseline justify-center gap-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
          Анализирани профили
        </p>
        <p
          className="text-sm text-white/85"
          style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
        >
          {profilesCount.toLocaleString('bg-BG')}
        </p>
      </div>

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
