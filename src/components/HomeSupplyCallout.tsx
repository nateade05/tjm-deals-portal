export function HomeSupplyCallout() {
  return (
    <section className="bg-olive-dark px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-olive-tint/90">
          Market mechanic
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-surface sm:text-3xl">
          A market built for exports
        </h2>
        <p className="mt-4 text-base leading-relaxed text-surface/90">
          Singapore&apos;s COE system means thousands of vehicles leave the market each month, creating a steady pipeline of high-quality export opportunities.
        </p>
        <div className="mt-8 inline-flex items-center justify-center rounded-2xl border border-gold/40 bg-white/10 px-8 py-4">
          <span className="text-2xl font-bold tabular-nums text-gold sm:text-3xl">
            ~7,000
          </span>
          <span className="ml-2 text-sm font-medium text-surface/90">
            vehicles per month
          </span>
        </div>
      </div>
    </section>
  );
}
