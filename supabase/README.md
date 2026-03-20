# Supabase migrations

Apply SQL in `migrations/` from the Supabase SQL editor (or your migration workflow).

**Required for this app version:** run `migrations/20260302120000_listings_pricing_category.sql` so `listings.pricing_category` exists. Without it, creating/updating listings with the new field may fail.
