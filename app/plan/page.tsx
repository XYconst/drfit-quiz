import { AVATARS, type AvatarId } from '@/lib/avatars';
import { buildCheckoutUrl } from '@/lib/checkout';
import { StickyCountdown } from '@/components/plan/StickyCountdown';
import { NumberedSection } from '@/components/plan/NumberedSection';
import { ComparisonBlock } from '@/components/plan/ComparisonBlock';
import { GuaranteeBlock } from '@/components/plan/GuaranteeBlock';
import { CtaButton } from '@/components/plan/CtaButton';

interface PageProps {
  searchParams: Promise<{ avatar?: string; kg?: string }>;
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

  return (
    <>
      <StickyCountdown initialSeconds={9 * 60 + 42} />

      <main className="max-w-md mx-auto px-5 pt-14 pb-32">
        {/* Hero */}
        <section className="py-6">
          <span className="eyebrow">Твоят план</span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight">
            {avatar.resultHeadlineBg(kg)}
          </h1>
          <p className="mt-3 text-base text-[var(--color-text-body)]">{avatar.resultSubBg}</p>

          <div className="mt-6 rounded-2xl bg-white border border-[var(--color-line)] p-5">
            <p className="text-sm text-[var(--color-text-muted)]">Прогноза за теб</p>
            <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-headline)]">
              {kg ? `${kg} кг за 90 дни` : '90-дневна трансформация'}
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">*Индивидуални резултати според следване на плана</p>
          </div>
        </section>

        <NumberedSection number="01" title="Защо стандартните програми не работят за теб">
          <ul className="space-y-2 text-[var(--color-text-body)]">
            <li>• Не таргетират корена на проблема — метаболитните хормони</li>
            <li>• Не се адаптират към твоя ритъм, сън и стрес</li>
            <li>• Без подкрепа е лесно да се откажеш на 14-я ден</li>
            <li>• Едно и също решение за всички — без персонализация</li>
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
                <span className="text-[var(--color-success-600)] font-bold">✓</span>
                <span className="text-[var(--color-text-strong)]">{t}</span>
              </li>
            ))}
          </ul>
        </NumberedSection>

        <NumberedSection number="03" title="Без план срещу С Dr.Fit план">
          <ComparisonBlock
            without={[
              'Йо-йо ефект — сваляш и качваш',
              'Налучкваш сам/-а',
              'Без подкрепа',
              'Скъпа фитнес зала',
              'Не виждаш резултати',
            ]}
            withDrFit={[
              'Стабилно сваляне без връщане',
              'Точен план за теб',
              'Чат с треньор всеки ден',
              'От телефона ти',
              'Първи резултати в 30 дни',
            ]}
          />
        </NumberedSection>

        <NumberedSection number="04" title="Гаранция: плащаш 0 EUR">
          <GuaranteeBlock />
        </NumberedSection>

        <div className="mt-8">
          <CtaButton href={checkoutUrl} avatar={avatarId}>
            Започни моите 90 дни →
          </CtaButton>
          <p className="text-center text-xs text-[var(--color-text-muted)] mt-3">
            🔒 Сигурно плащане през Stripe · без auto-renewal
          </p>
        </div>
      </main>
    </>
  );
}
