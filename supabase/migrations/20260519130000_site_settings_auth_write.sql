-- Allow authenticated users (admin session) to write site_settings.
-- The application layer enforces admin-only access via requireAdminSession().

create policy "site_settings_authenticated_write" on public.site_settings
  for all
  to authenticated
  using (true)
  with check (true);
