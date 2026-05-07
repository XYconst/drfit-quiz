'use client';
import { trackInitiateCheckout } from '@/lib/pixel';
import { ArrowRightIcon } from '@/components/icons';

interface Props {
  href: string;
  avatar: string;
  children: React.ReactNode;
}

export function CtaButton({ href, avatar, children }: Props) {
  return (
    <a
      href={href}
      onClick={() => trackInitiateCheckout(avatar)}
      className="flex items-center justify-center gap-2 w-full h-16 rounded-full text-white text-lg bg-brand-gradient shadow-brand-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2"
      style={{ fontWeight: 700 }}
    >
      <span>{children}</span>
      <ArrowRightIcon width={20} height={20} />
    </a>
  );
}
