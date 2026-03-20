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

/** @param limit Max rows (default 500 for full attribution page). */
export async function fetchSaleAttributionsOverview(limit = 500): Promise<SaleAttributionOverview[]> {
  const supabase = await supabaseServer();
  const { data: rows, error } = await supabase
    .from('sales_attribution')
    .select('*')
    .order('sold_at', { ascending: false })
    .limit(limit);

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

/** Total rows in sales_attribution (dashboard stat). */
export async function fetchSalesAttributionCount(): Promise<number> {
  const supabase = await supabaseServer();
  const { count, error } = await supabase
    .from('sales_attribution')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('[fetchSalesAttributionCount]', error.message);
    return 0;
  }
  return count ?? 0;
}

export type ListingAttributionOption = { id: string; label: string; status: Listing['status'] };

/** Draft + live only — vehicles that can still be marked sold from the admin sale modal. */
export async function fetchListingOptionsForSaleModal(): Promise<ListingAttributionOption[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from('listings')
    .select('id, title, year, make, model, status')
    .in('status', ['draft', 'live'])
    .order('listed_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[fetchListingOptionsForSaleModal]', error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    label: listingLabel(row as Pick<Listing, 'title' | 'year' | 'make' | 'model'>),
    status: row.status as Listing['status'],
  }));
}

export type RecordSaleModalFixedLead = {
  id: string;
  label: string;
  source: LeadSource;
};

export type RecordSaleModalData = {
  listingFixed: { id: string; label: string } | null;
  listingOptions: ListingAttributionOption[];
  leadsPool: LeadAttributionPick[];
  leadFixed: RecordSaleModalFixedLead | null;
  /** When listing is not fixed, pre-select this id in the dropdown (e.g. lead’s listing). */
  suggestedListingId: string | null;
  existing: SalesAttribution | null;
};

/**
 * Unified “Record sale” modal payload: listing-first, lead-first, or both (linked lead + listing).
 */
export async function fetchRecordSaleModalData(params: {
  listingId?: string;
  leadId?: string;
}): Promise<RecordSaleModalData | null> {
  const { listingId, leadId } = params;
  if (!listingId && !leadId) return null;

  const listingOptionsAll = await fetchListingOptionsForSaleModal();

  let leadPick: LeadAttributionPick | null = null;
  if (leadId) {
    leadPick = await fetchLeadAttributionPickById(leadId);
    if (!leadPick) return null;
  }

  let listingFixed: { id: string; label: string } | null = null;
  if (listingId) {
    const listing = await fetchListingById(listingId);
    if (listing && (listing.status === 'live' || listing.status === 'draft')) {
      listingFixed = { id: listing.id, label: listingLabel(listing) };
    }
  }

  if (listingId && !listingFixed && !leadId) {
    return null;
  }

  let leadsPool: LeadAttributionPick[];
  if (listingFixed) {
    const [forL, recent] = await Promise.all([
      fetchLeadsForListing(listingFixed.id),
      fetchLeadsRecentForPicker(200),
    ]);
    leadsPool = mergeLeadsAttributionPool(forL, recent);
    if (leadPick) {
      leadsPool = mergeLeadsAttributionPool([leadPick], leadsPool);
    }
  } else {
    const recent = await fetchLeadsRecentForPicker(200);
    leadsPool = leadPick ? mergeLeadsAttributionPool([leadPick], recent) : recent;
  }

  const leadFixed: RecordSaleModalFixedLead | null = leadPick
    ? {
        id: leadPick.id,
        label: `${leadPick.name} · ${leadPick.email}`,
        source: leadPick.source === 'other' ? 'other' : 'website',
      }
    : null;

  let suggestedListingId: string | null = null;
  if (!listingFixed) {
    if (leadPick?.listing_id && listingOptionsAll.some((o) => o.id === leadPick.listing_id)) {
      suggestedListingId = leadPick.listing_id;
    } else if (listingOptionsAll[0]) {
      suggestedListingId = listingOptionsAll[0].id;
    }
  }

  const existing = listingFixed ? await fetchSaleAttributionByListingId(listingFixed.id) : null;

  return {
    listingFixed,
    listingOptions: listingFixed ? [] : listingOptionsAll,
    leadsPool,
    leadFixed,
    suggestedListingId,
    existing,
  };
}

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
  input: SaleAttributionFormInput,
  opts?: { /** Set false when “Mark as sold” modal will set `sold` right after */
    closeListing?: boolean }
): Promise<{ ok: true } | { error: string }> {
  const shouldCloseListing = opts?.closeListing !== false;
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

  // Prefer update/insert over upsert: ON CONFLICT requires UNIQUE(listing_id). Older DBs may lack it.
  const { data: existing, error: selErr } = await supabase
    .from('sales_attribution')
    .select('id')
    .eq('listing_id', payload.listing_id)
    .maybeSingle();

  if (selErr) {
    console.error('[upsertSaleAttribution] select', selErr.message, selErr.code);
    return { error: selErr.message || 'Could not save attribution' };
  }

  if (existing?.id) {
    const {
      lead_id,
      buyer_name,
      buyer_phone,
      buyer_email,
      buyer_country,
      sold_price_gbp,
      sold_at,
      notes,
    } = payload;
    const { error } = await supabase
      .from('sales_attribution')
      .update({
        lead_id,
        buyer_name,
        buyer_phone,
        buyer_email,
        buyer_country,
        sold_price_gbp,
        sold_at,
        notes,
      })
      .eq('listing_id', payload.listing_id);

    if (error) {
      console.error('[upsertSaleAttribution] update', error.message, error.code, error.details);
      return { error: error.message || 'Could not save attribution' };
    }
  } else {
    const { error } = await supabase.from('sales_attribution').insert(payload);

    if (error) {
      console.error('[upsertSaleAttribution] insert', error.message, error.code, error.details);
      return { error: error.message || 'Could not save attribution' };
    }
  }

  // Take listing off the public site (live/draft → closed). Leave sold/archived/closed unchanged.
  const { data: listingRow } = await supabase
    .from('listings')
    .select('status')
    .eq('id', payload.listing_id)
    .maybeSingle();

  const st = listingRow?.status as string | undefined;
  if (shouldCloseListing && (st === 'live' || st === 'draft')) {
    const { error: statusErr } = await supabase
      .from('listings')
      .update({ status: 'closed' })
      .eq('id', payload.listing_id);
    if (statusErr) {
      console.error('[upsertSaleAttribution] set closed', statusErr.message, statusErr.code);
      // Attribution row is already saved; don’t fail the whole action
    }
    revalidatePath('/');
    revalidatePath('/listings');
    revalidatePath(`/listings/${payload.listing_id}`);
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
