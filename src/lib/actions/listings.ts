'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import type { Listing, ListingMedia, ListingStatus } from '@/lib/supabase/types';

function rowToListing(row: {
  id: string;
  title: string;
  make: string | null;
  model: string | null;
  year: number | null;
  mileage_mi: number | null;
  colour: string | null;
  transmission: string | null;
  fuel: string | null;
  category: string;
  status: string;
  price_landed_gbp: number | null;
  estimated_resale_gbp: number | null;
  description: string | null;
  listed_at: string;
  created_at: string;
  updated_at: string;
}): Listing {
  return {
    id: row.id,
    title: row.title,
    make: row.make,
    model: row.model,
    year: row.year,
    mileage_mi: row.mileage_mi,
    colour: row.colour,
    transmission: row.transmission,
    fuel: row.fuel,
    category: row.category as Listing['category'],
    status: row.status as Listing['status'],
    price_landed_gbp: row.price_landed_gbp,
    estimated_resale_gbp: row.estimated_resale_gbp,
    description: row.description,
    listed_at: row.listed_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function computeAutoTitle(year: number | null, make: string | null, model: string | null): string {
  return [year, make, model].filter(Boolean).map(String).join(' ').trim() || 'Untitled listing';
}

export async function createListing(formData: FormData): Promise<{ id: string } | { error: string }> {
  const supabase = await supabaseServer();
  const category = (formData.get('category') as Listing['category']) || 'in_stock';

  const yearVal = formData.get('year');
  const year = yearVal !== null && yearVal !== '' && !Number.isNaN(Number(yearVal)) ? Number(yearVal) : null;
  const make = (formData.get('make') as string)?.trim() || null;
  const model = (formData.get('model') as string)?.trim() || null;
  const titleRaw = (formData.get('title') as string)?.trim();
  const title = titleRaw ? titleRaw : computeAutoTitle(year, make, model);

  const mileageMi = formData.get('mileage_mi');
  const mileage_mi = mileageMi !== null && mileageMi !== '' && !Number.isNaN(Number(mileageMi))
    ? Number(mileageMi)
    : null;
  const priceVal = formData.get('price_landed_gbp');
  const price_landed_gbp = priceVal !== null && priceVal !== '' && !Number.isNaN(Number(priceVal)) ? Number(priceVal) : null;
  const resaleVal = formData.get('estimated_resale_gbp');
  const estimated_resale_gbp = resaleVal !== null && resaleVal !== '' && !Number.isNaN(Number(resaleVal)) ? Number(resaleVal) : null;

  const { data, error } = await supabase
    .from('listings')
    .insert({
      title,
      category,
      status: 'draft',
      make,
      model,
      year,
      mileage_mi,
      colour: (formData.get('colour') as string) || null,
      transmission: (formData.get('transmission') as string) || null,
      fuel: (formData.get('fuel') as string) || null,
      price_landed_gbp,
      estimated_resale_gbp,
      description: (formData.get('description') as string) || null,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/admin/listings');
  return { id: data.id };
}

export async function createListingAndRedirect(formData: FormData) {
  const result = await createListing(formData);
  if ('error' in result) return result;
  redirect(`/admin/listings/${result.id}/edit`);
}

/** No-op for ListingForm when mode is edit (createAction unused). */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function noopCreateAction(_formData: FormData) {
  return {};
}

/** No-op for ListingForm when mode is create (updateAction unused). */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function noopUpdateAction(_formData: FormData) {
  return {};
}

export async function updateListing(
  id: string,
  formData: FormData
): Promise<{ ok: true } | { error: string }> {
  const supabase = await supabaseServer();
  const title = formData.get('title') as string;
  const category = (formData.get('category') as Listing['category']) || 'in_stock';
  if (!title?.trim()) return { error: 'Title is required' };

  const mileageMi = formData.get('mileage_mi');
  const mileage_mi = mileageMi !== null && mileageMi !== '' && !Number.isNaN(Number(mileageMi))
    ? Number(mileageMi)
    : null;
  const yearVal = formData.get('year');
  const year = yearVal !== null && yearVal !== '' && !Number.isNaN(Number(yearVal)) ? Number(yearVal) : null;
  const priceVal = formData.get('price_landed_gbp');
  const price_landed_gbp = priceVal !== null && priceVal !== '' && !Number.isNaN(Number(priceVal)) ? Number(priceVal) : null;
  const resaleVal = formData.get('estimated_resale_gbp');
  const estimated_resale_gbp = resaleVal !== null && resaleVal !== '' && !Number.isNaN(Number(resaleVal)) ? Number(resaleVal) : null;

  const { error } = await supabase
    .from('listings')
    .update({
      title: title.trim(),
      category,
      make: (formData.get('make') as string) || null,
      model: (formData.get('model') as string) || null,
      year,
      mileage_mi,
      colour: (formData.get('colour') as string) || null,
      transmission: (formData.get('transmission') as string) || null,
      fuel: (formData.get('fuel') as string) || null,
      price_landed_gbp,
      estimated_resale_gbp,
      description: (formData.get('description') as string) || null,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/listings');
  revalidatePath(`/admin/listings/${id}/edit`);
  return { ok: true };
}

export async function updateListingFromForm(formData: FormData): Promise<{ ok?: true; error?: string }> {
  const id = formData.get('listing_id') as string | null;
  if (!id) return { error: 'Missing listing id' };
  return updateListing(id, formData);
}

export async function setListingStatus(
  id: string,
  status: ListingStatus
): Promise<{ ok: true } | { error: string }> {
  const supabase = await supabaseServer();
  const { error } = await supabase.from('listings').update({ status }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/listings');
  revalidatePath(`/admin/listings/${id}/edit`);
  return { ok: true };
}

export async function fetchListings(filters: {
  status?: 'all' | ListingStatus;
  category?: 'all' | Listing['category'];
}): Promise<Listing[]> {
  const supabase = await supabaseServer();
  let q = supabase
    .from('listings')
    .select('*')
    .order('updated_at', { ascending: false });

  if (filters.status && filters.status !== 'all') {
    q = q.eq('status', filters.status);
  }
  if (filters.category && filters.category !== 'all') {
    q = q.eq('category', filters.category);
  }

  const { data, error } = await q;
  if (error) return [];
  return (data ?? []).map(rowToListing);
}

export async function fetchListingById(id: string): Promise<Listing | null> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
  if (error || !data) return null;
  return rowToListing(data);
}

export async function fetchListingMedia(listingId: string): Promise<ListingMedia[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from('listing_media')
    .select('*')
    .eq('listing_id', listingId)
    .order('sort_order', { ascending: true });
  if (error) return [];
  return (data ?? []) as ListingMedia[];
}

export async function insertMediaRows(
  listingId: string,
  items: { type: 'image' | 'video'; storage_path: string; sort_order: number }[]
): Promise<{ ok: true } | { error: string }> {
  const supabase = await supabaseServer();
  const rows = items.map((item) => ({
    listing_id: listingId,
    type: item.type,
    storage_path: item.storage_path,
    sort_order: item.sort_order,
  }));
  const { error } = await supabase.from('listing_media').insert(rows);
  if (error) return { error: error.message };
  revalidatePath(`/admin/listings/${listingId}/edit`);
  return { ok: true };
}

export async function reorderMedia(
  listingId: string,
  mediaId: string,
  direction: 'up' | 'down'
): Promise<{ ok: true } | { error: string }> {
  const supabase = await supabaseServer();
  const media = await fetchListingMedia(listingId);
  const idx = media.findIndex((m) => m.id === mediaId);
  if (idx < 0) return { error: 'Media not found' };
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= media.length) return { ok: true };

  const a = media[idx];
  const b = media[swapIdx];
  const aOrder = a.sort_order;
  const bOrder = b.sort_order;

  const { error: e1 } = await supabase.from('listing_media').update({ sort_order: bOrder }).eq('id', a.id);
  if (e1) return { error: e1.message };
  const { error: e2 } = await supabase.from('listing_media').update({ sort_order: aOrder }).eq('id', b.id);
  if (e2) return { error: e2.message };
  revalidatePath(`/admin/listings/${listingId}/edit`);
  return { ok: true };
}

export async function deleteMedia(mediaId: string): Promise<{ ok: true } | { error: string }> {
  const supabase = await supabaseServer();
  const { data: row } = await supabase.from('listing_media').select('listing_id, storage_path').eq('id', mediaId).single();
  if (!row) return { error: 'Media not found' };

  await supabase.storage.from('listing-media').remove([row.storage_path]);
  const { error } = await supabase.from('listing_media').delete().eq('id', mediaId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/listings/${row.listing_id}/edit`);
  return { ok: true };
}
