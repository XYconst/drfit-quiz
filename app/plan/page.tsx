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

const DEFAULT_CHARACTER_BY_AVATAR: Record<AvatarId, string> = {
  '01': 'm2',
  '02': 'f2',
  '03': 'm2',
  '04': 'f2',
  '05': 'm1',
};

const DEFAULT_BODYTYPE_BY_AVATAR: Record<AvatarId, string> = {
  '01': 'overweight',
  '02': 'overweight',
  '03': 'skinny-fat',
  '04': 'skinny-fat',
  '05': 'underweight',
};

const VALID_CHARS = new Set(['m1', 'm2', 'm3', 'm4', 'f1', 'f2', 'f3', 'f4']);
const VALID_BODYTYPES = new Set(['overweight', 'skinny-fat', 'underweight', 'perfect']);

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
  const goalDays = Math.max(7, Number(sp.days) || 90);

  const motivationCodes = sp.mot ? sp.mot.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const goalLabels = motivationCodes
    .map((code) => MOTIVATION_LABELS[code])
    .filter((v): v is string => Boolean(v));

  const character = sp.char && VALID_CHARS.has(sp.char) ? sp.char : DEFAULT_CHARACTER_BY_AVATAR[avatarId];
  const currentBodyType =
    sp.bt && VALID_BODYTYPES.has(sp.bt) ? sp.bt : DEFAULT_BODYTYPE_BY_AVATAR[avatarId];

  const name = sp.name?.trim();
  const greeting = name ? `${name}, отстъпката ти е готова` : 'Отстъпката ти е готова';

  // Personal redemption code: derive from the email's local part (the most
  // unique handle we have for this user). Fallback to name, then avatar id.
  const email = sp.email?.trim();
  const fromEmail = email
    ? email.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10)
    : '';
  const fromName = name
    ? name
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-zA-Zа-яА-Я0-9]/g, '')
        .toUpperCase()
        .slice(0, 8)
    : '';
  const slug = fromEmail || fromName || `AV${avatarId}`;
  const discountCode = `DRFIT-${slug}-50`;

  return (
    <main>
      <PlanFlow
        greeting={greeting}
        currentState={{ heightCm, currentKg, targetKg, bmi, targetDateLabel }}
        goalLabels={goalLabels}
        plans={PLANS}
        checkoutBaseUrl={checkoutUrl}
        discountCode={discountCode}
        initialDiscountPercent="30%"
        bumpedDiscountPercent="50%"
        character={character}
        currentBodyType={currentBodyType}
        goalDays={goalDays}
      />
      <span className="hidden" aria-hidden data-avatar={avatar.id} />
    </main>
  );
}
