import type { Metadata } from 'next';
import { TopNav } from '@/components/TopNav';
import { HowItWorksCTA } from '@/components/HowItWorksCTA';
import { HowItWorksTimelineDesktop } from '@/components/HowItWorksTimelineDesktop';
import { HowItWorksTimelineResponsive, type TimelineStepData } from '@/components/HowItWorksTimelineResponsive';
import { BRAND_SHORT } from '@/lib/constants';

export const revalidate = 120;

export const metadata: Metadata = {
  title: `How it works | ${BRAND_SHORT}`,
  description:
    'Seamless vehicle import journey from Singapore to the UK. Source, prepare, ship, clear customs, and register with one partner.',
};

const STEPS: readonly TimelineStepData[] = [
  {
    step: 1,
    title: 'Source & Inspection',
    body: 'Vehicles are sourced in Singapore from private owners, auctions and authorised dealers. Each car undergoes a rigorous inspection before purchase.',
    imagePlaceholder: 'Professional vehicle inspection in Singapore',
  },
  {
    step: 2,
    title: 'Preparation',
    body: 'Vehicles are prepared to showroom condition in Singapore, including bodywork, mechanical repairs and servicing where needed.',
    imagePlaceholder: 'Car prepared in workshop',
  },
  {
    step: 3,
    title: 'Shipping & Transit',
    body: 'Vehicles are shipped from Singapore to the UK via RoRo or container shipping. Transit typically takes 6–8 weeks.',
    imagePlaceholder: 'Shipping and logistics',
  },
  {
    step: 4,
    title: 'UK Arrival & Customs',
    body: 'Cars arrive at Bristol or Southampton ports, where our team manages customs clearance and import paperwork.',
    imagePlaceholder: 'UK port and customs',
  },
  {
    step: 5,
    title: 'Registration & Delivery',
    body: `${BRAND_SHORT} registers the vehicle with the DVLA, installs UK number plates, and prepares it for delivery or collection.`,
    imagePlaceholder: 'UK registration and delivery',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />

      {/* Hero */}
      <header className="border-b border-border-subtle bg-gradient-to-b from-background to-surface px-4 py-8 sm:px-6 sm:py-10 md:py-12 lg:py-14">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-border-subtle bg-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold shadow-sm">
            How it works
          </span>
          <h1 className="mt-3 text-xl font-bold tracking-tight text-primary sm:mt-4 sm:text-2xl md:text-4xl lg:text-5xl">
            Seamless Logistics from{' '}
            <span className="text-gold">Singapore to the UK</span>
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-secondary sm:mt-3 sm:text-base md:mt-4">
            From Singapore sourcing to UK registration, our specialists manage every stage of the import journey.
          </p>
        </div>
      </header>

      {/* Timeline — content-driven bottom padding so rail/end anchor feel close to CTA */}
      <main className="relative overflow-hidden bg-surface pb-12 pt-12 lg:pb-16 lg:pt-20 xl:pb-24 xl:pt-28">
        <div
          aria-hidden
          className="how-it-works-timeline-radial pointer-events-none absolute inset-0 hidden lg:block"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Responsive timeline: left-rail, tablet + mobile */}
          <div className="xl:hidden">
            <HowItWorksTimelineResponsive steps={STEPS} />
          </div>

          {/* Desktop timeline: centered, alternating text/image; line from start cap to end cap */}
          <div className="hidden xl:block">
            <HowItWorksTimelineDesktop steps={STEPS} />
          </div>
        </div>
      </main>

      <HowItWorksCTA />

      <footer className="mt-auto border-t border-border-subtle bg-surface px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm text-muted">
            © {new Date().getFullYear()} {BRAND_SHORT}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
