import { Suspense } from 'react';
import type { Metadata } from 'next';
import { TopNav } from '@/components/TopNav';
import { CategoryTabs } from '@/components/CategoryTabs';
import { ListingsClient } from './_ListingsClient';
import { BRAND_SHORT, TAGLINE } from '@/lib/constants';
import { supabaseServer } from '@/lib/supabase/server';
import type { ListingCategory } from '@/lib/supabase/types';

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

  const supabase = await supabaseServer();
  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'live')
    .eq('category', category)
    .order('updated_at', { ascending: false });

  const listings = (data ?? []) as any[];

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
            <ListingsClient initialListings={listings as any} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

