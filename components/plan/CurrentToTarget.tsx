'use client';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ShieldAlertIcon, CircleCheckIcon } from '@/components/icons';

interface Props {
  /** Character code, e.g. "f2" or "m3". Drives which body-type photo we render. */
  character: string;
  /** Current body-type the user picked: 'overweight' | 'skinny-fat' | 'underweight' | 'perfect'. */
  currentBodyType: string;
  currentKg: number;
  targetKg: number;
  /** Total days the user wants to take to reach the goal. */
  days: number;
}

/**
 * Side-by-side "where you are now" vs "where you want to be" with the user's
 * matched character cast. Below the visuals: a realism verdict — green check
 * if achievable at <=1 kg/week (loss) or <=0.5 kg/week (gain), red warning
 * otherwise with a recommended longer timeline.
 */
export function CurrentToTarget({ character, currentBodyType, currentKg, targetKg, days }: Props) {
  const delta = currentKg - targetKg; // positive = losing, negative = gaining
  const losing = delta > 0;
  const gaining = delta < 0;
  const totalKg = Math.abs(delta);
  const weeks = Math.max(1, days / 7);
  const perWeek = totalKg / weeks;

  // Safe rates: 1 kg/week loss, 0.5 kg/week gain (lean mass).
  const safeRate = losing ? 1.0 : 0.5;
  const isSafe = perWeek <= safeRate;
  const safeDays = Math.ceil((totalKg / safeRate) * 7);
  const safeWeeks = Math.ceil(totalKg / safeRate);

  const currentImg = `/images/photo/body-type/${character}-${currentBodyType}.png`;
  const targetImg = `/images/photo/body-type/${character}-perfect.png`;

  return (
    <section className="rounded-2xl bg-white border border-[var(--color-line)] p-5">
      <p
        className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)] mb-4"
        style={{ letterSpacing: '0.22em' }}
      >
        От · до
      </p>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <BodyCard
          label="Сега"
          kg={currentKg}
          imgSrc={currentImg}
          accent="muted"
        />
        <ArrowRightIcon
          width={22}
          height={22}
          className="text-[var(--color-brand-red)]"
        />
        <BodyCard
          label="Цел"
          kg={targetKg}
          imgSrc={targetImg}
          accent="brand"
        />
      </div>

      {/* Realism verdict */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.1 }}
        className={[
          'mt-5 rounded-xl p-4 flex items-start gap-3',
          isSafe
            ? 'bg-[var(--color-success-50)] border border-[var(--color-success-600)]/30'
            : 'bg-[var(--color-amber-bg)] border border-[var(--color-amber-text)]/30',
        ].join(' ')}
      >
        <span
          aria-hidden
          className={[
            'shrink-0 size-8 rounded-full grid place-items-center',
            isSafe ? 'bg-[var(--color-success-600)] text-white' : 'bg-[var(--color-amber-text)] text-white',
          ].join(' ')}
        >
          {isSafe ? <CircleCheckIcon width={18} height={18} /> : <ShieldAlertIcon width={18} height={18} />}
        </span>
        <div className="flex-1 min-w-0">
          {isSafe ? (
            <>
              <p className="text-[14px] font-extrabold text-[var(--color-success-700)] leading-tight">
                Реалистична цел
              </p>
              <p className="mt-1 text-[12px] text-[var(--color-text-body)] leading-snug">
                {totalKg.toFixed(0)} кг за {Math.round(weeks)} седмици · около{' '}
                {perWeek.toFixed(2).replace('.', ',')} кг/седмица. В безопасния диапазон.
              </p>
            </>
          ) : (
            <>
              <p className="text-[14px] font-extrabold text-[var(--color-amber-text)] leading-tight">
                {gaining ? 'Прекалено бърза цел' : 'Прекалено бърза загуба'}
              </p>
              <p className="mt-1 text-[12px] text-[var(--color-text-body)] leading-snug">
                {totalKg.toFixed(0)} кг за {Math.round(weeks)} седмици означава{' '}
                {perWeek.toFixed(2).replace('.', ',')} кг/седмица. Това изисква екстремен дефицит,
                който не препоръчваме (риск за здравето и тонуса). Удължи срока до поне{' '}
                <span className="font-bold whitespace-nowrap">{safeWeeks} седмици</span>{' '}
                ({Math.round(safeDays / 30)} мес.) за здравословно темпо ({losing ? '~1' : '~0,5'} кг/седмица).
              </p>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}

function BodyCard({
  label,
  kg,
  imgSrc,
  accent,
}: {
  label: string;
  kg: number;
  imgSrc: string;
  accent: 'muted' | 'brand';
}) {
  return (
    <div
      className={[
        'rounded-2xl overflow-hidden border-2 bg-[var(--color-paper-warm)]',
        accent === 'brand'
          ? 'border-[var(--color-brand-red)]'
          : 'border-[var(--color-line)]',
      ].join(' ')}
    >
      <div className="relative aspect-[4/5] bg-[var(--color-surface-100)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 18%' }}
        />
      </div>
      <div className="px-3 py-2 text-center">
        <p
          className="text-[9px] uppercase font-bold text-[var(--color-text-muted)]"
          style={{ letterSpacing: '0.2em' }}
        >
          {label}
        </p>
        <p className="text-[16px] font-extrabold text-[var(--color-text-headline)] tabular-nums mt-0.5">
          {kg} <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">кг</span>
        </p>
      </div>
    </div>
  );
}
