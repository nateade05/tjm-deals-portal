import type { SupabaseClient } from '@supabase/supabase-js';

export const LISTING_MEDIA_BUCKET = 'listing-media';

/** Permanent public URL for a storage path. Bucket must be set to public in Supabase. */
export function getPublicListingMediaUrl(
  supabase: Pick<SupabaseClient, 'storage'>,
  storagePath: string
): string {
  const { data } = supabase.storage.from(LISTING_MEDIA_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

/** For each listing ID, resolve the cover image's public URL in a single DB query. */
export async function buildCoverUrlMapForListingIds(
  supabase: SupabaseClient,
  listingIds: string[]
): Promise<Record<string, string | undefined>> {
  if (listingIds.length === 0) return {};

  const { data: media } = await supabase
    .from('listing_media')
    .select('listing_id, storage_path')
    .in('listing_id', listingIds)
    .eq('type', 'image')
    .order('sort_order', { ascending: true });

  const result: Record<string, string | undefined> = {};
  for (const row of (media ?? []) as { listing_id: string; storage_path: string }[]) {
    if (!result[row.listing_id]) {
      result[row.listing_id] = getPublicListingMediaUrl(supabase, row.storage_path);
    }
  }
  return result;
}

/** Public URLs for an ordered list of storage paths — synchronous, no network call. */
export function buildPublicUrlsForImagePaths(
  supabase: Pick<SupabaseClient, 'storage'>,
  storagePaths: string[]
): string[] {
  return storagePaths.map((path) => getPublicListingMediaUrl(supabase, path));
}
