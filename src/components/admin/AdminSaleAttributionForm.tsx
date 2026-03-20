'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { upsertSaleAttribution, clearSaleAttribution } from '@/lib/actions/attribution';
import type { LeadAttributionPick, SalesAttribution } from '@/lib/supabase/types';
import type { ListingAttributionOption } from '@/lib/actions/attribution';
import { LeadSourceBadge } from '@/components/admin/LeadSourceBadge';

function isoToDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const t = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return t.toISOString().slice(0, 16);
}

function formatLeadOption(l: LeadAttributionPick): string {
  const when = new Date(l.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${l.name} · ${l.email} · ${when}`;
}

export interface AdminSaleAttributionFormProps {
  /** Listing edit page: fixed id. Attribution page: omit and use listing select. */
  fixedListingId?: string | null;
  fixedListingLabel?: string;
  listingOptions: ListingAttributionOption[];
  /** Deduped leads (for-listing + recent); groups update when listing selection changes. */
  leadsPool: LeadAttributionPick[];
  existing: SalesAttribution | null;
  initialLeadId?: string | null;
  initialLead?: LeadAttributionPick | null;
  /** `embedded`: no outer card/title (e.g. inside “Mark as sold” modal). */
  variant?: 'page' | 'embedded';
  /** After attribution is saved; e.g. mark listing sold + close modal. */
  afterAttributionSaved?: () => void | Promise<void>;
  /** Override primary submit label. */
  submitLabel?: string;
  /** Hide “Clear attribution” (e.g. in mark-sold modal). */
  hideClearAttribution?: boolean;
}

export function AdminSaleAttributionForm({
  fixedListingId,
  fixedListingLabel,
  listingOptions,
  leadsPool,
  existing,
  initialLeadId,
  initialLead,
  variant = 'page',
  afterAttributionSaved,
  submitLabel,
  hideClearAttribution = false,
}: AdminSaleAttributionFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const defaultListingId =
    fixedListingId ??
    initialLead?.listing_id ??
    (listingOptions[0]?.id ?? '');

  const [selectedListingId, setSelectedListingId] = useState(() => defaultListingId);

  const effectiveListingIdEarly = fixedListingId ?? selectedListingId;
  const leadsForListingCountEarly = leadsPool.filter(
    (l) => l.listing_id === effectiveListingIdEarly
  ).length;

  const initialMode: 'lead' | 'manual' =
    existing?.lead_id ? 'lead' : existing?.buyer_name ? 'manual' : leadsForListingCountEarly > 0 ? 'lead' : 'manual';

  const [mode, setMode] = useState<'lead' | 'manual'>(initialMode);
  const [leadId, setLeadId] = useState(
    () => existing?.lead_id ?? initialLeadId ?? ''
  );
  const [buyerName, setBuyerName] = useState(() => existing?.buyer_name ?? '');
  const [buyerPhone, setBuyerPhone] = useState(() => existing?.buyer_phone ?? '');
  const [buyerEmail, setBuyerEmail] = useState(() => existing?.buyer_email ?? '');
  const [buyerCountry, setBuyerCountry] = useState(() => existing?.buyer_country ?? '');
  const [soldPriceGbp, setSoldPriceGbp] = useState(() =>
    existing?.sold_price_gbp != null ? String(existing.sold_price_gbp) : ''
  );
  const [soldAt, setSoldAt] = useState(() =>
    existing?.sold_at ? isoToDatetimeLocalValue(existing.sold_at) : isoToDatetimeLocalValue(new Date().toISOString())
  );
  const [notes, setNotes] = useState(() => existing?.notes ?? '');
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const effectiveListingId = fixedListingId ?? selectedListingId;

  const { forListing, otherLeads } = useMemo(() => {
    const forL = leadsPool.filter((l) => l.listing_id === effectiveListingId);
    const other = leadsPool.filter((l) => l.listing_id !== effectiveListingId);
    return { forListing: forL, otherLeads: other };
  }, [leadsPool, effectiveListingId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const listingId = effectiveListingId?.trim();
    if (!listingId) {
      setMessage({ type: 'err', text: 'Choose a listing' });
      return;
    }

    startTransition(async () => {
      const result = await upsertSaleAttribution({
        listingId,
        mode,
        leadId: mode === 'lead' ? leadId : '',
        buyerName: mode === 'manual' ? buyerName : undefined,
        buyerPhone: mode === 'manual' ? buyerPhone : undefined,
        buyerEmail: mode === 'manual' ? buyerEmail : undefined,
        buyerCountry: mode === 'manual' ? buyerCountry : undefined,
        soldPriceGbp,
        soldAt,
        notes,
      });
      if ('error' in result) {
        setMessage({ type: 'err', text: result.error });
        return;
      }
      if (afterAttributionSaved) {
        try {
          await afterAttributionSaved();
        } catch (err) {
          setMessage({
            type: 'err',
            text: err instanceof Error ? err.message : 'Something went wrong after saving.',
          });
          router.refresh();
          return;
        }
        router.refresh();
        return;
      }
      setMessage({ type: 'ok', text: 'Sale attribution saved.' });
      router.refresh();
    });
  }

  function handleClear() {
    const listingId = effectiveListingId?.trim();
    if (!listingId || !existing) return;
    if (!window.confirm('Remove sale attribution for this listing?')) return;
    setMessage(null);
    startTransition(async () => {
      const result = await clearSaleAttribution(listingId);
      if ('error' in result) {
        setMessage({ type: 'err', text: result.error });
        return;
      }
      setLeadId('');
      setBuyerName('');
      setBuyerPhone('');
      setBuyerEmail('');
      setBuyerCountry('');
      setSoldPriceGbp('');
      setSoldAt(isoToDatetimeLocalValue(new Date().toISOString()));
      setNotes('');
      setMode(
        leadsPool.filter((l) => l.listing_id === (fixedListingId ?? selectedListingId)).length > 0
          ? 'lead'
          : 'manual'
      );
      setMessage({ type: 'ok', text: 'Attribution cleared.' });
      router.refresh();
    });
  }

  const isEmbedded = variant === 'embedded';
  const Wrapper: 'section' | 'div' = isEmbedded ? 'div' : 'section';
  const wrapClass = isEmbedded ? 'space-y-4' : 'rounded-xl border border-zinc-200 bg-white p-5 shadow-sm';

  return (
    <Wrapper className={wrapClass}>
      {!isEmbedded && (
        <>
          <h2 className="text-base font-semibold text-zinc-900">Record sale attribution</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Link the sale to a lead from the site (shows as{' '}
            <LeadSourceBadge source="website" /> or <LeadSourceBadge source="other" />) or enter buyer details for
            off-platform deals.
          </p>
        </>
      )}

      <form onSubmit={handleSubmit} className={isEmbedded ? 'space-y-4' : 'mt-5 space-y-4'}>
        {!fixedListingId && (
          <div>
            <label htmlFor="attr-listing" className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
              Listing
            </label>
            <select
              id="attr-listing"
              required
              value={selectedListingId}
              onChange={(e) => setSelectedListingId(e.target.value)}
              className="mt-1 w-full max-w-xl rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            >
              <option value="">Select listing…</option>
              {listingOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label} ({opt.status})
                </option>
              ))}
            </select>
          </div>
        )}

        {fixedListingId && fixedListingLabel && (
          <p className="text-sm text-zinc-700">
            <span className="font-medium text-zinc-900">Listing:</span> {fixedListingLabel}
          </p>
        )}

        <fieldset className="space-y-2">
          <legend className="text-xs font-medium uppercase tracking-wide text-zinc-500">Buyer</legend>
          <div className="flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-800">
              <input
                type="radio"
                name="attr-mode"
                checked={mode === 'lead'}
                onChange={() => setMode('lead')}
                className="text-zinc-900"
              />
              Existing lead
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-800">
              <input
                type="radio"
                name="attr-mode"
                checked={mode === 'manual'}
                onChange={() => setMode('manual')}
                className="text-zinc-900"
              />
              Manual (other source)
            </label>
          </div>
        </fieldset>

        {mode === 'lead' && (
          <div>
            <label htmlFor="attr-lead" className="block text-xs font-medium text-zinc-600">
              Select lead
            </label>
            <select
              id="attr-lead"
              required={mode === 'lead'}
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="mt-1 w-full max-w-xl rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            >
              <option value="">Choose a lead…</option>
              {forListing.length > 0 && (
                <optgroup label="Leads for this listing">
                  {forListing.map((l) => (
                    <option key={l.id} value={l.id}>
                      {formatLeadOption(l)} — {l.source === 'website' ? 'Website' : 'Other'}
                    </option>
                  ))}
                </optgroup>
              )}
              {otherLeads.length > 0 && (
                <optgroup label="Recent leads (all listings)">
                  {otherLeads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {formatLeadOption(l)} — {l.source === 'website' ? 'Website' : 'Other'}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            {(() => {
              const sel = leadsPool.find((l) => l.id === leadId);
              return sel ? (
                <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                  Lead source: <LeadSourceBadge source={sel.source} />
                </p>
              ) : null;
            })()}
          </div>
        )}

        {mode === 'manual' && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="attr-buyer-name" className="block text-xs font-medium text-zinc-600">
                Buyer name <span className="text-red-600">*</span>
              </label>
              <input
                id="attr-buyer-name"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="attr-buyer-phone" className="block text-xs font-medium text-zinc-600">
                Phone
              </label>
              <input
                id="attr-buyer-phone"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                autoComplete="tel"
              />
            </div>
            <div>
              <label htmlFor="attr-buyer-email" className="block text-xs font-medium text-zinc-600">
                Email
              </label>
              <input
                id="attr-buyer-email"
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                autoComplete="email"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="attr-buyer-country" className="block text-xs font-medium text-zinc-600">
                Country
              </label>
              <input
                id="attr-buyer-country"
                value={buyerCountry}
                onChange={(e) => setBuyerCountry(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                autoComplete="country-name"
              />
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="attr-price" className="block text-xs font-medium text-zinc-600">
              Sold price (GBP)
            </label>
            <input
              id="attr-price"
              inputMode="decimal"
              value={soldPriceGbp}
              onChange={(e) => setSoldPriceGbp(e.target.value)}
              placeholder="e.g. 28500"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="attr-sold-at" className="block text-xs font-medium text-zinc-600">
              Sale date
            </label>
            <input
              id="attr-sold-at"
              type="datetime-local"
              required
              value={soldAt}
              onChange={(e) => setSoldAt(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="attr-notes" className="block text-xs font-medium text-zinc-600">
            Notes
          </label>
          <textarea
            id="attr-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        {message && (
          <p
            role="status"
            className={`text-sm ${message.type === 'ok' ? 'text-emerald-700' : 'text-red-600'}`}
          >
            {message.text}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {pending
              ? 'Saving…'
              : submitLabel ??
                (existing ? 'Update attribution' : 'Save attribution')}
          </button>
          {existing && !hideClearAttribution && (
            <button
              type="button"
              disabled={pending}
              onClick={handleClear}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
            >
              Clear attribution
            </button>
          )}
        </div>
      </form>
    </Wrapper>
  );
}
