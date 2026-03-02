'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { ListingCategory } from '@/lib/supabase/types';

const TABS: { value: ListingCategory; label: string }[] = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'opportunity', label: 'Opportunities' },
];

export function CategoryTabs() {
  const searchParams = useSearchParams();
  const current = (searchParams.get('category') as ListingCategory) || 'in_stock';

  return (
    <div className="flex gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
      {TABS.map(({ value, label }) => {
        const isActive = current === value;
        const href = `/listings?category=${value}`;
        return (
          <Link
            key={value}
            href={href}
            className={`min-w-[7rem] rounded-md px-4 py-2.5 text-center text-sm font-medium transition-colors ${
              isActive
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
