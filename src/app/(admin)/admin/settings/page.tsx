import { getSiteSettingNumber, updateSiteSettingNumber } from '@/lib/actions/settings';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth';

export default async function AdminSettingsPage() {
  await requireAdminSession();
  const carsSoldCount = (await getSiteSettingNumber('cars_sold_count')) ?? 0;

  async function saveCarsSoldCount(formData: FormData) {
    'use server';
    const raw = formData.get('cars_sold_count');
    const value = raw ? parseInt(String(raw), 10) : 0;
    if (!isNaN(value) && value >= 0) {
      await updateSiteSettingNumber('cars_sold_count', value);
    }
    revalidatePath('/admin/settings');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-primary">Site settings</h1>
        <p className="mt-1 text-sm text-muted">Control public-facing stats and content.</p>
      </div>

      <section className="rounded-xl border border-border-subtle bg-surface-alt p-5">
        <h2 className="text-sm font-semibold text-primary">Homepage stat</h2>
        <p className="mt-1 text-xs text-muted">
          Displays as &ldquo;X+ cars successfully imported&rdquo; on the homepage. Set to 0 to hide.
        </p>
        <form action={saveCarsSoldCount} className="mt-4 flex items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="cars_sold_count" className="text-xs font-medium text-secondary">
              Cars delivered count
            </label>
            <input
              id="cars_sold_count"
              name="cars_sold_count"
              type="number"
              min="0"
              defaultValue={carsSoldCount}
              className="w-32 rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-primary"
          >
            Save
          </button>
        </form>
      </section>
    </div>
  );
}
