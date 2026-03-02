import type { ReactNode } from 'react';
import Link from 'next/link';
import { requireAdminSession } from '@/lib/auth';
import { AdminSignOutButton } from '@/components/AdminSignOutButton';

export const dynamic = 'force-dynamic';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/listings', label: 'Listings' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/attribution', label: 'Attribution' },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await requireAdminSession();

  return (
    <div className="min-h-screen bg-zinc-50 py-6 sm:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:gap-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-52 flex-shrink-0 rounded-2xl border border-zinc-200 bg-white p-4 sm:block">
          <div className="mb-4 text-sm font-semibold text-zinc-900">Admin</div>
          <nav className="space-y-1 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main card */}
        <div className="flex min-h-[70vh] flex-1 flex-col rounded-2xl border border-zinc-200 bg-white">
          <header className="border-b border-zinc-200 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  TJM Motors
                </div>
                <div className="mt-0.5 text-xs text-zinc-500">
                  {user.email ?? 'Admin user'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Mobile nav */}
                <nav className="flex gap-2 text-xs text-zinc-600 sm:hidden">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full border border-zinc-200 px-3 py-1 hover:bg-zinc-50 hover:text-zinc-900"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <AdminSignOutButton />
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

