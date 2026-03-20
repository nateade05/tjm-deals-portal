import type { Listing, ListingCategory, ListingStatus, PricingCategory } from '@/lib/supabase/types';

/** Map a Supabase `listings` row to our `Listing` type (handles optional / new columns). */
export function listingFromDbRow(row: Record<string, unknown>): Listing {
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    make: (row.make as string | null) ?? null,
    model: (row.model as string | null) ?? null,
    year: (row.year as number | null) ?? null,
    mileage_mi: (row.mileage_mi as number | null) ?? null,
    colour: (row.colour as string | null) ?? null,
    transmission: (row.transmission as string | null) ?? null,
    fuel: (row.fuel as string | null) ?? null,
    category: row.category as ListingCategory,
    pricing_category: (row.pricing_category as PricingCategory | null | undefined) ?? null,
    status: row.status as ListingStatus,
    price_landed_gbp: (row.price_landed_gbp as number | null) ?? null,
    estimated_resale_gbp: (row.estimated_resale_gbp as number | null) ?? null,
    description: (row.description as string | null) ?? null,
    listed_at: String(row.listed_at ?? ''),
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  };
}
