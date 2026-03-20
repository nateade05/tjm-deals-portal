'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Listing, ListingStatus } from '@/lib/supabase/types';

type StatusFilter = 'all' | ListingStatus;
type CategoryFilter = 'all' | Listing['category'];

interface Props {
  status: StatusFilter;
  category: CategoryFilter;
}

export function AdminListingsFilters({ status, category }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateStatus(value: StatusFilter) {
    const u = new URLSearchParams(searchParams.toString());
    if (value === 'all') u.delete('status');
    else u.set('status', value);
    router.push(`/admin/listings?${u.toString()}`);
  }

  function updateCategory(value: CategoryFilter) {
    const u = new URLSearchParams(searchParams.toString());
    if (value === 'all') u.delete('category');
    else u.set('category', value);
    router.push(`/admin/listings?${u.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-zinc-500">Filters:</span>
      <select
        value={status}
        onChange={(e) => updateStatus(e.target.value as StatusFilter)}
        className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900"
      >
        <option value="all">All statuses</option>
        <option value="draft">Draft</option>
        <option value="live">Live</option>
        <option value="sold">Sold</option>
        <option value="closed">Closed</option>
        <option value="archived">Archived</option>
      </select>
      <select
        value={category}
        onChange={(e) => updateCategory(e.target.value as CategoryFilter)}
        className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900"
      >
        <option value="all">All categories</option>
        <option value="in_stock">In stock</option>
        <option value="opportunity">Opportunity</option>
      </select>
    </div>
  );
}
