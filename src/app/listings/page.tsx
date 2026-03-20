import type { Metadata } from 'next';
import { TopNav } from '@/components/TopNav';
import { SiteFooter } from '@/components/SiteFooter';
import { ListingsClient } from './_ListingsClient';
import { BRAND_SHORT, TAGLINE } from '@/lib/constants';
import { supabaseServerPublic } from '@/lib/supabase/server';
import type { ListingCategory } from '@/lib/supabase/types';
import { buildCoverUrlMapForListingIds } from '@/lib/listingImages';
import { listingFromDbRow } from '@/lib/listingRow';
import { pricingCategoryFromQuery, PRICING_CATEGORY_LABELS } from '@/lib/pricingCategory';

export const revalidate = 120;

type Search = { category?: string; pricingCategory?: string };

export async function generateMetadata({ searchParams }: { searchParams: Promise<Search> }): Promise<Metadata> {
  const { category, pricingCategory } = await searchParams;
  const pricing = pricingCategoryFromQuery(pricingCategory);
  const listingType: 'all' | ListingCategory =
    category === 'in_stock' || category === 'opportunity' ? category : 'all';

  let title = 'Listings';
  if (listingType === 'in_stock') title = 'In stock';
  else if (listingType === 'opportunity') title = 'Opportunities';
  if (pricing) {
    title = `${PRICING_CATEGORY_LABELS[pricing]} · ${title}`;
  }

  return {
    title: `${title} | ${BRAND_SHORT}`,
    description: TAGLINE,
  };
}

export default async function ListingsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { category: rawCategory, pricingCategory: rawPricing } = await searchParams;
  const listingType: 'all' | ListingCategory =
    rawCategory === 'in_stock' || rawCategory === 'opportunity' ? rawCategory : 'all';
  const pricingFilter = pricingCategoryFromQuery(rawPricing);

  const supabase = await supabaseServerPublic();
  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'live')
    .order('updated_at', { ascending: false });

  if (listingType !== 'all') {
    query = query.eq('category', listingType);
  }
  if (pricingFilter) {
    query = query.eq('pricing_category', pricingFilter);
  }

  const { data } = await query;
  const listings = (data ?? []).map((row) => listingFromDbRow(row as Record<string, unknown>));

  const coverUrls =
    listings.length > 0
      ? await buildCoverUrlMapForListingIds(supabase, listings.map((l) => l.id))
      : {};

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

          <ListingsClient initialListings={listings} coverUrls={coverUrls} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
