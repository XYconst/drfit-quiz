'use client';
import { useEffect, useState } from 'react';

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
    <div className="sticky top-0 z-20 bg-[var(--color-brand-dark)] text-white text-sm py-2.5 px-4 flex items-center justify-center gap-2">
      <span>🔥 Само за първите 10 абонати днес. Изтича след</span>
      <span className="text-gold-gradient font-extrabold tabular-nums">{pad(m)}:{pad(sec)}</span>
    </div>
  );
}
