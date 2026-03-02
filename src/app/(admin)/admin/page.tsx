import Link from 'next/link';
import { fetchListings } from '@/lib/actions/listings';
import { fetchLeadsCountSince } from '@/lib/actions/leads';

export default async function AdminDashboardPage() {
  const [liveListings, draftListings, leadsLast7Days] = await Promise.all([
    fetchListings({ status: 'live' }),
    fetchListings({ status: 'draft' }),
    fetchLeadsCountSince(7),
  ]);

  const liveCount = liveListings.length;
  const draftCount = draftListings.length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
        Admin — TJM Motors
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Live listings
          </div>
          <div className="mt-2 text-2xl font-semibold text-zinc-900">{liveCount}</div>
          <p className="mt-1 text-xs text-zinc-500">
            Published and visible on the site.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Drafts
          </div>
          <div className="mt-2 text-2xl font-semibold text-zinc-900">{draftCount}</div>
          <p className="mt-1 text-xs text-zinc-500">
            Draft listings awaiting publish.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Leads (last 7 days)
          </div>
          <div className="mt-2 text-2xl font-semibold text-zinc-900">{leadsLast7Days}</div>
          <p className="mt-1 text-xs text-zinc-500">
            Enquiries captured from the site.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/listings"
          className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Manage listings
        </Link>
        <Link
          href="/admin/leads"
          className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          View leads
        </Link>
      </div>
    </div>
  );
}
