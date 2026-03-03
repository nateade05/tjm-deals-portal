'use client';

import { useState, useCallback, useEffect } from 'react';

interface MediaGalleryProps {
  images: string[];
  videoUrl?: string;
}

export function MediaGallery({ images, videoUrl }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const count = images.length;
  const currentImage = images[selectedIndex] ?? images[0];
  const showArrows = count > 1;

  const goPrev = useCallback(() => {
    setSelectedIndex((i) => (i <= 0 ? count - 1 : i - 1));
  }, [count]);

  const goNext = useCallback(() => {
    setSelectedIndex((i) => (i >= count - 1 ? 0 : i + 1));
  }, [count]);

  useEffect(() => {
    if (!showArrows) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showArrows, goPrev, goNext]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100">
        {currentImage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={currentImage}
            alt=""
            className="h-full w-full object-contain"
          />
        )}
        {showArrows && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
              aria-label="Previous image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
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
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                selectedIndex === i
                  ? 'border-zinc-900'
                  : 'border-transparent hover:border-zinc-300'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      {videoUrl && (
        <div className="rounded-xl overflow-hidden bg-black">
          <p className="bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700">
            Walkaround video
          </p>
          <video
            controls
            className="w-full"
            src={videoUrl}
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
