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
      className={className ?? 'rounded border border-border-subtle bg-surface px-2 py-1 text-xs font-medium text-secondary hover:bg-surface-alt transition-colors'}
    >
      {copied ? 'Copied' : 'Copy link'}
    </button>
  );
}
