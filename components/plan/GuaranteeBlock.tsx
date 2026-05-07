export function GuaranteeBlock() {
  const steps = [
    'Регистрираш се с 49 EUR',
    'Завършваш 90 дни',
    'Качваш видео отзив + преди/след снимки',
    'Връщаме ти 49 EUR',
  ];
  return (
    <div className="rounded-2xl border-2 border-[var(--color-amber-border)] bg-[var(--color-amber-bg)] p-5">
      <p className="text-2xl font-extrabold text-[var(--color-amber-text)] mb-1">Плащаш 0 EUR</p>
      <p className="text-sm text-[var(--color-amber-text)]/80 mb-4">При завършване на програмата получаваш парите си обратно</p>
      <ol className="space-y-2.5">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-strong)]">
            <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-amber-text)] text-white text-xs font-bold flex items-center justify-center tabular-nums">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
