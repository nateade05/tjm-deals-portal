'use client';

import { useState } from 'react';

interface ListingCardMediaProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

/**
 * Primary listing thumbnail with stable aspect ratio and broken-image fallback.
 */
export function ListingCardMedia({ src, alt = '', className = '' }: ListingCardMediaProps) {
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(src) && !failed;

  return (
    <div className="relative h-full w-full">
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={className}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={`flex h-full w-full min-h-[8rem] items-center justify-center bg-border-subtle ${className}`}
          aria-hidden
        />
      )}
    </div>
  );
}
