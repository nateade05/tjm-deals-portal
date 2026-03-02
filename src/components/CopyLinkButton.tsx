'use client';

import { useState } from 'react';

interface CopyLinkButtonProps {
  path: string;
  className?: string;
}

export function CopyLinkButton({ path, className }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className ?? 'rounded border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50'}
    >
      {copied ? 'Copied' : 'Copy link'}
    </button>
  );
}
