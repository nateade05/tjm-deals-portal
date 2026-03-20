import { TopNav } from '@/components/TopNav';
import { SiteFooter } from '@/components/SiteFooter';

export default function ListingDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1 px-4 pb-12 pt-4 sm:px-6 sm:pt-6">
        <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10 lg:gap-x-14">
          <article className="min-w-0 space-y-3 lg:space-y-4">
            <div className="flex flex-wrap items-start gap-3">
              <div className="h-9 w-[min(100%,20rem)] max-w-full animate-pulse rounded-lg bg-surface-alt sm:h-10" />
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-surface-alt" />
            </div>
            <div className="h-4 w-40 animate-pulse rounded bg-surface-alt" />
            <div className="relative aspect-[16/10] w-full min-h-[220px] animate-pulse rounded-2xl bg-gradient-to-br from-surface-alt to-section-soft/50" />
            <div className="flex gap-2 overflow-hidden pt-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-[4.25rem] w-[5.5rem] shrink-0 animate-pulse rounded-xl bg-surface-alt sm:h-[4.5rem] sm:w-24"
                />
              ))}
            </div>
          </article>
          <aside className="min-w-0">
            <div className="rounded-2xl border border-border-subtle/80 bg-surface p-5 shadow-md ring-1 ring-black/[0.05] sm:p-6">
              <div className="space-y-4 pt-2">
                <div className="h-3 w-28 animate-pulse rounded bg-surface-alt" />
                <div className="h-10 w-36 animate-pulse rounded bg-surface-alt" />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between gap-4 border-t border-border-subtle/40 pt-3">
                    <div className="h-3 w-20 animate-pulse rounded bg-surface-alt" />
                    <div className="h-3 w-16 animate-pulse rounded bg-surface-alt" />
                  </div>
                ))}
                <div className="h-12 w-full animate-pulse rounded-xl bg-surface-alt" />
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
