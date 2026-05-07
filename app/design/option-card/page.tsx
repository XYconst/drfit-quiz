'use client';
import { useState } from 'react';
import { OptionCard } from '@/components/quiz/OptionCard';

const PLACEHOLDER = '/images/quiz/_demo/sample.svg';

export default function OptionCardSandbox() {
  const [selectedSingle, setSelectedSingle] = useState<string | null>('a');
  const [selectedMulti, setSelectedMulti] = useState<string[]>(['x']);
  const toggle = (id: string) =>
    setSelectedMulti((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));

  return (
    <main className="min-h-dvh bg-[var(--color-brand-bg)] px-5 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-2 text-[var(--color-text-headline)]">
          OptionCard sandbox
        </h1>
        <p className="text-[var(--color-text-muted)] mb-10 text-sm">
          Variants: portrait (4:5), square (1:1), wide (16:9). States: default / selected / disabled / focus-visible.
        </p>

        <section className="mb-12">
          <h2 className="font-bold uppercase tracking-wider text-xs text-[var(--color-brand-red)] mb-4">
            Single-select (portrait)
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {(['a', 'b', 'c', 'd'] as const).map((id, i) => (
              <OptionCard
                key={id}
                imageUrl={PLACEHOLDER}
                label={`Option ${id.toUpperCase()}`}
                sub={i === 1 ? 'With sub-line' : undefined}
                selected={selectedSingle === id}
                onClick={() => setSelectedSingle(id)}
                variant="portrait"
                index={i}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-bold uppercase tracking-wider text-xs text-[var(--color-brand-red)] mb-4">
            Multi-select (square)
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {(['x', 'y', 'z', 'w'] as const).map((id, i) => (
              <OptionCard
                key={id}
                imageUrl={PLACEHOLDER}
                label={`Choice ${id}`}
                selected={selectedMulti.includes(id)}
                disabled={i === 3 && selectedMulti.length >= 2 && !selectedMulti.includes(id)}
                onClick={() => toggle(id)}
                variant="square"
                role="checkbox"
                index={i}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-bold uppercase tracking-wider text-xs text-[var(--color-brand-red)] mb-4">
            Wide variant
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {(['p', 'q', 'r'] as const).map((id, i) => (
              <OptionCard
                key={id}
                imageUrl={PLACEHOLDER}
                label={`Wide option ${id}`}
                sub="Descriptive sub-line for the wide variant"
                selected={i === 1}
                variant="wide"
                index={i}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold uppercase tracking-wider text-xs text-[var(--color-brand-red)] mb-4">
            Disabled state
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <OptionCard imageUrl={PLACEHOLDER} label="Disabled, unselected" disabled variant="square" />
            <OptionCard imageUrl={PLACEHOLDER} label="Disabled, selected" disabled selected variant="square" />
          </div>
        </section>
      </div>
    </main>
  );
}
