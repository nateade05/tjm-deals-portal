import { TopNav } from '@/components/TopNav';
import { HowItWorksTiles } from '@/components/HowItWorksTiles';
import { BRAND_FULL } from '@/lib/constants';

export const revalidate = 120;

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">
        <div className="px-4 pt-8 sm:px-6 sm:pt-12">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              How it works
            </h1>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
              {BRAND_FULL} brings right-hand drive cars from Singapore to the UK through a clear,
              repeatable 5‑step process.
            </p>
          </div>
        </div>

        <HowItWorksTiles variant="page" />
      </main>
    </div>
  );
}
