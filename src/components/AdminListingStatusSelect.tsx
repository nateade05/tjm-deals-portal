'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setListingStatus } from '@/lib/actions/listings';
import type { ListingStatus } from '@/lib/supabase/types';

const OPTIONS: { value: ListingStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'live', label: 'Live' },
  { value: 'sold', label: 'Sold' },
  { value: 'archived', label: 'Archived' },
];

interface AdminListingStatusSelectProps {
  listingId: string;
  currentStatus: ListingStatus;
}

export function AdminListingStatusSelect({ listingId, currentStatus }: AdminListingStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as ListingStatus;
    setStatus(value);
    const result = await setListingStatus(listingId, value);
    if ('error' in result && result.error) {
      setStatus(status);
      return;
    }
    router.refresh();
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
