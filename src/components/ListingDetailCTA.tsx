'use client';

import { useState } from 'react';
import { LeadModal, type ListingInfo } from '@/components/LeadModalLazy';
import { Button } from '@/components/ui/Button';

interface ListingDetailCTAProps {
  listing: ListingInfo;
}

export function ListingDetailCTA({ listing }: ListingDetailCTAProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="mt-8 flex flex-col items-stretch border-t border-border-subtle/70 pt-6 sm:items-center">
        <Button
          type="button"
          variant="whatsapp"
          size="md"
          fullWidth
          className="max-w-full shadow-sm transition-shadow hover:shadow-md sm:max-w-xs sm:min-w-[220px]"
          onClick={() => setModalOpen(true)}
        >
          Chat on WhatsApp
        </Button>
        <p className="mt-2.5 text-center text-[11px] text-muted">Questions about this vehicle — we reply on WhatsApp.</p>
      </div>
      {modalOpen && (
        <LeadModal
          context="listing"
          listing={listing}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
