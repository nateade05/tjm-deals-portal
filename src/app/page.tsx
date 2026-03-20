import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { TopNav } from '@/components/TopNav';
import { HomeHero } from '@/components/HomeHero';
import { HomeFeaturedListings } from '@/components/HomeFeaturedListings';
import { SiteFooter } from '@/components/SiteFooter';
import { BRAND_SHORT, TAGLINE } from '@/lib/constants';
import { getFeaturedListings } from '@/lib/featuredListings';

// Below-the-fold sections: separate chunks so initial load is smaller and faster
function HomeSectionSkeleton({ className }: { className: string }) {
  return (
    <section className={`animate-pulse ${className}`} aria-hidden>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto h-8 max-w-md rounded-lg bg-surface-alt/90" />
        <div className="mx-auto mt-4 h-4 max-w-lg rounded bg-surface-alt/70" />
        <div className="mt-10 h-48 rounded-2xl bg-surface-alt/60 sm:h-56" />
      </div>
    </section>
  );
}

const HomePriceComparison = dynamic(
  () => import('@/components/HomePriceComparison').then((m) => m.HomePriceComparison),
  { ssr: true, loading: () => <HomeSectionSkeleton className="min-h-[420px] bg-section-soft" /> }
);

const HomeValueProps = dynamic(
  () => import('@/components/HomeValueProps').then((m) => m.HomeValueProps),
  { ssr: true, loading: () => <HomeSectionSkeleton className="min-h-[320px] bg-background" /> }
);

const HomeSupplyCallout = dynamic(
  () => import('@/components/HomeSupplyCallout').then((m) => m.HomeSupplyCallout),
  { ssr: true, loading: () => <HomeSectionSkeleton className="min-h-[200px] bg-section-soft" /> }
);

const HomeCategoryTiles = dynamic(
  () => import('@/components/HomeCategoryTiles').then((m) => m.HomeCategoryTiles),
  { ssr: true, loading: () => <HomeSectionSkeleton className="min-h-[280px] bg-background" /> }
);

const HomeServiceSummary = dynamic(
  () => import('@/components/HomeServiceSummary').then((m) => m.HomeServiceSummary),
  { ssr: true, loading: () => <HomeSectionSkeleton className="min-h-[240px] bg-section-soft" /> }
);

const HomeFinalCta = dynamic(
  () => import('@/components/HomeFinalCta').then((m) => m.HomeFinalCta),
  { ssr: true, loading: () => <HomeSectionSkeleton className="min-h-[220px] bg-background" /> }
);

export const revalidate = 120;

export const metadata: Metadata = {
  title: `${BRAND_SHORT} | Singapore car deals landed in the UK`,
  description: TAGLINE,
  openGraph: {
    title: `${BRAND_SHORT} | Singapore car deals landed in the UK`,
    description: TAGLINE,
    type: 'website',
  },
};

export default async function HomePage() {
  const { listings, coverUrls } = await getFeaturedListings();

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">
        <HomeHero />

        <HomeFeaturedListings listings={listings} coverUrls={coverUrls} />
        <HomePriceComparison />
        <HomeValueProps />
        <HomeSupplyCallout />
        <HomeCategoryTiles />
        <HomeServiceSummary />
        <HomeFinalCta />

        <SiteFooter />
      </main>
    </div>
  );
}
