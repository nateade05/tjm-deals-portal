'use client';

import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  onOpenLead?: () => void;
}

export function EmptyState({ onOpenLead }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-alt/80 px-6 py-12 text-center">
      <p className="text-secondary">
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
