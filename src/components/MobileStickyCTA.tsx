'use client';

import { useState, useEffect, useRef } from 'react';
import { LeadModal, type ListingInfo } from '@/components/LeadModalLazy';

interface Props {
  listing: ListingInfo;
  /** CSS selector for the element whose visibility hides/shows this bar */
  watchSelector: string;
}

export function MobileStickyCTA({ listing, watchSelector }: Props) {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const target = document.querySelector(watchSelector);
    if (!target) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '0px' }
    );
    observerRef.current.observe(target);
    return () => observerRef.current?.disconnect();
  }, [watchSelector]);

  return (
    <>
      <div
        className={`lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border-subtle/70 bg-surface/95 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
        aria-hidden={!visible}
      >
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-[15px] font-semibold text-white shadow-sm active:brightness-95"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.845L.057 23.43a.75.75 0 00.918.919l5.671-1.476A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 01-4.964-1.362l-.355-.213-3.692.96.983-3.596-.232-.371A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
          </svg>
          Chat on WhatsApp
        </button>
      </div>
      {modalOpen && (
        <LeadModal
          context="listing"
          listing={listing}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
