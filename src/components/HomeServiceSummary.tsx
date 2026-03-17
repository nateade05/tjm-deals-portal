import Link from 'next/link';
import { BRAND_SHORT } from '@/lib/constants';

const STEPS = [
  {
    key: 'source',
    title: 'Source',
    copy: "Find high-value vehicles across Singapore's dealer network.",
    icon: 'search',
  },
  {
    key: 'inspect',
    title: 'Inspect',
    copy: 'Every vehicle is checked before purchase and export.',
    icon: 'inspect',
  },
  {
    key: 'ship',
    title: 'Ship',
    copy: 'RoRo or container shipping arranged end-to-end.',
    icon: 'ship',
  },
  {
    key: 'register',
    title: 'Register',
    copy: 'UK customs, DVLA registration and plates handled.',
    icon: 'register',
  },
] as const;

type StepIconKey = (typeof STEPS)[number]['icon'];

function StepIcon({ type }: { type: StepIconKey }) {
  const common = 'h-5 w-5 stroke-[1.7]';

  if (type === 'search') {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        aria-hidden
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="11" cy="11" r="5.25" className="stroke-ink/80" />
        <path d="M15.5 15.5L19 19" className="stroke-ink/80" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'inspect') {
    return (
      <svg className={common} viewBox="0 0 24 24" aria-hidden fill="none">
        <rect
          x="4.75"
          y="4.75"
          width="10.5"
          height="14.5"
          rx="2.25"
          className="stroke-ink/80"
        />
        <path d="M9 9.5h4.5M9 12h2.75" className="stroke-ink/80" strokeLinecap="round" />
        <path d="M15.5 15.5L19 19" className="stroke-ink/80" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'ship') {
    return (
      <svg className={common} viewBox="0 0 24 24" aria-hidden fill="none">
        <path
          d="M4 11.5h16l-1.2 5.5H5.2L4 11.5Z"
          className="stroke-ink/80"
          strokeLinejoin="round"
        />
        <path
          d="M7 8.25h3.5M7 10h2.5M13.75 8.25H17"
          className="stroke-ink/80"
          strokeLinecap="round"
        />
        <path
          d="M5 18.5c.9.7 1.8 1 2.75 1s1.85-.3 2.75-1c.9.7 1.8 1 2.75 1s1.85-.3 2.75-1"
          className="stroke-ink/80"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // register
  return (
    <svg className={common} viewBox="0 0 24 24" aria-hidden fill="none">
      <rect
        x="4.5"
        y="6.25"
        width="15"
        height="11.5"
        rx="2.25"
        className="stroke-ink/80"
      />
      <path d="M7.25 10.25h4.5M7.25 13h2.75" className="stroke-ink/80" strokeLinecap="round" />
      <path d="M14.75 13h2" className="stroke-ink/80" strokeLinecap="round" />
    </svg>
  );
}

export function HomeServiceSummary() {
  return (
    <section className="bg-section-soft px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Our process
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Handled end-to-end
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-secondary">
              From sourcing in Singapore to UK registration, {BRAND_SHORT} manages the process for you.
            </p>
          </div>
        </div>

        {/* Steps: clean horizontal grid on desktop, stacked on mobile */}
        <div className="mt-12 space-y-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.key} className="flex flex-col items-start gap-3 lg:items-start">
                <div className="text-gold">
                  <StepIcon type={step.icon} />
                </div>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-primary sm:text-lg">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-secondary sm:text-sm">
                    {step.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              href="/how-it-works"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-gold bg-gold-tint/60 px-5 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-gold-tint hover:border-gold"
            >
              View the full import process →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
