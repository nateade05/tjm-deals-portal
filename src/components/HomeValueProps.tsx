'use client';

import { useState, useEffect, useCallback } from 'react';

const FEATURES = [
  {
    id: 'high-spec',
    title: 'High specification',
    copy: 'Singapore buyers frequently select higher trims and factory options, resulting in vehicles with stronger specifications than many equivalent UK models.',
    imageUrl: '/high_spec_why_sg.jpg',
  },
  {
    id: 'well-maintained',
    title: 'Well maintained',
    copy: 'Strict inspection standards and a strong servicing culture keep Singapore vehicles in excellent mechanical condition.',
    imageUrl: '/maintained_why_sg.jpg',
  },
  {
    id: 'low-corrosion',
    title: 'Low corrosion',
    copy: "Singapore's climate and absence of salted winter roads significantly reduce corrosion risk compared with many UK vehicles.",
    imageUrl: '/low_corrosion_why_sg.jpg',
  },
  {
    id: 'lower-mileage',
    title: 'Lower mileage',
    copy: 'Short urban journeys and efficient road networks often result in lower annual mileage than comparable UK vehicles.',
    imageUrl: '/low_mileage_why_sg.jpg',
  },
  {
    id: 'constant-supply',
    title: 'Constant supply',
    copy: 'The COE system means vehicles regularly exit the market, creating a steady pipeline of high-quality export opportunities.',
    imageUrl: '/constant_supply_why_sg.jpg',
  },
] as const;

const TRANSITION_MS = 400;
const EXPANDED_COPY_HEIGHT = 120;

function ImageStage({
  features,
  currentIndex,
  nextIndex,
  isTransitioning,
}: {
  features: typeof FEATURES;
  currentIndex: number;
  nextIndex: number;
  isTransitioning: boolean;
}) {
  const current = features[currentIndex];
  const next = features[nextIndex];

  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-surface-alt shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] sm:aspect-[16/10] lg:aspect-[3/2] lg:min-h-[360px]">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent"
        aria-hidden
      />
      {/* Crossfade: opacity only for a smooth fade, no scale */}
      <div
        className="absolute inset-0"
        style={{
          transition: `opacity ${TRANSITION_MS}ms ease-in-out`,
          opacity: isTransitioning ? 0 : 1,
        }}
        aria-hidden={isTransitioning}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current?.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          transition: `opacity ${TRANSITION_MS}ms ease-in-out`,
          opacity: isTransitioning ? 1 : 0,
        }}
        aria-hidden={!isTransitioning}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={next?.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

function FeatureItem({
  feature,
  isActive,
  onSelect,
}: {
  feature: (typeof FEATURES)[number];
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`relative rounded-lg transition-all duration-300 ease-in-out ${
        isActive ? 'pl-5 lg:pl-6' : 'pl-0'
      } ${isActive ? 'bg-gold-tint/25' : ''}`}
    >
      {/* Gold accent — smooth opacity/scale so it doesn’t pop */}
      <span
        className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-gold shadow-sm transition-all duration-300 ease-out"
        style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'scaleY(1)' : 'scaleY(0.6)' }}
        aria-hidden
      />
      <button
        type="button"
        onClick={onSelect}
        className="group flex w-full flex-col items-start text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-lg py-4 lg:py-4 -ml-px pl-px pr-2"
        aria-expanded={isActive}
        aria-controls={`feature-copy-${feature.id}`}
        id={`feature-trigger-${feature.id}`}
      >
        <span
          className={`block font-semibold tracking-tight transition-all duration-200 ease-out ${
            isActive
              ? 'text-xl text-primary sm:text-2xl lg:text-[1.5rem] lg:leading-tight'
              : 'text-base text-secondary/85 sm:text-lg lg:text-xl group-hover:text-primary/80'
          }`}
        >
          {feature.title}
        </span>
        <div
          id={`feature-copy-${feature.id}`}
          role="region"
          aria-labelledby={`feature-trigger-${feature.id}`}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isActive ? EXPANDED_COPY_HEIGHT : 0,
            opacity: isActive ? 1 : 0,
          }}
        >
          <p
            className="pt-3 text-sm leading-relaxed text-secondary lg:text-[0.9375rem] lg:leading-relaxed transition-all duration-300 ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(8px)',
            }}
          >
            {feature.copy}
          </p>
        </div>
      </button>
    </div>
  );
}

export function HomeValueProps() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = useCallback((index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setIsTransitioning(true);
  }, [activeIndex]);

  useEffect(() => {
    if (!isTransitioning) return;
    const t = setTimeout(() => {
      setDisplayIndex(activeIndex);
      setIsTransitioning(false);
    }, TRANSITION_MS);
    return () => clearTimeout(t);
  }, [isTransitioning, activeIndex]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-olive-tint/45 via-olive-tint/50 to-olive-tint/40 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-olive">
            The Singapore advantage
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Why Singapore vehicles?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-secondary">
            High-quality, right-hand-drive cars with strong maintenance history and attractive UK resale potential.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div className="min-w-0 order-2 lg:order-1">
            <ImageStage
              features={FEATURES}
              currentIndex={displayIndex}
              nextIndex={activeIndex}
              isTransitioning={isTransitioning}
            />
          </div>

          <div className="min-w-0 order-1 lg:order-2 flex min-h-[400px] flex-col lg:min-h-[440px]">
            {FEATURES.map((feature, index) => (
              <FeatureItem
                key={feature.id}
                feature={feature}
                isActive={activeIndex === index}
                onSelect={() => handleSelect(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
