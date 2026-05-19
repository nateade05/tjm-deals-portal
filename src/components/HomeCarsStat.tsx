import { getSiteSettingNumber } from '@/lib/actions/settings';

export async function HomeCarsStat() {
  const count = await getSiteSettingNumber('cars_sold_count');
  if (!count || count <= 0) return null;

  return (
    <section className="bg-ink px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-xl text-center">
        <p className="gold-shimmer font-serif text-[5rem] font-bold leading-none tracking-tight sm:text-[6rem]">
          {count.toLocaleString()}+
        </p>
        <div className="mx-auto my-5 h-px w-48 bg-white/10" />
        <p className="text-2xl font-semibold leading-snug text-surface sm:text-3xl">
          cars successfully imported<br />for UK customers
        </p>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b08d57]">
          Sourced. Inspected. Delivered.
        </p>
      </div>
    </section>
  );
}
