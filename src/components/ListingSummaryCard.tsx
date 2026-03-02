'use client';

import type { Listing } from '@/lib/supabase/types';
import { formatGBP, formatMiles } from '@/lib/format';

function computeTitle(listing: Listing): string {
  return [listing.year, listing.make, listing.model].filter(Boolean).map(String).join(' ').trim() || listing.title || '—';
}

function displayColour(colour: string | null): string {
  if (!colour) return '—';
  if (colour.startsWith('Other:')) return `Other: ${colour.slice(6).trim()}`;
  return colour;
}

interface ListingSummaryCardProps {
  listing: Listing;
  onEditDetails: () => void;
}

export function ListingSummaryCard({ listing, onEditDetails }: ListingSummaryCardProps) {
  const title = computeTitle(listing);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Listing details</h2>
        <button
          type="button"
          onClick={onEditDetails}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Edit details
        </button>
      </div>
      <dl className="mt-4 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">Category</dt>
          <dd className="font-medium text-zinc-900">
            {listing.category === 'in_stock' ? 'In stock' : 'Opportunity'}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Year / Make / Model</dt>
          <dd className="font-medium text-zinc-900">
            {[listing.year, listing.make, listing.model].filter(Boolean).join(' ') || '—'}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Mileage</dt>
          <dd className="font-medium text-zinc-900">{formatMiles(listing.mileage_mi)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Colour</dt>
          <dd className="font-medium text-zinc-900">{displayColour(listing.colour)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Transmission</dt>
          <dd className="font-medium text-zinc-900">{listing.transmission || '—'}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Fuel</dt>
          <dd className="font-medium text-zinc-900">{listing.fuel || '—'}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Price landed</dt>
          <dd className="font-medium text-zinc-900">{formatGBP(listing.price_landed_gbp)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Est. resale</dt>
          <dd className="font-medium text-zinc-900">{formatGBP(listing.estimated_resale_gbp)}</dd>
        </div>
      </dl>
      {listing.description && (
        <div className="mt-4 border-t border-zinc-100 pt-4">
          <h3 className="text-sm font-semibold text-zinc-800">Description</h3>
          <p className="mt-1 text-sm text-zinc-700">{listing.description}</p>
        </div>
      )}
      <div className="mt-4 border-t border-zinc-100 pt-4">
        <h3 className="text-sm font-semibold text-zinc-800">Listing title</h3>
        <p className="mt-1 text-base font-medium text-zinc-900">{title}</p>
      </div>
    </div>
  );
}
