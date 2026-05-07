import type { AvatarId } from './avatars';

const STRIPE_PRODUCT_ID = 'prod_SUUVgFxdaBvsl1';
const STRIPE_REGULAR_PRICE_ID = 'price_1Skjf0GDcYd0F03cY92YRDRX';
const CHECKOUT_BASE = 'https://app.dr-fit.co/checkout';

export function buildCheckoutUrl(avatar: AvatarId, lang: 'bg' | 'en' = 'bg'): string {
  const params = new URLSearchParams({
    productId: STRIPE_PRODUCT_ID,
    flow: 'full_price',
    regularPriceId: STRIPE_REGULAR_PRICE_ID,
    lang,
    avatar,
  });
  return `${CHECKOUT_BASE}?${params.toString()}`;
}
