// Meta Pixel + GA4 helpers. Pixel ID lives in app/layout.tsx (base script).
// Use these helpers from client components to fire standard + custom events.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export const META_PIXEL_ID = '1054275422812594';
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? '';

export function trackPageView() {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', 'PageView');
}

export function trackQuizStep(step: number, avatar?: string) {
  if (typeof window === 'undefined') return;
  window.fbq?.('trackCustom', 'QuizStep', { step, avatar });
  window.gtag?.('event', 'quiz_step', { step, avatar });
}

export function trackLead(email: string, avatar: string) {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', 'Lead', { content_name: `quiz-${avatar}`, value: 0, currency: 'EUR' });
  window.gtag?.('event', 'generate_lead', { method: 'quiz', avatar });
}

export function trackInitiateCheckout(avatar: string) {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', 'InitiateCheckout', { content_name: `plan-${avatar}`, value: 49, currency: 'EUR' });
  window.gtag?.('event', 'begin_checkout', { value: 49, currency: 'EUR', avatar });
}
