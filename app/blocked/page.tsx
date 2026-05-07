import { HelpCircleIcon, ArrowRightIcon } from '@/components/icons';

export default function BlockedPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto">
      <HelpCircleIcon width={64} height={64} className="text-[var(--color-text-muted)] mb-6" />
      <h1 className="text-2xl font-extrabold text-[var(--color-text-headline)] mb-3">
        Не виждам как да ти помогна с тази комбинация
      </h1>
      <p className="text-base text-[var(--color-text-body)] mb-8">
        90-дневният Dr.Fit план е изграден за конкретни цели и тип тяло. Възможно е да има по-добро решение за теб на основния сайт.
      </p>
      <a
        href="https://www.dr-fit.co"
        className="w-full h-14 rounded-full font-bold text-white bg-brand-gradient shadow-brand-red transition-colors flex items-center justify-center gap-2"
      >
        <span>Виж основния сайт</span>
        <ArrowRightIcon width={18} height={18} />
      </a>
    </main>
  );
}
