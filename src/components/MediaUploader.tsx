'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { insertMediaRows } from '@/lib/actions/listings';
import type { ListingMedia } from '@/lib/supabase/types';

const MAX_IMAGES = 20;
const MAX_VIDEOS = 1;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const USER_MESSAGE_UPLOAD_FAILED = 'Upload failed. Please try again.';

interface MediaWithUrl extends ListingMedia {
  signedUrl?: string;
}

interface MediaUploaderProps {
  listingId: string;
  existingMedia: MediaWithUrl[];
  onUploaded?: () => void;
}

function getExt(type: string): string {
  if (type.includes('png')) return 'png';
  if (type.includes('webp')) return 'webp';
  if (type.includes('gif')) return 'gif';
  if (type.includes('webm')) return 'webm';
  if (type.includes('quicktime')) return 'mov';
  return 'jpg';
}

export function MediaUploader({ listingId, existingMedia, onUploaded }: MediaUploaderProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const imageCount = existingMedia.filter((m) => m.type === 'image').length;
  const videoCount = existingMedia.filter((m) => m.type === 'video').length;
  const canAddImages = imageCount < MAX_IMAGES;
  const canAddVideo = videoCount < MAX_VIDEOS;

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setMessage(null);
    setUploading(true);

    const supabase = supabaseBrowser();
    const toInsert: { type: 'image' | 'video'; storage_path: string; sort_order: number }[] = [];
    let maxOrder = Math.max(0, ...existingMedia.map((m) => m.sort_order), -1);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = VIDEO_TYPES.includes(file.type);
        const isImage = IMAGE_TYPES.includes(file.type);
        if (!isImage && !isVideo) continue;
        if (isVideo && !canAddVideo) continue;
        if (isImage && !canAddImages) break;

        const type = isVideo ? 'video' : 'image';
        const ext = getExt(file.type);
        const storage_path = `${listingId}/${crypto.randomUUID()}.${ext}`;

        const { error } = await supabase.storage.from('listing-media').upload(storage_path, file, { upsert: false });
        if (error) {
          console.error('[MediaUploader] storage upload error:', error.message);
          setMessage(USER_MESSAGE_UPLOAD_FAILED);
          setUploading(false);
          return;
        }
        maxOrder += 1;
        toInsert.push({ type, storage_path, sort_order: maxOrder });
      }

      if (toInsert.length) {
        const result = await insertMediaRows(listingId, toInsert);
        if ('error' in result && result.error) {
          console.error('[MediaUploader] insertMediaRows error:', result.error);
          setMessage(USER_MESSAGE_UPLOAD_FAILED);
        } else {
          onUploaded?.();
          router.refresh();
        }
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={[...IMAGE_TYPES, ...VIDEO_TYPES].join(',')}
          multiple
          onChange={handleFileSelect}
          disabled={uploading || (!canAddImages && !canAddVideo)}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || (!canAddImages && !canAddVideo)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : 'Add images or video'}
        </button>
        <span className="text-xs text-zinc-500">
          {imageCount}/{MAX_IMAGES} images, {videoCount}/{MAX_VIDEOS} video
        </span>
      </div>
      {message && <p className="text-sm text-red-600">{message}</p>}
    </div>
  );
}
