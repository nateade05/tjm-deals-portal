import type { Metadata } from 'next';
import { TopNav } from '@/components/TopNav';
import { SiteFooter } from '@/components/SiteFooter';
import { FaqAccordion } from '@/components/FaqAccordion';
import { FAQ_ITEMS } from '@/lib/faqContent';
import { BRAND_SHORT, BUSINESS_WHATSAPP_E164 } from '@/lib/constants';

export const metadata: Metadata = {
  title: `FAQs | ${BRAND_SHORT}`,
  description:
    'Answers to common questions about importing a car from Singapore to the UK with TJ Motors.',
};

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopNav />
      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl">
          <header className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Support</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Frequently asked questions
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              Everything you need to know about importing a car from Singapore. Can't find an answer?{' '}
              <a
                href={`https://wa.me/${BUSINESS_WHATSAPP_E164.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gold hover:text-gold-hover transition-colors"
              >
                Ask us on WhatsApp.
              </a>
            </p>
          </header>

          <div className="rounded-2xl border border-border-subtle/80 bg-surface px-5 shadow-sm ring-1 ring-black/[0.04] sm:px-7">
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
