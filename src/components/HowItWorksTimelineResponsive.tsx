'use client';

import { useRef, useState, useEffect } from 'react';
import { StepImagePlaceholder } from '@/components/StepImagePlaceholder';

const DURATION_MS = 700;
const EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

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

export interface TimelineStepData {
  step: number;
  title: string;
  body: string;
  imagePlaceholder: string;
}

interface HowItWorksTimelineResponsiveProps {
  steps: readonly TimelineStepData[];
}

function ResponsiveStepContent({
  stepNumber,
  stepLabel,
  title,
  body,
  imageNode,
  scrollDir,
}: {
  stepNumber: number;
  stepLabel: string;
  title: string;
  body: string;
  imageNode: React.ReactNode;
  scrollDir: 'down' | 'up';
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const wasIntersectingRef = useRef(false);

  useEffect(() => {
    const el = contentRef.current;
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
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [scrollDir, stepNumber]);

  const transition = `opacity ${DURATION_MS}ms ${EASE}, transform ${DURATION_MS}ms ${EASE}`;
  const contentStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition,
  };
  const nodeStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'scale(1)' : 'scale(0.85)',
    transition,
  };

  return (
    <>
      <div className="flex justify-center py-5 sm:py-6" style={nodeStyle}>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-gold bg-surface text-xs font-bold text-primary shadow-md sm:h-14 sm:w-14 sm:text-sm">
          {String(stepNumber).padStart(2, '0')}
        </div>
      </div>
      <div
        ref={contentRef}
        className="flex flex-col gap-3 py-5 pl-4 sm:py-6 sm:pl-6"
        style={contentStyle}
      >
        <span className="text-gold text-[10px] font-bold uppercase tracking-widest sm:text-xs">
          {stepLabel}
        </span>
        <h2 className="max-w-xl text-base font-bold leading-tight text-primary sm:text-lg">
          {title}
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-secondary">
          {body}
        </p>
        <div className="mt-1 w-full max-w-[280px] overflow-hidden rounded-lg shadow-sm sm:max-w-xs">
          {imageNode}
        </div>
      </div>
    </>
  );
}

/** Final row: Step 05 content + end anchor in one flow; rail has node + short segment + end cap */
function ResponsiveLastStepWithEndAnchor({
  step,
  scrollDir,
}: {
  step: TimelineStepData;
  scrollDir: 'down' | 'up';
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const wasIntersectingRef = useRef(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (scrollDir === 'down') {
            if (entry.isIntersecting) setVisible(true);
          } else {
            const justExited = wasIntersectingRef.current && !entry.isIntersecting;
            if (step.step > 1 && justExited) setVisible(false);
          }
          wasIntersectingRef.current = entry.isIntersecting;
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [scrollDir, step.step]);

  const transition = `opacity ${DURATION_MS}ms ${EASE}, transform ${DURATION_MS}ms ${EASE}`;
  const contentStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition,
  };
  const nodeStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'scale(1)' : 'scale(0.85)',
    transition,
  };

  return (
    <>
      {/* Rail: Step 05 node, stretch segment, end cap at bottom of line (not copying start cap) */}
      <div className="flex min-h-0 flex-col">
        <div className="flex justify-center py-5 sm:py-6" style={nodeStyle}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-gold bg-surface text-xs font-bold text-primary shadow-md sm:h-14 sm:w-14 sm:text-sm">
            {String(step.step).padStart(2, '0')}
          </div>
        </div>
        <div className="min-h-[28px] flex-1 flex-shrink-0 sm:min-h-[32px]" aria-hidden />
        <div className="mt-auto flex justify-center pb-0 pt-0">
          <span
            className="relative z-10 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-gold bg-surface shadow-md"
            aria-hidden
          />
        </div>
      </div>
      {/* Content: Step 05 at top (spacing matches steps 1–4); United Kingdom block at bottom inline with end cap */}
      <div
        ref={contentRef}
        className="flex min-h-0 flex-col pl-4 pt-5 pb-2 sm:pt-6 sm:pl-6 sm:pb-2"
        style={contentStyle}
      >
        <div className="flex flex-col gap-3">
          <span className="text-gold text-[10px] font-bold uppercase tracking-widest sm:text-xs">
            STEP {String(step.step).padStart(2, '0')}
          </span>
          <h2 className="max-w-xl text-base font-bold leading-tight text-primary sm:text-lg">
            {step.title}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-secondary">
            {step.body}
          </p>
          <div className="mt-1 w-full max-w-[240px] overflow-hidden rounded-lg shadow-sm sm:max-w-[260px]">
            <StepImagePlaceholder alt={step.imagePlaceholder} className="min-h-[72px] sm:min-h-[80px]" />
          </div>
        </div>
        {/* Spacer: pushes United Kingdom block to bottom so it aligns with end cap */}
        <div className="min-h-[20px] flex-1 sm:min-h-[24px]" aria-hidden />
        {/* United Kingdom: its own text block, inline with bottom end cap */}
        <div
          className="mt-auto flex flex-col pt-0"
          aria-label="Journey completes in United Kingdom"
        >
          <span className="text-sm font-semibold text-primary">
            United Kingdom
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
            Journey complete
          </span>
        </div>
      </div>
    </>
  );
}

export function HowItWorksTimelineResponsive({ steps }: HowItWorksTimelineResponsiveProps) {
  const scrollDir = useScrollDirection();
  const stepsBeforeLast = steps.slice(0, -1);
  const lastStep = steps[steps.length - 1];

  return (
    <div className="relative grid grid-cols-[64px_1fr] gap-0 sm:grid-cols-[72px_1fr]">
      <div
        aria-hidden
        className="how-it-works-timeline-line pointer-events-none absolute top-0 bottom-0 w-px -translate-x-px left-[31px] sm:left-[35px]"
      />

      {/* Row 0: start cap + start labels */}
      <div className="flex justify-center pt-0 pb-2 sm:pb-3">
        <span
          className="relative z-10 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-gold bg-surface sm:h-3 sm:w-3"
          aria-hidden
        />
      </div>
      <div className="flex flex-col py-3 pl-4 sm:py-4 sm:pl-6" aria-label="Journey starts in Singapore">
        <span className="text-sm font-semibold text-primary">Singapore</span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
          Journey starts
        </span>
      </div>

      {/* Rows 1–4: step node + step content */}
      {stepsBeforeLast.map((item) => (
        <ResponsiveStepContent
          key={item.step}
          stepNumber={item.step}
          stepLabel={`STEP ${String(item.step).padStart(2, '0')}`}
          title={item.title}
          body={item.body}
          imageNode={<StepImagePlaceholder alt={item.imagePlaceholder} className="min-h-[100px]" />}
          scrollDir={scrollDir}
        />
      ))}

      {/* Row 5: Step 05 + end anchor in one segment; rail ends at end cap */}
      {lastStep && (
        <ResponsiveLastStepWithEndAnchor key={lastStep.step} step={lastStep} scrollDir={scrollDir} />
      )}
    </div>
  );
}
