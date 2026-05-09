'use client';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@/components/icons';

interface Props {
  /** Character code, e.g. "f2" or "m3". Drives which body-type photo we render. */
  character: string;
  /** Quiz-picked body type — used as fallback when we cannot compute BMI. */
  currentBodyType: string;
  /** Height in cm — drives BMI-based body-type selection. */
  heightCm: number;
  currentKg: number;
  targetKg: number;
  /** Total days the user wants to take to reach the goal. */
  days: number;
}

/** Map a BMI value to one of our body-type photo slugs. */
function bodyTypeForBmi(bmi: number): 'overweight' | 'skinny-fat' | 'perfect' | 'underweight' {
  if (bmi >= 27) return 'overweight';
  if (bmi >= 25) return 'skinny-fat';
  if (bmi >= 18.5) return 'perfect';
  return 'underweight';
}

/**
 * Side-by-side "where you are now" vs "where you want to be" with the user's
 * matched character cast. Below the visuals: a realism verdict — green check
 * if achievable at <=1 kg/week (loss) or <=0.5 kg/week (gain), red warning
 * otherwise with a recommended longer timeline.
 */
export function CurrentToTarget({ character, currentBodyType, heightCm, currentKg, targetKg, days }: Props) {
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

  // BMI-driven photo selection. If we don't have a height, fall back to the
  // quiz pick so the card still renders something sensible.
  const heightM = heightCm / 100;
  const currentBmi = heightM > 0 && currentKg > 0 ? currentKg / (heightM * heightM) : null;
  const targetBmi = heightM > 0 && targetKg > 0 ? targetKg / (heightM * heightM) : null;

  const currentSlug = currentBmi ? bodyTypeForBmi(currentBmi) : currentBodyType;
  const targetSlug = targetBmi ? bodyTypeForBmi(targetBmi) : 'perfect';

  const currentImg = `/images/photo/body-type/${character}-${currentSlug}.png`;
  const targetImg = `/images/photo/body-type/${character}-${targetSlug}.png`;

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
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, delay: 0.1 }}
        className="mt-5 relative rounded-[22px] overflow-hidden"
        style={{
          fontFamily: 'var(--font-sans)',
          background: isSafe
            ? 'linear-gradient(160deg, #F0FBF5 0%, #FFFFFF 55%, #FBFDFB 100%)'
            : 'linear-gradient(160deg, #FFF1ED 0%, #FFFFFF 50%, #FFF6F1 100%)',
          boxShadow: isSafe
            ? '0 1px 0 rgba(4,120,87,0.08) inset, 0 14px 32px -22px rgba(4,120,87,0.35)'
            : '0 1px 0 rgba(165,0,21,0.10) inset, 0 14px 32px -22px rgba(165,0,21,0.35)',
        }}
      >
        {/* Hairline gradient border */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[22px]"
          style={{
            padding: 1,
            background: isSafe
              ? 'linear-gradient(135deg, rgba(4,120,87,0.35), rgba(4,120,87,0.05))'
              : 'linear-gradient(135deg, rgba(229,9,20,0.45), rgba(165,0,21,0.08))',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        <div className="relative px-5 pt-5 pb-5">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="relative inline-flex size-2 rounded-full"
              style={{
                background: isSafe ? '#059669' : '#E50914',
                boxShadow: isSafe ? '0 0 0 4px rgba(5,150,105,0.18)' : '0 0 0 4px rgba(229,9,20,0.18)',
              }}
            />
            <p
              className="text-[10px] font-extrabold uppercase"
              style={{
                letterSpacing: '0.22em',
                color: isSafe ? '#047857' : '#A50015',
              }}
            >
              {isSafe ? 'Реалистична цел' : gaining ? 'Прекалено бърза цел' : 'Прекалено бързо темпо'}
            </p>
          </div>

          {/* Hero number — current pace */}
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className="font-extrabold tabular-nums leading-none"
              style={{
                fontSize: 'clamp(2.625rem, 12vw, 3.5rem)',
                letterSpacing: '-0.045em',
                background: isSafe
                  ? 'linear-gradient(180deg, #047857 0%, #065F46 100%)'
                  : 'linear-gradient(180deg, #E50914 0%, #A50015 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {perWeek.toFixed(2).replace('.', ',')}
            </span>
            <span
              className="font-bold text-[var(--color-text-strong)] leading-tight"
              style={{ fontSize: 'clamp(0.8125rem, 3.4vw, 0.9375rem)', letterSpacing: '-0.01em' }}
            >
              кг<br />на седмица
            </span>
          </div>

          {/* Stat strip */}
          <div className="mt-4 grid grid-cols-2 gap-0 rounded-2xl bg-white/70 border border-black/5 backdrop-blur-[2px] divide-x divide-black/5">
            <Stat label={losing ? 'Сваляш общо' : 'Качваш общо'} value={`${totalKg.toFixed(0)} кг`} />
            <Stat label="За" value={`${Math.round(weeks)} седм.`} />
          </div>

          {!isSafe && (
            <div
              className="mt-4 rounded-2xl px-4 py-3.5 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,243,236,0.85) 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(165,0,21,0.12)',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-1 rounded-full"
                  style={{ background: '#A50015' }}
                />
                <p
                  className="text-[10px] font-extrabold uppercase"
                  style={{ letterSpacing: '0.22em', color: '#A50015' }}
                >
                  Препоръчваме
                </p>
              </div>
              <p
                className="mt-1.5 font-extrabold leading-tight text-[var(--color-text-headline)]"
                style={{ fontSize: 'clamp(0.9375rem, 4vw, 1.0625rem)', letterSpacing: '-0.018em' }}
              >
                <span className="tabular-nums">{safeWeeks} седмици</span>{' '}
                <span className="text-[var(--color-text-muted)] font-semibold">
                  ({Math.round(safeDays / 30)} мес.)
                </span>
              </p>
              <p className="mt-1 text-[12.5px] text-[var(--color-text-body)]">
                Здравословно темпо около{' '}
                <span className="font-bold tabular-nums text-[var(--color-text-strong)]">
                  {losing ? '1' : '0,5'} кг/седм.
                </span>
              </p>
            </div>
          )}

          {isSafe && (
            <p className="mt-3 text-[13px] text-[var(--color-text-body)] leading-snug">
              В безопасния диапазон. Темпото е устойчиво и реалистично.
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-3">
      <p
        className="text-[9.5px] font-bold uppercase text-[var(--color-text-muted)]"
        style={{ letterSpacing: '0.18em' }}
      >
        {label}
      </p>
      <p
        className="mt-0.5 text-[20px] font-extrabold tabular-nums text-[var(--color-text-headline)] leading-tight"
        style={{ letterSpacing: '-0.025em' }}
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
