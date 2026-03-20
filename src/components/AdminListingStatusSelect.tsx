'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setListingStatus } from '@/lib/actions/listings';
import type { ListingStatus } from '@/lib/supabase/types';

/** Sold / archived are set from the listings table actions, not this menu. */
const OPTIONS: { value: ListingStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'live', label: 'Live' },
];

interface AdminListingStatusSelectProps {
  listingId: string;
  currentStatus: ListingStatus;
}

function statusLabel(s: ListingStatus): string {
  switch (s) {
    case 'draft':
      return 'Draft';
    case 'live':
      return 'Live';
    case 'sold':
      return 'Sold';
    case 'archived':
      return 'Archived';
    default:
      return s;
  }
}

export function AdminListingStatusSelect({ listingId, currentStatus }: AdminListingStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as ListingStatus;
    const before = status;
    setStatus(value);
    const result = await setListingStatus(listingId, value);
    if ('error' in result && result.error) {
      setStatus(before);
      return;
    }
    router.refresh();
  }

  if (currentStatus === 'sold' || currentStatus === 'archived') {
    return (
      <span className="inline-flex rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-sm font-medium text-zinc-700">
        {statusLabel(currentStatus)}
      </span>
    );
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
