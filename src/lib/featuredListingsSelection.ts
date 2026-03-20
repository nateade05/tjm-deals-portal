import type { Listing, ListingCategory } from '@/lib/supabase/types';

const FEATURED_COUNT = 3;

/** Newest first; tie-break by id for deterministic ordering. */
export function sortListingsByRecency(listings: Listing[]): Listing[] {
  return [...listings].sort((a, b) => {
    const ta = new Date(a.created_at).getTime();
    const tb = new Date(b.created_at).getTime();
    if (tb !== ta) return tb - ta;
    return b.id.localeCompare(a.id);
  });
}

function hasCategory(pick: Listing[], cat: ListingCategory): boolean {
  return pick.some((l) => l.category === cat);
}

/**
 * Pick up to 3 live listings: newest first, with at least one in_stock and one opportunity when possible.
 * If the top 3 already satisfy, return them. Otherwise swap out the least-recent conflicting listing
 * for the newest listing of the missing type (deterministic).
 */
export function pickFeaturedListings(allLive: Listing[]): Listing[] {
  const sorted = sortListingsByRecency(allLive);
  if (sorted.length === 0) return [];
  if (sorted.length <= FEATURED_COUNT) return sorted;

  let pick = sorted.slice(0, FEATURED_COUNT);

  const findNextOfType = (cat: ListingCategory, excludeIds: Set<string>): Listing | undefined =>
    sorted.find((l) => l.category === cat && !excludeIds.has(l.id));

  const resort = (items: Listing[]): Listing[] => sortListingsByRecency(items).slice(0, FEATURED_COUNT);

  // Ensure at least one opportunity
  while (pick.length === FEATURED_COUNT && !hasCategory(pick, 'opportunity')) {
    const exclude = new Set(pick.map((l) => l.id));
    const add = findNextOfType('opportunity', exclude);
    if (!add) break;
    // Remove oldest in_stock (highest index in newest-first array); if none, remove last slot
    const stockIdxs = pick.map((l, i) => (l.category === 'in_stock' ? i : -1)).filter((i) => i >= 0);
    const removeIdx = stockIdxs.length > 0 ? Math.max(...stockIdxs) : FEATURED_COUNT - 1;
    pick = resort([...pick.filter((_, i) => i !== removeIdx), add]);
  }

  // Ensure at least one in_stock
  while (pick.length === FEATURED_COUNT && !hasCategory(pick, 'in_stock')) {
    const exclude = new Set(pick.map((l) => l.id));
    const add = findNextOfType('in_stock', exclude);
    if (!add) break;
    const oppIdxs = pick.map((l, i) => (l.category === 'opportunity' ? i : -1)).filter((i) => i >= 0);
    const removeIdx = oppIdxs.length > 0 ? Math.max(...oppIdxs) : FEATURED_COUNT - 1;
    pick = resort([...pick.filter((_, i) => i !== removeIdx), add]);
  }

  return pick;
}
