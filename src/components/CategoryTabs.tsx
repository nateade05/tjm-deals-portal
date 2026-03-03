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
    <div className="flex w-full rounded-full border border-slate-200 bg-slate-50 p-1 text-xs sm:text-sm dark:border-slate-800 dark:bg-slate-900/80">
      {TABS.map(({ value, label }) => {
        const isActive = current === value;
        const href = `/listings?category=${value}`;
        return (
          <Link
            key={value}
            href={href}
            className={`flex-1 rounded-full px-3 py-2.5 text-center font-medium transition-colors ${
              isActive
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
