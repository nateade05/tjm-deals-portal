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
        className="text-sm text-zinc-600 underline hover:text-zinc-900"
      >
        {path}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
