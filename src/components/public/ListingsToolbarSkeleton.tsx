/** Stable-height placeholders for listings toolbar + results header (CLS). */
export function ListingsToolbarSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading listings">
      <div className="overflow-hidden rounded-xl border border-border-subtle/55 bg-surface/95 ring-1 ring-black/[0.025]">
        <div className="border-b border-border-subtle/40 bg-background/40 px-3 py-3">
          <div className="flex gap-1 rounded-full border border-border-subtle/45 bg-surface-alt/60 p-0.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 flex-1 animate-pulse rounded-full bg-surface-alt/90 sm:h-11"
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:flex-wrap">
          <div className="h-10 min-h-[44px] flex-1 animate-pulse rounded-lg bg-surface-alt/80 sm:max-w-[11rem]" />
          <div className="h-10 min-h-[44px] flex-1 animate-pulse rounded-lg bg-surface-alt/80 sm:max-w-[11rem]" />
          <div className="h-10 min-h-[44px] flex-1 animate-pulse rounded-lg bg-surface-alt/80 sm:max-w-[14rem]" />
        </div>
      </div>
      <div className="flex flex-col gap-2 border-b border-border-subtle/40 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-surface-alt" />
          <div className="h-8 w-32 animate-pulse rounded bg-surface-alt" />
        </div>
      </div>
    </div>
  );
}
