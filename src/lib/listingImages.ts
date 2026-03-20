import type { SupabaseClient } from '@supabase/supabase-js';

/** Bucket name for listing media (must match Supabase storage). */
export const LISTING_MEDIA_BUCKET = 'listing-media';

/**
 * Longer-lived signed URLs so cached pages and long sessions don’t show broken images
 * as quickly as the default 1h TTL.
 */
export const LISTING_IMAGE_SIGNED_URL_TTL_SEC = 60 * 60 * 24 * 7; // 7 days

/**
 * Create a signed URL for a single storage path, or null if the request fails.
 */
export async function createSignedListingMediaUrl(
  supabase: Pick<SupabaseClient, 'storage'>,
  storagePath: string
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(LISTING_MEDIA_BUCKET)
    .createSignedUrl(storagePath, LISTING_IMAGE_SIGNED_URL_TTL_SEC);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/**
 * For each listing id, resolve the first image’s storage_path (by sort_order), then sign.
 */
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

  const firstByListing: Record<string, string> = {};
  for (const row of (media ?? []) as { listing_id: string; storage_path: string }[]) {
    if (!firstByListing[row.listing_id]) {
      firstByListing[row.listing_id] = row.storage_path;
    }
  }

  const entries = Object.entries(firstByListing);
  const signedPairs = await Promise.all(
    entries.map(async ([listingId, storagePath]) => {
      const url = await createSignedListingMediaUrl(supabase, storagePath);
      return [listingId, url ?? undefined] as const;
    })
  );

  return Object.fromEntries(signedPairs);
}

/**
 * Sign URLs for an ordered list of media rows (gallery).
 */
export async function buildSignedUrlsForImagePaths(
  supabase: Pick<SupabaseClient, 'storage'>,
  storagePaths: string[]
): Promise<string[]> {
  const out: string[] = [];
  for (const path of storagePaths) {
    const url = await createSignedListingMediaUrl(supabase, path);
    if (url) out.push(url);
  }
  return out;
}
