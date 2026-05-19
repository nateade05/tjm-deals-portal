-- Site-wide settings controlled from the admin portal.
-- Initially used for the "X cars and counting" homepage stat.

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Anyone can read; only service role can write
create policy "site_settings_public_read" on public.site_settings
  for select using (true);

-- Seed default value
insert into public.site_settings (key, value)
  values ('cars_sold_count', '0')
  on conflict (key) do nothing;
