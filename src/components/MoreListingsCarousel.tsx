'use client';

import type { Listing } from '@/lib/supabase/types';
import { ListingCard } from '@/components/ListingCard';

interface MoreListingsCarouselProps {
  listings: Listing[];
  coverUrls: Record<string, string | undefined>;
}

export function MoreListingsCarousel({ listings, coverUrls }: MoreListingsCarouselProps) {
  if (listings.length === 0) return null;

  return (
    <section className="border-t border-border-subtle bg-gradient-to-b from-section-soft/30 to-background px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-0.5 border-b border-border-subtle/60 pb-4 sm:flex-row sm:items-end sm:justify-between sm:pb-5">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-primary sm:text-xl">More listings</h2>
            <p className="mt-1 text-sm text-secondary">Similar vehicles you may like.</p>
          </div>
        </div>
        <div
          className="mt-6 flex gap-4 overflow-x-auto pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:thin] sm:gap-5 sm:pb-4 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border-strong"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="w-[min(100%,300px)] shrink-0 sm:w-[308px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ListingCard listing={listing} coverImageUrl={coverUrls[listing.id]} showCategoryBadge />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
