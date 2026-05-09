'use client';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Gender } from '@/lib/avatars';
import { PricingPlans, type PricingPlan } from './PricingPlans';
import { PaymentMethods } from './PaymentMethods';
import { CurrentToTarget } from './CurrentToTarget';
import { MotivationVisuals } from './MotivationVisuals';
import { PreCheckoutModal } from './PreCheckoutModal';
import { ScrubReveal } from './ScrubReveal';
import { LockIcon } from '@/components/icons';

interface CurrentState {
  heightCm: number;
  currentKg: number;
  targetKg: number;
  bmi?: number;
  targetDateLabel?: string;
}

interface Props {
  greeting: string;
  currentState: CurrentState;
  /** Motivation codes the user picked in the quiz (e.g. ['kids','photos']). */
  motivationCodes: string[];
  /** Gender — picks which gender-aware motivation visual to render. */
  gender: Gender;
  plans: PricingPlan[];
  defaultPlanId?: string;
  checkoutBaseUrl: string;
  /** Personal redemption code — kept in props for back-compat / analytics. */
  discountCode: string;
  /** Initial discount percentage label revealed on CTA click (e.g. "30%"). */
  initialDiscountPercent: string;
  /** Bumped percentage offered when the user closes the initial modal (e.g. "50%"). */
  bumpedDiscountPercent: string;
  /** Character code (m1-m4 / f1-f4) used for the current/target body visuals. */
  character: string;
  /** Body-type the user picked in the quiz (for the "current" visual). */
  currentBodyType: string;
  /** Total days to goal — drives the realism verdict. */
  goalDays: number;
}

type ModalStage = 'none' | 'initial' | 'bumped';

export function PlanFlow({
  greeting,
  currentState,
  motivationCodes,
  gender,
  plans,
  defaultPlanId,
  checkoutBaseUrl,
  discountCode,
  initialDiscountPercent,
  bumpedDiscountPercent,
  character,
  currentBodyType,
  goalDays,
}: Props) {
  const [selectedId, setSelectedId] = useState<string>(
    defaultPlanId ?? plans.find((p) => p.recommended)?.id ?? plans[0].id,
  );
  const [stage, setStage] = useState<ModalStage>('none');
  const [bumpSeen, setBumpSeen] = useState(false);
  const [sliderClaimed, setSliderClaimed] = useState(false);

  const selected = useMemo(() => plans.find((p) => p.id === selectedId) ?? plans[0], [plans, selectedId]);

  const fmtEur = (n: number) => `${n.toFixed(2).replace('.', ',')} EUR`;
  const fmtPerDay = (n: number) => `${n.toFixed(2).replace('.', ',')} EUR/ден`;

  // Page price = "30% off" tier. Bumped = "50% off" — apply the ratio (5/7) so
  // the second offer is a real, visible drop from the first.
  const bumpRatio = 0.5 / 0.7;
  const initialPrice = selected.price;
  const initialPerDay = selected.perDay;
  const bumpedPrice = selected.price * bumpRatio;
  const bumpedPerDay = selected.perDay * bumpRatio;

  const buildCheckoutHref = (disc: '30' | '50') => {
    const sep = checkoutBaseUrl.includes('?') ? '&' : '?';
    return `${checkoutBaseUrl}${sep}plan=${selected.id}&disc=${disc}`;
  };

  const onCta = () => setStage('initial');

  const onCloseInitial = () => {
    if (bumpSeen) {
      setStage('none');
      return;
    }
    setBumpSeen(true);
    setStage('bumped');
  };

  const onAcceptInitial = () => {
    window.location.href = buildCheckoutHref('30');
  };
  const onAcceptBumped = () => {
    window.location.href = buildCheckoutHref('50');
  };

  const onSliderClose = () => {
    if (bumpSeen) return;
    setBumpSeen(true);
    setStage('bumped');
  };

  return (
    <div className="max-w-md mx-auto px-5 pt-6 pb-32">
      {/* Stage 1 — focus on the discount: scratch card centered in viewport */}
      {!sliderClaimed && (
        <div className="min-h-[80vh] flex flex-col justify-center">
          <ScrubReveal
            greeting={greeting}
            percent={initialDiscountPercent}
            code={discountCode}
            initialSeconds={9 * 60 + 42}
            onClaim={() => setSliderClaimed(true)}
            onClose={onSliderClose}
          />
          <p className="mt-6 text-center text-[12px] text-[var(--color-text-muted)] max-w-[34ch] mx-auto">
            Изтрий покритието с пръст или мишка. След това ще видиш плана си с
            всички детайли.
          </p>
        </div>
      )}

      {/* Stage 2 — full plan reveals after the code is unlocked */}
      <AnimatePresence>
        {sliderClaimed && (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <FullPlanContent
              greeting={greeting}
              currentState={currentState}
              motivationCodes={motivationCodes}
              gender={gender}
              plans={plans}
              selected={selected}
              onSelect={setSelectedId}
              onCta={onCta}
              character={character}
              currentBodyType={currentBodyType}
              goalDays={goalDays}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <PreCheckoutModal
        open={stage === 'initial'}
        eyebrow="Лична оферта"
        percent={`-${initialDiscountPercent}`}
        headline="активирай отстъпката си"
        body="Запази персонализираната си цена за следващите 10 минути."
        fromPrice={fmtEur(selected.oldPrice)}
        toPrice={fmtEur(initialPrice)}
        perDay={fmtPerDay(initialPerDay)}
        acceptLabel="Активирай и плати"
        onAccept={onAcceptInitial}
        onClose={onCloseInitial}
      />

      <PreCheckoutModal
        open={stage === 'bumped'}
        eyebrow="Изчакай малко"
        percent={`-${bumpedDiscountPercent}`}
        headline="последна оферта за теб"
        body="Сваляме още 20%. Това е най-добрата цена, която ще видиш."
        fromPrice={fmtEur(selected.oldPrice)}
        toPrice={fmtEur(bumpedPrice)}
        perDay={fmtPerDay(bumpedPerDay)}
        acceptLabel="Заключи отстъпката"
        onAccept={onAcceptBumped}
        onClose={() => setStage('none')}
      />
    </div>
  );
}

interface FullProps {
  greeting: string;
  currentState: CurrentState;
  motivationCodes: string[];
  gender: Gender;
  plans: PricingPlan[];
  selected: PricingPlan;
  onSelect: (id: string) => void;
  onCta: () => void;
  character: string;
  currentBodyType: string;
  goalDays: number;
}

function FullPlanContent({
  greeting,
  currentState,
  motivationCodes,
  gender,
  plans,
  selected,
  onSelect,
  onCta,
  character,
  currentBodyType,
  goalDays,
}: FullProps) {
  const { heightCm, currentKg, targetKg, bmi, targetDateLabel } = currentState;
  const fmt = (n: number) => n.toFixed(2).replace('.', ',');
  return (
    <div className="flex flex-col gap-7">
      {/* Hero */}
      <header>
        <span
          className="block text-[11px] font-extrabold uppercase text-[var(--color-brand-red)]"
          style={{ letterSpacing: '0.22em' }}
        >
          {greeting}
        </span>
        <h1
          className="mt-2 font-extrabold text-[var(--color-text-headline)]"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1.75rem, 7vw, 2.375rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            textWrap: 'balance',
          }}
        >
          Твоят 90-дневен план е готов
        </h1>
      </header>

      {/* Current state card — height/weight/BMI */}
      <section
        className="relative rounded-[22px] overflow-hidden p-5"
        style={{
          background:
            'linear-gradient(160deg, #FFFFFF 0%, #FBFAF7 60%, #F8F4EE 100%)',
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.6) inset, 0 18px 36px -28px rgba(25,33,38,0.25)',
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[22px]"
          style={{
            padding: 1,
            background:
              'linear-gradient(135deg, rgba(25,33,38,0.12), rgba(25,33,38,0.02))',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span
              aria-hidden
              className="size-1 rounded-full bg-[var(--color-brand-red)]"
            />
            <p
              className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)]"
              style={{ letterSpacing: '0.22em' }}
            >
              Къде си сега
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <BigStat label="Височина" value={heightCm ? `${heightCm}` : '··'} suffix="см" />
            <BigStat label="Тегло" value={currentKg ? `${currentKg}` : '··'} suffix="кг" />
            <BigStat label="BMI" value={bmi ? bmi.toFixed(1) : '··'} suffix="" gradient />
          </div>
          <div className="mt-5 pt-4 border-t border-black/5 grid grid-cols-2 gap-2">
            <SmallStat label="Цел" value={targetKg ? `${targetKg}` : '··'} suffix="кг" />
            <SmallStat label="Срок" value={targetDateLabel || '90 дни'} suffix="" />
          </div>

          <BmiExplainer bmi={bmi} />
        </div>
      </section>

      {/* Current → Target visual + realism check */}
      {currentKg > 0 && targetKg > 0 && (
        <CurrentToTarget
          character={character}
          currentBodyType={currentBodyType}
          heightCm={heightCm}
          currentKg={currentKg}
          targetKg={targetKg}
          days={goalDays}
        />
      )}

      {/* Motivation visuals — replaces the previous chip list */}
      {motivationCodes.length > 0 && (
        <MotivationVisuals codes={motivationCodes} gender={gender} />
      )}

      {/* Pricing plans */}
      <section>
        <p
          className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)] mb-4"
          style={{ letterSpacing: '0.22em' }}
        >
          Избери план
        </p>
        <PricingPlans plans={plans} defaultId={selected.id} onChange={onSelect} />
      </section>

      {/* Selected plan summary + CTA */}
      <section className="rounded-2xl bg-[var(--color-paper-warm)] border border-[var(--color-line)] p-5">
        <div className="flex items-baseline justify-between gap-3">
          <span
            className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)]"
            style={{ letterSpacing: '0.22em' }}
          >
            Цена на ден
          </span>
          <span className="text-[12px] text-[var(--color-text-muted)] line-through tabular-nums">
            {fmt(selected.oldPrice)} EUR общо
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span
            className="text-[52px] font-extrabold tabular-nums text-[var(--color-brand-red)]"
            style={{ letterSpacing: '-0.03em', lineHeight: 1 }}
          >
            {fmt(selected.perDay)}
          </span>
          <span className="text-[15px] font-bold text-[var(--color-text-strong)]">EUR/ден</span>
        </div>
        <p className="mt-2 text-[13px] text-[var(--color-text-muted)] tabular-nums">
          Общо <span className="font-bold text-[var(--color-text-strong)]">{fmt(selected.price)} EUR</span> за {selected.label.toLowerCase()}
        </p>

        <button
          type="button"
          onClick={onCta}
          className={[
            'mt-5 w-full h-14 rounded-full font-extrabold text-white bg-brand-gradient shadow-brand-red',
            'flex items-center justify-center gap-2',
            'motion-safe:transition-[transform,box-shadow] motion-safe:duration-200',
            'motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[0_18px_32px_-12px_rgba(165,0,21,0.55)]',
            'motion-safe:active:scale-[0.98]',
          ].join(' ')}
        >
          Вземи плана сега
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-[var(--color-text-muted)]">
          <LockIcon width={12} height={12} aria-hidden />
          Сигурно плащане през Stripe
        </p>
        <PaymentMethods className="mt-3" />
      </section>

      {/* Disclaimer + privacy */}
      <p className="text-center text-[11px] leading-relaxed text-[var(--color-text-muted)] max-w-[40ch] mx-auto">
        Натискайки бутона, потвърждаваш, че си съгласен/-на с{' '}
        <a href="/terms" className="underline hover:text-[var(--color-text-body)]">Общите условия</a>,{' '}
        <a href="/refund" className="underline hover:text-[var(--color-text-body)]">Политиката за връщане</a>{' '}
        и{' '}
        <a href="/privacy" className="underline hover:text-[var(--color-text-body)]">Политиката за поверителност</a>.
        Без скрити такси и без автоматично подновяване.
      </p>

      <footer className="mt-2 pt-6 border-t border-[var(--color-line)] text-[11px] text-[var(--color-text-muted)] flex flex-col items-center gap-3">
        <span style={{ fontFamily: 'var(--font-mono)' }}>© 2026 Thunder Digital</span>
        <span className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
          <a href="/terms" className="hover:text-[var(--color-text-body)] transition-colors">Общи условия</a>
          <a href="/privacy" className="hover:text-[var(--color-text-body)] transition-colors">Поверителност</a>
          <a href="/refund" className="hover:text-[var(--color-text-body)] transition-colors">Връщане на сумата</a>
          <a href="/impressum" className="hover:text-[var(--color-text-body)] transition-colors">Impressum</a>
        </span>
      </footer>
    </div>
  );
}

function BmiExplainer({ bmi }: { bmi?: number }) {
  const cat = bmi
    ? bmi < 18.5
      ? { label: 'поднормено тегло', color: '#2563EB' }
      : bmi < 25
        ? { label: 'здравословно тегло', color: '#047857' }
        : bmi < 30
          ? { label: 'наднормено тегло', color: '#B45309' }
          : { label: 'затлъстяване', color: '#A50015' }
    : null;

  // Map BMI 15..35 to 0..100% so the marker has a sensible scale.
  const BMI_MIN = 15;
  const BMI_MAX = 35;
  const markerPct = bmi
    ? Math.min(100, Math.max(0, ((bmi - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100))
    : null;

  // Segment widths in % of the [15..35] scale: 18.5/25/30 → 17.5/32.5/25/25
  const segments = [
    { color: '#2563EB', width: ((18.5 - 15) / 20) * 100 }, // под 18.5
    { color: '#047857', width: ((25 - 18.5) / 20) * 100 },
    { color: '#B45309', width: ((30 - 25) / 20) * 100 },
    { color: '#A50015', width: ((35 - 30) / 20) * 100 },
  ];

  return (
    <div className="mt-4 pt-4 border-t border-black/5">
      <div className="flex items-center gap-2 mb-2">
        <span aria-hidden className="size-1 rounded-full" style={{ background: cat?.color ?? 'var(--color-text-muted)' }} />
        <p
          className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)]"
          style={{ letterSpacing: '0.22em' }}
        >
          Какво е BMI
        </p>
      </div>
      <p className="text-[12.5px] text-[var(--color-text-body)] leading-snug">
        Индекс на телесната маса — показва дали теглото ти е здравословно за височината ти.
        {cat && (
          <>
            {' '}
            Твоят е{' '}
            <span className="font-extrabold tabular-nums" style={{ color: cat.color }}>
              {bmi!.toFixed(1)}
            </span>{' '}
            <span className="font-bold" style={{ color: cat.color }}>({cat.label})</span>.
          </>
        )}
      </p>

      {/* Segmented scale with marker */}
      {markerPct !== null && (
        <div className="mt-3">
          <div className="relative">
            <div className="flex h-2 rounded-full overflow-hidden">
              {segments.map((s, i) => (
                <span key={i} style={{ width: `${s.width}%`, background: s.color, opacity: 0.85 }} />
              ))}
            </div>
            {/* Marker */}
            <span
              aria-hidden
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-3.5 rounded-full bg-white"
              style={{
                left: `${markerPct}%`,
                boxShadow: `0 0 0 3px ${cat?.color ?? '#1F2937'}, 0 2px 8px rgba(0,0,0,0.18)`,
              }}
            />
          </div>
          <div className="relative mt-2 h-4 text-[10px] font-bold tabular-nums text-[var(--color-text-muted)]">
            {[
              { v: '15', pct: 0, anchor: 'left' as const },
              { v: '18,5', pct: 17.5, anchor: 'center' as const },
              { v: '25', pct: 50, anchor: 'center' as const },
              { v: '30', pct: 75, anchor: 'center' as const },
              { v: '35', pct: 100, anchor: 'right' as const },
            ].map((t) => (
              <span
                key={t.v}
                className="absolute top-0"
                style={{
                  left: t.anchor === 'right' ? undefined : `${t.pct}%`,
                  right: t.anchor === 'right' ? '0' : undefined,
                  transform: t.anchor === 'center' ? 'translateX(-50%)' : undefined,
                }}
              >
                {t.v}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BigStat({
  label,
  value,
  suffix,
  gradient = false,
}: {
  label: string;
  value: string;
  suffix: string;
  gradient?: boolean;
}) {
  return (
    <div className="text-center">
      <p
        className="text-[9.5px] uppercase font-bold text-[var(--color-text-muted)]"
        style={{ letterSpacing: '0.2em' }}
      >
        {label}
      </p>
      <p
        className="mt-1 font-extrabold tabular-nums leading-none"
        style={{
          fontSize: 'clamp(1.875rem, 8vw, 2.375rem)',
          letterSpacing: '-0.04em',
          ...(gradient
            ? {
                background: 'linear-gradient(180deg, #E50914 0%, #A50015 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }
            : { color: 'var(--color-text-headline)' }),
        }}
      >
        {value}
      </p>
      {suffix && (
        <p
          className="mt-1 text-[10.5px] font-bold uppercase text-[var(--color-text-muted)]"
          style={{ letterSpacing: '0.16em' }}
        >
          {suffix}
        </p>
      )}
    </div>
  );
}

function SmallStat({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="text-center">
      <p
        className="text-[9.5px] uppercase font-bold text-[var(--color-text-muted)]"
        style={{ letterSpacing: '0.2em' }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-[20px] font-extrabold tabular-nums text-[var(--color-text-headline)] leading-tight"
        style={{ letterSpacing: '-0.025em' }}
      >
        {value}
        {suffix && (
          <span className="text-[12px] font-semibold text-[var(--color-text-muted)] ml-1">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}
