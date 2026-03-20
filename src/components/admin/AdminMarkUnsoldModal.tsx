'use client';

import { useEffect, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { markListingAsUnsold } from '@/lib/actions/listings';

type Step = 1 | 2;

interface AdminMarkUnsoldModalProps {
  open: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
}

export function AdminMarkUnsoldModal({
  open,
  onClose,
  listingId,
  listingTitle,
}: AdminMarkUnsoldModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      /* eslint-disable react-hooks/set-state-in-effect -- reset modal when opened */
      setStep(1);
      setError(null);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [open]);

  function handleClose() {
    if (pending) return;
    setStep(1);
    setError(null);
    onClose();
  }

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const r = await markListingAsUnsold(listingId);
      if ('error' in r) {
        setError(r.error);
        return;
      }
      handleClose();
      router.refresh();
    });
  }

  if (typeof document === 'undefined') return null;
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal
      aria-labelledby="mark-unsold-modal-title"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="mark-unsold-modal-title" className="text-lg font-semibold text-zinc-900">
            {step === 1 ? 'Mark as unsold?' : 'Are you sure?'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={pending}
            className="shrink-0 rounded-full p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-50"
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        <p className="mt-3 text-sm text-zinc-600">
          <span className="font-medium text-zinc-800">{listingTitle}</span>
        </p>

        {step === 1 ? (
          <p className="mt-3 text-sm text-zinc-600">
            This will set the listing back to <strong className="font-medium text-zinc-800">draft</strong> (not live on
            the site). Sale attribution for this vehicle will be <strong className="font-medium text-zinc-800">removed</strong>
            . You can record a sale again later if needed.
          </p>
        ) : (
          <p className="mt-3 text-sm text-zinc-600">
            This action will remove the sold status and clear linked sale attribution. Continue only if the sale did not
            complete or you need to correct the listing.
          </p>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={handleClose}
                disabled={pending}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={pending}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={pending}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={pending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {pending ? 'Updating…' : 'Mark as unsold'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
