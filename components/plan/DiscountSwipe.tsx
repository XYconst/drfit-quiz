'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ArrowRightIcon } from '@/components/icons';

interface Props {
  /** Personalised greeting line (e.g. "Иванка, отстъпката ти е готова"). */
  greeting: string;
  /** Discount percentage label, e.g. "51%". */
  percent: string;
  /** Pre-discount price label e.g. "99 EUR". */
  fromPrice: string;
  /** Post-discount price label e.g. "49 EUR". */
  toPrice: string;
  /** Seconds remaining until the offer expires. Drives the countdown. */
  initialSeconds: number;
  onClaim: () => void;
}

const TRACK_PADDING = 6;
const THUMB = 56;

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export function DiscountSwipe({
  greeting,
  percent,
  fromPrice,
  toPrice,
  initialSeconds,
  onClaim,
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const [claimed, setClaimed] = useState(false);
  const [seconds, setSeconds] = useState(initialSeconds);

  // Countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  // Swipe handling
  const drag = useRef<{ startX: number; trackW: number; active: boolean }>({
    startX: 0,
    trackW: 0,
    active: false,
  });

  const start = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (claimed) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    const trackW = trackRef.current?.clientWidth ?? 0;
    drag.current = { startX: e.clientX, trackW, active: true };
  };

  const move = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag.current.active || claimed) return;
    const dx = e.clientX - drag.current.startX;
    const max = drag.current.trackW - THUMB - TRACK_PADDING * 2;
    const clamped = Math.min(max, Math.max(0, dx));
    controls.set({ x: clamped });
    if (clamped >= max - 4) {
      drag.current.active = false;
      controls.start({ x: max });
      setClaimed(true);
      setTimeout(onClaim, 460);
    }
  };

  const end = () => {
    if (!drag.current.active || claimed) return;
    drag.current.active = false;
    controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const expired = seconds <= 0;

  return (
    <div className="rounded-3xl bg-white border border-[var(--color-line)] shadow-[0_18px_40px_-22px_rgba(25,33,38,0.25)] overflow-hidden">
      {/* Header strip with countdown */}
      <div className="bg-gradient-to-r from-[var(--color-brand-red)] to-[#FF3B47] text-white px-5 py-3 flex items-center justify-between">
        <span
          className="text-[11px] font-extrabold uppercase"
          style={{ letterSpacing: '0.22em' }}
        >
          Лична отстъпка
        </span>
        <span
          className="font-mono tabular-nums text-[13px] font-bold tracking-wider"
        >
          {expired ? '00:00' : `${pad(mins)}:${pad(secs)}`}
        </span>
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
          {percent} отстъпка <span className="text-[var(--color-brand-red)]">резервирана</span>
        </h2>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-[15px] text-[var(--color-text-muted)] line-through tabular-nums">
            {fromPrice}
          </span>
          <span className="text-[28px] font-extrabold tabular-nums text-[var(--color-text-headline)]">
            {toPrice}
          </span>
        </div>

        {/* Swipe track */}
        <div
          ref={trackRef}
          className="relative mt-6 h-[68px] rounded-full bg-[var(--color-paper-warm)] border border-[var(--color-line)] overflow-hidden"
          style={{ padding: TRACK_PADDING }}
        >
          {/* Hint text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className={[
                'text-[14px] font-bold uppercase tracking-[0.18em] transition-opacity duration-200',
                claimed ? 'text-[var(--color-brand-red)] opacity-100' : 'text-[var(--color-text-muted)] opacity-90',
              ].join(' ')}
            >
              {claimed ? 'Отстъпката е твоя' : 'Плъзни, за да отключиш'}
            </span>
          </div>

          {/* Thumb */}
          <motion.button
            type="button"
            aria-label="Плъзни, за да активираш отстъпката"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
            animate={controls}
            initial={{ x: 0 }}
            disabled={claimed || expired}
            className={[
              'absolute top-1/2 left-0 -translate-y-1/2 ml-[6px]',
              'flex items-center justify-center rounded-full',
              'bg-brand-gradient text-white shadow-brand-red touch-none',
              expired ? 'opacity-40 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing',
            ].join(' ')}
            style={{ width: THUMB, height: THUMB }}
          >
            <ArrowRightIcon width={22} height={22} />
          </motion.button>
        </div>
        {expired && (
          <p className="mt-3 text-center text-[12px] text-[var(--color-text-muted)]">
            Отстъпката изтече. Презареди страницата, за да опиташ отново.
          </p>
        )}
      </div>
    </div>
  );
}
