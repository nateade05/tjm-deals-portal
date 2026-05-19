'use server';

import { supabaseServerPublic, supabaseServer } from '@/lib/supabase/server';
import { requireAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getSiteSettingNumber(key: string): Promise<number | null> {
  const supabase = await supabaseServerPublic();
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single();
  if (!data) return null;
  const v = data.value;
  if (typeof v === 'number') return v;
  return null;
}

export async function updateSiteSettingNumber(key: string, value: number): Promise<void> {
  await requireAdminSession();
  const supabase = await supabaseServer();
  await supabase.from('site_settings').upsert({
    key,
    value,
    updated_at: new Date().toISOString(),
  });
  revalidatePath('/');
}
