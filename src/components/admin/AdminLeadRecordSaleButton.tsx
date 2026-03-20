'use client';

import { useState } from 'react';
import { AdminRecordSaleModal } from '@/components/admin/AdminRecordSaleModal';

type Props = {
  leadId: string;
  listingId: string | null;
  leadLabel: string;
};

/** Opens the same “Record sale” modal as listings (vehicle + buyer / attribution). */
export function AdminLeadRecordSaleButton({ leadId, listingId, leadLabel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-sky-700 underline-offset-2 hover:underline"
      >
        Record sale
      </button>
      <AdminRecordSaleModal
        open={open}
        onClose={() => setOpen(false)}
        listingId={listingId ?? undefined}
        leadId={leadId}
        leadNameFallback={leadLabel}
      />
    </>
  );
}
