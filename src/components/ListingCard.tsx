import Link from 'next/link';
import type { Listing } from '@/lib/supabase/types';
import { formatGBP, formatMiles, timeAgo } from '@/lib/format';
import { Card } from '@/components/ui/Card';

interface ListingCardProps {
  listing: Listing;
  coverImageUrl?: string | null;
}

function displayTitle(listing: Listing): string {
  if (listing.year && listing.make && listing.model) {
    return `${listing.year} ${listing.make} ${listing.model}`;
  }
  return listing.title;
}

export function ListingCard({ listing, coverImageUrl }: ListingCardProps) {
  const href = `/listings/${listing.id}`;

  return (
    <Link href={href} className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md" padded={false}>
        <div className="aspect-[4/3] overflow-hidden bg-surface-alt">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
            />
          ) : (
            <div className="h-full w-full bg-border-subtle" />
          )}
        </div>
        <div className="p-4">
          <h2 className="truncate text-sm font-semibold text-primary">
            {displayTitle(listing)}
          </h2>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            <span>{formatMiles(listing.mileage_mi)}</span>
            <span>{timeAgo(listing.listed_at)}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 text-sm">
            <span className="font-medium text-primary">
              {formatGBP(listing.price_landed_gbp)}
            </span>
            {listing.estimated_resale_gbp != null && (
              <span className="text-muted">
                Est. resale {formatGBP(listing.estimated_resale_gbp)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
