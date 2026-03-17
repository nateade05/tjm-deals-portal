'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { HowItWorksStep } from '@/lib/howItWorks';
import { HOW_IT_WORKS_STEPS } from '@/lib/howItWorks';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LeadModal } from '@/components/LeadModalLazy';
import { StepIcon } from '@/components/StepIcon';

type Variant = 'home' | 'page';

interface HowItWorksTilesProps {
  variant: Variant;
  steps?: HowItWorksStep[];
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function HowItWorksTiles({ variant, steps = HOW_IT_WORKS_STEPS }: HowItWorksTilesProps) {
  const [showLeadModal, setShowLeadModal] = useState(false);

  const isHome = variant === 'home';

  return (
    <section className={cn('px-4 py-14 sm:px-6 sm:py-20', isHome ? 'bg-transparent' : '')}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="text-2xl font-semibold text-primary sm:text-3xl">
            How it works
          </h2>
          {isHome ? (
            <p className="mt-3 text-sm text-secondary">
              A simple, structured process from sourcing in Singapore to registration in the UK.
            </p>
          ) : (
            <p className="mt-3 text-sm text-secondary sm:text-base">
              From first enquiry to DVLA registration, each step is tightly managed so you know
              exactly where your vehicle is in the process.
            </p>
          )}
        </div>

        <div className="relative">
          {!isHome && (
            <div className="pointer-events-none absolute inset-y-2 left-4 hidden w-px bg-border-subtle sm:block" />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step) => (
              <Card
                key={step.step}
                className={cn(
                  'relative flex flex-col gap-3 rounded-2xl border-border-subtle bg-surface/95 text-primary shadow-sm backdrop-blur-sm',
                  !isHome && 'sm:pl-8'
                )}
              >
                {!isHome && (
                  <div className="pointer-events-none absolute left-3 top-6 hidden h-2 w-2 rounded-full bg-ink sm:block" />
                )}

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-surface-alt text-primary">
                    <StepIcon icon={step.icon} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 items-center rounded-full bg-surface-alt px-2 text-xs font-medium text-secondary">
                        Step {step.step}
                      </span>
                      <h3 className="truncate text-sm font-semibold text-primary sm:text-base">
                        {step.title}
                      </h3>
                      {step.timeframe && (
                        <span className="ml-auto inline-flex items-center rounded-full border border-border-subtle bg-surface-alt px-2 py-0.5 text-[11px] font-medium text-muted">
                          {step.timeframe}
                        </span>
                      )}
                    </div>
                    {isHome ? (
                      <p className="mt-2 line-clamp-3 text-sm text-secondary">
                        {step.short}
                      </p>
                    ) : (
                      <>
                        <p className="mt-2 text-sm leading-relaxed text-secondary">
                          {step.long}
                        </p>
                        <ul className="mt-2 space-y-1.5 text-sm text-secondary">
                          {step.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-2">
                              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-muted" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {isHome ? (
          <div className="mt-8 text-center">
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-secondary underline hover:text-primary transition-colors"
            >
              Learn more about the process
            </Link>
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/listings">
              <Button variant="primary" size="md">
                View current listings
              </Button>
            </Link>
            <Button
              variant="whatsapp"
              size="md"
              onClick={() => setShowLeadModal(true)}
            >
              Chat on WhatsApp
            </Button>
          </div>
        )}
      </div>

      {showLeadModal && (
        <LeadModal context="general" onClose={() => setShowLeadModal(false)} />
      )}
    </section>
  );
}

