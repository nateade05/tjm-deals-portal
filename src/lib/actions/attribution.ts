'use server';

import { revalidatePath } from 'next/cache';
import { fetchListingById } from '@/lib/actions/listings';
import { fetchLeadsForListing, fetchLeadsRecentForPicker } from '@/lib/actions/leads';
import { mergeLeadsAttributionPool } from '@/lib/leadsAttributionMerge';
import { supabaseServer } from '@/lib/supabase/server';
import type { LeadAttributionPick, LeadSource, Listing, SalesAttribution } from '@/lib/supabase/types';
import {
  saleAttributionFormSchema,
  toSaleAttributionPayload,
  type SaleAttributionFormInput,
} from '@/lib/validations/saleAttribution';

export type SaleAttributionOverview = SalesAttribution & {
  listingLabel: string;
  leadName: string | null;
  leadSource: LeadSource | null;
};

function listingLabel(row: Pick<Listing, 'title' | 'year' | 'make' | 'model'>): string {
  const auto = [row.year, row.make, row.model].filter(Boolean).map(String).join(' ').trim();
  return auto || row.title;
}

export async function fetchSaleAttributionByListingId(
  listingId: string
): Promise<SalesAttribution | null> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from('sales_attribution')
    .select('*')
    .eq('listing_id', listingId)
    .maybeSingle();

  if (error) {
    console.error('[fetchSaleAttributionByListingId]', error.message, error.code);
    return null;
  }
  return data as SalesAttribution | null;
}

export async function fetchSaleAttributionsOverview(): Promise<SaleAttributionOverview[]> {
  const supabase = await supabaseServer();
  const { data: rows, error } = await supabase
    .from('sales_attribution')
    .select('*')
    .order('sold_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[fetchSaleAttributionsOverview]', error.message, error.code);
    return [];
  }

  const attributions = (rows ?? []) as SalesAttribution[];
  if (attributions.length === 0) return [];

  const listingIds = [...new Set(attributions.map((a) => a.listing_id))];
  const leadIds = [...new Set(attributions.map((a) => a.lead_id).filter(Boolean))] as string[];

  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, year, make, model')
    .in('id', listingIds);

  const listingMap = new Map(
    (listings ?? []).map((l) => [l.id as string, l as Pick<Listing, 'id' | 'title' | 'year' | 'make' | 'model'>])
  );

  let leadMap = new Map<string, { name: string; source: LeadSource }>();
  if (leadIds.length > 0) {
    const { data: leads } = await supabase.from('leads').select('id, name, source').in('id', leadIds);
    leadMap = new Map(
      (leads ?? []).map((l) => {
        const src = l.source === 'other' ? 'other' : 'website';
        return [l.id as string, { name: l.name as string, source: src }];
      })
    );
  }

  return attributions.map((a) => {
    const L = listingMap.get(a.listing_id);
    const lead = a.lead_id ? leadMap.get(a.lead_id) : null;
    return {
      ...a,
      listingLabel: L ? listingLabel(L) : a.listing_id,
      leadName: lead?.name ?? null,
      leadSource: lead ? lead.source : null,
    };
  });
}

export type ListingAttributionOption = { id: string; label: string; status: Listing['status'] };

export async function fetchListingOptionsForAttribution(): Promise<ListingAttributionOption[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from('listings')
    .select('id, title, year, make, model, status')
    .neq('status', 'archived')
    .order('listed_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[fetchListingOptionsForAttribution]', error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    label: listingLabel(row as Pick<Listing, 'title' | 'year' | 'make' | 'model'>),
    status: row.status as Listing['status'],
  }));
}

export async function upsertSaleAttribution(
  input: SaleAttributionFormInput
): Promise<{ ok: true } | { error: string }> {
  const parsed = saleAttributionFormSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg =
      Object.values(first).flat()[0] ??
      parsed.error.issues[0]?.message ??
      'Invalid form';
    return { error: msg };
  }

  let payload;
  try {
    payload = toSaleAttributionPayload(parsed.data);
  } catch {
    return { error: 'Invalid sale date' };
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.from('sales_attribution').upsert(payload, {
    onConflict: 'listing_id',
  });

  if (error) {
    console.error('[upsertSaleAttribution]', error.message, error.code, error.details);
    return { error: error.message || 'Could not save attribution' };
  }

  revalidatePath('/admin/attribution');
  revalidatePath('/admin/listings');
  revalidatePath(`/admin/listings/${payload.listing_id}/edit`);
  revalidatePath('/admin/leads');
  return { ok: true };
}

export async function clearSaleAttribution(listingId: string): Promise<{ ok: true } | { error: string }> {
  const supabase = await supabaseServer();
  const { error } = await supabase.from('sales_attribution').delete().eq('listing_id', listingId);

  if (error) {
    console.error('[clearSaleAttribution]', error.message);
    return { error: error.message };
  }

  revalidatePath('/admin/attribution');
  revalidatePath('/admin/listings');
  revalidatePath(`/admin/listings/${listingId}/edit`);
  return { ok: true };
}

/** Resolve a lead for prefill (attribution page query). */
export async function fetchLeadAttributionPickById(
  leadId: string
): Promise<LeadAttributionPick | null> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from('leads')
    .select('id, listing_id, name, phone, email, country, source, created_at')
    .eq('id', leadId)
    .maybeSingle();

  if (error || !data) return null;
  const r = data as LeadAttributionPick & { source?: string };
  const source = r.source === 'other' ? 'other' : 'website';
  return { ...r, source };
}

/** Data for “Mark as sold” modal (draft/live only). */
export async function fetchMarkSoldModalData(
  listingId: string
): Promise<{ listingLabel: string; leadsPool: LeadAttributionPick[] } | null> {
  const listing = await fetchListingById(listingId);
  if (!listing || (listing.status !== 'live' && listing.status !== 'draft')) return null;
  const label = listingLabel(listing);
  const [forL, recent] = await Promise.all([
    fetchLeadsForListing(listingId),
    fetchLeadsRecentForPicker(200),
  ]);
  const leadsPool = mergeLeadsAttributionPool(forL, recent);
  return { listingLabel: label, leadsPool };
}

/** Sold listings with no `sales_attribution` row (reminder banner). */
export async function fetchSoldListingsMissingAttribution(): Promise<{ id: string; label: string }[]> {
  const supabase = await supabaseServer();
  const { data: soldRows, error: e1 } = await supabase
    .from('listings')
    .select('id, title, year, make, model')
    .eq('status', 'sold');

  if (e1 || !soldRows?.length) return [];

  const { data: attrRows, error: e2 } = await supabase.from('sales_attribution').select('listing_id');
  if (e2) return [];

  const attributed = new Set((attrRows ?? []).map((r) => r.listing_id as string));
  return soldRows
    .filter((r) => !attributed.has(r.id as string))
    .map((r) => ({
      id: r.id as string,
      label: listingLabel(r as Pick<Listing, 'title' | 'year' | 'make' | 'model'>),
    }));
}
