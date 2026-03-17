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
    <div className="flex w-full rounded-full border border-border-subtle bg-surface-alt p-1 text-xs sm:text-sm">
      {TABS.map(({ value, label }) => {
        const isActive = current === value;
        const href = `/listings?category=${value}`;
        return (
          <Link
            key={value}
            href={href}
            className={`flex-1 rounded-full px-3 py-2.5 text-center font-medium transition-colors ${
              isActive
                ? 'bg-surface text-primary shadow-sm'
                : 'text-secondary hover:text-primary transition-colors'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
