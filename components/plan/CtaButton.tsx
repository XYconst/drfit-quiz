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
      style={{ transformOrigin: 'center', fontWeight: 700 }}
      className={[
        'group flex items-center justify-center gap-2 w-full h-16 rounded-full',
        'text-white text-lg bg-brand-gradient shadow-brand-red',
        'motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 motion-safe:ease-out',
        'motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[0_22px_36px_-14px_rgba(165,0,21,0.55)]',
        'motion-safe:active:scale-[0.98] motion-safe:active:duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
      ].join(' ')}
    >
      <span>{children}</span>
      <ArrowRightIcon
        width={20}
        height={20}
        className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out group-hover:motion-safe:translate-x-0.5"
      />
    </a>
  );
}
