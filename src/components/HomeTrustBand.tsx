const POINTS = [
  'Dealer-ready sourcing',
  'Retail-friendly imports',
  'Delivered UK-registered',
] as const;

export function HomeTrustBand() {
  return (
    <section className="border-t border-border-subtle bg-section-soft px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
          <span className="text-sm font-semibold text-primary">
            Built for UK dealers and buyers
          </span>
          {POINTS.map((label) => (
            <span key={label} className="flex items-center gap-2 text-sm font-medium text-secondary">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
