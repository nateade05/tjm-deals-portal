import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TopNav } from '@/components/TopNav';
import { MediaGallery } from '@/components/MediaGallery';
import { StatRow } from '@/components/StatRow';
import { ListingDetailCTA } from '@/components/ListingDetailCTA';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { supabaseServer } from '@/lib/supabase/server';
import type { Listing, ListingMedia } from '@/lib/supabase/types';
import { formatGBP, formatMiles, timeAgo } from '@/lib/format';
import { BRAND_SHORT, TAGLINE } from '@/lib/constants';

export const revalidate = 120;

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

async function getListingWithMedia(id: string): Promise<{ listing: Listing; media: ListingMedia[] } | null> {
  const supabase = await supabaseServer();

  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('status', 'live')
    .single();

  if (listingError || !listing) return null;

  const { data: media } = await supabase
    .from('listing_media')
    .select('*')
    .eq('listing_id', id)
    .order('sort_order', { ascending: true });

  return { listing: listing as Listing, media: (media ?? []) as ListingMedia[] };
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getListingWithMedia(id);
  if (!data) return { title: 'Not found' };
  const { listing, media } = data;
  const title =
    listing.year && listing.make && listing.model
      ? `${listing.year} ${listing.make} ${listing.model}`
      : listing.title;
  const descParts: string[] = [];
  if (listing.price_landed_gbp != null) descParts.push(formatGBP(listing.price_landed_gbp));
  if (listing.mileage_mi != null) descParts.push(formatMiles(listing.mileage_mi));
  const description = descParts.length
    ? `${title}. ${descParts.join(' · ')}. ${TAGLINE}`
    : `${title}. ${TAGLINE}`;
  const supabase = await supabaseServer();
  let firstImage: string | undefined;
  const firstImageRow = media.find((m) => m.type === 'image');
  if (firstImageRow) {
    const { data: signed } = await supabase.storage
      .from('listing-media')
      .createSignedUrl(firstImageRow.storage_path, 60 * 60);
    if (signed?.signedUrl) firstImage = signed.signedUrl;
  }

  return {
    title: `${title} | ${BRAND_SHORT}`,
    description,
    openGraph: {
      title: `${title} | ${BRAND_SHORT}`,
      description,
      type: 'website',
      ...(firstImage && { images: [{ url: firstImage, alt: title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${BRAND_SHORT}`,
      description,
      ...(firstImage && { images: [firstImage] }),
    },
  };
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { id } = await params;
  const data = await getListingWithMedia(id);
  if (!data) return notFound();

  const { listing, media } = data;

  const supabase = await supabaseServer();
  const images: string[] = [];
  let videoUrl: string | undefined;

  for (const item of media) {
    const { data: signed } = await supabase.storage
      .from('listing-media')
      .createSignedUrl(item.storage_path, 60 * 60);
    if (!signed?.signedUrl) continue;
    if (item.type === 'image') {
      images.push(signed.signedUrl);
    } else if (item.type === 'video' && !videoUrl) {
      videoUrl = signed.signedUrl;
    }
  }

  const title =
    listing.year && listing.make && listing.model
      ? `${listing.year} ${listing.make} ${listing.model}`
      : listing.title;

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 px-4 pb-10 pt-6 sm:px-6 sm:pt-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
                {title}
              </h1>
              <CopyLinkButton path={`/listings/${id}`} />
            </div>
            <p className="text-sm text-zinc-500">
              Listed {timeAgo(listing.listed_at)}
            </p>
            <MediaGallery images={images} videoUrl={videoUrl} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">
                Vehicle details
              </h2>
              <div className="mt-4">
                <StatRow label="Price landed (GBP)" value={formatGBP(listing.price_landed_gbp)} />
                {listing.estimated_resale_gbp != null && (
                  <StatRow
                    label="Estimated resale (GBP)"
                    value={formatGBP(listing.estimated_resale_gbp)}
                  />
                )}
                <StatRow label="Mileage" value={formatMiles(listing.mileage_mi)} />
                {listing.year && <StatRow label="Year" value={listing.year} />}
                {listing.colour && <StatRow label="Colour" value={listing.colour} />}
                {listing.transmission && (
                  <StatRow label="Transmission" value={listing.transmission} />
                )}
                {listing.fuel && <StatRow label="Fuel" value={listing.fuel} />}
                <StatRow label="Category" value={listing.category === 'in_stock' ? 'In stock' : 'Opportunity'} />
              </div>
              {listing.description && (
                <div className="mt-4 border-t border-zinc-100 pt-4">
                  <h3 className="text-sm font-semibold text-zinc-900">Description</h3>
                  <p className="mt-2 text-base text-zinc-700">{listing.description}</p>
                </div>
              )}
              <ListingDetailCTA
                listing={{
                  id: listing.id,
                  title,
                  year: listing.year,
                  make: listing.make,
                  model: listing.model,
                  category: listing.category,
                  price_landed_gbp: listing.price_landed_gbp,
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
