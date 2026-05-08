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
import { HeroStagger, HeroItem } from '@/components/plan/HeroReveal';

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
          <HeroStagger>
            <HeroItem as="span" className="eyebrow">Твоят персонализиран план</HeroItem>
            <HeroItem
              as="h1"
              className="mt-3 text-3xl leading-[1.05] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textWrap: 'balance' }}
            >
              {avatar.resultHeadlineBg(kg)}
            </HeroItem>
            <HeroItem
              as="p"
              className="mt-3 text-base text-[var(--color-text-body)]"
              style={{ textWrap: 'pretty' }}
            >
              {avatar.resultSubBg}
            </HeroItem>
          </HeroStagger>

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
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Прогнозата е ориентир, базиран на твоите отговори. Реалните резултати зависят от спазването на плана.
              </p>
            </div>
          )}
        </section>

        <NumberedSection number="01" title="Какво включва твоят 90-дневен план">
          <ul className="space-y-3">
            {[
              { t: 'Индивидуален хранителен план', s: 'Калории и макроси, изчислени за твоя метаболизъм' },
              { t: 'Персонализирана тренировъчна програма', s: 'Адаптирана за оборудването, което имаш' },
              { t: 'Неограничен чат с треньор', s: 'Бонус за първите 10 абонати днес' },
              { t: 'Пълен достъп до приложението', s: 'app.dr-fit.co, всички функции отключени' },
            ].map((row) => (
              <li key={row.t} className="flex items-start gap-3">
                <CheckIcon width={16} height={16} className="text-[var(--color-success-600)] mt-1.5 shrink-0" />
                <span>
                  <span className="block font-semibold text-[var(--color-text-strong)]">{row.t}</span>
                  <span className="block text-sm text-[var(--color-text-muted)]">{row.s}</span>
                </span>
              </li>
            ))}
          </ul>
        </NumberedSection>

        <NumberedSection number="02" title="Защо стандартните програми не работят за теб">
          <ul className="space-y-3 text-[var(--color-text-body)]">
            {section01.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[var(--color-brand-red)] font-bold leading-none mt-1.5">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </NumberedSection>

        <NumberedSection number="03" title="Без план срещу С Dr.Fit план">
          <ComparisonBlock blockers={blockers} pastAttempts={pastAttempts} />
        </NumberedSection>

        <NumberedSection number="04" title="Истории като твоята">
          <TestimonialsBlock avatar={avatarId} />
        </NumberedSection>

        <NumberedSection number="05" title="Гаранция: плащаш 0 EUR накрая">
          <GuaranteeBlock />
        </NumberedSection>

        {/* Pricing block */}
        <section className="mt-12 rounded-2xl bg-[var(--color-paper-warm)] border border-[var(--color-line)] p-6">
          <div className="flex items-baseline justify-between gap-3">
            <span className="eyebrow">Какво плащаш днес</span>
            <span className="text-xs text-[var(--color-text-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
              90 дни
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span
              className="text-5xl font-extrabold text-[var(--color-text-headline)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              49
            </span>
            <span className="text-2xl font-bold text-[var(--color-text-strong)]">EUR</span>
            <span className="text-sm text-[var(--color-text-muted)] line-through">99 EUR</span>
          </div>
          <p className="mt-2 text-sm text-[var(--color-text-body)]">
            Еднократно плащане. Завършваш 90-те дни и качваш отзив, ние ти връщаме всяка стотинка обратно.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-text-body)]">
            <li className="flex items-start gap-2">
              <CheckIcon width={14} height={14} className="text-[var(--color-success-600)] mt-1 shrink-0" />
              <span>Без скрити такси</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon width={14} height={14} className="text-[var(--color-success-600)] mt-1 shrink-0" />
              <span>Без автоматично подновяване</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon width={14} height={14} className="text-[var(--color-success-600)] mt-1 shrink-0" />
              <span>Възстановяване на сумата при завършване на програмата</span>
            </li>
          </ul>
        </section>

        {/* CTA + trust band */}
        <div className="mt-8">
          <CtaButton href={checkoutUrl} avatar={avatarId}>
            Започни моите 90 дни
          </CtaButton>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <LockIcon width={12} height={12} aria-hidden />
            <span>Сигурно плащане през Stripe</span>
          </p>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-[var(--color-text-muted)] max-w-[36ch] mx-auto">
            Натискайки бутона, потвърждаваш че си съгласен/-на с{' '}
            <a href="/terms" className="underline hover:text-[var(--color-text-body)]">Общите условия</a>{' '}
            и{' '}
            <a href="/refund" className="underline hover:text-[var(--color-text-body)]">Политиката за връщане</a>.
            Личните ти данни се обработват според{' '}
            <a href="/privacy" className="underline hover:text-[var(--color-text-body)]">Политиката за поверителност</a>.
          </p>
        </div>

        <footer className="mt-16 pt-6 border-t border-[var(--color-line)] text-xs text-[var(--color-text-muted)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span style={{ fontFamily: 'var(--font-mono)' }}>© 2026 Thunder Digital</span>
          <span className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
            <a href="/terms" className="hover:text-[var(--color-text-body)] transition-colors">Общи условия</a>
            <a href="/privacy" className="hover:text-[var(--color-text-body)] transition-colors">Поверителност</a>
            <a href="/refund" className="hover:text-[var(--color-text-body)] transition-colors">Връщане на сумата</a>
            <a href="/impressum" className="hover:text-[var(--color-text-body)] transition-colors">Impressum</a>
          </span>
        </footer>
      </main>
    </>
  );
}
