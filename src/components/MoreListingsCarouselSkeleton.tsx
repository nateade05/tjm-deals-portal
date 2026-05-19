export function MoreListingsCarouselSkeleton() {
  return (
    <section className="border-t border-border-subtle bg-gradient-to-b from-section-soft/30 to-background px-4 py-10 sm:px-6 sm:py-12" aria-hidden>
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-border-subtle/60 pb-4 sm:pb-5 space-y-1.5">
          <div className="h-5 w-32 animate-pulse rounded bg-surface-alt" />
          <div className="h-3.5 w-44 animate-pulse rounded bg-surface-alt/70" />
        </div>
        <div className="mt-6 flex gap-4 overflow-hidden sm:gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-[min(100%,300px)] shrink-0 sm:w-[308px] overflow-hidden rounded-2xl border border-border-subtle/70 bg-surface">
              <div className="aspect-[5/4] animate-pulse bg-gradient-to-b from-surface-alt to-section-soft/30" />
              <div className="space-y-3 px-4 pb-4 pt-3.5 sm:px-5">
                <div className="h-4 w-[80%] animate-pulse rounded bg-surface-alt" />
                <div className="h-3 w-24 animate-pulse rounded bg-surface-alt/80" />
                <div className="h-px bg-border-subtle/40" />
                <div className="h-7 w-28 animate-pulse rounded bg-surface-alt" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
