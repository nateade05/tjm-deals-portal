'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { archiveListing } from '@/lib/actions/listings';
import { AdminMarkUnsoldModal } from '@/components/admin/AdminMarkUnsoldModal';
import { AdminRecordSaleModal } from '@/components/admin/AdminRecordSaleModal';
import type { ListingStatus } from '@/lib/supabase/types';

interface AdminListingsRowActionsProps {
  listingId: string;
  status: ListingStatus;
  /** Used in modal header while loading */
  listingTitle: string;
}

function SoldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Undo / revert sold */
function UnsoldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 010 11H11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Lucide-style archive: flat lid + box + slot (reads as filing box, not trash) */
function ArchiveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 5h16a1 1 0 0 1 1 1v3H3V6a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 13h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AdminListingsRowActions({ listingId, status, listingTitle }: AdminListingsRowActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [soldOpen, setSoldOpen] = useState(false);
  const [unsoldOpen, setUnsoldOpen] = useState(false);

  const canMarkSold = status === 'draft' || status === 'live';
  const canMarkUnsold = status === 'sold';
  const canArchive = status === 'draft' || status === 'sold' || status === 'closed';
  const archiveDisabled = status === 'live' || status === 'archived';
  const showArchiveButton = status !== 'archived';

  function handleArchive() {
    if (!canArchive || pending) return;
    if (!window.confirm('Archive this listing?')) return;
    startTransition(async () => {
      const r = await archiveListing(listingId);
      if ('error' in r) {
        window.alert(r.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        {canMarkSold && (
          <button
            type="button"
            title="Mark as sold"
            aria-label="Mark as sold"
            onClick={() => setSoldOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 transition-colors hover:bg-emerald-100"
          >
            <SoldIcon />
          </button>
        )}
        {canMarkUnsold && (
          <button
            type="button"
            title="Mark as unsold"
            aria-label="Mark as unsold"
            onClick={() => setUnsoldOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-900 transition-colors hover:bg-amber-100"
          >
            <UnsoldIcon />
          </button>
        )}
        {showArchiveButton && (
          <button
            type="button"
            title={
              archiveDisabled && status === 'live'
                ? 'Unpublish (set to draft) before archiving'
                : 'Archive listing'
            }
            aria-label="Archive listing"
            disabled={archiveDisabled || pending}
            onClick={handleArchive}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArchiveIcon />
          </button>
        )}
      </div>
      <AdminRecordSaleModal
        open={soldOpen}
        onClose={() => setSoldOpen(false)}
        listingId={listingId}
        listingTitleFallback={listingTitle}
      />
      <AdminMarkUnsoldModal
        open={unsoldOpen}
        onClose={() => setUnsoldOpen(false)}
        listingId={listingId}
        listingTitle={listingTitle}
      />
    </>
  );
}
