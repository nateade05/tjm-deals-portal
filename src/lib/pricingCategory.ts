import type { PricingCategory } from '@/lib/supabase/types';

/**
 * Database-backed pricing segment for listings (matches homepage category tiles).
 * Stored in Supabase as `listings.pricing_category`.
 */
export const PRICING_CATEGORY_VALUES: readonly PricingCategory[] = [
  'premium_economy',
  'economy',
  'premium_suvs',
  'luxury',
] as const;

export const PRICING_CATEGORY_LABELS: Record<PricingCategory, string> = {
  premium_economy: 'Premium economy',
  economy: 'Economy',
  premium_suvs: 'Premium SUVs',
  luxury: 'Luxury',
};

export function isPricingCategory(value: string | null | undefined): value is PricingCategory {
  return value != null && (PRICING_CATEGORY_VALUES as readonly string[]).includes(value);
}

export function pricingCategoryFromQuery(value: string | null | undefined): PricingCategory | null {
  if (!value || value === 'all') return null;
  return isPricingCategory(value) ? value : null;
}
