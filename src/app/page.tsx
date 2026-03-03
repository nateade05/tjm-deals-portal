import Link from 'next/link';
import type { Metadata } from 'next';
import { TopNav } from '@/components/TopNav';
import { HowItWorksTiles } from '@/components/HowItWorksTiles';
import { BRAND_SHORT, TAGLINE } from '@/lib/constants';

export const revalidate = 120;

export const metadata: Metadata = {
  title: `${BRAND_SHORT} | Singapore car deals landed in the UK`,
  description: TAGLINE,
  openGraph: {
    title: `${BRAND_SHORT} | Singapore car deals landed in the UK`,
    description: TAGLINE,
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-zinc-200 bg-zinc-50/50 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              {TAGLINE}
            </h1>
            <p className="mt-4 text-lg text-zinc-600">
              Premium right-hand drive vehicles from Singapore, landed in the UK. We handle
              shipping, customs, and registration so you can focus on your customers.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/listings?category=in_stock"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
              >
                View In-Stock
              </Link>
              <Link
                href="/listings?category=opportunity"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                View Opportunities
              </Link>
            </div>
          </div>
        </section>

        <HowItWorksTiles variant="home" />

        {/* Footer */}
        <footer className="mt-auto border-t border-zinc-200 bg-white px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} {BRAND_SHORT}. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
