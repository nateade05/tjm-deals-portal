'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { buildListingsHref } from '@/lib/listingsHref';
import type { ListingCategory } from '@/lib/supabase/types';

type TabValue = 'all' | ListingCategory;

const TABS: { value: TabValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'opportunity', label: 'Opportunities' },
];

interface CategoryTabsProps {
  className?: string;
}

export function CategoryTabs({ className = '' }: CategoryTabsProps) {
  const searchParams = useSearchParams();
  const pricingCategory = searchParams.get('pricingCategory');
  const raw = searchParams.get('category');
  const current: TabValue =
    raw === 'in_stock' || raw === 'opportunity' ? raw : 'all';

  return (
    <div
      className={`flex w-full rounded-full border border-border-subtle/45 bg-surface-alt/60 p-0.5 text-xs shadow-inner sm:text-sm ${className}`}
    >
      {TABS.map(({ value, label }) => {
        const isActive = current === value;
        const href = buildListingsHref({
          categoryTab: value === 'all' ? null : value,
          pricingCategory: pricingCategory || 'all',
        });
        return (
          <Link
            key={value}
            href={href}
            className={`flex min-h-[44px] flex-1 items-center justify-center rounded-full px-2 py-2 text-center text-[13px] font-semibold transition-all duration-200 motion-reduce:transition-none sm:min-h-0 sm:px-3 sm:py-2.5 sm:text-sm ${
              isActive
                ? 'bg-surface/95 text-primary ring-1 ring-border-subtle/35'
                : 'text-secondary hover:text-primary'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
