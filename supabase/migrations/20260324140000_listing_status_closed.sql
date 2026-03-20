-- Terminal status: listing taken off the public site after sale attribution is recorded.

alter table public.listings
  drop constraint if exists listings_status_check;

alter table public.listings
  add constraint listings_status_check
  check (status in ('draft', 'live', 'sold', 'archived', 'closed'));

comment on column public.listings.status is
  'draft | live (public) | sold (mark-sold button) | closed (attribution saved, off site) | archived';
