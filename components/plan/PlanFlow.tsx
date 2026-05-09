'use client';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrubReveal } from './ScrubReveal';
import { PlanLoading } from './PlanLoading';
import { PricingPlans, type PricingPlan } from './PricingPlans';
import { PaymentMethods } from './PaymentMethods';
import { EscalationModal } from './EscalationModal';
import { CurrentToTarget } from './CurrentToTarget';
import { ActiveDiscountStrip } from './ActiveDiscountStrip';
import { CheckIcon, LockIcon } from '@/components/icons';

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
  goalLabels: string[];
  plans: PricingPlan[];
  defaultPlanId?: string;
  checkoutBaseUrl: string;
  /** Personal redemption code shown on the scrub-to-reveal banner. */
  discountCode: string;
  /** Initial discount percentage label (e.g. "30%"). */
  initialDiscountPercent: string;
  /** Bumped percentage offered when the user closes the banner (e.g. "50%"). */
  bumpedDiscountPercent: string;
  /** Character code (m1-m4 / f1-f4) used for the current/target body visuals. */
  character: string;
  /** Body-type the user picked in the quiz (for the "current" visual). */
  currentBodyType: string;
  /** Total days to goal — drives the realism verdict. */
  goalDays: number;
}

export function PlanFlow({
  greeting,
  currentState,
  goalLabels,
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
  const [phase, setPhase] = useState<'swipe' | 'loading' | 'full'>('swipe');
  const [discountPercent, setDiscountPercent] = useState<string>(initialDiscountPercent);
  const [escalationOpen, setEscalationOpen] = useState(false);
  const [escalationDone, setEscalationDone] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(
    defaultPlanId ?? plans.find((p) => p.recommended)?.id ?? plans[0].id,
  );

  const selected = useMemo(() => plans.find((p) => p.id === selectedId) ?? plans[0], [plans, selectedId]);

  const checkoutHref = `${checkoutBaseUrl}${checkoutBaseUrl.includes('?') ? '&' : '?'}plan=${selected.id}`;

  const handleClose = () => {
    if (escalationDone) {
      // User already saw the bump; let them dismiss the banner straight to the full plan.
      setPhase('loading');
    } else {
      setEscalationOpen(true);
    }
  };
  const acceptBump = () => {
    setDiscountPercent(bumpedDiscountPercent);
    setEscalationDone(true);
    setEscalationOpen(false);
  };
  const declineBump = () => {
    setEscalationDone(true);
    setEscalationOpen(false);
    setPhase('loading');
  };

  return (
    <div className="max-w-md mx-auto px-5 pt-6 pb-32">
      <AnimatePresence mode="wait">
        {phase === 'swipe' && (
          <motion.div
            key="swipe"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            <ScrubReveal
              greeting={greeting}
              percent={discountPercent}
              code={discountCode}
              initialSeconds={9 * 60 + 42}
              onClaim={() => setPhase('loading')}
              onClose={handleClose}
            />
            <p className="mt-6 text-center text-[13px] text-[var(--color-text-muted)] max-w-[36ch] mx-auto">
              Отстъпката е резервирана за теб въз основа на отговорите ти. Плъзни, за да я отключиш и да видиш плана си.
            </p>
          </motion.div>
        )}

        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <PlanLoading durationMs={1800} onDone={() => setPhase('full')} />
          </motion.div>
        )}

        {phase === 'full' && (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <FullPlanContent
              greeting={greeting}
              currentState={currentState}
              goalLabels={goalLabels}
              plans={plans}
              selected={selected}
              onSelect={setSelectedId}
              checkoutHref={checkoutHref}
              character={character}
              currentBodyType={currentBodyType}
              goalDays={goalDays}
              discountPercent={discountPercent}
              discountCode={discountCode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <EscalationModal
        open={escalationOpen}
        bumpedPercent={bumpedDiscountPercent}
        onAccept={acceptBump}
        onDecline={declineBump}
      />
    </div>
  );
}

interface FullProps {
  greeting: string;
  currentState: CurrentState;
  goalLabels: string[];
  plans: PricingPlan[];
  selected: PricingPlan;
  onSelect: (id: string) => void;
  checkoutHref: string;
  character: string;
  currentBodyType: string;
  goalDays: number;
  discountPercent: string;
  discountCode: string;
}

function FullPlanContent({
  greeting,
  currentState,
  goalLabels,
  plans,
  selected,
  onSelect,
  checkoutHref,
  character,
  currentBodyType,
  goalDays,
  discountPercent,
  discountCode,
}: FullProps) {
  const { heightCm, currentKg, targetKg, bmi, targetDateLabel } = currentState;
  const fmt = (n: number) => n.toFixed(2).replace('.', ',');
  return (
    <div className="flex flex-col gap-7">
      <ActiveDiscountStrip
        percent={discountPercent}
        code={discountCode}
        initialSeconds={9 * 60 + 42}
      />
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
      <section className="rounded-2xl bg-white border border-[var(--color-line)] p-5">
        <p
          className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)] mb-3"
          style={{ letterSpacing: '0.22em' }}
        >
          Къде си сега
        </p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat label="Височина" value={heightCm ? `${heightCm}` : '··'} suffix="см" />
          <Stat label="Тегло" value={currentKg ? `${currentKg}` : '··'} suffix="кг" />
          <Stat label="BMI" value={bmi ? bmi.toFixed(1) : '··'} suffix="" />
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--color-line)] grid grid-cols-2 gap-3 text-center">
          <Stat label="Цел" value={targetKg ? `${targetKg}` : '··'} suffix="кг" small />
          <Stat label="Срок" value={targetDateLabel || '90 дни'} suffix="" small />
        </div>
      </section>

      {/* Current → Target visual + realism check */}
      {currentKg > 0 && targetKg > 0 && (
        <CurrentToTarget
          character={character}
          currentBodyType={currentBodyType}
          currentKg={currentKg}
          targetKg={targetKg}
          days={goalDays}
        />
      )}

      {/* Goals */}
      {goalLabels.length > 0 && (
        <section className="rounded-2xl bg-white border border-[var(--color-line)] p-5">
          <p
            className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)] mb-3"
            style={{ letterSpacing: '0.22em' }}
          >
            Какво искаш да постигнеш
          </p>
          <ul className="flex flex-wrap gap-2">
            {goalLabels.map((g) => (
              <li
                key={g}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-brand-red)]/30 bg-[var(--color-brand-red-tint)] px-3 py-1 text-[12px] font-semibold text-[var(--color-brand-red)]"
              >
                <CheckIcon width={11} height={11} />
                {g}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Pricing plans */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <p
            className="text-[10px] font-extrabold uppercase text-[var(--color-text-muted)]"
            style={{ letterSpacing: '0.22em' }}
          >
            Избери план
          </p>
          <span className="text-[12px] font-bold text-[var(--color-brand-red)] tabular-nums">−{discountPercent}</span>
        </div>
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

        <a
          href={checkoutHref}
          className={[
            'mt-5 w-full h-14 rounded-full font-extrabold text-white bg-brand-gradient shadow-brand-red',
            'flex items-center justify-center gap-2',
            'motion-safe:transition-[transform,box-shadow] motion-safe:duration-200',
            'motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[0_18px_32px_-12px_rgba(165,0,21,0.55)]',
            'motion-safe:active:scale-[0.98]',
          ].join(' ')}
        >
          Вземи плана сега
        </a>
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

function Stat({ label, value, suffix, small = false }: { label: string; value: string; suffix: string; small?: boolean }) {
  return (
    <div>
      <p
        className="text-[10px] uppercase font-bold text-[var(--color-text-muted)]"
        style={{ letterSpacing: '0.18em' }}
      >
        {label}
      </p>
      <p
        className={`mt-1 ${small ? 'text-[18px]' : 'text-[24px]'} font-extrabold tabular-nums text-[var(--color-text-headline)]`}
        style={{ letterSpacing: '-0.02em' }}
      >
        {value}
        {suffix && <span className="text-[12px] font-semibold text-[var(--color-text-muted)] ml-1">{suffix}</span>}
      </p>
    </div>
  );
}
