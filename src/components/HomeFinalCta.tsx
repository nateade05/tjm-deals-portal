'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LeadModal } from '@/components/LeadModalLazy';

export function HomeFinalCta() {
  const [showLeadModal, setShowLeadModal] = useState(false);

  return (
    <section className="border-t border-white/10 bg-ink px-4 py-24 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-surface sm:text-3xl">
          Ready to import your next car?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-surface/90 sm:text-lg">
          Browse live vehicles or speak directly with us on WhatsApp.
        </p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-5">
          <Link href="/listings" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              className="w-full min-w-[180px] border-border-strong bg-transparent text-surface hover:bg-surface hover:text-ink sm:w-auto"
            >
              Browse vehicles
            </Button>
          </Link>
          <Button
            variant="whatsapp"
            size="md"
            onClick={() => setShowLeadModal(true)}
            className="w-full min-w-[180px] sm:w-auto"
          >
            Chat on WhatsApp
          </Button>
        </div>
      </div>
      {showLeadModal && (
        <LeadModal context="general" onClose={() => setShowLeadModal(false)} />
      )}
    </section>
  );
}
