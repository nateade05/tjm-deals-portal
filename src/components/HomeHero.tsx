'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

const TRUST_ROW = 'Right-hand drive • UK-registered • No conversion needed';

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border-subtle bg-background">
      {/* Image-led hero stage (full-width) */}
      <div className="absolute inset-0">
        <Image
          src="/home-hero.png"
          alt="Front-facing car with Singapore and London skyline blend"
          fill
          priority
          sizes="100vw"
          quality={82}
          className="object-cover object-center motion-reduce:scale-100 scale-[1.18]"
          style={{ objectPosition: '50% 58%' }}
        />
        {/* Gentle readability wash that keeps the scene intact */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/65 via-background/25 to-background/88"
          aria-hidden
        />
        {/* Subtle left-side lift for text (desktop) */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/85 via-background/25 to-transparent"
          aria-hidden
        />
      </div>

      {/* Content overlay */}
      <div className="relative min-h-[72vh] px-4 py-14 sm:min-h-[78vh] sm:px-6 sm:py-18 lg:min-h-[86vh] lg:py-24">
        <div className="mx-auto flex min-h-[72vh] max-w-6xl flex-col sm:min-h-[78vh] lg:min-h-[86vh]">
          {/* Above the car: editorial stack */}
          <div className="relative mx-auto max-w-xl text-center lg:max-w-[720px]">
            {/* Soft veil only behind text, not a box */}
            <div className="pointer-events-none absolute inset-x-[-1.5rem] top-[-1.5rem] bottom-[-1.5rem] rounded-[2.5rem] bg-background/65 blur-xl sm:inset-x-[-2rem]" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold sm:text-sm">
                Singapore to UK
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-[2.75rem] lg:text-[2.9rem] xl:text-5xl lg:leading-[1.06]">
                Premium Singapore cars, UK delivered
              </h1>
              <p className="mt-4 text-base leading-relaxed text-secondary sm:mt-5 sm:text-lg">
                Browse premium Singapore vehicles with delivery, shipping, and DVLA registration fully handled.
              </p>
            </div>
          </div>

          {/* Car stage spacer: more air between subtitle and car */}
          <div className="min-h-[6vh] flex-1 lg:min-h-[8vh]" />

          {/* Below the car: CTAs + trust (more air above buttons) */}
          <div className="mx-auto w-full max-w-xl pt-2 text-center lg:max-w-[720px] lg:pt-6">
            <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <Link href="/listings?category=in_stock" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full min-h-[48px] sm:w-auto">
                  Browse in-stock cars
                </Button>
              </Link>
              <Link href="/listings?category=opportunity" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full min-h-[48px] border-border-strong bg-background/40 text-primary hover:bg-surface sm:w-auto"
                >
                  View opportunities
                </Button>
              </Link>
            </div>

            <p className="mt-6 hidden text-xs font-medium text-secondary lg:block">
              {TRUST_ROW}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
