'use client';

import { useRouter } from 'next/navigation';
import { reorderMedia, deleteMedia } from '@/lib/actions/listings';
import type { ListingMedia } from '@/lib/supabase/types';

interface MediaItem extends ListingMedia {
  signedUrl?: string;
}

interface AdminListingMediaListProps {
  listingId: string;
  media: MediaItem[];
}

export function AdminListingMediaList({ listingId, media }: AdminListingMediaListProps) {
  const router = useRouter();

  async function handleReorder(mediaId: string, direction: 'up' | 'down') {
    await reorderMedia(listingId, mediaId, direction);
    router.refresh();
  }

  async function handleDelete(mediaId: string) {
    if (!confirm('Delete this media? The file will be removed from storage.')) return;
    await deleteMedia(mediaId);
    router.refresh();
  }

  if (media.length === 0) return null;

  return (
    <ul className="space-y-2">
      {media.map((m, idx) => (
        <li
          key={m.id}
          className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2"
        >
          <div className="h-14 w-20 shrink-0 overflow-hidden rounded bg-zinc-200">
            {m.type === 'image' && m.signedUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.signedUrl} alt="" className="h-full w-full object-cover" />
            ) : m.type === 'video' ? (
              <span className="flex h-full items-center justify-center text-xs text-zinc-500">
                Video
              </span>
            ) : (
              <span className="flex h-full items-center justify-center text-xs text-zinc-500">
                —
              </span>
            )}
          </div>
          <span className="min-w-0 flex-1 truncate text-xs text-zinc-600">{m.storage_path}</span>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={() => handleReorder(m.id, 'up')}
              disabled={idx === 0}
              className="rounded border border-zinc-300 bg-white px-2 py-0.5 text-xs disabled:opacity-40"
            >
              Up
            </button>
            <button
              type="button"
              onClick={() => handleReorder(m.id, 'down')}
              disabled={idx === media.length - 1}
              className="rounded border border-zinc-300 bg-white px-2 py-0.5 text-xs disabled:opacity-40"
            >
              Down
            </button>
            <button
              type="button"
              onClick={() => handleDelete(m.id)}
              className="rounded border border-red-200 bg-white px-2 py-0.5 text-xs text-red-700 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
