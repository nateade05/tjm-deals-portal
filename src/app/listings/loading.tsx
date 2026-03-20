import { TopNav } from '@/components/TopNav';
import { SiteFooter } from '@/components/SiteFooter';
import { ListingsToolbarSkeleton } from '@/components/public/ListingsToolbarSkeleton';
import { ListingGridSkeleton } from '@/components/public/ListingGridSkeleton';

export default function ListingsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1 px-4 py-5 sm:px-6 sm:py-7">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <header className="pb-1">
            <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">Listings</h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-secondary">
              Curated Singapore imports — choose a stock type, then refine by make, budget, and segment.
            </p>
          </header>
          <ListingsToolbarSkeleton />
          <ListingGridSkeleton />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
