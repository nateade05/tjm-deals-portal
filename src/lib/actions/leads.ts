'use server';

import { supabaseServer } from '@/lib/supabase/server';
import type { Lead, LeadAttributionPick } from '@/lib/supabase/types';

/** Count leads created in the last N days. */
export async function fetchLeadsCountSince(days: number): Promise<number> {
  const supabase = await supabaseServer();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceIso = since.toISOString();

  const { count, error } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sinceIso);

  if (error) return 0;
  return count ?? 0;
}

const LEAD_COLUMNS =
  'id, listing_id, name, phone, email, country, company, website, message, status, source, created_at' as const;

/** All leads for admin (newest first). Requires authenticated SELECT RLS policy. */
export async function fetchLeads(limit = 500): Promise<Lead[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from('leads')
    .select(LEAD_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[fetchLeads]', error.message, error.code, error.details);
    return [];
  }
  return (data ?? []).map((row) => {
    const r = row as Lead & { source?: string };
    const source = r.source === 'other' ? 'other' : 'website';
    return { ...r, source } as Lead;
  });
}

const LEAD_PICK_COLUMNS =
  'id, listing_id, name, phone, email, country, source, created_at' as const;

/** Leads tied to a listing (for sale attribution picker). */
export async function fetchLeadsForListing(listingId: string, limit = 80): Promise<LeadAttributionPick[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from('leads')
    .select(LEAD_PICK_COLUMNS)
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[fetchLeadsForListing]', error.message);
    return [];
  }
  return (data ?? []).map((row) => {
    const r = row as LeadAttributionPick & { source?: string };
    const source = r.source === 'other' ? 'other' : 'website';
    return { ...r, source };
  });
}

/** Recent leads for attribution when picking a lead not scoped to listing. */
export async function fetchLeadsRecentForPicker(limit = 200): Promise<LeadAttributionPick[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from('leads')
    .select(LEAD_PICK_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[fetchLeadsRecentForPicker]', error.message);
    return [];
  }
  return (data ?? []).map((row) => {
    const r = row as LeadAttributionPick & { source?: string };
    const source = r.source === 'other' ? 'other' : 'website';
    return { ...r, source };
  });
}
