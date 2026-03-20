'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { TopNav } from '@/components/TopNav';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/Button';

export default function ListingDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[listing detail]', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-md rounded-2xl border border-border-subtle bg-surface p-8 shadow-sm">
          <h1 className="text-lg font-semibold text-primary">Couldn&apos;t load this vehicle</h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            Something went wrong while loading the listing. Try again, or return to the catalogue.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button type="button" variant="primary" size="md" onClick={() => reset()}>
              Try again
            </Button>
            <Link
              href="/listings"
              className="inline-flex w-full items-center justify-center rounded-xl border border-border-strong bg-surface px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:w-auto"
            >
              All listings
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
