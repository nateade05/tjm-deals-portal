-- PostgREST upsert uses ON CONFLICT (listing_id); requires UNIQUE on listing_id.
-- Fixes: "there is no unique or exclusion constraint matching the ON CONFLICT specification"
-- Safe if constraint already exists from 20260322120000.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public'
      AND t.relname = 'sales_attribution'
      AND c.contype = 'u'
      AND c.conname = 'sales_attribution_listing_unique'
  ) THEN
    ALTER TABLE public.sales_attribution
      ADD CONSTRAINT sales_attribution_listing_unique UNIQUE (listing_id);
  END IF;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION
      'Cannot add UNIQUE(listing_id): duplicate listing_id rows in sales_attribution. Remove duplicates in SQL, then re-run.';
  WHEN duplicate_object THEN
    NULL;
END $$;
