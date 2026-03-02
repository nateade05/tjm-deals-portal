'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRAND_SHORT } from '@/lib/constants';
import { LeadModal } from '@/components/LeadModal';

const WHATSAPP_CTA_TEXT = 'Chat on WhatsApp';

export function TopNav() {
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="text-lg font-semibold text-zinc-900 hover:text-zinc-700"
          >
            {BRAND_SHORT}
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/listings"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Listings
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              How it works
            </Link>
            <button
              type="button"
              onClick={() => setLeadOpen(true)}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:bg-[#20bd5a]"
            >
              {WHATSAPP_CTA_TEXT}
            </button>
          </div>
        </nav>
      </header>
      {leadOpen && (
        <LeadModal context="general" onClose={() => setLeadOpen(false)} />
      )}
    </>
  );
}
