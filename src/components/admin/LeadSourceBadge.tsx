import type { LeadSource } from '@/lib/supabase/types';

export function LeadSourceBadge({ source }: { source: LeadSource }) {
  if (source === 'website') {
    return (
      <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-800 ring-1 ring-inset ring-sky-200">
        Website
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 ring-1 ring-inset ring-zinc-200">
      Other source
    </span>
  );
}
