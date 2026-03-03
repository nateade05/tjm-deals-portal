'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { HowItWorksStep } from '@/lib/howItWorks';
import { HOW_IT_WORKS_STEPS } from '@/lib/howItWorks';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LeadModal } from '@/components/LeadModal';
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
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            How it works
          </h2>
          {isHome ? (
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
              A simple, structured process from sourcing in Singapore to registration in the UK.
            </p>
          ) : (
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
              From first enquiry to DVLA registration, each step is tightly managed so you know
              exactly where your vehicle is in the process.
            </p>
          )}
        </div>

        <div className="relative">
          {!isHome && (
            <div className="pointer-events-none absolute inset-y-2 left-4 hidden w-px bg-zinc-200 dark:bg-zinc-700 sm:block" />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step) => (
              <Card
                key={step.step}
                className={cn(
                  'relative flex flex-col gap-3 rounded-2xl border-zinc-200 bg-white/90 text-zinc-900 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-50',
                  !isHome && 'sm:pl-8'
                )}
              >
                {!isHome && (
                  <div className="pointer-events-none absolute left-3 top-6 hidden h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100 sm:block" />
                )}

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
                    <StepIcon icon={step.icon} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 items-center rounded-full bg-zinc-100 px-2 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                        Step {step.step}
                      </span>
                      <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50 sm:text-base">
                        {step.title}
                      </h3>
                      {step.timeframe && (
                        <span className="ml-auto inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                          {step.timeframe}
                        </span>
                      )}
                    </div>
                    {isHome ? (
                      <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">
                        {step.short}
                      </p>
                    ) : (
                      <>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                          {step.long}
                        </p>
                        <ul className="mt-2 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-300">
                          {step.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-2">
                              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-zinc-400 dark:bg-zinc-500" />
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
              className="text-sm font-medium text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
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

