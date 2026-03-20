import Link from 'next/link';
import type { Listing } from '@/lib/supabase/types';
import { formatGBP, formatMiles, timeAgo } from '@/lib/format';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { BUSINESS_WHATSAPP_E164 } from '@/lib/constants';
import { ListingCardMedia } from '@/components/ListingCardMedia';

interface HomeFeaturedListingsProps {
  listings: Listing[];
  coverUrls: Record<string, string | undefined>;
}

function displayTitle(listing: Listing): string {
  if (listing.year && listing.make && listing.model) {
    return `${listing.year} ${listing.make} ${listing.model}`;
  }
  return listing.title;
}

function CategoryBadge({ category }: { category: Listing['category'] }) {
  const isInStock = category === 'in_stock';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shadow-sm backdrop-blur-sm ${
        isInStock
          ? 'bg-surface/95 text-secondary ring-1 ring-border-strong'
          : 'bg-gold-tint/95 text-gold ring-1 ring-gold/40'
      }`}
    >
      {isInStock ? 'In stock' : 'Opportunity'}
    </span>
  );
}

function ListingCard({
  listing,
  coverUrl,
}: {
  listing: Listing;
  coverUrl: string | undefined;
}) {
  return (
    <Link href={`/listings/${listing.id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
          <ListingCardMedia
            src={coverUrl}
            alt={displayTitle(listing)}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
          <div className="absolute right-2 top-2">
            <CategoryBadge category={listing.category} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <h3 className="truncate text-sm font-semibold text-primary">
            {displayTitle(listing)}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-x-2.5 gap-y-0.5 text-xs text-muted">
            <span>{formatMiles(listing.mileage_mi)}</span>
            <span>{timeAgo(listing.listed_at)}</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-border-subtle pt-3">
            <span className="text-base font-bold text-primary">
              {formatGBP(listing.price_landed_gbp)}
            </span>
            {listing.estimated_resale_gbp != null && (
              <span className="text-xs text-muted">
                Est. {formatGBP(listing.estimated_resale_gbp)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export function HomeFeaturedListings({ listings, coverUrls }: HomeFeaturedListingsProps) {
  if (listings.length === 0) {
    return (
      <section className="bg-section-soft px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-border-subtle bg-surface p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Featured Deals
            </h2>
            <p className="mt-2 text-sm text-secondary">
              Live vehicles currently available for import to the UK.
            </p>
            <p className="mt-6 text-sm text-secondary">
              New vehicles are being added soon. Browse opportunities or message TJMotors directly.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/listings"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-surface shadow-md transition-all duration-200 hover:bg-primary hover:shadow-lg"
              >
                Browse all vehicles
              </Link>
              <a
                href={buildWhatsAppUrl({ phoneE164: BUSINESS_WHATSAPP_E164, text: '' })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-border-strong bg-surface px-5 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:border-gold hover:bg-gold-tint/50"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-section-soft px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Featured Deals
            </h2>
            <p className="mt-1 text-sm text-secondary">
              Latest arrivals — in stock and opportunities.
            </p>
          </div>
          <Link
            href="/listings"
            className="inline-flex min-h-[44px] w-fit items-center justify-center rounded-xl border-2 border-border-strong bg-surface px-5 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:border-gold hover:bg-gold-tint/50"
          >
            Browse all vehicles →
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {listings.map((listing) => (
            <li key={listing.id}>
              <ListingCard
                listing={listing}
                coverUrl={coverUrls[listing.id]}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
