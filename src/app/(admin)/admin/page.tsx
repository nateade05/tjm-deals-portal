import Link from 'next/link';
import { fetchSaleAttributionsOverview, fetchSalesAttributionCount } from '@/lib/actions/attribution';
import { fetchListings } from '@/lib/actions/listings';
import { fetchLeadsCountSince } from '@/lib/actions/leads';
import { LeadSourceBadge } from '@/components/admin/LeadSourceBadge';
import { formatGBP } from '@/lib/format';

function formatSoldAt(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function AdminDashboardPage() {
  const [liveListings, draftListings, leadsLast7Days, salesCount, recentSales] = await Promise.all([
    fetchListings({ status: 'live' }),
    fetchListings({ status: 'draft' }),
    fetchLeadsCountSince(7),
    fetchSalesAttributionCount(),
    fetchSaleAttributionsOverview(12),
  ]);

  const liveCount = liveListings.length;
  const draftCount = draftListings.length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary sm:text-3xl">
        Admin — TJMotors
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="rounded-xl border border-border-subtle bg-surface-alt p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted">
            Sales recorded
          </div>
          <div className="mt-2 text-2xl font-semibold text-primary">{salesCount}</div>
          <p className="mt-1 text-xs text-muted">
            Listings with sale attribution saved.
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-border-subtle bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary">Recent sales</h2>
            <p className="mt-0.5 text-sm text-muted">
              From sale attribution — sold price, buyer, and source.
            </p>
          </div>
          <Link
            href="/admin/attribution"
            className="text-sm font-medium text-gold hover:underline"
          >
            View all in Attribution →
          </Link>
        </div>

        {recentSales.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            No recorded sales yet. When you save sale attribution, they will appear here.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-border-subtle">
            <table className="min-w-[44rem] w-full text-left text-sm">
              <thead className="border-b border-border-subtle bg-surface-alt/80">
                <tr>
                  <th className="px-3 py-2 font-medium text-secondary">Listing</th>
                  <th className="px-3 py-2 font-medium text-secondary">Buyer</th>
                  <th className="px-3 py-2 font-medium text-secondary">Source</th>
                  <th className="px-3 py-2 font-medium text-secondary">Sold price</th>
                  <th className="px-3 py-2 font-medium text-secondary">Sale date</th>
                  <th className="px-3 py-2 font-medium text-secondary"> </th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((row) => {
                  const buyer = row.leadName ?? row.buyer_name ?? '—';
                  const source =
                    row.lead_id && row.leadSource ? (
                      <LeadSourceBadge source={row.leadSource} />
                    ) : row.lead_id ? (
                      <LeadSourceBadge source="website" />
                    ) : (
                      <span className="text-xs text-muted">Manual</span>
                    );
                  return (
                    <tr key={row.id} className="border-b border-border-subtle/60 last:border-0">
                      <td className="px-3 py-2 font-medium text-primary">{row.listingLabel}</td>
                      <td className="max-w-[10rem] px-3 py-2 break-words text-secondary">{buyer}</td>
                      <td className="px-3 py-2">{source}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-secondary">
                        {row.sold_price_gbp != null ? formatGBP(row.sold_price_gbp) : '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-muted">{formatSoldAt(row.sold_at)}</td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <Link
                          href={`/admin/attribution?listingId=${row.listing_id}`}
                          className="text-sm font-medium text-gold hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

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
        <Link
          href="/admin/attribution"
          className="inline-flex items-center rounded-full border border-border-strong bg-surface px-5 py-2.5 text-sm font-medium text-primary hover:bg-surface-alt transition-colors"
        >
          Attribution
        </Link>
      </div>
    </div>
  );
}
