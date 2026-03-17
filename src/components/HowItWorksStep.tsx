'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';

const DURATION_MS = 700;
const EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const SLIDE_DESKTOP = 60;

function useScrollDirection() {
  const lastY = useRef(0);
  const [direction, setDirection] = useState<'down' | 'up'>('down');
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const nextY = window.scrollY;
      if (Math.abs(nextY - lastY.current) < 2) return;
      setDirection(nextY > lastY.current ? 'down' : 'up');
      lastY.current = nextY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return direction;
}

interface HowItWorksStepProps {
  stepNumber: number;
  textFirst: boolean;
  textBlock: ReactNode;
  imageBlock: ReactNode;
  title: string;
  body: string;
  stepLabel: string;
  /** When true, uses smaller bottom margin so end cap sits closer to Step 05 */
  isLastStep?: boolean;
}

/** Desktop-only timeline step: alternating text | marker | image. Used inside HowItWorksTimelineDesktop (xl). */
export function HowItWorksStep({
  stepNumber,
  textFirst,
  textBlock,
  imageBlock,
  isLastStep = false,
}: HowItWorksStepProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const wasIntersectingRef = useRef(false);
  const scrollDir = useScrollDirection();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (scrollDir === 'down') {
            if (entry.isIntersecting) setVisible(true);
          } else {
            const justExited = wasIntersectingRef.current && !entry.isIntersecting;
            if (stepNumber > 1 && justExited) setVisible(false);
          }
          wasIntersectingRef.current = entry.isIntersecting;
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [scrollDir, stepNumber]);

  const transition = `opacity ${DURATION_MS}ms ${EASE}, transform ${DURATION_MS}ms ${EASE}`;
  const textFrom = textFirst ? -SLIDE_DESKTOP : SLIDE_DESKTOP;
  const imageFrom = textFirst ? SLIDE_DESKTOP : -SLIDE_DESKTOP;

  return (
    <section
      ref={sectionRef}
      className={`flex flex-col items-stretch gap-0 lg:flex-row lg:items-center ${isLastStep ? 'mb-8' : 'mb-24'}`}
    >
      <div
        className={`w-full lg:w-1/2 ${textFirst ? 'lg:pr-10 xl:pr-14' : 'lg:pl-10 xl:pl-14'} order-2 ${textFirst ? 'lg:order-1' : 'lg:order-3'}`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : `translateX(${textFrom}px)`,
          transition,
        }}
      >
        {textBlock}
      </div>

      <div
        className="relative z-10 order-1 flex shrink-0 justify-center lg:order-2"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.85)',
          transition,
        }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-gold bg-surface text-sm font-bold text-primary shadow-lg">
          {String(stepNumber).padStart(2, '0')}
        </div>
      </div>

      <div
        className={`w-full lg:w-1/2 ${textFirst ? 'lg:pl-10 xl:pl-14' : 'lg:pr-10 xl:pr-14'} order-3 ${textFirst ? 'lg:order-3' : 'lg:order-1'}`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? 'translateX(0) translateY(0)'
            : `translateX(${imageFrom}px) translateY(12px)`,
          transition,
        }}
      >
        {imageBlock}
      </div>
    </section>
  );
}
