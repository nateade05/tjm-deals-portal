'use server';

import { supabaseServer } from '@/lib/supabase/server';

/** Count leads created in the last N days. */
export async function fetchLeadsCountSince(days: number): Promise<number> {
  const supabase = await supabaseServer();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceIso = since.toISOString();

  const { count, error } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sinceIso);

  if (error) return 0;
  return count ?? 0;
}
