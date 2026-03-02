'use client';

import { useState } from 'react';
import { LeadModal, type ListingInfo } from '@/components/LeadModal';

interface ListingDetailCTAProps {
  listing: ListingInfo;
}

export function ListingDetailCTA({ listing }: ListingDetailCTAProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#20bd5a]"
        >
          Chat on WhatsApp
        </button>
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
