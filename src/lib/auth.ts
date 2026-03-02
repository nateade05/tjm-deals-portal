import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

export async function requireAdminSession() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect('/admin/login');
  }

  return { user: data.user };
}

