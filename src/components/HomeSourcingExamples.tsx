import { formatGBP } from '@/lib/format';

const EXAMPLES = [
  { vehicle: 'Bentley Continental GT', imported: 30_000, ukValue: 46_500 },
  { vehicle: 'VW Golf 1.4 TSI', imported: 5_500, ukValue: 10_500 },
  { vehicle: 'BMW 216d Gran Tourer', imported: 4_500, ukValue: 8_500 },
] as const;

export function HomeSourcingExamples() {
  return (
    <section className="border-t border-border-subtle bg-surface px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Proof
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-primary sm:text-2xl">
          Recent sourcing examples
        </h2>

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {EXAMPLES.map((item) => (
            <li key={item.vehicle}>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border-subtle bg-surface px-5 py-4 transition-colors duration-200 hover:bg-section-soft/30">
                <span className="text-sm font-semibold text-primary">
                  {item.vehicle}
                </span>
                <div className="shrink-0 text-right text-xs">
                  <span className="font-bold text-gold">
                    {formatGBP(item.imported)}
                  </span>
                  <span className="mx-1.5 text-muted">→</span>
                  <span className="font-medium text-secondary">
                    {formatGBP(item.ukValue)} UK
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
