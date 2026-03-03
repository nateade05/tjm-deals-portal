'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRAND_SHORT } from '@/lib/constants';
import { LeadModal } from '@/components/LeadModal';
import { Button } from '@/components/ui/Button';

const WHATSAPP_CTA_TEXT = 'Chat on WhatsApp';

export function TopNav() {
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/90">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="text-base font-semibold text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-200"
          >
            {BRAND_SHORT}
          </Link>
          <div className="flex items-center gap-3">
            {/* Desktop nav */}
            <div className="hidden items-center gap-4 sm:flex">
              <Link
                href="/listings"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50 whitespace-nowrap"
              >
                Listings
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50 whitespace-nowrap"
              >
                How it works
              </Link>
            </div>
            {/* Mobile nav: just listings link */}
            <Link
              href="/listings"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50 sm:hidden whitespace-nowrap"
            >
              Listings
            </Link>
            <Button
              type="button"
              variant="whatsapp"
              size="sm"
              onClick={() => setLeadOpen(true)}
              className="min-w-[96px] px-3.5 sm:px-4"
            >
              <span className="sm:hidden">WhatsApp</span>
              <span className="hidden sm:inline">{WHATSAPP_CTA_TEXT}</span>
            </Button>
          </div>
        </nav>
      </header>
      {leadOpen && (
        <LeadModal context="general" onClose={() => setLeadOpen(false)} />
      )}
    </>
  );
}
