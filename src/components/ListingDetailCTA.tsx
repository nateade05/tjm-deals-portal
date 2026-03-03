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
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-start">
        <Button
          type="button"
          variant="primary"
          size="md"
          fullWidth
          className="sm:w-auto"
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
