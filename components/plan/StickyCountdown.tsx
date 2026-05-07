'use client';
import { useEffect, useState } from 'react';
import { FlameIcon } from '@/components/icons';

function pad(n: number) { return String(n).padStart(2, '0'); }

export function StickyCountdown({ initialSeconds }: { initialSeconds: number }) {
  const [s, setS] = useState(initialSeconds);
  useEffect(() => {
    const id = setInterval(() => setS((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return (
    <div className="sticky top-0 z-20 bg-[var(--color-graphite)] text-white text-sm py-2.5 px-4 flex items-center justify-center gap-2 border-b border-white/5">
      <FlameIcon width={14} height={14} className="text-[var(--color-brand-red)]" />
      <span>Само за първите 10 абонати днес. Изтича след</span>
      <span
        className="text-white font-semibold"
        style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
      >
        {pad(m)}:{pad(sec)}
      </span>
    </div>
  );
}
