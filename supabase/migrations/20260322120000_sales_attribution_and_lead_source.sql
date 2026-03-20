-- Sale attribution (one row per listing) + lead source for website vs other channels.

-- Leads: mark origin (public form = website; admin/other = other).
alter table public.leads
  add column if not exists source text not null default 'website'
  constraint leads_source_check check (source in ('website', 'other'));

comment on column public.leads.source is 'website: captured via site lead form; other: entered elsewhere (e.g. phone, walk-in).';

-- One attribution per listing; either linked lead or manual buyer details.
create table if not exists public.sales_attribution (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete set null,
  sold_price_gbp numeric(12, 2),
  sold_at timestamptz not null default now(),
  notes text,
  buyer_name text,
  buyer_phone text,
  buyer_email text,
  buyer_country text,
  created_at timestamptz not null default now(),
  constraint sales_attribution_listing_unique unique (listing_id),
  constraint sales_attribution_lead_or_manual check (
    lead_id is not null
    or (buyer_name is not null and length(trim(buyer_name)) > 0)
  )
);

-- If the table already existed from an older schema, CREATE TABLE was skipped and columns may be missing.
alter table public.sales_attribution
  add column if not exists sold_at timestamptz not null default now();

alter table public.sales_attribution
  add column if not exists buyer_name text,
  add column if not exists buyer_phone text,
  add column if not exists buyer_email text,
  add column if not exists buyer_country text;

create index if not exists sales_attribution_lead_id_idx on public.sales_attribution (lead_id);
create index if not exists sales_attribution_sold_at_idx on public.sales_attribution (sold_at desc);

comment on table public.sales_attribution is 'Admin-recorded sale: link to site lead or manual buyer; one row per listing.';

alter table public.sales_attribution enable row level security;

drop policy if exists "Authenticated full access sales_attribution" on public.sales_attribution;
create policy "Authenticated full access sales_attribution"
  on public.sales_attribution
  for all
  to authenticated
  using (true)
  with check (true);

grant select, insert, update, delete on table public.sales_attribution to authenticated;
