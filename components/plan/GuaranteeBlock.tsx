export function GuaranteeBlock() {
  const steps = [
    'Регистрираш се с 49 EUR',
    'Завършваш 90 дни',
    'Качваш видео отзив + преди/след снимки',
    'Връщаме ти 49 EUR',
  ];
  return (
    <div className="rounded-2xl border-2 border-[var(--color-amber-border)] bg-[var(--color-amber-bg)] p-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-5">
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-extrabold text-[var(--color-amber-text)] mb-1">Плащаш 0 EUR</p>
          <p className="text-sm text-[var(--color-amber-text)]/80 mb-4">
            При завършване на програмата получаваш парите си обратно
          </p>
          <ol className="space-y-2.5">
            {steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-strong)]">
                <span
                  className="shrink-0 size-6 rounded-full bg-[var(--color-amber-text)] text-white text-xs font-bold flex items-center justify-center"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="shrink-0 self-center sm:self-start">
          <div
            className="size-28 rounded-full grid place-items-center text-center bg-[var(--color-amber-bg)]"
            style={{
              backgroundImage:
                'linear-gradient(var(--color-amber-bg), var(--color-amber-bg)), linear-gradient(135deg, #E0B86A 0%, #C99540 50%, #8C6A20 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              border: '3px solid transparent',
            }}
            aria-label="49 EUR върнати при завършване"
          >
            <div>
              <p
                className="leading-none text-[var(--color-amber-text)]"
                style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 700, fontSize: '1.5rem' }}
              >
                49 EUR
              </p>
              <p
                className="mt-1 text-[10px] uppercase font-bold text-[var(--color-amber-text)]"
                style={{ letterSpacing: '0.18em' }}
              >
                Върнати
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
