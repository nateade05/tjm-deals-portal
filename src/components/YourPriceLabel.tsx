'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface YourPriceLabelProps {
  /** Formatted price string */
  value: string;
}

/**
 * “Your price” with info control — premium emphasis on the figure.
 * Desktop: tooltip on hover; mobile: tap to toggle; keyboard-friendly.
 */
export function YourPriceLabel({ value }: YourPriceLabelProps) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const show = hover || open;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div className="border-b border-border-subtle/80 py-3.5 last:border-0 sm:py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Your price</span>
          <div
            ref={rootRef}
            className="relative"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onBlurCapture={(e) => {
              const next = e.relatedTarget as Node | null;
              if (next && rootRef.current?.contains(next)) return;
              setOpen(false);
            }}
          >
            <button
              type="button"
              aria-expanded={show}
              aria-controls="your-price-annotation"
              aria-label="About your price"
              onClick={() => setOpen((v) => !v)}
              onFocus={() => setOpen(true)}
              className="inline-flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-full border border-border-subtle/45 text-muted/55 transition-[color,border-color,background-color] duration-200 hover:border-gold/30 hover:bg-gold/[0.06] hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface active:scale-[0.97]"
            >
              <svg
                viewBox="0 0 16 16"
                aria-hidden
                className="h-[11px] w-[11px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="8" r="6.25" />
                <path d="M8 7.15V11" />
                <circle cx="8" cy="5.15" r="0.55" fill="currentColor" stroke="none" />
              </svg>
            </button>
            <div
              id="your-price-annotation"
              role="tooltip"
              aria-hidden={!show}
              className={`absolute left-0 top-full z-20 w-[min(14.5rem,calc(100vw-2rem))] pt-1.5 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${
                show
                  ? 'pointer-events-auto translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-1 opacity-0'
              }`}
              style={{ visibility: show ? 'visible' : 'hidden' }}
            >
              <div className="rounded-lg border border-border-subtle/60 bg-surface/97 px-2.5 py-2 text-[11px] leading-snug text-secondary shadow-[0_6px_24px_rgba(0,0,0,0.06)] backdrop-blur-[2px]">
                <p className="text-secondary/95">Final delivered price to your door</p>
                <Link
                  href="/how-it-works"
                  tabIndex={show ? 0 : -1}
                  className="mt-2 inline-block text-[11px] font-semibold text-gold underline-offset-2 hover:underline"
                >
                  How it works
                </Link>
              </div>
            </div>
          </div>
        </div>
        <span className="text-xl font-bold tabular-nums tracking-tight text-primary sm:text-2xl">{value}</span>
      </div>
    </div>
  );
}
