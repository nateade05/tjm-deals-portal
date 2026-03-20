import { supabaseServerPublic } from '@/lib/supabase/server';
import { buildCoverUrlMapForListingIds } from '@/lib/listingImages';
import { listingFromDbRow } from '@/lib/listingRow';
import { pickFeaturedListings } from '@/lib/featuredListingsSelection';
import type { Listing } from '@/lib/supabase/types';

/** Pool size for featured selection (need depth to swap in missing category). */
const FEATURED_POOL = 60;

export async function getFeaturedListings(): Promise<{
  listings: Listing[];
  coverUrls: Record<string, string | undefined>;
}> {
  const supabase = await supabaseServerPublic();

  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'live')
    .order('created_at', { ascending: false })
    .limit(FEATURED_POOL);

  const all = (data ?? []).map((row) => listingFromDbRow(row as Record<string, unknown>));
  const listings = pickFeaturedListings(all);

  const coverUrls =
    listings.length > 0
      ? await buildCoverUrlMapForListingIds(supabase, listings.map((l) => l.id))
      : {};

  return { listings, coverUrls };
}
