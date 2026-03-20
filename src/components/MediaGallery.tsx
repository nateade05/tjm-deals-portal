'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { ListingImageViewerModal } from '@/components/ListingImageViewerModal';

interface MediaGalleryProps {
  images: string[];
  videoUrl?: string;
}

/** Single fixed-aspect stage; images always fill via cover + center (any source aspect). */
function MainImageStage({
  src,
  onError,
  fetchPriority,
}: {
  src: string;
  onError: () => void;
  fetchPriority?: 'high' | 'low' | 'auto';
}) {
  return (
    <div className="relative aspect-[16/10] w-full min-h-[220px] overflow-hidden rounded-2xl border border-border-subtle/70 bg-gradient-to-br from-surface-alt/90 to-section-soft/50 shadow-sm ring-1 ring-black/[0.04]">
      {/* Signed URLs + layout from fixed aspect container; native img avoids optimizer coupling */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        onError={onError}
        decoding="async"
        fetchPriority={fetchPriority}
        sizes="(max-width: 1024px) 100vw, 65vw"
        className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:scale-100 scale-[1.02]"
      />
    </div>
  );
}

export function MediaGallery({ images, videoUrl }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0);
  const [failedSrc, setFailedSrc] = useState<Set<string>>(() => new Set());

  const markFailed = useCallback((src: string) => {
    setFailedSrc((prev) => {
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  const goodImages = useMemo(
    () => images.filter((src) => !failedSrc.has(src)),
    [images, failedSrc]
  );

  const count = goodImages.length;
  const safeIndex = count === 0 ? 0 : Math.min(selectedIndex, count - 1);
  const currentImage = goodImages[safeIndex] ?? goodImages[0];
  const showArrows = count > 1;

  const goPrev = useCallback(() => {
    if (count <= 0) return;
    setSelectedIndex((i) => {
      const cur = Math.min(i, count - 1);
      return cur <= 0 ? count - 1 : cur - 1;
    });
  }, [count]);

  const goNext = useCallback(() => {
    if (count <= 0) return;
    setSelectedIndex((i) => {
      const cur = Math.min(i, count - 1);
      return cur >= count - 1 ? 0 : cur + 1;
    });
  }, [count]);

  useEffect(() => {
    if (!showArrows || viewerOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showArrows, viewerOpen, goPrev, goNext]);

  const openViewer = useCallback(() => {
    if (goodImages.length === 0) return;
    setViewerInitialIndex(safeIndex);
    setViewerOpen(true);
  }, [goodImages.length, safeIndex]);

  return (
    <div className="space-y-4">
      <div className="relative">
        {currentImage ? (
          <>
            <button
              type="button"
              onClick={openViewer}
              aria-haspopup="dialog"
              aria-label="Open full-screen photo viewer"
              className="group relative block w-full cursor-zoom-in rounded-2xl text-left transition-[box-shadow,ring] duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-gold motion-reduce:transition-none"
            >
              <MainImageStage
                src={currentImage}
                onError={() => markFailed(currentImage)}
                fetchPriority={safeIndex === 0 ? 'high' : 'auto'}
              />
              <span
                className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white opacity-0 shadow-sm backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 sm:right-4 sm:top-4"
                aria-hidden
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                  />
                </svg>
              </span>
            </button>
            <ListingImageViewerModal
              open={viewerOpen}
              onClose={() => setViewerOpen(false)}
              images={goodImages}
              initialIndex={viewerInitialIndex}
            />
          </>
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-2xl border border-border-subtle bg-gradient-to-b from-surface-alt to-section-soft/40 px-4 text-center text-sm text-muted">
            <span className="rounded-full bg-surface/90 px-3 py-1 text-xs font-medium tracking-wide text-secondary ring-1 ring-border-subtle">
              Gallery
            </span>
            No photos available
          </div>
        )}
        {showArrows && currentImage && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/95 text-secondary shadow-md ring-1 ring-border-subtle/80 backdrop-blur-sm transition-colors hover:bg-surface hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:left-4 sm:h-11 sm:w-11"
              aria-label="Previous image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/95 text-secondary shadow-md ring-1 ring-border-subtle/80 backdrop-blur-sm transition-colors hover:bg-surface hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:right-4 sm:h-11 sm:w-11"
              aria-label="Next image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:thin] sm:gap-3 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border-strong/80">
          {goodImages.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`relative h-[4.25rem] w-[5.5rem] shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 sm:h-[4.5rem] sm:w-24 ${
                safeIndex === i
                  ? 'border-gold shadow-sm ring-1 ring-gold/25'
                  : 'border-transparent opacity-85 ring-1 ring-transparent hover:border-border-strong hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                onError={() => markFailed(src)}
              />
            </button>
          ))}
        </div>
      )}
      {videoUrl && (
        <div className="overflow-hidden rounded-2xl border border-border-subtle bg-black shadow-md ring-1 ring-black/5">
          <p className="border-b border-border-subtle bg-surface-alt px-4 py-2.5 text-sm font-medium text-secondary">
            Walkaround video
          </p>
          <video
            controls
            className="w-full max-h-[min(70vh,520px)] bg-black"
            src={videoUrl}
            preload="metadata"
            poster={currentImage}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
