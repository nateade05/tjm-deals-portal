'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRAND_SHORT } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { LeadModal } from '@/components/LeadModalLazy';

export function HowItWorksCTA() {
  const [showLeadModal, setShowLeadModal] = useState(false);

  return (
    <section className="border-t border-border-subtle bg-section-soft px-4 pt-12 pb-10 sm:px-6 sm:pt-16 sm:pb-12 md:pt-20 md:pb-14 lg:pt-24 lg:pb-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-lg font-bold tracking-tight text-primary sm:text-xl md:text-2xl lg:text-3xl">
          Ready to start your import journey?
        </h2>
        <p className="mt-2 text-sm text-secondary sm:mt-3 sm:text-base md:mt-4">
          Browse current vehicles or speak to {BRAND_SHORT} directly on WhatsApp.
        </p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-8">
          <Link href="/listings" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full sm:w-auto">
              View Current Inventory
            </Button>
          </Link>
          <Button
            variant="whatsapp"
            size="md"
            onClick={() => setShowLeadModal(true)}
            className="w-full sm:w-auto"
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
