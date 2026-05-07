import type { ReactNode } from 'react';
import { CheckIcon, XIcon } from '@/components/icons';

interface Row {
  left: string;
  right: ReactNode;
}

// Per design plan B.9: each blocker / past-attempt key maps to a paired "Без план" vs "С Dr.Fit" row.
// Mechanism IP terms (Carb-Cycling, TUT, AfterBurn) are wrapped in <em> so they pick up Playfair italic.
const Em = ({ children }: { children: ReactNode }) => (
  <em
    style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600 }}
  >
    {children}
  </em>
);

const ROWS: Record<string, Row> = {
  // From step 23 — blockers
  'no-time': {
    left: 'Нямам време',
    right: (<>20-минутна тренировка с <Em>TUT</Em> timer</>),
  },
  'no-plan': {
    left: 'Нямам план',
    right: 'Дневен план до минути, готов в приложението',
  },
  'no-support': {
    left: 'Нямам подкрепа',
    right: 'Реален треньор в чат, не бот',
  },
  expensive: {
    left: 'Скъпо ми е',
    right: '49 EUR върнати при завършване',
  },
  lost: {
    left: 'Не знам откъде',
    right: (<>Първа стъпка: <Em>Carb-Cycling</Em> за 7 дни</>),
  },
  fear: {
    left: 'Страх ме е, че няма да издържа',
    right: (<>90-дневен ритъм + <Em>AfterBurn</Em> ефект</>),
  },
  failed: {
    left: 'Пробвал/-а съм и не върви',
    right: (<>Защо: 4-те хормона. Решение: ротация</>),
  },
  // From step 12 — past attempts
  gym: {
    left: 'Зала без план',
    right: (<>Програма по <Em>TUT</Em>, не по тегло</>),
  },
  diets: {
    left: 'Диети без коренна причина',
    right: (<><Em>Carb-Cycling</Em> таргетира инсулина</>),
  },
  youtube: {
    left: 'YouTube за всички',
    right: 'Програма за твоя профил',
  },
  supplements: {
    left: 'Добавки на сляпо',
    right: 'Добавки само където е нужно',
  },
  pt: {
    left: 'Треньор без хранене',
    right: 'Треньор + хранителен план в едно',
  },
};

const FALLBACK: Row[] = [
  { left: 'Йо-йо ефект, сваляш и качваш', right: 'Стабилно сваляне без връщане' },
  { left: 'Налучкваш сам/-а', right: 'Точен план за теб' },
  { left: 'Без подкрепа', right: 'Чат с треньор всеки ден' },
  { left: 'Скъпа фитнес зала', right: 'От телефона ти' },
  { left: 'Не виждаш резултати', right: 'Първи резултати в 30 дни' },
];

interface Props {
  blockers?: string[];
  pastAttempts?: string[];
  /** legacy override — if provided, skips dynamic generation */
  rows?: Row[];
}

function buildRows(blockers: string[] = [], pastAttempts: string[] = []): Row[] {
  const seen = new Set<string>();
  const out: Row[] = [];
  // Blockers first (they describe present-tense fears), then past attempts (post-mortem of effort).
  const ordered = [...blockers, ...pastAttempts.filter((p) => p !== 'nothing')];
  for (const key of ordered) {
    if (out.length >= 5) break;
    if (seen.has(key)) continue;
    const row = ROWS[key];
    if (!row) continue;
    seen.add(key);
    out.push(row);
  }
  // Top up from fallback if the user didn't pick enough.
  for (const f of FALLBACK) {
    if (out.length >= 5) break;
    out.push(f);
  }
  return out.slice(0, 5);
}

export function ComparisonBlock({ blockers, pastAttempts, rows: rowsOverride }: Props) {
  const rows = rowsOverride ?? buildRows(blockers, pastAttempts);
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-[var(--color-surface-100)] p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Без план</p>
        <ul className="space-y-2">
          {rows.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-body)]">
              <XIcon width={14} height={14} className="text-[var(--color-brand-red)] mt-1 shrink-0" />
              <span>{r.left}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl bg-[var(--color-success-50)] p-4 border border-[var(--color-success-400)]/30">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-success-700)] mb-3">С Dr.Fit</p>
        <ul className="space-y-2">
          {rows.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-strong)]">
              <CheckIcon width={14} height={14} className="text-[var(--color-success-600)] mt-1 shrink-0" />
              <span>{r.right}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
