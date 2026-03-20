import Link from 'next/link';
import type { Listing } from '@/lib/supabase/types';
import { formatGBP, formatMiles, timeAgo } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { ListingCardMedia } from '@/components/ListingCardMedia';

interface ListingCardProps {
  listing: Listing;
  coverImageUrl?: string | null;
  showCategoryBadge?: boolean;
}

function displayTitle(listing: Listing): string {
  if (listing.year && listing.make && listing.model) {
    return `${listing.year} ${listing.make} ${listing.model}`;
  }
  return listing.title;
}

function ListingTypeBadge({ category }: { category: Listing['category'] }) {
  const isInStock = category === 'in_stock';
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] shadow-sm backdrop-blur-md ${
        isInStock
          ? 'bg-surface/95 text-secondary ring-1 ring-black/5'
          : 'bg-gold/90 text-ink ring-1 ring-gold/35'
      }`}
    >
      {isInStock ? 'In stock' : 'Opportunity'}
    </span>
  );
}

export function ListingCard({ listing, coverImageUrl, showCategoryBadge = true }: ListingCardProps) {
  const href = `/listings/${listing.id}`;
  const alt = displayTitle(listing);

  return (
    <Link href={href} className="group block">
      <Card
        padded={false}
        className="overflow-hidden border-border-subtle/70 shadow-sm ring-1 ring-black/[0.03] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-border-strong/80 hover:shadow-lg"
      >
        {/* Taller, more editorial image ratio (5:4) */}
        <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-b from-surface-alt via-section-soft/20 to-surface-alt">
          <ListingCardMedia
            src={coverImageUrl}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {showCategoryBadge && (
            <div className="absolute left-2.5 top-2.5 z-10 sm:left-3 sm:top-3">
              <ListingTypeBadge category={listing.category} />
            </div>
          )}
        </div>
        <div className="px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5 sm:pt-4">
          <h2 className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-primary sm:text-[1.0625rem]">
            {displayTitle(listing)}
          </h2>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted/75">
            <span className="tabular-nums">{formatMiles(listing.mileage_mi)}</span>
            <span className="mx-1.5 text-border-strong">·</span>
            <span className="normal-case tracking-normal">{timeAgo(listing.listed_at)}</span>
          </p>
          <div className="mt-4 border-t border-border-subtle/50 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Your price</p>
            <div className="mt-1 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
              <span className="text-xl font-bold tabular-nums tracking-tight text-primary sm:text-2xl">
                {formatGBP(listing.price_landed_gbp)}
              </span>
              {listing.estimated_resale_gbp != null && (
                <span className="text-right text-[10px] leading-snug text-muted">
                  Est. resale
                  <span className="ml-1 font-medium tabular-nums text-secondary/90">
                    {formatGBP(listing.estimated_resale_gbp)}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
