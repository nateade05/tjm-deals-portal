'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ListingSummaryCard } from '@/components/ListingSummaryCard';
import { ListingForm } from '@/components/ListingForm';
import { MediaUploader } from '@/components/MediaUploader';
import { AdminListingMediaList } from '@/components/AdminListingMediaList';
import { AdminPublicLink } from '@/components/AdminPublicLink';
import { AdminMarkUnsoldModal } from '@/components/admin/AdminMarkUnsoldModal';
import { AdminSaleAttributionForm } from '@/components/admin/AdminSaleAttributionForm';
import { updateListingFromForm, setListingStatus } from '@/lib/actions/listings';
import { noopCreateAction } from '@/lib/actions/listings';
import type { LeadAttributionPick, Listing, ListingMedia, SalesAttribution } from '@/lib/supabase/types';

function computeTitle(listing: Listing): string {
  return [listing.year, listing.make, listing.model].filter(Boolean).map(String).join(' ').trim() || listing.title || '—';
}

interface AdminListingEditClientProps {
  listing: Listing;
  mediaWithUrls: (ListingMedia & { signedUrl?: string })[];
  listingLabel: string;
  leadsAttributionPool: LeadAttributionPick[];
  saleAttribution: SalesAttribution | null;
}

const SAVE_TOAST_MS = 4200;

export function AdminListingEditClient({
  listing: initialListing,
  mediaWithUrls,
  listingLabel,
  leadsAttributionPool,
  saleAttribution,
}: AdminListingEditClientProps) {
  const router = useRouter();
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [saveToastOpen, setSaveToastOpen] = useState(false);
  const [unsoldModalOpen, setUnsoldModalOpen] = useState(false);

  const showSavedToast = useCallback(() => {
    setSaveToastOpen(true);
  }, []);

  useEffect(() => {
    if (!saveToastOpen) return;
    const t = window.setTimeout(() => setSaveToastOpen(false), SAVE_TOAST_MS);
    return () => window.clearTimeout(t);
  }, [saveToastOpen]);

  async function handlePublish() {
    const result = await setListingStatus(initialListing.id, 'live');
    if ('error' in result) return;
    router.refresh();
  }

  const computedTitle = computeTitle(initialListing);

  return (
    <div className="relative space-y-8">
      {saveToastOpen && (
        <div
          role="status"
          aria-live="polite"
          className="admin-save-toast fixed bottom-6 right-6 z-[200] flex max-w-[min(calc(100vw-2rem),20rem)] items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-lg"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700" aria-hidden>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span>Changes saved — listing updated.</span>
        </div>
      )}
      {/* 1) Listing details: summary or form */}
      {!isEditingDetails ? (
        <ListingSummaryCard listing={initialListing} onEditDetails={() => setIsEditingDetails(true)} />
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">Edit details</h2>
            <button
              type="button"
              onClick={() => setIsEditingDetails(false)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
          <ListingForm
            mode="edit"
            listing={initialListing}
            listingId={initialListing.id}
            createAction={noopCreateAction}
            updateAction={updateListingFromForm}
            showSubmitButton={false}
            formId="admin-listing-edit-form"
            onSaved={showSavedToast}
          />
        </div>
      )}

      {/* 2) Media */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-zinc-700">Media</h2>
        <MediaUploader listingId={initialListing.id} existingMedia={mediaWithUrls} />
        <div className="mt-3">
          <AdminListingMediaList listingId={initialListing.id} media={mediaWithUrls} />
        </div>
      </section>

      {/* 3) Title section (when summary view) or form has title inside when editing */}
      {!isEditingDetails && (
        <section className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
          <h3 className="text-sm font-semibold text-zinc-800">Listing title</h3>
          <p className="mt-2 text-base font-medium text-zinc-900">
            Your listing title: <span className="text-zinc-700">{computedTitle}</span>
          </p>
          <button
            type="button"
            onClick={() => setIsEditingDetails(true)}
            className="mt-2 text-sm font-medium text-zinc-600 underline hover:text-zinc-900"
          >
            Edit title
          </button>
        </section>
      )}

      {/* 4) Main CTAs — Save when editing; Publish only for drafts (not sold/closed/archived) */}
      {(isEditingDetails || initialListing.status === 'draft') && (
        <div className="flex flex-wrap items-center gap-3">
          {isEditingDetails && (
            <button
              type="submit"
              form="admin-listing-edit-form"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Save changes
            </button>
          )}
          {initialListing.status === 'draft' && (
            <button
              type="button"
              onClick={handlePublish}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Publish
            </button>
          )}
        </div>
      )}

      {/* Sale attribution */}
      {initialListing.status === 'sold' && (
        <section className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
          <h2 className="text-sm font-semibold text-amber-950">Sold listing</h2>
          <p className="mt-1 text-sm text-amber-900/90">
            If this sale should be reversed, mark the listing as unsold (returns to draft and clears sale attribution).
          </p>
          <button
            type="button"
            onClick={() => setUnsoldModalOpen(true)}
            className="mt-3 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-950 hover:bg-amber-50"
          >
            Mark as unsold…
          </button>
        </section>
      )}
      <AdminSaleAttributionForm
        fixedListingId={initialListing.id}
        fixedListingLabel={listingLabel}
        listingOptions={[]}
        leadsPool={leadsAttributionPool}
        existing={saleAttribution}
      />

      {/* Public link */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-zinc-700">Public link</h2>
        {initialListing.status === 'live' ? (
          <AdminPublicLink listingId={initialListing.id} />
        ) : initialListing.status === 'draft' ? (
          <p className="text-sm text-zinc-500">Publish to make this visible on the public site.</p>
        ) : (
          <p className="text-sm text-zinc-500">
            Not on the public site ({initialListing.status === 'closed' ? 'closed after sale attribution' : 'sold or archived'}).
          </p>
        )}
      </section>

      <AdminMarkUnsoldModal
        open={unsoldModalOpen}
        onClose={() => setUnsoldModalOpen(false)}
        listingId={initialListing.id}
        listingTitle={listingLabel}
      />
    </div>
  );
}
