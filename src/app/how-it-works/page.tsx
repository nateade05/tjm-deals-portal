import Link from 'next/link';
import { TopNav } from '@/components/TopNav';
import { BRAND_FULL } from '@/lib/constants';

export const revalidate = 120;

const STEPS = [
  {
    icon: '📋',
    title: 'Tell us what you want',
    you: 'Your target spec, budget, and timeline.',
    us: 'We match you with available stock or source from our Singapore network.',
  },
  {
    icon: '🔍',
    title: 'We source from Singapore network',
    you: 'Confirm interest and any must-haves.',
    us: 'We secure the vehicle and provide a clear landed price in GBP.',
  },
  {
    icon: '✓',
    title: 'Confirm landed price in the UK',
    you: 'Review the full cost (vehicle, shipping, duties, fees).',
    us: 'Transparent pricing with no hidden charges.',
  },
  {
    icon: '📦',
    title: 'Shipping, customs, and paperwork handled',
    you: 'Sign off and provide any documentation we need.',
    us: 'We manage logistics, customs clearance, and all paperwork.',
  },
  {
    icon: '🚗',
    title: 'Delivered + registered in the UK',
    you: 'Receive the vehicle and complete registration if required.',
    us: 'Delivery to your chosen location; we support registration where needed.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
            How it works
          </h1>
          <p className="mt-2 text-zinc-600">
            {BRAND_FULL} brings right-hand drive cars from Singapore to the UK. Here’s the process.
          </p>

          <ul className="mt-10 space-y-10">
            {STEPS.map((step) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-lg">
                  {step.icon}
                </span>
                <div>
                  <h2 className="font-semibold text-zinc-900">{step.title}</h2>
                  <div className="mt-3 grid gap-2 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 text-sm sm:grid-cols-2">
                    <div>
                      <span className="font-medium text-zinc-500">What you provide</span>
                      <p className="mt-1 text-zinc-700">{step.you}</p>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-500">What we handle</span>
                      <p className="mt-1 text-zinc-700">{step.us}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex justify-center">
            <Link
              href="/listings"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              View Listings
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
