'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  /** Personalised greeting line (e.g. "Иванка, отстъпката ти е готова"). */
  greeting: string;
  /** Discount percentage label, e.g. "30%". */
  percent: string;
  /** Personal redemption code, e.g. "DRFIT-MARIA-30". */
  code: string;
  /** Seconds remaining before the offer expires (drives the countdown header). */
  initialSeconds: number;
  onClaim: () => void;
  /** Optional close handler — when present a small × renders in the header. */
  onClose?: () => void;
}

const BRUSH_RADIUS = 28;
const CLAIM_RATIO = 0.5; // unlock when ≥50% of the scratch coating is removed
const PROGRESS_SAMPLE_STRIDE = 32; // sample every Nth byte (RGBA*step)

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

/**
 * Real scratch-card UX: the user drags a finger anywhere on the coating and
 * pixels are erased along the trajectory (canvas destination-out). Once
 * roughly half the surface is cleared the claim fires and the code is
 * revealed.
 */
export function ScrubReveal({
  greeting,
  percent,
  code,
  initialSeconds,
  onClaim,
  onClose,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPt = useRef<{ x: number; y: number } | null>(null);
  const drawing = useRef(false);
  const [claimed, setClaimed] = useState(false);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [hint, setHint] = useState(true);

  // Countdown timer.
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  // Paint the scratch coating onto the canvas.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const paint = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';

      // Brand-red gradient base
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#A50015');
      grad.addColorStop(1, '#E50914');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Diagonal stripe texture
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      for (let x = -h; x < w + h; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + h, h);
        ctx.stroke();
      }

      // Hint text
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.font = '800 13px -apple-system, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ИЗТРИЙ С ПРЪСТ', w / 2, h / 2 - 8);
      ctx.font = '700 11px -apple-system, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.78)';
      ctx.fillText('за да отключиш кода', w / 2, h / 2 + 12);
    };

    paint();
    const ro = new ResizeObserver(() => {
      if (claimed) return;
      paint();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [claimed]);

  const positionFor = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const measureProgress = () => {
    const c = canvasRef.current;
    if (!c) return 0;
    const ctx = c.getContext('2d');
    if (!ctx) return 0;
    try {
      const { data } = ctx.getImageData(0, 0, c.width, c.height);
      let cleared = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += PROGRESS_SAMPLE_STRIDE) {
        total++;
        if (data[i] < 16) cleared++;
      }
      return total > 0 ? cleared / total : 0;
    } catch {
      return 0;
    }
  };

  const erase = (x: number, y: number) => {
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = BRUSH_RADIUS * 2;
    ctx.beginPath();
    if (lastPt.current) ctx.moveTo(lastPt.current.x, lastPt.current.y);
    else ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    lastPt.current = { x, y };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (claimed || seconds <= 0) return;
    const p = positionFor(e);
    if (!p) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    drawing.current = true;
    lastPt.current = null;
    setHint(false);
    erase(p.x, p.y);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const p = positionFor(e);
    if (!p) return;
    erase(p.x, p.y);
  };
  const finish = () => {
    if (!drawing.current) return;
    drawing.current = false;
    lastPt.current = null;
    if (claimed) return;
    const ratio = measureProgress();
    if (ratio >= CLAIM_RATIO) {
      setClaimed(true);
      const c = canvasRef.current;
      const ctx = c?.getContext('2d');
      if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
      setTimeout(onClaim, 320);
    }
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const expired = seconds <= 0;

  return (
    <div className="rounded-3xl bg-white border border-[var(--color-line)] shadow-[0_24px_60px_-22px_rgba(25,33,38,0.35)] overflow-hidden">
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

      <div className="px-5 pt-6 pb-7">
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

        <p className="mt-2 text-[13px] text-[var(--color-text-muted)] leading-snug max-w-[34ch]">
          Изтрий полето, за да отключиш кода и плана си.
        </p>

        <div className="mt-5">
          <div
            ref={wrapRef}
            className="relative w-full rounded-2xl overflow-hidden border border-[var(--color-brand-red)]/30 select-none touch-none"
            style={{ height: 140, background: '#FFFFFF' }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <span
                className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)] mb-1.5"
                style={{ letterSpacing: '0.22em' }}
              >
                Твоят код
              </span>
              <span
                className="font-extrabold tabular-nums tracking-[0.18em] text-[var(--color-brand-red)] leading-none"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(1.0625rem, 4.6vw, 1.375rem)',
                }}
              >
                {code}
              </span>
              <span
                className="mt-2 text-[11px] font-bold text-[var(--color-text-strong)]"
                style={{ letterSpacing: '0.06em' }}
              >
                {percent} отстъпка активирана
              </span>
            </div>

            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={finish}
              onPointerCancel={finish}
              onPointerLeave={finish}
              className={[
                'absolute inset-0 w-full h-full',
                claimed ? 'pointer-events-none opacity-0' : 'opacity-100',
                expired ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing',
              ].join(' ')}
              style={{ transition: 'opacity 0.4s ease' }}
            />

            {hint && !claimed && (
              <motion.span
                aria-hidden
                className="absolute pointer-events-none size-12 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 65%)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0.2, 0.9, 0], x: ['-50%', '-30%', '-70%', '-50%'] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
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
