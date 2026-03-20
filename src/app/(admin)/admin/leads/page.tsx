import Link from 'next/link';
import { fetchLeads } from '@/lib/actions/leads';
import { LeadSourceBadge } from '@/components/admin/LeadSourceBadge';
import type { Lead, LeadStatus } from '@/lib/supabase/types';

function formatLeadTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusBadgeClass(status: LeadStatus): string {
  switch (status) {
    case 'new':
      return 'bg-amber-50 text-amber-900 ring-amber-200';
    case 'contacted':
      return 'bg-sky-50 text-sky-900 ring-sky-200';
    case 'negotiating':
      return 'bg-violet-50 text-violet-900 ring-violet-200';
    case 'sold':
      return 'bg-emerald-50 text-emerald-900 ring-emerald-200';
    case 'lost':
      return 'bg-zinc-100 text-zinc-600 ring-zinc-200';
    default:
      return 'bg-zinc-50 text-zinc-700 ring-zinc-200';
  }
}

function formatStatusLabel(status: LeadStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default async function AdminLeadsPage() {
  const leads = await fetchLeads();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h1 className="text-xl font-semibold text-zinc-900 sm:text-2xl">Leads</h1>
        <p className="text-sm text-zinc-500">
          {leads.length} {leads.length === 1 ? 'record' : 'records'}
          {leads.length >= 500 ? ' (showing latest 500)' : ''}
        </p>
      </div>
      <p className="text-sm text-zinc-600">
        Enquiries from the WhatsApp lead form are tagged <LeadSourceBadge source="website" />. You can
        mark other channels in Supabase (<code className="rounded bg-zinc-100 px-1 text-xs">source</code> ={' '}
        <code className="rounded bg-zinc-100 px-1 text-xs">other</code>). Status can be updated in
        Supabase for now.
      </p>

      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="min-w-[56rem] w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-zinc-700">Received</th>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-zinc-700">Status</th>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-zinc-700">Name</th>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-zinc-700">Phone</th>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-zinc-700">Email</th>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-zinc-700">Country</th>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-zinc-700">Company</th>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-zinc-700">Website</th>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-zinc-700">Source</th>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-zinc-700">Listing</th>
              <th className="whitespace-nowrap px-3 py-2 font-medium text-zinc-700">Attribution</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-zinc-500">
                  No leads yet. They will appear here after visitors submit the lead form.
                </td>
              </tr>
            ) : (
              leads.map((row: Lead) => (
                <tr key={row.id} className="border-b border-zinc-100 align-top">
                  <td className="whitespace-nowrap px-3 py-2 text-zinc-600">
                    {formatLeadTime(row.created_at)}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusBadgeClass(row.status)}`}
                    >
                      {formatStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className="max-w-[10rem] px-3 py-2 font-medium text-zinc-900 break-words">
                    {row.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <a
                      href={`tel:${row.phone.replace(/\s/g, '')}`}
                      className="text-sky-700 underline-offset-2 hover:underline"
                    >
                      {row.phone}
                    </a>
                  </td>
                  <td className="max-w-[12rem] px-3 py-2 break-all">
                    <a
                      href={`mailto:${row.email}`}
                      className="text-sky-700 underline-offset-2 hover:underline"
                    >
                      {row.email}
                    </a>
                  </td>
                  <td className="max-w-[8rem] px-3 py-2 text-zinc-600 break-words">{row.country}</td>
                  <td className="max-w-[8rem] px-3 py-2 text-zinc-600 break-words">
                    {row.company ?? '—'}
                  </td>
                  <td className="max-w-[10rem] px-3 py-2 break-all">
                    {row.website ? (
                      <a
                        href={row.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-700 underline-offset-2 hover:underline"
                      >
                        {row.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <LeadSourceBadge source={row.source === 'other' ? 'other' : 'website'} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {row.listing_id ? (
                      <Link
                        href={`/admin/listings/${row.listing_id}/edit`}
                        className="font-mono text-xs text-sky-700 underline-offset-2 hover:underline"
                      >
                        Edit listing
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <Link
                      href={
                        row.listing_id
                          ? `/admin/attribution?listingId=${row.listing_id}&leadId=${row.id}`
                          : `/admin/attribution?leadId=${row.id}`
                      }
                      className="text-xs font-medium text-sky-700 underline-offset-2 hover:underline"
                    >
                      Record sale
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
