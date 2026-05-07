'use client';
import { trackInitiateCheckout } from '@/lib/pixel';

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
      className="block w-full h-16 rounded-full font-extrabold text-white text-lg bg-brand-gradient shadow-brand-red active:scale-[0.99] transition-transform leading-[64px] text-center"
    >
      {children}
    </a>
  );
}
