'use client';

/**
 * Inline SVG payment method badges. Generic shapes — colour blocks with the
 * brand initials/marks — so we can render them crisply without external
 * assets. Heights are normalised for visual balance.
 */

const ROW = 'inline-flex h-8 px-3 rounded-md bg-white border border-[var(--color-line)] items-center justify-center';

export function PaymentMethods({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`} aria-label="Поддържани методи на плащане">
      <div className={ROW}>
        <span className="text-[13px] font-extrabold text-[#1A1F71] italic" style={{ letterSpacing: '0.04em' }}>
          VISA
        </span>
      </div>
      <div className={ROW}>
        <span className="flex items-center gap-1">
          <span className="size-3.5 rounded-full bg-[#EB001B]" />
          <span className="size-3.5 rounded-full bg-[#F79E1B] -ml-2 mix-blend-multiply" />
        </span>
      </div>
      <div className={ROW}>
        <span className="text-[12px] font-extrabold tracking-wider">
          <span className="text-[#003087]">Pay</span>
          <span className="text-[#009CDE]">Pal</span>
        </span>
      </div>
      <div className={ROW}>
        <span className="flex items-center gap-1 text-[12px] font-semibold text-black">
          <svg width={12} height={14} viewBox="0 0 12 14" fill="currentColor" aria-hidden>
            <path d="M9.7 7.4c0-1.5 1.2-2.2 1.3-2.3-.7-1-1.8-1.2-2.2-1.2-.9-.1-1.8.5-2.3.5s-1.2-.5-2-.5c-1 0-2 .6-2.5 1.5C.9 7.3 1.7 10.5 2.8 12.2c.5.8 1.2 1.7 2 1.7s1.2-.5 2.2-.5 1.3.5 2.2.5c.9 0 1.5-.8 2-1.7.6-.9.9-1.8 1-1.8-.1 0-1.9-.7-1.9-2.5l-.6-.5zM7.8 2.4c.5-.5.8-1.3.7-2-.7 0-1.5.4-1.9.9-.4.5-.8 1.3-.7 2 .7.1 1.5-.4 1.9-.9z"/>
          </svg>
          Pay
        </span>
      </div>
      <div className={ROW}>
        <span className="flex items-center gap-1 text-[12px] font-semibold text-black">
          <span className="size-3 rounded-sm bg-gradient-to-br from-[#4285F4] via-[#EA4335] to-[#34A853]" />
          Pay
        </span>
      </div>
    </div>
  );
}
