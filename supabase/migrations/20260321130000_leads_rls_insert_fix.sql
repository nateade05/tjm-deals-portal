-- Fix: "new row violates row level security policy for table leads"
-- Run this in Supabase SQL Editor if you already applied an older leads migration
-- that used `TO anon` only and inserts still fail.

alter table public.leads enable row level security;

drop policy if exists "Public can submit leads" on public.leads;
drop policy if exists "allow_public_lead_inserts" on public.leads;
drop policy if exists "leads_insert_anon" on public.leads;
drop policy if exists "leads_insert_public" on public.leads;

create policy "allow_public_lead_inserts"
  on public.leads
  as permissive
  for insert
  to public
  with check (true);

grant usage on schema public to anon;
grant insert on table public.leads to anon;
grant insert on table public.leads to authenticated;

-- Keep admin read policy if missing
drop policy if exists "Authenticated users can read leads" on public.leads;
create policy "Authenticated users can read leads"
  on public.leads
  for select
  to authenticated
  using (true);
