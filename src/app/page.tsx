import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { TopNav } from '@/components/TopNav';
import { HomeHero } from '@/components/HomeHero';
import { HomeFeaturedListings } from '@/components/HomeFeaturedListings';
import { BRAND_SHORT, TAGLINE } from '@/lib/constants';
import { getFeaturedListings } from '@/lib/featuredListings';

// Below-the-fold sections: separate chunks so initial load is smaller and faster
const HomePriceComparison = dynamic(
  () => import('@/components/HomePriceComparison').then((m) => m.HomePriceComparison),
  { ssr: true, loading: () => <section className="min-h-[420px] bg-section-soft" aria-hidden /> }
);

const HomeValueProps = dynamic(
  () => import('@/components/HomeValueProps').then((m) => m.HomeValueProps),
  { ssr: true, loading: () => <section className="min-h-[320px] bg-background" aria-hidden /> }
);

const HomeSupplyCallout = dynamic(
  () => import('@/components/HomeSupplyCallout').then((m) => m.HomeSupplyCallout),
  { ssr: true, loading: () => <section className="min-h-[200px] bg-section-soft" aria-hidden /> }
);

const HomeCategoryTiles = dynamic(
  () => import('@/components/HomeCategoryTiles').then((m) => m.HomeCategoryTiles),
  { ssr: true, loading: () => <section className="min-h-[280px] bg-background" aria-hidden /> }
);

const HomeServiceSummary = dynamic(
  () => import('@/components/HomeServiceSummary').then((m) => m.HomeServiceSummary),
  { ssr: true, loading: () => <section className="min-h-[240px] bg-section-soft" aria-hidden /> }
);

const HomeFinalCta = dynamic(
  () => import('@/components/HomeFinalCta').then((m) => m.HomeFinalCta),
  { ssr: true, loading: () => <section className="min-h-[220px] bg-background" aria-hidden /> }
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

        <footer className="border-t border-border-subtle bg-surface px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-sm text-muted">
              © {new Date().getFullYear()} Thangamani Jeyam Motors. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
