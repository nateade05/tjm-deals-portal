'use client';

import { useState } from 'react';
import { LeadModal, type ListingInfo } from '@/components/LeadModal';
import { Button } from '@/components/ui/Button';

interface ListingDetailCTAProps {
  listing: ListingInfo;
}

export function ListingDetailCTA({ listing }: ListingDetailCTAProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="mt-6 flex justify-center">
        <Button
          type="button"
          variant="whatsapp"
          size="md"
          fullWidth
          className="max-w-xs sm:w-auto"
          onClick={() => setModalOpen(true)}
        >
          Chat on WhatsApp
        </Button>
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
