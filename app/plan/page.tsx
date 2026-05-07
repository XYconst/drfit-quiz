import { AVATARS, type AvatarId } from '@/lib/avatars';
import { buildCheckoutUrl } from '@/lib/checkout';
import { parsePersonalizeParams, personalizedSection01Bullets } from '@/lib/personalize';
import { StickyCountdown } from '@/components/plan/StickyCountdown';
import { NumberedSection } from '@/components/plan/NumberedSection';
import { ComparisonBlock } from '@/components/plan/ComparisonBlock';
import { GuaranteeBlock } from '@/components/plan/GuaranteeBlock';
import { CtaButton } from '@/components/plan/CtaButton';
import { BmiProjection } from '@/components/plan/BmiProjection';
import { TestimonialsBlock } from '@/components/plan/TestimonialsBlock';
import { CheckIcon, LockIcon } from '@/components/icons';

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function isAvatar(s: string | undefined): s is AvatarId {
  return !!s && ['01', '02', '03', '04', '05'].includes(s);
}

export default async function PlanPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const avatarId: AvatarId = isAvatar(sp.avatar) ? sp.avatar : '01';
  const kg = sp.kg ? Number(sp.kg) : undefined;
  const avatar = AVATARS[avatarId];
  const checkoutUrl = buildCheckoutUrl(avatarId);
  const personalize = parsePersonalizeParams(sp);
  const section01 = personalizedSection01Bullets(personalize);
  const heightCm = Number(sp.h) || 0;
  const currentKg = Number(sp.w) || 0;
  const targetKg = Number(sp.tw) || 0;
  const targetDate = sp.td;
  const showProjection = heightCm > 0 && currentKg > 0 && targetKg > 0;
  const blockers = sp.blockers ? sp.blockers.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const pastAttempts = sp.past ? sp.past.split(',').map((s) => s.trim()).filter(Boolean) : [];

  return (
    <>
      <StickyCountdown initialSeconds={9 * 60 + 42} />

      <main className="max-w-md mx-auto px-5 pt-14 pb-32">
        {/* Hero */}
        <section className="py-6">
          <span className="eyebrow">Твоят план</span>
          <h1
            className="mt-3 text-3xl leading-[1.05] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            {avatar.resultHeadlineBg(kg)}
          </h1>
          <p className="mt-3 text-base text-[var(--color-text-body)]">{avatar.resultSubBg}</p>

          {showProjection ? (
            <div className="mt-6">
              <BmiProjection
                heightCm={heightCm}
                currentKg={currentKg}
                targetKg={targetKg}
                targetDate={targetDate}
                avatar={avatarId}
              />
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-white border border-[var(--color-line)] p-5">
              <p className="text-sm text-[var(--color-text-muted)]">Прогноза за теб</p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-headline)]">
                {kg ? `${kg} кг за 90 дни` : '90-дневна трансформация'}
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">*Индивидуални резултати според следване на плана</p>
            </div>
          )}
        </section>

        <NumberedSection number="01" title="Защо стандартните програми не работят за теб">
          <ul className="space-y-3 text-[var(--color-text-body)]">
            {section01.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[var(--color-brand-red)] font-bold leading-none mt-1.5">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </NumberedSection>

        <NumberedSection number="02" title="Какво включва твоят 90-дневен план">
          <ul className="space-y-3">
            {[
              'Индивидуален хранителен план',
              'Персонализирана тренировъчна програма',
              'Неограничен чат с треньор (бонус за първите 10 днес)',
              'Достъп до app.dr-fit.co',
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <CheckIcon width={16} height={16} className="text-[var(--color-success-600)] mt-1 shrink-0" />
                <span className="text-[var(--color-text-strong)]">{t}</span>
              </li>
            ))}
          </ul>
        </NumberedSection>

        <NumberedSection number="03" title="Без план срещу С Dr.Fit план">
          <ComparisonBlock blockers={blockers} pastAttempts={pastAttempts} />
        </NumberedSection>

        <NumberedSection number="04" title="Гаранция: плащаш 0 EUR">
          <GuaranteeBlock />
        </NumberedSection>

        <NumberedSection number="05" title="Истории като твоята">
          <TestimonialsBlock avatar={avatarId} />
        </NumberedSection>

        <div className="mt-8">
          <CtaButton href={checkoutUrl} avatar={avatarId}>
            Започни моите 90 дни
          </CtaButton>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <LockIcon width={12} height={12} aria-hidden />
            <span>Сигурно плащане през Stripe, без auto-renewal</span>
          </p>
        </div>

        <footer className="mt-16 pt-6 border-t border-[var(--color-line)] text-xs text-[var(--color-text-muted)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span style={{ fontFamily: 'var(--font-mono)' }}>© 2026 Thunder Digital</span>
          <span className="flex gap-4">
            <a href="/privacy" className="hover:text-[var(--color-text-body)] transition-colors">Privacy</a>
            <a href="/impressum" className="hover:text-[var(--color-text-body)] transition-colors">Impressum</a>
          </span>
        </footer>
      </main>
    </>
  );
}
