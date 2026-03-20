'use client';

import { useEffect, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  fetchRecordSaleModalData,
  type RecordSaleModalData,
} from '@/lib/actions/attribution';
import { markListingAsSold } from '@/lib/actions/listings';
import { AdminSaleAttributionForm } from '@/components/admin/AdminSaleAttributionForm';

export interface AdminRecordSaleModalProps {
  open: boolean;
  onClose: () => void;
  /** From listings row — vehicle is fixed. */
  listingId?: string;
  /** From leads row — buyer is fixed in the form. */
  leadId?: string;
  /** Shown while loading (listing-first). */
  listingTitleFallback?: string;
  /** Shown while loading / header for lead-first. */
  leadNameFallback?: string;
}

export function AdminRecordSaleModal({
  open,
  onClose,
  listingId,
  leadId,
  listingTitleFallback = '',
  leadNameFallback = '',
}: AdminRecordSaleModalProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [data, setData] = useState<RecordSaleModalData | null>(null);
  const [markSoldTargetId, setMarkSoldTargetId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      /* eslint-disable react-hooks/set-state-in-effect -- clear modal when closed */
      setData(null);
      setFetchError(null);
      setActionError(null);
      setMarkSoldTargetId(null);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }
    if (!listingId && !leadId) {
      setFetchError('Missing listing or lead.');
      return;
    }
    let cancelled = false;
    (async () => {
      setFetchError(null);
      setActionError(null);
      setData(null);
      setMarkSoldTargetId(null);
      let d = await fetchRecordSaleModalData({ listingId, leadId });
      if (cancelled) return;
      if (!d && listingId && leadId) {
        d = await fetchRecordSaleModalData({ leadId });
      }
      if (cancelled) return;
      if (!d) {
        if (listingId && !leadId) {
          setFetchError('This listing cannot be marked sold (only draft or live).');
        } else if (leadId) {
          setFetchError('Could not load this lead or sale data.');
        } else {
          setFetchError('Could not load sale data.');
        }
        return;
      }
      setData(d);
      if (d.listingFixed) {
        setMarkSoldTargetId(d.listingFixed.id);
      } else if (d.suggestedListingId) {
        setMarkSoldTargetId(d.suggestedListingId);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, listingId, leadId]);

  function handleMarkSoldWithoutAttribution() {
    const id = markSoldTargetId?.trim();
    if (!id) return;
    setActionError(null);
    startTransition(async () => {
      const r = await markListingAsSold(id);
      if ('error' in r) {
        setActionError(r.error);
        return;
      }
      onClose();
      router.refresh();
    });
  }

  const loading = open && data === null && fetchError === null;
  const canSkipAttribution = Boolean(markSoldTargetId?.trim());

  if (typeof document === 'undefined') return null;
  if (!open) return null;

  const subtitle =
    data?.listingFixed && data.leadFixed
      ? `${data.listingFixed.label} · ${data.leadFixed.label}`
      : data?.listingFixed
        ? data.listingFixed.label
        : data?.leadFixed
          ? data.leadFixed.label
          : leadId
            ? leadNameFallback || 'Lead'
            : listingTitleFallback;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal
      aria-labelledby="record-sale-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[min(90vh,44rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:max-w-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="record-sale-modal-title" className="text-lg font-semibold text-zinc-900">
              Record sale
            </h2>
            <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>
            <p className="mt-2 text-xs text-zinc-500">
              {data?.listingFixed
                ? 'Save attribution and mark sold, mark sold and add details later from Attribution, or cancel.'
                : data?.leadFixed
                  ? 'Choose the vehicle, add sale details, then save — or mark sold without attribution if you prefer.'
                  : 'Add sale attribution and mark the listing sold, or cancel.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {loading && <p className="mt-4 text-sm text-zinc-500">Loading…</p>}

        {fetchError && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {fetchError}
          </p>
        )}

        {data && (
          <div className="mt-4 border-t border-zinc-100 pt-4">
            <AdminSaleAttributionForm
              key={`${listingId ?? ''}-${leadId ?? ''}-${open}`}
              fixedListingId={data.listingFixed?.id ?? null}
              fixedListingLabel={data.listingFixed?.label}
              listingOptions={data.listingOptions}
              leadsPool={data.leadsPool}
              existing={data.existing}
              fixedLead={data.leadFixed}
              initialListingSelection={data.suggestedListingId}
              variant="embedded"
              hideClearAttribution
              submitLabel="Save attribution & mark sold"
              onEffectiveListingChange={(id) => setMarkSoldTargetId(id)}
              afterAttributionSaved={async (soldListingId) => {
                const r = await markListingAsSold(soldListingId);
                if ('error' in r) throw new Error(r.error);
                onClose();
              }}
            />
          </div>
        )}

        {actionError && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {actionError}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2 border-t border-zinc-100 pt-4 sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            type="button"
            disabled={pending || !data || !canSkipAttribution}
            onClick={handleMarkSoldWithoutAttribution}
            className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-950 hover:bg-amber-100 disabled:opacity-50"
          >
            {pending ? 'Updating…' : 'Mark sold — add attribution later'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
