import Link from 'next/link';
import {
  fetchLeadAttributionPickById,
  fetchListingOptionsForAttribution,
  fetchSaleAttributionByListingId,
  fetchSaleAttributionsOverview,
  fetchSoldListingsMissingAttribution,
} from '@/lib/actions/attribution';
import { mergeLeadsAttributionPool } from '@/lib/leadsAttributionMerge';
import { fetchLeadsRecentForPicker } from '@/lib/actions/leads';
import { AdminAttributionRecordSalePanel } from '@/components/admin/AdminAttributionRecordSalePanel';
import { LeadSourceBadge } from '@/components/admin/LeadSourceBadge';
import { formatGBP } from '@/lib/format';

interface PageProps {
  searchParams: Promise<{ listingId?: string; leadId?: string }>;
}

function formatSoldAt(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AdminAttributionPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const queryListingId = sp.listingId?.trim() || null;
  const queryLeadId = sp.leadId?.trim() || null;

  const [overview, listingOptions, recentLeads, initialLead, missingAttribution] = await Promise.all([
    fetchSaleAttributionsOverview(),
    fetchListingOptionsForAttribution(),
    fetchLeadsRecentForPicker(300),
    queryLeadId ? fetchLeadAttributionPickById(queryLeadId) : Promise.resolve(null),
    fetchSoldListingsMissingAttribution(),
  ]);

  const leadsPool = mergeLeadsAttributionPool(recentLeads, initialLead ? [initialLead] : []);

  let existing = null as Awaited<ReturnType<typeof fetchSaleAttributionByListingId>>;
  if (queryListingId) {
    existing = await fetchSaleAttributionByListingId(queryListingId);
  } else if (initialLead?.listing_id) {
    existing = await fetchSaleAttributionByListingId(initialLead.listing_id);
  }

  const fixedListingLabel = queryListingId
    ? listingOptions.find((o) => o.id === queryListingId)?.label
    : undefined;

  const openFormByDefault = Boolean(queryListingId || queryLeadId);

  return (
    <div className="space-y-8">
      <AdminAttributionRecordSalePanel
        defaultOpen={openFormByDefault}
        fixedListingId={queryListingId}
        fixedListingLabel={fixedListingLabel}
        listingOptions={listingOptions}
        leadsPool={leadsPool}
        existing={existing}
        initialLeadId={queryLeadId}
        initialLead={initialLead}
      >
        <h1 className="text-xl font-semibold text-zinc-900 sm:text-2xl">Attribution</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-600">
          Record which listing sold, and whether the buyer came through the website lead form or another
          channel. Mark listings sold from the{' '}
          <Link href="/admin/listings" className="font-medium text-sky-700 underline-offset-2 hover:underline">
            Listings
          </Link>{' '}
          table, or start from{' '}
          <Link href="/admin/leads" className="font-medium text-sky-700 underline-offset-2 hover:underline">
            Leads
          </Link>
          . Click <span className="font-medium text-zinc-800">Record a sale</span> to open the form for ad-hoc
          sales (choose any listing).
        </p>
      </AdminAttributionRecordSalePanel>

      {missingAttribution.length > 0 && (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950"
          role="status"
        >
          <p className="font-semibold text-amber-950">Sold listings — attribution still needed</p>
          <p className="mt-1 text-amber-900/90">
            These were marked sold without saving attribution (or the flow was closed). Click{' '}
            <span className="font-medium">Record a sale</span> and select the listing, use a link below, or edit
            the listing.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-amber-950">
            {missingAttribution.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/admin/attribution?listingId=${item.id}`}
                  className="font-medium text-amber-900 underline-offset-2 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <section>
        <h2 className="text-base font-semibold text-zinc-900">Recorded sales</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Latest 500 attributions. Website-linked rows show the lead&apos;s source badge.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200">
          <table className="min-w-[52rem] w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-3 py-2 font-medium text-zinc-700">Listing</th>
                <th className="px-3 py-2 font-medium text-zinc-700">Buyer / lead</th>
                <th className="px-3 py-2 font-medium text-zinc-700">Source</th>
                <th className="px-3 py-2 font-medium text-zinc-700">Sold price</th>
                <th className="px-3 py-2 font-medium text-zinc-700">Sale date</th>
                <th className="px-3 py-2 font-medium text-zinc-700">Notes</th>
                <th className="px-3 py-2 font-medium text-zinc-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {overview.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                    No sale attributions yet. Use the form above to add one.
                  </td>
                </tr>
              ) : (
                overview.map((row) => {
                  const buyerLabel =
                    row.leadName ??
                    row.buyer_name ??
                    '—';
                  const sourceNode = row.lead_id ? (
                    row.leadSource ? (
                      <LeadSourceBadge source={row.leadSource} />
                    ) : (
                      <LeadSourceBadge source="website" />
                    )
                  ) : (
                    <span className="text-xs text-zinc-500">Manual entry</span>
                  );
                  return (
                    <tr key={row.id} className="border-b border-zinc-100 align-top">
                      <td className="px-3 py-2 font-medium text-zinc-900">{row.listingLabel}</td>
                      <td className="max-w-[14rem] px-3 py-2 break-words text-zinc-800">{buyerLabel}</td>
                      <td className="px-3 py-2">{sourceNode}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-zinc-700">
                        {row.sold_price_gbp != null ? formatGBP(row.sold_price_gbp) : '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-zinc-600">{formatSoldAt(row.sold_at)}</td>
                      <td className="max-w-[12rem] px-3 py-2 break-words text-zinc-600">
                        {row.notes ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <Link
                          href={`/admin/attribution?listingId=${row.listing_id}`}
                          className="text-sky-700 underline-offset-2 hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
