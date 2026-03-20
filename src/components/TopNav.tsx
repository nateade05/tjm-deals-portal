'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { LeadModal } from '@/components/LeadModalLazy';

const WHATSAPP_CTA_TEXT = 'Chat on WhatsApp';

export function TopNav() {
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <Image
              src="/tjm-logo.png"
              alt="TJMotors logo"
              width={35}
              height={35}
              className="h-[34px] w-[34px] sm:h-9 sm:w-9"
              priority
            />
          </Link>
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <div className="flex min-w-0 items-center gap-3 sm:gap-5">
              <Link
                href="/listings"
                className="min-h-[44px] shrink-0 content-center px-1 text-xs font-medium text-secondary hover:text-primary whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:min-h-0 sm:px-0 sm:text-sm sm:py-1"
              >
                Listings
              </Link>
              <Link
                href="/how-it-works"
                className="min-h-[44px] shrink-0 content-center px-1 text-xs font-medium text-secondary hover:text-primary whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:min-h-0 sm:px-0 sm:text-sm sm:py-1"
              >
                How it works
              </Link>
            </div>
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
