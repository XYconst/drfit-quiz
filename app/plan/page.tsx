import { AVATARS, type AvatarId, type Gender } from '@/lib/avatars';
import { buildCheckoutUrl } from '@/lib/checkout';
import { PlanFlow } from '@/components/plan/PlanFlow';
import type { PricingPlan } from '@/components/plan/PricingPlans';

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function isAvatar(s: string | undefined): s is AvatarId {
  return !!s && ['01', '02', '03', '04', '05'].includes(s);
}

const GENDER_BY_AVATAR: Record<AvatarId, Gender> = {
  '01': 'male',
  '02': 'female',
  '03': 'male',
  '04': 'female',
  '05': 'male',
};

// Promo prices shown when the default 30% discount is active. The 50% bump
// applies a deeper multiplier on top of these (PlanFlow handles it).
const PLANS: PricingPlan[] = [
  {
    id: 'month',
    label: '4 седмици',
    durationLabel: 'Стандартен месец',
    oldPrice: 39.99,
    price: 19.99,
    perDay: 0.71,
    days: 28,
    tagLabel: 'Най-често избиран',
    tone: 'slate',
  },
  {
    id: 'quarter',
    label: '3 месеца',
    durationLabel: 'Целият 90-дневен план',
    oldPrice: 99.0,
    price: 49.0,
    perDay: 0.54,
    days: 90,
    recommended: true,
    tagLabel: 'Най-изгоден',
    tone: 'red',
  },
  {
    id: 'week',
    label: '1 седмица',
    durationLabel: 'Тест',
    oldPrice: 13.99,
    price: 6.93,
    perDay: 0.99,
    days: 7,
    tagLabel: 'Най-евтин',
    tone: 'emerald',
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
  const gender = GENDER_BY_AVATAR[avatarId];

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
  // Validity stamp: MMM YY (e.g. "MAY26"). Anchors the code in time so it
  // feels personal-and-expiring without quoting a discount percentage.
  const MONTHS_EN = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const now = new Date();
  const validity = `${MONTHS_EN[now.getMonth()]}${String(now.getFullYear()).slice(-2)}`;
  const discountCode = `DRFIT-${slug}-${validity}`;

  return (
    <main>
      <PlanFlow
        greeting={greeting}
        currentState={{ heightCm, currentKg, targetKg, bmi, targetDateLabel }}
        motivationCodes={motivationCodes}
        gender={gender}
        plans={PLANS}
        checkoutBaseUrl={checkoutUrl}
        discountCode={discountCode}
        initialDiscountPercent="30%"
        bumpedDiscountPercent="50%"
        character={character}
        currentBodyType={currentBodyType}
        goalDays={goalDays}
        avatarId={avatarId}
        kgDelta={currentKg - targetKg}
      />
      <span className="hidden" aria-hidden data-avatar={avatar.id} />
    </main>
  );
}
