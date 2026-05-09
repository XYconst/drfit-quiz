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
          'mt-5 rounded-2xl p-4',
          isSafe
            ? 'bg-[var(--color-success-50)] border border-[var(--color-success-600)]/30'
            : 'bg-[var(--color-amber-bg)] border border-[var(--color-amber-text)]/30',
        ].join(' ')}
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={[
              'shrink-0 size-8 rounded-full grid place-items-center',
              isSafe ? 'bg-[var(--color-success-600)] text-white' : 'bg-[var(--color-amber-text)] text-white',
            ].join(' ')}
          >
            {isSafe ? <CircleCheckIcon width={18} height={18} /> : <ShieldAlertIcon width={18} height={18} />}
          </span>
          <p
            className={[
              'text-[15px] font-extrabold leading-tight',
              isSafe ? 'text-[var(--color-success-700)]' : 'text-[var(--color-amber-text)]',
            ].join(' ')}
            style={{ letterSpacing: '-0.01em' }}
          >
            {isSafe ? 'Реалистична цел' : gaining ? 'Прекалено бърза цел' : 'Прекалено бързо темпо'}
          </p>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Pill label={losing ? 'Сваляш' : 'Качваш'} value={`${totalKg.toFixed(0)} кг`} />
          <Pill label="Срок" value={`${Math.round(weeks)} седм.`} />
          <Pill
            label="Темпо"
            value={`${perWeek.toFixed(2).replace('.', ',')} кг/седм.`}
            warn={!isSafe}
          />
        </dl>

        {!isSafe && (
          <div className="mt-4 rounded-xl bg-white/60 border border-[var(--color-amber-text)]/20 px-3 py-2.5">
            <p
              className="text-[10px] font-extrabold uppercase text-[var(--color-amber-text)]"
              style={{ letterSpacing: '0.18em' }}
            >
              Препоръчваме
            </p>
            <p className="mt-1 text-[14px] font-bold text-[var(--color-text-strong)] leading-snug">
              <span className="tabular-nums">{safeWeeks} седмици</span> ({Math.round(safeDays / 30)} мес.)
              за здравословно темпо около <span className="tabular-nums">{losing ? '1' : '0,5'} кг/седм.</span>
            </p>
          </div>
        )}

        {isSafe && (
          <p className="mt-3 text-[13px] text-[var(--color-text-body)] leading-snug">
            В безопасния диапазон. Можем да го направим устойчиво.
          </p>
        )}
      </motion.div>
    </section>
  );
}

function Pill({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div
      className={[
        'rounded-xl px-2 py-2 border',
        warn
          ? 'bg-[var(--color-amber-text)]/8 border-[var(--color-amber-text)]/30'
          : 'bg-white/70 border-[var(--color-line)]',
      ].join(' ')}
    >
      <p
        className="text-[9px] font-bold uppercase text-[var(--color-text-muted)]"
        style={{ letterSpacing: '0.16em' }}
      >
        {label}
      </p>
      <p
        className={[
          'mt-0.5 text-[13px] font-extrabold tabular-nums leading-tight',
          warn ? 'text-[var(--color-amber-text)]' : 'text-[var(--color-text-headline)]',
        ].join(' ')}
        style={{ letterSpacing: '-0.01em' }}
      >
        {value}
      </p>
    </div>
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
