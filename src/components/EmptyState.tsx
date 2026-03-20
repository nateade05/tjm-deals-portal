'use client';

import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  onOpenLead?: () => void;
  /** `filtered` — user narrowed results; `empty` — no inventory at all. */
  variant?: 'filtered' | 'empty';
}

export function EmptyState({ onOpenLead, variant = 'empty' }: EmptyStateProps) {
  const isFiltered = variant === 'filtered';

  return (
    <div
      role="status"
      className="rounded-xl border border-border-subtle bg-surface-alt/80 px-6 py-12 text-center"
    >
      <p className="text-secondary">
        {isFiltered
          ? 'No vehicles match those filters. Try widening your search or clear filters to see everything in stock.'
          : 'More cars coming soon — check back shortly or request a specific model.'}
      </p>
      {onOpenLead && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" variant="whatsapp" size="md" onClick={onOpenLead}>
            Chat on WhatsApp
          </Button>
        </div>
      )}
    </div>
  );
}
