import Link from 'next/link';
import { fetchListings } from '@/lib/actions/listings';
import { AdminListingStatusSelect } from '@/components/AdminListingStatusSelect';
import { AdminListingsRowActions } from '@/components/admin/AdminListingsRowActions';
import { formatGBP, formatMiles } from '@/lib/format';
import { PRICING_CATEGORY_LABELS } from '@/lib/pricingCategory';
import type { Listing, ListingStatus } from '@/lib/supabase/types';
import { AdminListingsFilters } from './AdminListingsFilters';

type StatusFilter = 'all' | ListingStatus;
type CategoryFilter = 'all' | Listing['category'];

interface PageProps {
  searchParams: Promise<{ status?: string; category?: string }>;
}

function formatListedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function listingHeadline(row: Listing): string {
  const auto = [row.year, row.make, row.model].filter(Boolean).map(String).join(' ').trim();
  return auto || row.title;
}

export default async function AdminListingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = (params.status as StatusFilter) ?? 'all';
  const category = (params.category as CategoryFilter) ?? 'all';

  const listings = await fetchListings({ status, category });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-zinc-900 sm:text-2xl">Listings</h1>
        <Link
          href="/admin/listings/new"
          className="inline-flex w-fit items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          New listing
        </Link>
      </div>

      <AdminListingsFilters status={status} category={category} />

      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-4 py-2 font-medium text-zinc-700">Status</th>
              <th className="px-4 py-2 font-medium text-zinc-700">Type</th>
              <th className="px-4 py-2 font-medium text-zinc-700">Pricing cat.</th>
              <th className="px-4 py-2 font-medium text-zinc-700">Title</th>
              <th className="px-4 py-2 font-medium text-zinc-700">Year</th>
              <th className="px-4 py-2 font-medium text-zinc-700">Make</th>
              <th className="px-4 py-2 font-medium text-zinc-700">Model</th>
              <th className="px-4 py-2 font-medium text-zinc-700">Colour</th>
              <th className="px-4 py-2 font-medium text-zinc-700">Mileage</th>
              <th className="px-4 py-2 font-medium text-zinc-700">Your price</th>
              <th className="px-4 py-2 font-medium text-zinc-700">Listed at</th>
              <th className="px-4 py-2 font-medium text-zinc-700">Edit</th>
              <th className="px-4 py-2 text-right font-medium text-zinc-700">Sold / archive</th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-4 py-6 text-center text-zinc-500">
                  No listings match the filters.
                </td>
              </tr>
            ) : (
              listings.map((row) => (
                <tr key={row.id} className="border-b border-zinc-100">
                  <td className="px-4 py-2">
                    <AdminListingStatusSelect listingId={row.id} currentStatus={row.status} />
                  </td>
                  <td className="px-4 py-2 text-zinc-600">
                    {row.category === 'in_stock' ? 'In stock' : 'Opportunity'}
                  </td>
                  <td className="px-4 py-2 text-zinc-600">
                    {row.pricing_category ? PRICING_CATEGORY_LABELS[row.pricing_category] : '—'}
                  </td>
                  <td className="px-4 py-2 font-medium text-zinc-900">{row.title}</td>
                  <td className="px-4 py-2 text-zinc-600">{row.year ?? '—'}</td>
                  <td className="px-4 py-2 text-zinc-600">{row.make ?? '—'}</td>
                  <td className="px-4 py-2 text-zinc-600">{row.model ?? '—'}</td>
                  <td className="max-w-[8rem] px-4 py-2 text-zinc-600 break-words">{row.colour ?? '—'}</td>
                  <td className="px-4 py-2 text-zinc-600">{formatMiles(row.mileage_mi)}</td>
                  <td className="px-4 py-2 text-zinc-600">{formatGBP(row.price_landed_gbp)}</td>
                  <td className="px-4 py-2 text-zinc-600">{formatListedAt(row.listed_at)}</td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/admin/listings/${row.id}/edit`}
                      className="text-zinc-600 underline hover:text-zinc-900"
                    >
                      Edit
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <AdminListingsRowActions
                      listingId={row.id}
                      status={row.status}
                      listingTitle={listingHeadline(row)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
