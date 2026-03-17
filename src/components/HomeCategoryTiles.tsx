import Link from 'next/link';

const CATEGORIES = [
  {
    key: 'premium-economy',
    title: 'Premium Economy',
    subtitle: 'Executive saloons and estates',
    href: '/listings',
    imageUrl:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
  },
  {
    key: 'economy',
    title: 'Economy',
    subtitle: 'Compact hatchbacks and city cars',
    href: '/listings',
    imageUrl:
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
  },
  {
    key: 'premium-suvs',
    title: 'Premium SUVs',
    subtitle: 'High-spec SUVs and crossovers',
    href: '/listings',
    imageUrl:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
  },
  {
    key: 'luxury',
    title: 'Luxury',
    subtitle: 'Flagship sedans and performance',
    href: '/listings',
    imageUrl:
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&q=80',
  },
] as const;

function CategoryTile({ item }: { item: (typeof CATEGORIES)[number] }) {
  return (
    <Link
      href={item.href}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
    >
      {/* Background image — subdued via overlay */}
      <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
        <img
          src={item.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>

      {/* Gradient overlay: transparent top → darker bottom for readability */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-black/85 group-hover:via-black/40"
        aria-hidden
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 lg:p-7">
        <h3 className="text-xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-2xl lg:text-[1.625rem]">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="mt-1 text-sm text-white/90 sm:text-base">
            {item.subtitle}
          </p>
        )}
        <span
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white/95 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        >
          View listings
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function HomeCategoryTiles() {
  return (
    <section className="border-y border-border-subtle bg-surface px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Browse by vehicle type
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Find the right category for your next import.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-2 lg:gap-6">
          {CATEGORIES.map((item) => (
            <CategoryTile key={item.key} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
