import Link from 'next/link';
import { ListingForm } from '@/components/ListingForm';
import { createListingAndRedirect, noopUpdateAction } from '@/lib/actions/listings';

export default function AdminListingsNewPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/listings"
          className="text-sm text-zinc-600 hover:text-zinc-900"
        >
          ← Listings
        </Link>
      </div>
      <h1 className="text-xl font-semibold text-zinc-900 sm:text-2xl">New listing</h1>
      <ListingForm
        mode="create"
        createAction={createListingAndRedirect}
        updateAction={noopUpdateAction}
      />
    </div>
  );
}
