'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  /** Personalised greeting line (e.g. "Иванка, отстъпката ти е готова"). */
  greeting: string;
  /** Discount percentage label, e.g. "50%". */
  percent: string;
  /** Pre-discount price, e.g. "99 EUR". */
  fromPrice: string;
  /** Post-discount price, e.g. "49 EUR". */
  toPrice: string;
  /** Personal redemption code, e.g. "DRFIT-MARIA-50". */
  code: string;
  /** Seconds remaining before the offer expires (drives the countdown header). */
  initialSeconds: number;
  onClaim: () => void;
  /** Optional close handler — when present a small × renders in the header. */
  onClose?: () => void;
}

const TRACK_PADDING = 6;

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

/**
 * Scratch-to-reveal style discount unlock. The user drags their finger across
 * the track and the personal code is wiped clean (a clip-path follows the
 * pointer). Once fully revealed, the claim fires.
 */
export function ScrubReveal({
  greeting,
  percent,
  fromPrice,
  toPrice,
  code,
  initialSeconds,
  onClaim,
  onClose,
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const drag = useRef<{ active: boolean; rectLeft: number; rectWidth: number; lastX: number }>({
    active: false,
    rectLeft: 0,
    rectWidth: 1,
    lastX: 0,
  });

  const updateFromX = (clientX: number) => {
    const r = drag.current;
    const local = Math.max(0, Math.min(r.rectWidth, clientX - r.rectLeft));
    const p = local / r.rectWidth;
    if (p > progress) setProgress(p);
    if (p >= 0.96 && !claimed) {
      setClaimed(true);
      setProgress(1);
      setTimeout(onClaim, 540);
    }
  };

  const start = (e: React.PointerEvent<HTMLDivElement>) => {
    if (claimed || seconds <= 0) return;
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { active: true, rectLeft: rect.left, rectWidth: rect.width, lastX: e.clientX };
    updateFromX(e.clientX);
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.lastX = e.clientX;
    updateFromX(e.clientX);
  };
  const end = () => {
    drag.current.active = false;
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const expired = seconds <= 0;

  return (
    <div className="rounded-3xl bg-white border border-[var(--color-line)] shadow-[0_18px_40px_-22px_rgba(25,33,38,0.25)] overflow-hidden">
      {/* Header strip with countdown */}
      <div className="bg-gradient-to-r from-[var(--color-brand-red)] to-[#FF3B47] text-white px-5 py-3 flex items-center justify-between gap-3">
        <span className="text-[11px] font-extrabold uppercase" style={{ letterSpacing: '0.22em' }}>
          Лична отстъпка
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono tabular-nums text-[13px] font-bold tracking-wider">
            {expired ? '00:00' : `${pad(mins)}:${pad(secs)}`}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Затвори отстъпката"
              className="size-7 rounded-full grid place-items-center text-white/85 hover:bg-white/15 motion-safe:transition-[background-color] motion-safe:duration-150"
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="px-5 pt-5 pb-6">
        <p className="text-[14px] font-semibold text-[var(--color-text-strong)] mb-1">{greeting}</p>
        <h2
          className="font-extrabold text-[var(--color-text-headline)]"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1.875rem, 7.5vw, 2.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
          }}
        >
          {percent} <span className="text-[var(--color-brand-red)]">отстъпка</span>
        </h2>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-[15px] text-[var(--color-text-muted)] line-through tabular-nums">
            {fromPrice}
          </span>
          <span className="text-[28px] font-extrabold tabular-nums text-[var(--color-text-headline)]">
            {toPrice}
          </span>
        </div>

        <p
          className="mt-5 mb-2 text-[10px] font-extrabold uppercase text-[var(--color-text-muted)]"
          style={{ letterSpacing: '0.22em' }}
        >
          Изтрий, за да отключиш кода
        </p>

        {/* Scrub track — code shown beneath, frosted overlay clipped by progress */}
        <div
          ref={trackRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          className={[
            'relative w-full h-[68px] rounded-xl overflow-hidden select-none touch-none',
            'border border-dashed border-[var(--color-brand-red)]/40 bg-[var(--color-brand-red-tint)]',
            claimed ? 'cursor-default' : expired ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing',
          ].join(' ')}
          style={{ padding: TRACK_PADDING }}
        >
          {/* Code revealed underneath */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-extrabold tabular-nums tracking-[0.18em] text-[var(--color-brand-red)]"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1rem, 4.4vw, 1.25rem)',
              }}
            >
              {code}
            </span>
          </div>

          {/* Frosted overlay that gets clipped from left to right as the user scrubs */}
          <motion.div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={false}
            animate={{
              clipPath: `inset(0 0 0 ${Math.round(progress * 100)}%)`,
              opacity: claimed ? 0 : 1,
            }}
            transition={{ duration: claimed ? 0.4 : 0.06, ease: 'easeOut' }}
            style={{
              background:
                'repeating-linear-gradient(135deg, rgba(165,0,21,0.92) 0 8px, rgba(229,9,20,0.92) 8px 16px)',
            }}
          >
            <span
              className="text-[12px] font-extrabold uppercase text-white"
              style={{ letterSpacing: '0.24em' }}
            >
              {progress < 0.05 ? 'Плъзни →' : 'Продължавай'}
            </span>
          </motion.div>
        </div>

        {claimed && (
          <p className="mt-3 text-center text-[12px] font-bold text-[var(--color-brand-red)]">
            Кодът е активиран
          </p>
        )}
        {expired && !claimed && (
          <p className="mt-3 text-center text-[12px] text-[var(--color-text-muted)]">
            Отстъпката изтече.
          </p>
        )}
      </div>
    </div>
  );
}
