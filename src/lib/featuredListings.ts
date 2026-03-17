import { supabaseServerPublic } from '@/lib/supabase/server';
import type { Listing } from '@/lib/supabase/types';

const FEATURED_LIMIT = 6;

export async function getFeaturedListings(): Promise<{
  listings: Listing[];
  coverUrls: Record<string, string | undefined>;
}> {
  const supabase = await supabaseServerPublic();

  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'live')
    .order('updated_at', { ascending: false })
    .limit(FEATURED_LIMIT * 2);

  const all = (data ?? []) as Listing[];
  const inStock = all.filter((l) => l.category === 'in_stock');
  const opportunity = all.filter((l) => l.category === 'opportunity');
  const mixed: Listing[] = [];
  let i = 0;
  let j = 0;
  while (mixed.length < FEATURED_LIMIT && (i < inStock.length || j < opportunity.length)) {
    if (i < inStock.length) mixed.push(inStock[i++]);
    if (mixed.length < FEATURED_LIMIT && j < opportunity.length) mixed.push(opportunity[j++]);
  }
  const listings = mixed.slice(0, FEATURED_LIMIT);

  let coverUrls: Record<string, string | undefined> = {};
  if (listings.length > 0) {
    const listingIds = listings.map((l) => l.id);
    const { data: media } = await supabase
      .from('listing_media')
      .select('listing_id, storage_path')
      .in('listing_id', listingIds)
      .eq('type', 'image')
      .order('sort_order', { ascending: true });

    const firstByListing: Record<string, string> = {};
    for (const row of (media ?? []) as { listing_id: string; storage_path: string }[]) {
      if (!firstByListing[row.listing_id]) firstByListing[row.listing_id] = row.storage_path;
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

  return { listings, coverUrls };
}
