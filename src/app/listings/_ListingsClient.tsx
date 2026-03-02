'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ListingCard } from '@/components/ListingCard';
import { EmptyState } from '@/components/EmptyState';
import { LeadModal } from '@/components/LeadModal';
import type { Listing } from '@/lib/supabase/types';
import { formatGBP } from '@/lib/format';
import { CAR_MAKES } from '@/lib/carOptions';

const MAX_PRICE_OPTIONS = Array.from({ length: 50 }, (_, i) => (i + 1) * 1000); // 1000 to 50000

interface ListingsClientProps {
  initialListings: Listing[];
  coverUrls: Record<string, string | undefined>;
}

export function ListingsClient({ initialListings, coverUrls }: ListingsClientProps) {
  const searchParams = useSearchParams();
  const [makeFilter, setMakeFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | ''>('');
  const [leadOpen, setLeadOpen] = useState(false);

  const filtered = useMemo(() => {
    return initialListings.filter((listing) => {
      if (makeFilter) {
        const listingMake = (listing.make ?? '').trim();
        if (!listingMake || listingMake.toLowerCase() !== makeFilter.toLowerCase()) return false;
      }
      if (maxPriceFilter !== '') {
        const max = maxPriceFilter as number;
        if (listing.price_landed_gbp == null || listing.price_landed_gbp > max) return false;
      }
      return true;
    });
  }, [initialListings, makeFilter, maxPriceFilter]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="filter-make" className="block text-xs font-medium text-zinc-500">
              Make
            </label>
            <select
              id="filter-make"
              value={makeFilter}
              onChange={(e) => setMakeFilter(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="">All makes</option>
              {CAR_MAKES.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter-max-price" className="block text-xs font-medium text-zinc-500">
              Max price
            </label>
            <select
              id="filter-max-price"
              value={maxPriceFilter === '' ? '' : String(maxPriceFilter)}
              onChange={(e) => setMaxPriceFilter(e.target.value ? Number(e.target.value) : '')}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="">Any price</option>
              {MAX_PRICE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {formatGBP(p)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState onOpenLead={() => setLeadOpen(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => {
            const coverUrl = coverUrls[listing.id];
            return (
              <ListingCard
                key={listing.id}
                listing={listing}
                coverImageUrl={coverUrl}
              />
            );
          })}
        </div>
      )}

      {leadOpen && (
        <LeadModal context="general" onClose={() => setLeadOpen(false)} />
      )}
    </div>
  );
}
