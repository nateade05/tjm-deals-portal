-- Pricing segment for listings (homepage tiles / filters).
-- Run in Supabase SQL editor or via CLI if you use migrations.

alter table public.listings
  add column if not exists pricing_category text;

alter table public.listings
  drop constraint if exists listings_pricing_category_check;

alter table public.listings
  add constraint listings_pricing_category_check
  check (
    pricing_category is null
    or pricing_category in ('premium_economy', 'economy', 'premium_suvs', 'luxury')
  );

comment on column public.listings.pricing_category is
  'Market segment: premium_economy | economy | premium_suvs | luxury; null = unset';

create index if not exists listings_pricing_category_idx
  on public.listings (pricing_category)
  where status = 'live';
