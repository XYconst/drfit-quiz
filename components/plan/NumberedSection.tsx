interface Props {
  number: string;
  title: string;
  children: React.ReactNode;
}

export function NumberedSection({ number, title, children }: Props) {
  return (
    <section className="mt-10 pt-8 border-t border-[var(--color-line)]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-extrabold text-[var(--color-brand-red)] tabular-nums">{number}</span>
        <h2 className="text-xl font-extrabold leading-tight text-[var(--color-text-headline)]">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}
