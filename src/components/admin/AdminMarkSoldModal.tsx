'use client';

import { useEffect, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { fetchMarkSoldModalData } from '@/lib/actions/attribution';
import { markListingAsSold } from '@/lib/actions/listings';
import { AdminSaleAttributionForm } from '@/components/admin/AdminSaleAttributionForm';
import type { LeadAttributionPick } from '@/lib/supabase/types';

interface AdminMarkSoldModalProps {
  open: boolean;
  onClose: () => void;
  listingId: string;
  /** Shown while loading or if fetch fails */
  listingTitleFallback: string;
}

export function AdminMarkSoldModal({
  open,
  onClose,
  listingId,
  listingTitleFallback,
}: AdminMarkSoldModalProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [data, setData] = useState<{
    listingLabel: string;
    leadsPool: LeadAttributionPick[];
  } | null>(null);

  useEffect(() => {
    if (!open) {
      setData(null);
      setFetchError(null);
      setActionError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setFetchError(null);
      setActionError(null);
      setData(null);
      const d = await fetchMarkSoldModalData(listingId);
      if (cancelled) return;
      if (!d) {
        setFetchError('This listing cannot be marked sold (only draft or live).');
        return;
      }
      setData(d);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, listingId]);

  function handleMarkSoldWithoutAttribution() {
    setActionError(null);
    startTransition(async () => {
      const r = await markListingAsSold(listingId);
      if ('error' in r) {
        setActionError(r.error);
        return;
      }
      onClose();
      router.refresh();
    });
  }

  const loading = open && data === null && fetchError === null;

  if (typeof document === 'undefined') return null;

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal
      aria-labelledby="mark-sold-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[min(90vh,44rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:max-w-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="mark-sold-modal-title" className="text-lg font-semibold text-zinc-900">
              Mark as sold
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              {data?.listingLabel ?? listingTitleFallback}
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              Save sale attribution now, mark sold and add details later from Attribution, or cancel.
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

        {loading && (
          <p className="mt-4 text-sm text-zinc-500">Loading…</p>
        )}

        {fetchError && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {fetchError}
          </p>
        )}

        {data && (
          <div className="mt-4 border-t border-zinc-100 pt-4">
            <AdminSaleAttributionForm
              key={listingId}
              fixedListingId={listingId}
              fixedListingLabel={data.listingLabel}
              listingOptions={[]}
              leadsPool={data.leadsPool}
              existing={null}
              variant="embedded"
              hideClearAttribution
              submitLabel="Save attribution & mark sold"
              afterAttributionSaved={async () => {
                const r = await markListingAsSold(listingId);
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
            disabled={pending || !data}
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
