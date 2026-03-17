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
      <h1 className="text-2xl font-bold text-primary sm:text-3xl">
        Admin — TJMotors
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border-subtle bg-surface-alt p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted">
            Live listings
          </div>
          <div className="mt-2 text-2xl font-semibold text-primary">{liveCount}</div>
          <p className="mt-1 text-xs text-muted">
            Published and visible on the site.
          </p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface-alt p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted">
            Drafts
          </div>
          <div className="mt-2 text-2xl font-semibold text-primary">{draftCount}</div>
          <p className="mt-1 text-xs text-muted">
            Draft listings awaiting publish.
          </p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface-alt p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted">
            Leads (last 7 days)
          </div>
          <div className="mt-2 text-2xl font-semibold text-primary">{leadsLast7Days}</div>
          <p className="mt-1 text-xs text-muted">
            Enquiries captured from the site.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/listings"
          className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-surface hover:bg-primary transition-colors"
        >
          Manage listings
        </Link>
        <Link
          href="/admin/leads"
          className="inline-flex items-center rounded-full border border-border-strong bg-surface px-5 py-2.5 text-sm font-medium text-primary hover:bg-surface-alt transition-colors"
        >
          View leads
        </Link>
      </div>
    </div>
  );
}
