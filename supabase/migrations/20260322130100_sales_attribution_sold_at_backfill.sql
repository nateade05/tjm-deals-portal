-- Run this if 20260322120000 failed partway: table existed without sold_at / buyer columns.
-- Safe to run multiple times (IF NOT EXISTS).

alter table public.sales_attribution
  add column if not exists sold_at timestamptz not null default now();

alter table public.sales_attribution
  add column if not exists buyer_name text,
  add column if not exists buyer_phone text,
  add column if not exists buyer_email text,
  add column if not exists buyer_country text;

create index if not exists sales_attribution_lead_id_idx on public.sales_attribution (lead_id);
create index if not exists sales_attribution_sold_at_idx on public.sales_attribution (sold_at desc);
