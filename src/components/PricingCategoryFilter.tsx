'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PRICING_CATEGORY_LABELS, PRICING_CATEGORY_VALUES } from '@/lib/pricingCategory';

function buildHref(categoryTab: string | null, pricingValue: string) {
  const sp = new URLSearchParams();
  if (categoryTab === 'in_stock' || categoryTab === 'opportunity') {
    sp.set('category', categoryTab);
  }
  if (pricingValue && pricingValue !== 'all') {
    sp.set('pricingCategory', pricingValue);
  }
  const q = sp.toString();
  return q ? `/listings?${q}` : '/listings';
}

export function PricingCategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryTab = searchParams.get('category');
  const current = searchParams.get('pricingCategory') || 'all';

  const options: { value: string; label: string }[] = [
    { value: 'all', label: 'All categories' },
    ...PRICING_CATEGORY_VALUES.map((v) => ({ value: v, label: PRICING_CATEGORY_LABELS[v] })),
  ];

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4 sm:p-5">
      <label htmlFor="pricing-category-filter" className="block text-xs font-medium text-muted">
        Pricing category
      </label>
      <select
        id="pricing-category-filter"
        value={current}
        onChange={(e) => {
          router.push(buildHref(categoryTab, e.target.value));
        }}
        className="mt-2 w-full max-w-md rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-muted">Filter by market segment (same segments as the homepage).</p>
    </div>
  );
}
