import { AVATARS, type AvatarId } from '@/lib/avatars';
import { buildCheckoutUrl } from '@/lib/checkout';
import { PlanFlow } from '@/components/plan/PlanFlow';
import type { PricingPlan } from '@/components/plan/PricingPlans';

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function isAvatar(s: string | undefined): s is AvatarId {
  return !!s && ['01', '02', '03', '04', '05'].includes(s);
}

const MOTIVATION_LABELS: Record<string, string> = {
  health: 'За здраве',
  partner: 'За половинката си',
  photos: 'Уверен/-а на снимки',
  kids: 'За децата',
  event: 'Конкретно събитие',
  prove: 'Стига вече',
};

const PLANS: PricingPlan[] = [
  {
    id: 'monthly',
    label: '1 месец',
    durationLabel: 'Старт',
    oldPrice: 39.99,
    price: 19.99,
    perDay: 0.67,
  },
  {
    id: 'quarterly',
    label: '3 месеца',
    durationLabel: 'Целият 90-дневен план',
    oldPrice: 99.0,
    price: 49.0,
    perDay: 0.54,
    recommended: true,
  },
  {
    id: 'yearly',
    label: '12 месеца',
    durationLabel: 'Най-изгодно',
    oldPrice: 199.0,
    price: 99.0,
    perDay: 0.27,
  },
];

export default async function PlanPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const avatarId: AvatarId = isAvatar(sp.avatar) ? sp.avatar : '01';
  const avatar = AVATARS[avatarId];
  const checkoutUrl = buildCheckoutUrl(avatarId);

  const heightCm = Number(sp.h) || 0;
  const currentKg = Number(sp.w) || 0;
  const targetKg = Number(sp.tw) || 0;
  const heightM = heightCm / 100;
  const bmi = heightM > 0 && currentKg > 0 ? currentKg / (heightM * heightM) : undefined;
  const targetDateLabel = sp.td;

  const motivationCodes = sp.mot ? sp.mot.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const goalLabels = motivationCodes
    .map((code) => MOTIVATION_LABELS[code])
    .filter((v): v is string => Boolean(v));

  const name = sp.name?.trim();
  const greeting = name ? `${name}, отстъпката ти е готова` : 'Отстъпката ти е готова';

  return (
    <main>
      <PlanFlow
        greeting={greeting}
        currentState={{ heightCm, currentKg, targetKg, bmi, targetDateLabel }}
        goalLabels={goalLabels}
        plans={PLANS}
        checkoutBaseUrl={checkoutUrl}
      />
      {/* avatar context kept available for downstream personalization */}
      <span className="hidden" aria-hidden data-avatar={avatar.id} />
    </main>
  );
}
