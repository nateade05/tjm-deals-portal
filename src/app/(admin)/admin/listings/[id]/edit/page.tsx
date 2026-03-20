import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchSaleAttributionByListingId } from '@/lib/actions/attribution';
import { mergeLeadsAttributionPool } from '@/lib/leadsAttributionMerge';
import { fetchLeadsForListing, fetchLeadsRecentForPicker } from '@/lib/actions/leads';
import { fetchListingById, fetchListingMedia } from '@/lib/actions/listings';
import { supabaseServer } from '@/lib/supabase/server';
import { AdminListingEditClient } from './AdminListingEditClient';
import type { Listing, ListingMedia } from '@/lib/supabase/types';

function computeListingLabel(listing: Listing): string {
  const auto = [listing.year, listing.make, listing.model].filter(Boolean).map(String).join(' ').trim();
  return auto || listing.title;
}

const SIGNED_URL_EXPIRY = 60 * 60; // 1 hour

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminListingsEditPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await fetchListingById(id);
  if (!listing) return notFound();

  const mediaRows = await fetchListingMedia(id);
  const supabase = await supabaseServer();
  const mediaWithUrls: (ListingMedia & { signedUrl?: string })[] = await Promise.all(
    mediaRows.map(async (m) => {
      const { data } = await supabase.storage
        .from('listing-media')
        .createSignedUrl(m.storage_path, SIGNED_URL_EXPIRY);
      return { ...m, signedUrl: data?.signedUrl };
    })
  );

  const [saleAttribution, leadsForListing, recentLeads] = await Promise.all([
    fetchSaleAttributionByListingId(id),
    fetchLeadsForListing(id),
    fetchLeadsRecentForPicker(200),
  ]);
  const leadsAttributionPool = mergeLeadsAttributionPool(leadsForListing, recentLeads);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Link href="/admin/listings" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← Listings
        </Link>
      </div>
      <h1 className="text-xl font-semibold text-zinc-900 sm:text-2xl">Edit listing</h1>

      <AdminListingEditClient
        listing={listing}
        mediaWithUrls={mediaWithUrls}
        listingLabel={computeListingLabel(listing)}
        leadsAttributionPool={leadsAttributionPool}
        saleAttribution={saleAttribution}
      />
    </div>
  );
}
