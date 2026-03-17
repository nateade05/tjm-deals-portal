'use client';

import { useState } from 'react';

interface AdminPublicLinkProps {
  listingId: string;
}

export function AdminPublicLink({ listingId }: AdminPublicLinkProps) {
  const [copied, setCopied] = useState(false);
  const path = `/listings/${listingId}`;
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;

  function handleCopy() {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-secondary underline hover:text-primary transition-colors"
      >
        {path}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded border border-border-subtle bg-surface px-2 py-1 text-xs font-medium text-secondary hover:bg-surface-alt transition-colors"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
