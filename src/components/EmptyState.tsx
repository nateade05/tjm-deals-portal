'use client';

import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  onOpenLead?: () => void;
}

export function EmptyState({ onOpenLead }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/80">
      <p className="text-slate-600 dark:text-slate-200">
        More cars coming soon — check back shortly or request a specific model.
      </p>
      {onOpenLead && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            variant="whatsapp"
            size="md"
            onClick={onOpenLead}
          >
            Chat on WhatsApp
          </Button>
        </div>
      )}
    </div>
  );
}
