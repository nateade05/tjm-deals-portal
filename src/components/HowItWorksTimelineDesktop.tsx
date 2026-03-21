'use client';

import { HowItWorksStep } from '@/components/HowItWorksStep';
import { StepImagePlaceholder } from '@/components/StepImagePlaceholder';
import type { TimelineStepData } from '@/components/HowItWorksTimelineResponsive';

interface HowItWorksTimelineDesktopProps {
  steps: readonly TimelineStepData[];
}

export function HowItWorksTimelineDesktop({ steps }: HowItWorksTimelineDesktopProps) {
  const stepsBeforeLast = steps.slice(0, -1);
  const lastStep = steps[steps.length - 1];
  if (!lastStep) return null;

  const textFirstLast = (steps.length - 1) % 2 === 0;
  const stepLabelLast = `STEP ${String(lastStep.step).padStart(2, '0')}`;

  return (
    <>
      {/* Start anchor: labels only; terminal cap is first item inside body */}
      <div
        className="flex flex-col items-center pb-10 xl:pb-14"
        aria-label="Journey starts in Singapore"
      >
        <span className="text-sm font-semibold text-primary sm:text-base">
          Singapore
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
          Journey starts
        </span>
      </div>

      {/* Line wrapper: line runs from start cap to end cap only; end anchor labels sit below */}
      <div className="relative">
        {/* Line terminates at end cap (bottom of this wrapper) */}
        <div
          aria-hidden
          className="how-it-works-timeline-line absolute left-1/2 top-0 bottom-0 w-px -translate-x-px"
        />

        {/* Start cap: rail begins here */}
        <div className="flex justify-center pb-10 xl:pb-14">
          <span
            className="relative z-10 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-gold bg-surface xl:h-3 xl:w-3"
            aria-hidden
          />
        </div>

        {/* Steps 1–4 */}
        {stepsBeforeLast.map((item, index) => {
          const textFirst = index % 2 === 0;
          const stepLabel = `STEP ${String(item.step).padStart(2, '0')}`;
          const textBlock = (
            <div className={`w-full max-w-xl ${textFirst ? 'text-right' : 'text-left'}`}>
              <span className="text-gold text-xs font-bold uppercase tracking-widest">
                {stepLabel}
              </span>
              <h2 className="mt-2.5 text-xl font-bold text-primary sm:text-2xl">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-secondary sm:text-base">
                {item.body}
              </p>
            </div>
          );
          const imageBlock = (
            <div
              className={`flex w-full justify-center ${textFirst ? 'xl:justify-end' : 'xl:justify-start'}`}
            >
              <StepImagePlaceholder
                src={item.imageSrc}
                alt={item.imagePlaceholder}
                className="max-h-60 w-full max-w-md xl:max-h-[340px]"
              />
            </div>
          );
          return (
            <HowItWorksStep
              key={item.step}
              stepNumber={item.step}
              textFirst={textFirst}
              textBlock={textBlock}
              imageBlock={imageBlock}
              title={item.title}
              body={item.body}
              stepLabel={stepLabel}
              isLastStep={false}
            />
          );
        })}

        {/* Final segment: Step 05 + short gap + end cap (line ends here) */}
        <div className="flex flex-col">
          <HowItWorksStep
            stepNumber={lastStep.step}
            textFirst={textFirstLast}
            textBlock={
              <div className={`w-full max-w-xl ${textFirstLast ? 'text-right' : 'text-left'}`}>
                <span className="text-gold text-xs font-bold uppercase tracking-widest">
                  {stepLabelLast}
                </span>
                <h2 className="mt-2.5 text-xl font-bold text-primary sm:text-2xl">
                  {lastStep.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-secondary sm:text-base">
                  {lastStep.body}
                </p>
              </div>
            }
            imageBlock={
              <div
                className={`flex w-full justify-center ${textFirstLast ? 'xl:justify-end' : 'xl:justify-start'}`}
              >
                <StepImagePlaceholder
                  src={lastStep.imageSrc}
                  alt={lastStep.imagePlaceholder}
                  className="max-h-44 w-full max-w-md xl:max-h-[280px]"
                />
              </div>
            }
            title={lastStep.title}
            body={lastStep.body}
            stepLabel={stepLabelLast}
            isLastStep
          />
          {/* Small gap then end cap — rail terminates at this node */}
          <div className="flex justify-center pt-4 lg:pt-5 xl:pt-6">
            <span
              className="relative z-10 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-gold bg-surface shadow-md"
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* End anchor labels: part of final flow, no line behind */}
      <div
        className="flex flex-col items-center pt-2 pb-2 lg:pt-3 xl:pb-4"
        aria-label="Journey completes in United Kingdom"
      >
        <span className="text-sm font-semibold text-primary sm:text-base">
          United Kingdom
        </span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
          Journey complete
        </span>
      </div>
    </>
  );
}
