'use client';
import { useEffect, useRef } from 'react';

/**
 * Horizontal scroll picker. Shows adjacent integer values left/right of the
 * centered (highlighted) one, snaps to the center on scroll, and emits
 * onChange when the centered value changes. Touch/finger swipes sideways.
 */

interface Props {
  min: number;
  max: number;
  value: number;
  onChange: (next: number) => void;
  /** Columns visible to either side of the centered one. */
  visibleCols?: number;
  colWidth?: number;
  height?: number;
}

export function HorizontalWheelPicker({
  min,
  max,
  value,
  onChange,
  visibleCols = 3,
  colWidth = 56,
  height = 72,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const lastEmittedRef = useRef<number>(value);
  const padCols = visibleCols;

  // Sync external value -> scroll position.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(max - min, value - min));
    const left = idx * colWidth;
    if (Math.abs(el.scrollLeft - left) > 2) {
      el.scrollTo({ left, behavior: 'auto' });
    }
    lastEmittedRef.current = value;
  }, [value, min, max, colWidth]);

  // Listen to scroll; on idle, emit the centered value.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handler = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const idx = Math.round(el.scrollLeft / colWidth);
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
  }, [min, max, colWidth, onChange]);

  const items: number[] = [];
  for (let v = min; v <= max; v++) items.push(v);

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Highlight band — sits behind the centered column */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-xl border border-[var(--color-brand-red)]/35 bg-[var(--color-brand-red-tint)]"
        style={{ width: colWidth, height: height - 8 }}
      />

      {/* Side fades — affordance + soft mask */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-[2]"
        style={{
          width: visibleCols * colWidth,
          background:
            'linear-gradient(90deg, var(--color-brand-bg) 0%, rgba(250,250,250,0.65) 60%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-[2]"
        style={{
          width: visibleCols * colWidth,
          background:
            'linear-gradient(270deg, var(--color-brand-bg) 0%, rgba(250,250,250,0.65) 60%, transparent 100%)',
        }}
      />

      <div
        ref={scrollerRef}
        className="absolute inset-0 overflow-x-auto overflow-y-hidden whitespace-nowrap"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          paddingLeft: padCols * colWidth,
          paddingRight: padCols * colWidth,
        }}
      >
        {items.map((v) => (
          <div
            key={v}
            className="inline-flex items-center justify-center text-[var(--color-text-headline)] tabular-nums align-top"
            style={{
              width: colWidth,
              height: '100%',
              scrollSnapAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 22,
              fontWeight: 700,
              transition: 'opacity 160ms, transform 160ms',
              opacity:
                Math.abs(v - value) === 0
                  ? 1
                  : Math.abs(v - value) === 1
                    ? 0.55
                    : Math.abs(v - value) === 2
                      ? 0.32
                      : 0.18,
              transform: Math.abs(v - value) === 0 ? 'scale(1.08)' : 'scale(1)',
            }}
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}
