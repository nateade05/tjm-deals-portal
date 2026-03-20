'use client';

import { useMemo, useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ListingCard } from '@/components/ListingCard';
import { EmptyState } from '@/components/EmptyState';
import { LeadModal } from '@/components/LeadModalLazy';
import { CategoryTabs } from '@/components/CategoryTabs';
import type { Listing } from '@/lib/supabase/types';
import { formatGBP } from '@/lib/format';
import { CAR_MAKES } from '@/lib/carOptions';
import { buildListingsHref } from '@/lib/listingsHref';
import { isPricingCategory, PRICING_CATEGORY_LABELS, PRICING_CATEGORY_VALUES } from '@/lib/pricingCategory';

const MAX_PRICE_OPTIONS = Array.from({ length: 50 }, (_, i) => (i + 1) * 1000);

interface ListingsClientProps {
  initialListings: Listing[];
  coverUrls: Record<string, string | undefined>;
}

/** Curated marketplace control strip — tabs + refinements in one system (not stacked forms). */
const selectChrome =
  'min-h-[44px] rounded-lg border-0 bg-transparent py-2 pl-0 pr-7 text-sm font-medium text-primary shadow-none ring-0 focus:ring-0 focus:outline-none cursor-pointer sm:min-h-0 sm:py-1.5';

export function ListingsClient({ initialListings, coverUrls }: ListingsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryTab = searchParams.get('category');
  const urlPricing = searchParams.get('pricingCategory') || 'all';

  const [makeFilter, setMakeFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | ''>('');
  const [leadOpen, setLeadOpen] = useState(false);

  const pushUrl = useCallback(
    (next: { categoryTab: string | null; pricingCategory: string }) => {
      router.push(buildListingsHref(next));
    },
    [router]
  );

  const filtered = useMemo(() => {
    return initialListings.filter((listing) => {
      if (makeFilter) {
        const listingMake = (listing.make ?? '').trim();
        if (!listingMake || listingMake.toLowerCase() !== makeFilter.toLowerCase()) return false;
      }
      if (maxPriceFilter !== '') {
        const max = maxPriceFilter as number;
        if (listing.price_landed_gbp == null || listing.price_landed_gbp > max) return false;
      }
      return true;
    });
  }, [initialListings, makeFilter, maxPriceFilter]);

  const hasClientFilters = Boolean(makeFilter || maxPriceFilter !== '');
  const hasUrlPricing = urlPricing !== 'all';

  const clearAllFilters = () => {
    setMakeFilter('');
    setMaxPriceFilter('');
    pushUrl({ categoryTab, pricingCategory: 'all' });
  };

  const clearPricingOnly = () => {
    pushUrl({ categoryTab, pricingCategory: 'all' });
  };

  return (
    <div className="space-y-4">
      {/* Single marketplace toolbar: inventory scope + refinements */}
      <div className="overflow-hidden rounded-xl border border-border-subtle/55 bg-surface/95 ring-1 ring-black/[0.025]">
        <div className="border-b border-border-subtle/40 bg-background/40 px-2.5 py-2 sm:px-3 sm:py-2.5">
          <CategoryTabs />
        </div>
        <div className="flex flex-col gap-2.5 px-2.5 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-0 sm:gap-y-2 sm:px-3 sm:py-2.5">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1 gap-y-2 sm:gap-x-0">
            <span className="hidden shrink-0 text-[10px] font-medium uppercase tracking-[0.12em] text-muted/55 sm:mr-2.5 sm:inline">
              Refine
            </span>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="group relative flex min-w-[7.5rem] flex-1 items-baseline gap-1.5 border-b border-border-subtle/50 pb-0.5 sm:min-w-[8.5rem] sm:max-w-[11rem] sm:border-0 sm:pb-0">
                <label htmlFor="filter-make" className="sr-only">
                  Make
                </label>
                <span className="pointer-events-none text-[9px] font-medium uppercase tracking-[0.08em] text-muted/50">
                  Make
                </span>
                <select
                  id="filter-make"
                  value={makeFilter}
                  onChange={(e) => setMakeFilter(e.target.value)}
                  className={`${selectChrome} min-w-0 flex-1`}
                >
                  <option value="">Any</option>
                  {CAR_MAKES.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </div>
              <div className="group relative flex min-w-[7.5rem] flex-1 items-baseline gap-1.5 border-b border-border-subtle/50 pb-0.5 sm:min-w-[8.5rem] sm:max-w-[11rem] sm:border-0 sm:pb-0">
                <label htmlFor="filter-max-price" className="sr-only">
                  Max price
                </label>
                <span className="pointer-events-none text-[9px] font-medium uppercase tracking-[0.08em] text-muted/50">
                  Max
                </span>
                <select
                  id="filter-max-price"
                  value={maxPriceFilter === '' ? '' : String(maxPriceFilter)}
                  onChange={(e) => setMaxPriceFilter(e.target.value ? Number(e.target.value) : '')}
                  className={`${selectChrome} min-w-0 flex-1`}
                >
                  <option value="">Any</option>
                  {MAX_PRICE_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {formatGBP(p)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="group relative flex min-w-0 flex-[1.2] items-baseline gap-1.5 border-b border-border-subtle/50 pb-0.5 sm:min-w-[10rem] sm:max-w-[14rem] sm:border-0 sm:pb-0">
                <label htmlFor="filter-pricing-category" className="sr-only">
                  Pricing category
                </label>
                <span className="pointer-events-none shrink-0 text-[9px] font-medium uppercase tracking-[0.08em] text-muted/50">
                  Segment
                </span>
                <select
                  id="filter-pricing-category"
                  value={urlPricing}
                  onChange={(e) => pushUrl({ categoryTab, pricingCategory: e.target.value })}
                  className={`${selectChrome} min-w-0 flex-1`}
                >
                  <option value="all">All</option>
                  {PRICING_CATEGORY_VALUES.map((v) => (
                    <option key={v} value={v}>
                      {PRICING_CATEGORY_LABELS[v]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results context — calm hierarchy */}
      <div className="flex flex-col gap-2.5 border-b border-border-subtle/40 pb-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Inventory</p>
          <p className="mt-0.5 text-lg font-bold tabular-nums tracking-tight text-primary sm:text-xl">
            {filtered.length}
            <span className="ml-1.5 text-sm font-semibold text-secondary">
              {filtered.length === 1 ? 'vehicle' : 'vehicles'}
            </span>
          </p>
        </div>
        {(hasClientFilters || hasUrlPricing) && (
          <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
            {hasUrlPricing && (
              <button
                type="button"
                onClick={clearPricingOnly}
                className="inline-flex items-center gap-0.5 rounded-md bg-section-soft/55 px-1.5 py-0.5 text-[10px] font-medium text-secondary/90 ring-1 ring-border-subtle/40 transition-colors hover:bg-gold-tint/35 hover:text-primary hover:ring-border-subtle/55"
              >
                {isPricingCategory(urlPricing) ? PRICING_CATEGORY_LABELS[urlPricing] : urlPricing}
                <span className="opacity-60" aria-hidden>
                  ×
                </span>
              </button>
            )}
            {makeFilter && (
              <button
                type="button"
                onClick={() => setMakeFilter('')}
                className="inline-flex items-center gap-0.5 rounded-md bg-section-soft/55 px-1.5 py-0.5 text-[10px] font-medium text-secondary/90 ring-1 ring-border-subtle/40 transition-colors hover:bg-gold-tint/35 hover:text-primary hover:ring-border-subtle/55"
              >
                {makeFilter}
                <span className="opacity-60" aria-hidden>
                  ×
                </span>
              </button>
            )}
            {maxPriceFilter !== '' && (
              <button
                type="button"
                onClick={() => setMaxPriceFilter('')}
                className="inline-flex items-center gap-0.5 rounded-md bg-section-soft/55 px-1.5 py-0.5 text-[10px] font-medium text-secondary/90 ring-1 ring-border-subtle/40 transition-colors hover:bg-gold-tint/35 hover:text-primary hover:ring-border-subtle/55"
              >
                ≤ {formatGBP(maxPriceFilter as number)}
                <span className="opacity-60" aria-hidden>
                  ×
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="ml-1 text-[11px] font-semibold text-gold underline-offset-4 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          variant={hasClientFilters || hasUrlPricing ? 'filtered' : 'empty'}
          onOpenLead={() => setLeadOpen(true)}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
          {filtered.map((listing, i) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              coverImageUrl={coverUrls[listing.id]}
              showCategoryBadge
              imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              imagePriority={i === 0}
            />
          ))}
        </div>
      )}

      {leadOpen && <LeadModal context="general" onClose={() => setLeadOpen(false)} />}
    </div>
  );
}
