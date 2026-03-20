'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSaleAttributionForm, type AdminSaleAttributionFormProps } from '@/components/admin/AdminSaleAttributionForm';

type Props = {
  children: ReactNode;
  /** Open by default when deep-linking with listingId / leadId */
  defaultOpen: boolean;
} & AdminSaleAttributionFormProps;

export function AdminAttributionRecordSalePanel({
  children,
  defaultOpen,
  ...formProps
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  function handleOpen() {
    setOpen(true);
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">{children}</div>
        <div className="shrink-0 sm:pt-0.5">
          {!open ? (
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 sm:w-auto"
            >
              Record a sale
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 sm:w-auto"
            >
              Hide form
            </button>
          )}
        </div>
      </div>

      {open && (
        <div id="admin-record-sale-section" ref={sectionRef} className="scroll-mt-6">
          <AdminSaleAttributionForm
            {...formProps}
            onSaveSuccess={() => {
              setOpen(false);
              // Drop query params so defaultOpen doesn’t re-open the panel after refresh
              router.replace('/admin/attribution');
            }}
          />
        </div>
      )}
    </div>
  );
}
