import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TopNav } from '@/components/TopNav';
import { SiteFooter } from '@/components/SiteFooter';
import { MediaGallery } from '@/components/MediaGallery';
import { StatRow } from '@/components/StatRow';
import { ListingDetailCTA } from '@/components/ListingDetailCTA';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { YourPriceLabel } from '@/components/YourPriceLabel';
import { MoreListingsCarousel } from '@/components/MoreListingsCarousel';
import { supabaseServerPublic } from '@/lib/supabase/server';
import type { Listing, ListingMedia } from '@/lib/supabase/types';
import { formatGBP, formatMiles, timeAgo } from '@/lib/format';
import { BRAND_SHORT, TAGLINE } from '@/lib/constants';
import {
  buildSignedUrlsForImagePaths,
  createSignedListingMediaUrl,
} from '@/lib/listingImages';
import { listingFromDbRow } from '@/lib/listingRow';
import { fetchMoreListingsForDetail } from '@/lib/moreListings';
import { PRICING_CATEGORY_LABELS } from '@/lib/pricingCategory';

export const revalidate = 120;

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

function getCategoryBadge(category: Listing['category']) {
  if (category === 'in_stock') {
    return {
      label: 'In stock',
      badgeClass:
        'bg-surface/95 text-secondary ring-1 ring-border-strong backdrop-blur-sm',
    };
  }
  return {
    label: 'Opportunity',
    badgeClass: 'bg-gold-tint/90 text-gold ring-1 ring-gold/45 backdrop-blur-sm',
  };
}

async function getListingWithMedia(id: string): Promise<{ listing: Listing; media: ListingMedia[] } | null> {
  const supabase = await supabaseServerPublic();

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

  return {
    listing: listingFromDbRow(listing as Record<string, unknown>),
    media: (media ?? []) as ListingMedia[],
  };
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
  const supabase = await supabaseServerPublic();
  let firstImage: string | undefined;
  const firstImageRow = media.find((m) => m.type === 'image');
  if (firstImageRow) {
    const url = await createSignedListingMediaUrl(supabase, firstImageRow.storage_path);
    if (url) firstImage = url;
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

  const supabase = await supabaseServerPublic();
  const imagePaths = media.filter((m) => m.type === 'image').map((m) => m.storage_path);
  const images = await buildSignedUrlsForImagePaths(supabase, imagePaths);

  const videoRow = media.find((m) => m.type === 'video');
  let videoUrl: string | undefined;
  if (videoRow) {
    const u = await createSignedListingMediaUrl(supabase, videoRow.storage_path);
    videoUrl = u ?? undefined;
  }

  const title =
    listing.year && listing.make && listing.model
      ? `${listing.year} ${listing.make} ${listing.model}`
      : listing.title;

  const { listings: moreListings, coverUrls: moreCovers } = await fetchMoreListingsForDetail(id, {
    pricingCategory: listing.pricing_category,
    listingCategory: listing.category,
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1 px-4 pb-12 pt-4 sm:px-6 sm:pt-6">
        <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10 lg:gap-x-14">
          <article className="min-w-0 space-y-3 lg:space-y-4">
            <header className="space-y-1">
              <div className="flex flex-wrap items-start gap-x-2 gap-y-2 sm:gap-x-3">
                <h1 className="min-w-0 max-w-[calc(100%-3rem)] text-2xl font-bold leading-[1.15] tracking-tight text-primary sm:text-3xl lg:text-[1.85rem]">
                  {title}
                </h1>
                <CopyLinkButton path={`/listings/${id}`} />
              </div>
              <p className="text-[13px] font-medium text-muted">Listed {timeAgo(listing.listed_at)}</p>
            </header>
            <MediaGallery key={listing.id} images={images} videoUrl={videoUrl} />
          </article>
          <aside className="min-w-0 lg:sticky lg:top-20">
            <div className="relative rounded-2xl border border-border-subtle/80 bg-surface p-5 shadow-md ring-1 ring-black/[0.05] sm:p-6">
              {(() => {
                const badge = getCategoryBadge(listing.category);
                return (
                  <span
                    className={`absolute right-3 top-3 inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-sm sm:right-4 sm:top-4 ${badge.badgeClass}`}
                    aria-label={`Listing status: ${listing.category === 'in_stock' ? 'In stock' : 'Opportunity'}`}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider">{badge.label}</span>
                  </span>
                );
              })()}
              <div className="pt-1 sm:pt-2">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Vehicle details</h2>
                <div className="mt-3 space-y-0 sm:mt-4">
                  <YourPriceLabel value={formatGBP(listing.price_landed_gbp)} />
                  {listing.estimated_resale_gbp != null && (
                    <StatRow
                      label="Estimated resale (GBP)"
                      value={formatGBP(listing.estimated_resale_gbp)}
                    />
                  )}
                  <StatRow label="Mileage" value={formatMiles(listing.mileage_mi)} />
                  {listing.year && <StatRow label="Year" value={listing.year} />}
                  {listing.colour && <StatRow label="Colour" value={listing.colour} />}
                  {listing.transmission && <StatRow label="Transmission" value={listing.transmission} />}
                  {listing.fuel && <StatRow label="Fuel" value={listing.fuel} />}
                  {listing.pricing_category && (
                    <StatRow
                      label="Pricing category"
                      value={PRICING_CATEGORY_LABELS[listing.pricing_category]}
                    />
                  )}
                </div>
                {listing.description && (
                  <div className="mt-5 border-t border-border-subtle/80 pt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Description</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-secondary">{listing.description}</p>
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
          </aside>
        </div>
      </main>
      <MoreListingsCarousel listings={moreListings} coverUrls={moreCovers} />
      <SiteFooter />
    </div>
  );
}
