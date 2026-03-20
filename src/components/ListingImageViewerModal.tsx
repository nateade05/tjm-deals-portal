'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

const ZOOM_LEVEL = 2.15;
const DRAG_THRESHOLD_PX = 10;
const SWIPE_CLOSE_PX = 96;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export type ListingImageViewerModalProps = {
  open: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
};

/**
 * Full-screen editorial image viewer: true aspect ratio, zoom/pan, keyboard + touch.
 */
export function ListingImageViewerModal({
  open,
  onClose,
  images,
  initialIndex,
}: ListingImageViewerModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const panRef = useRef(pan);
  panRef.current = pan;

  const interactionRef = useRef({
    down: false,
    moved: false,
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
  });

  const swipeRef = useRef({ y0: 0, tracking: false });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const safe = clamp(initialIndex, 0, Math.max(0, images.length - 1));
    setIndex(safe);
    setZoomed(false);
    setPan({ x: 0, y: 0 });
    setImgFailed(false);
  }, [open, initialIndex, images.length]);

  useEffect(() => {
    setZoomed(false);
    setPan({ x: 0, y: 0 });
    setImgFailed(false);
  }, [index]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 10);
    return () => window.clearTimeout(t);
  }, [open]);

  const computePanBounds = useCallback(() => {
    const stage = stageRef.current;
    const img = imgRef.current;
    if (!stage || !img) return { maxX: 0, maxY: 0 };
    const cw = stage.clientWidth;
    const ch = stage.clientHeight;
    const iw = img.clientWidth;
    const ih = img.clientHeight;
    if (!iw || !ih) return { maxX: 0, maxY: 0 };
    const z = ZOOM_LEVEL;
    const scaledW = iw * z;
    const scaledH = ih * z;
    const maxX = Math.max(0, (scaledW - cw) / 2);
    const maxY = Math.max(0, (scaledH - ch) / 2);
    return { maxX, maxY };
  }, []);

  const clampPan = useCallback(
    (x: number, y: number) => {
      const { maxX, maxY } = computePanBounds();
      return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
    },
    [computePanBounds]
  );

  const zoomOut = useCallback(() => {
    setZoomed(false);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowLeft' && images.length > 1) {
        e.preventDefault();
        setIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
      }
      if (e.key === 'ArrowRight' && images.length > 1) {
        e.preventDefault();
        setIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
      }
      if (e.key === '+' || (e.key === '=' && e.shiftKey)) {
        e.preventDefault();
        setZoomed(true);
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomOut();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, images.length, onClose, zoomOut]);

  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href]:not([disabled])'
      )
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const onImagePointerDown = (e: React.PointerEvent) => {
    if (imgFailed) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    interactionRef.current = {
      down: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      startPanX: panRef.current.x,
      startPanY: panRef.current.y,
    };
  };

  const onImagePointerMove = (e: React.PointerEvent) => {
    const ir = interactionRef.current;
    if (!ir.down) return;
    const dx = e.clientX - ir.startX;
    const dy = e.clientY - ir.startY;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) ir.moved = true;
    if (zoomed) {
      setPan(clampPan(ir.startPanX + dx, ir.startPanY + dy));
    }
  };

  const onImagePointerUp = (e: React.PointerEvent) => {
    const ir = interactionRef.current;
    if (!ir.down) return;
    ir.down = false;
    setDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (imgFailed) return;
    if (!zoomed) {
      if (!ir.moved) {
        setZoomed(true);
        setPan({ x: 0, y: 0 });
      }
    } else if (!ir.moved) {
      zoomOut();
    }
  };

  const onImagePointerCancel = () => {
    interactionRef.current.down = false;
    setDragging(false);
  };

  const onImgLoad = () => {
    setImgFailed(false);
    if (zoomed) setPan((p) => clampPan(p.x, p.y));
  };

  useEffect(() => {
    if (!open || !zoomed) return;
    const onResize = () => {
      requestAnimationFrame(() => {
        setPan((p) => clampPan(p.x, p.y));
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, zoomed, clampPan]);

  const currentSrc = images[index];

  const handleSwipeZoneTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    swipeRef.current = { y0: e.touches[0].clientY, tracking: true };
  };

  const handleSwipeZoneTouchMove = (e: React.TouchEvent) => {
    if (!swipeRef.current.tracking || e.touches.length !== 1) return;
    const dy = e.touches[0].clientY - swipeRef.current.y0;
    if (dy > SWIPE_CLOSE_PX) {
      swipeRef.current.tracking = false;
      onClose();
    }
  };

  const handleSwipeZoneTouchEnd = () => {
    swipeRef.current.tracking = false;
  };

  if (!mounted || !open || images.length === 0) return null;

  const showNav = images.length > 1;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[100] flex flex-col"
      onKeyDown={handleDialogKeyDown}
    >
      <span id={titleId} className="sr-only">
        Vehicle photos — image {index + 1} of {images.length}
      </span>

      {/* Backdrop — receives clicks in non-interactive areas (content uses pointer-events-none pass-through) */}
      <div
        role="presentation"
        className="absolute inset-0 z-0 bg-black/88 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none"
        onClick={onBackdropClick}
      />

      <div
        className="relative z-10 flex min-h-0 flex-1 flex-col pointer-events-none"
        style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
      >
        {/* Top bar — swipe-down hint on touch */}
        <div
          className="flex shrink-0 justify-center pb-2 pointer-events-auto"
          onTouchStart={handleSwipeZoneTouchStart}
          onTouchMove={handleSwipeZoneTouchMove}
          onTouchEnd={handleSwipeZoneTouchEnd}
        >
          <div className="h-1 w-10 rounded-full bg-white/25 sm:hidden" aria-hidden />
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-3 pb-4 pointer-events-auto sm:px-6">
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3 sm:mb-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/55">
            {images.length > 1 ? (
              <>
                {index + 1} <span className="text-white/35">/</span> {images.length}
              </>
            ) : (
              'View'
            )}
          </p>
          <div className="flex items-center gap-2">
            {zoomed && (
              <button
                type="button"
                onClick={zoomOut}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Fit
              </button>
            )}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center pointer-events-none">
          {showNav && (
            <button
              type="button"
              onClick={() => setIndex((i) => (i <= 0 ? images.length - 1 : i - 1))}
              className="absolute left-0 z-[103] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:left-1 sm:h-12 sm:w-12 pointer-events-auto"
              aria-label="Previous image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {showNav && (
            <button
              type="button"
              onClick={() => setIndex((i) => (i >= images.length - 1 ? 0 : i + 1))}
              className="absolute right-0 z-[103] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:right-1 sm:h-12 sm:w-12 pointer-events-auto"
              aria-label="Next image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div
            ref={stageRef}
            className={`relative mx-auto flex h-full max-h-[min(78vh,820px)] w-full max-w-[min(92vw,1200px)] items-center justify-center overflow-hidden rounded-sm pointer-events-auto ${
              zoomed ? 'cursor-grab touch-none active:cursor-grabbing' : 'cursor-zoom-in touch-manipulation'
            }`}
            style={{ touchAction: zoomed ? 'none' : 'manipulation' }}
          >
            {imgFailed ? (
              <p className="text-sm text-white/50">Image unavailable</p>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                ref={imgRef}
                src={currentSrc}
                alt=""
                draggable={false}
                className="max-h-full max-w-full object-contain select-none"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomed ? ZOOM_LEVEL : 1})`,
                  transition: dragging
                    ? 'none'
                    : 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                onPointerDown={onImagePointerDown}
                onPointerMove={onImagePointerMove}
                onPointerUp={onImagePointerUp}
                onPointerCancel={onImagePointerCancel}
                onLoad={onImgLoad}
                onError={() => setImgFailed(true)}
              />
            )}
          </div>
        </div>

        {!zoomed && (
          <p className="mt-3 text-center text-[11px] text-white/40 sm:mt-4">
            Tap image to zoom · Drag to pan when zoomed
          </p>
        )}

        {showNav && (
          <div className="mt-4 flex justify-center gap-1.5 overflow-x-auto pb-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border transition-all duration-200 sm:h-14 sm:w-[4.5rem] ${
                  i === index
                    ? 'border-gold/70 ring-1 ring-gold/35'
                    : 'border-white/15 opacity-70 hover:border-white/35 hover:opacity-100'
                }`}
                aria-label={`Show image ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>,
    document.body
  );
}
