'use client';
import { useEffect, useRef } from 'react';

/**
 * iOS-style scrollable wheel picker. Renders a vertical scrollable list of
 * integer values; the centered row (under the highlighted band) is the value.
 * Native scroll-snap handles the snapping; a small useEffect emits onChange
 * when the centered row changes.
 */

interface Props {
  min: number;
  max: number;
  value: number;
  /** Optional unit string drawn after each row (e.g. 'кг', 'см'). */
  suffix?: string;
  onChange: (next: number) => void;
  /** Visible rows above + below the center; row height stays constant. */
  visibleRows?: number;
  rowHeight?: number;
}

export function WheelPicker({
  min,
  max,
  value,
  suffix,
  onChange,
  visibleRows = 2,
  rowHeight = 40,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const lastEmittedRef = useRef<number>(value);
  const padRows = visibleRows;

  // Sync external `value` -> scroll position when prop changes (initial mount + parent edits).
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(max - min, value - min));
    const top = idx * rowHeight;
    if (Math.abs(el.scrollTop - top) > 2) {
      el.scrollTo({ top, behavior: 'auto' });
    }
    lastEmittedRef.current = value;
  }, [value, min, max, rowHeight]);

  // Listen to scroll events; on idle, snap-emit the centered value.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handler = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const idx = Math.round(el.scrollTop / rowHeight);
        const v = Math.max(min, Math.min(max, min + idx));
        if (v !== lastEmittedRef.current) {
          lastEmittedRef.current = v;
          onChange(v);
        }
      }, 90);
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => {
      el.removeEventListener('scroll', handler);
      if (timer) clearTimeout(timer);
    };
  }, [min, max, rowHeight, onChange]);

  const items: number[] = [];
  for (let v = min; v <= max; v++) items.push(v);
  const containerHeight = (visibleRows * 2 + 1) * rowHeight;

  return (
    <div
      className="relative w-full"
      style={{ height: containerHeight }}
    >
      {/* Highlighted band — sits behind the centered row */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none rounded-xl border border-[var(--color-brand-red)]/35 bg-[var(--color-brand-red-tint)]"
        style={{ height: rowHeight }}
      />

      {/* Top + bottom soft fades to imply scroll affordance */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[2]"
        style={{
          height: visibleRows * rowHeight,
          background:
            'linear-gradient(180deg, var(--color-brand-bg) 0%, rgba(250,250,250,0.65) 60%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2]"
        style={{
          height: visibleRows * rowHeight,
          background:
            'linear-gradient(0deg, var(--color-brand-bg) 0%, rgba(250,250,250,0.65) 60%, transparent 100%)',
        }}
      />

      <div
        ref={scrollerRef}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden snap-y snap-mandatory text-center"
        style={{
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          paddingTop: padRows * rowHeight,
          paddingBottom: padRows * rowHeight,
        }}
      >
        {items.map((v) => (
          <div
            key={v}
            className="flex items-center justify-center text-[var(--color-text-headline)]"
            style={{
              height: rowHeight,
              scrollSnapAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: 22,
              fontWeight: 700,
              transition: 'opacity 160ms',
              opacity: Math.abs(v - value) === 0 ? 1 : Math.abs(v - value) === 1 ? 0.55 : 0.28,
            }}
          >
            <span>{v}</span>
            {suffix && (
              <span
                className="ml-1.5 text-[var(--color-text-muted)]"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                {suffix}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
