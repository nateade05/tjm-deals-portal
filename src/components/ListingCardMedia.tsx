'use client';

import { useState } from 'react';
import Image from 'next/image';

const DEFAULT_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

interface ListingCardMediaProps {
  src?: string | null;
  alt?: string;
  className?: string;
  /** Responsive `sizes` for next/image (layout depends on grid/carousel). */
  sizes?: string;
  /** First visible card on page can set priority for LCP. */
  priority?: boolean;
}

/**
 * Listing thumbnail: Next.js Image when possible (optimization + CLS), stable aspect from parent.
 */
export function ListingCardMedia({
  src,
  alt = '',
  className = '',
  sizes = DEFAULT_SIZES,
  priority = false,
}: ListingCardMediaProps) {
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(src) && !failed;

  return (
    <div className="relative h-full w-full">
      {showImg ? (
        <Image
          src={src!}
          alt={alt || 'Vehicle photo'}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${className}`}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          role="img"
          aria-label={alt ? `No photo available for ${alt}` : 'No vehicle photo available'}
          className={`flex h-full min-h-[8rem] w-full items-center justify-center bg-gradient-to-b from-surface-alt to-section-soft/40 ${className}`}
        >
          <span className="px-3 text-center text-[11px] font-medium uppercase tracking-wider text-muted">
            No photo
          </span>
        </div>
      )}
    </div>
  );
}
