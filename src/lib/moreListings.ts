import { supabaseServerPublic } from '@/lib/supabase/server';
import { buildCoverUrlMapForListingIds } from '@/lib/listingImages';
import { listingFromDbRow } from '@/lib/listingRow';
import type { Listing } from '@/lib/supabase/types';

const MORE_LIMIT = 12;

/**
 * Related listings for detail page: same pricing segment + type, then broader fallbacks.
 */
export async function fetchMoreListingsForDetail(
  currentId: string,
  opts: {
    pricingCategory: string | null;
    listingCategory: Listing['category'];
  }
): Promise<{ listings: Listing[]; coverUrls: Record<string, string | undefined> }> {
  const supabase = await supabaseServerPublic();
  const seen = new Set<string>();
  const ordered: Listing[] = [];

  function append(rows: unknown[] | null | undefined) {
    for (const row of rows ?? []) {
      const listing = listingFromDbRow(row as Record<string, unknown>);
      if (listing.id === currentId || seen.has(listing.id)) continue;
      seen.add(listing.id);
      ordered.push(listing);
      if (ordered.length >= MORE_LIMIT) return true;
    }
    return false;
  }

  const base = () =>
    supabase.from('listings').select('*').eq('status', 'live').neq('id', currentId);

  if (opts.pricingCategory) {
    const { data: a } = await base()
      .eq('pricing_category', opts.pricingCategory)
      .eq('category', opts.listingCategory)
      .order('updated_at', { ascending: false })
      .limit(8);
    if (append(a)) {
      return finalize(supabase, ordered);
    }

    const { data: b } = await base()
      .eq('pricing_category', opts.pricingCategory)
      .order('updated_at', { ascending: false })
      .limit(8);
    if (append(b)) {
      return finalize(supabase, ordered);
    }
  }

  const { data: c } = await base()
    .eq('category', opts.listingCategory)
    .order('updated_at', { ascending: false })
    .limit(8);
  if (append(c)) {
    return finalize(supabase, ordered);
  }

  const { data: d } = await base().order('updated_at', { ascending: false }).limit(MORE_LIMIT);
  append(d);

  return finalize(supabase, ordered);
}

async function finalize(
  supabase: Awaited<ReturnType<typeof supabaseServerPublic>>,
  listings: Listing[]
): Promise<{ listings: Listing[]; coverUrls: Record<string, string | undefined> }> {
  const ids = listings.map((l) => l.id);
  const coverUrls = await buildCoverUrlMapForListingIds(supabase, ids);
  return { listings, coverUrls };
}
