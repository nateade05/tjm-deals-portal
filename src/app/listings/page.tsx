import { Suspense } from 'react';
import type { Metadata } from 'next';
import { TopNav } from '@/components/TopNav';
import { CategoryTabs } from '@/components/CategoryTabs';
import { ListingsClient } from './_ListingsClient';
import { BRAND_SHORT, TAGLINE } from '@/lib/constants';
import { supabaseServerPublic } from '@/lib/supabase/server';
import type { Listing, ListingCategory } from '@/lib/supabase/types';

export const revalidate = 120;

type Props = { searchParams: Promise<{ category?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category } = await searchParams;
  const title = category === 'opportunity'
    ? 'Opportunities'
    : category === 'in_stock'
      ? 'In stock'
      : 'Listings';
  return {
    title: `${title} | ${BRAND_SHORT}`,
    description: TAGLINE,
  };
}

export default async function ListingsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: rawCategory } = await searchParams;
  const category = (rawCategory as ListingCategory) || 'in_stock';

  const supabase = await supabaseServerPublic();
  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'live')
    .eq('category', category)
    .order('updated_at', { ascending: false });

  const listings = (data ?? []) as Listing[];

  // Fetch first image per listing for thumbnails
  let coverUrls: Record<string, string | undefined> = {};
  if (listings.length > 0) {
    const listingIds = listings.map((l) => l.id);
    const { data: media } = await supabase
      .from('listing_media')
      .select('listing_id, storage_path, type, sort_order')
      .in('listing_id', listingIds)
      .eq('type', 'image')
      .order('sort_order', { ascending: true });

    const firstByListing: Record<string, string> = {};
    for (const row of (media ?? []) as { listing_id: string; storage_path: string }[]) {
      if (!firstByListing[row.listing_id]) {
        firstByListing[row.listing_id] = row.storage_path;
      }
    }

    const entries = Object.entries(firstByListing);
    const signedPairs = await Promise.all(
      entries.map(async ([listingId, storagePath]) => {
        const { data: signed } = await supabase.storage
          .from('listing-media')
          .createSignedUrl(storagePath, 60 * 60);
        return [listingId, signed?.signedUrl] as const;
      })
    );
    coverUrls = Object.fromEntries(signedPairs);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
                Listings
              </h1>
              <p className="mt-1 text-sm text-zinc-600">
                Live stock and upcoming opportunities from Singapore to the UK.
              </p>
            </div>
            <Suspense fallback={<div className="h-10 w-32 animate-pulse rounded-lg bg-zinc-200" />}>
              <CategoryTabs />
            </Suspense>
          </div>

          <Suspense fallback={<div className="text-sm text-zinc-500">Loading listings…</div>}>
            <ListingsClient initialListings={listings} coverUrls={coverUrls} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

