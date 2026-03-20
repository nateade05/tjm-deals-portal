const CARD_COUNT = 6;

export function ListingGridSkeleton() {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8"
      aria-hidden
    >
      {Array.from({ length: CARD_COUNT }, (_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-border-subtle/70 bg-surface shadow-sm ring-1 ring-black/[0.03]"
        >
          <div className="aspect-[5/4] animate-pulse bg-gradient-to-b from-surface-alt to-section-soft/30" />
          <div className="space-y-3 px-4 pb-4 pt-3.5 sm:px-5">
            <div className="h-5 w-[85%] max-w-[14rem] animate-pulse rounded bg-surface-alt" />
            <div className="h-3 w-32 animate-pulse rounded bg-surface-alt/80" />
            <div className="h-px bg-border-subtle/40" />
            <div className="h-8 w-28 animate-pulse rounded bg-surface-alt" />
          </div>
        </div>
      ))}
    </div>
  );
}
