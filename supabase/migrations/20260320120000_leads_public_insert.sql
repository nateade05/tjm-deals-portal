-- Leads from the marketing site (POST /api/leads uses Supabase anon key).
-- Failure symptom: user sees "Failed to create lead" — almost always RLS blocking
-- INSERT for role `anon`, or missing `leads` table.
--
-- Apply in Supabase: SQL Editor → run this file, or `supabase db push`.
-- If you already have a `leads` table, skip CREATE TABLE and only add the policies
-- (or align columns manually, then add "Public can submit leads" for role `anon`).

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings (id) on delete set null,
  name text not null,
  phone text not null,
  email text not null,
  country text not null,
  company text,
  website text,
  message text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'negotiating', 'sold', 'lost')),
  created_at timestamptz not null default now()
);

comment on table public.leads is 'Inbound enquiries; public insert via Next.js /api/leads (anon key).';

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_listing_id_idx on public.leads (listing_id);

alter table public.leads enable row level security;

-- INSERT: use PUBLIC so anon JWT always matches (some projects see RLS fail with TO anon only).
drop policy if exists "Public can submit leads" on public.leads;
drop policy if exists "allow_public_lead_inserts" on public.leads;
drop policy if exists "leads_insert_anon" on public.leads;
create policy "allow_public_lead_inserts"
  on public.leads
  as permissive
  for insert
  to public
  with check (true);

-- Explicit table grants (RLS still applies unless service role; helps if defaults were changed).
grant usage on schema public to anon;
grant insert on table public.leads to anon;
grant insert on table public.leads to authenticated;

drop policy if exists "Authenticated users can read leads" on public.leads;
create policy "Authenticated users can read leads"
  on public.leads
  for select
  to authenticated
  using (true);
