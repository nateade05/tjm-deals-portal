import type { LeadAttributionPick } from '@/lib/supabase/types';

/** Dedupe by id; later entries override (e.g. ensure `extra` wins). */
export function mergeLeadsAttributionPool(
  ...batches: LeadAttributionPick[][]
): LeadAttributionPick[] {
  const map = new Map<string, LeadAttributionPick>();
  for (const batch of batches) {
    for (const l of batch) {
      map.set(l.id, l);
    }
  }
  return Array.from(map.values());
}
