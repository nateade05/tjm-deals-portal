'use client';

interface EmptyStateProps {
  onOpenLead?: () => void;
}

export function EmptyState({ onOpenLead }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 px-6 py-12 text-center">
      <p className="text-zinc-600">
        More cars coming soon — check back shortly or request a specific model.
      </p>
      {onOpenLead && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onOpenLead}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Chat on WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
