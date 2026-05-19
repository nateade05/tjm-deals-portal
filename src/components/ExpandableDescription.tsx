'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const LINE_CLAMP = 4;

function DescriptionModal({ text, onClose }: { text: string; onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Full description"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full sm:max-w-xl max-h-[85vh] sm:max-h-[75vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-surface shadow-2xl ring-1 ring-black/[0.07]">
        <div className="flex shrink-0 items-center justify-between border-b border-border-subtle/70 px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Description</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-alt hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-[15px] leading-relaxed text-secondary whitespace-pre-line">{text}</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ExpandableDescription({ text }: { text: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [clamped, setClamped] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) setClamped(el.scrollHeight > el.clientHeight + 2);
  }, [text]);

  return (
    <>
      <div className="rounded-2xl border border-border-subtle/80 bg-surface p-5 shadow-md ring-1 ring-black/[0.05] sm:p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Description</h2>
        <p
          ref={ref}
          className="mt-2.5 text-[15px] leading-relaxed text-secondary whitespace-pre-line"
          style={{ display: '-webkit-box', WebkitLineClamp: LINE_CLAMP, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {text}
        </p>
        {clamped && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-3 text-[13px] font-medium text-gold hover:text-gold-hover transition-colors"
          >
            Read full description
          </button>
        )}
      </div>
      {modalOpen && <DescriptionModal text={text} onClose={() => setModalOpen(false)} />}
    </>
  );
}
