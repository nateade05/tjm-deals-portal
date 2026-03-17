'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatGBP } from '@/lib/format';

/**
 * Animation timings — SINGLE SOURCE OF TRUTH.
 * Bentley / Golf / BMW all use this identical timeline (no per-example deltas).
 *
 * DURATION_MS     — ms from slide mount → auto-advance to next example (hold after sequence).
 * STAGGER.*       — delay (ms) after slide mount before that beat starts.
 * DURATIONS.*     — how long (seconds) that beat’s motion runs (Framer).
 * DURATIONS.countUpMs — import price count-up length (every example).
 *
 * Edit only here to retime the whole carousel consistently.
 */
const DURATION_MS = 7600;
const STAGGER = {
  image: 0,
  ukLabel: 460,
  ukPrice: 810,
  strike: 1270,
  importLabel: 1840,
  importPrice: 2190,
  savings: 2650,
};

const DURATIONS = {
  image: 0.7,
  ukLabel: 0.3,
  ukPrice: 0.35,
  strike: 0.6,
  importLabel: 0.3,
  importPrice: 0.4,
  savings: 0.45,
  countUpMs: 700,
};

const EASE = [0.22, 1, 0.36, 1] as const;

const EXAMPLES = [
  {
    vehicle: 'Bentley Continental GT',
    ukPrice: 46_500,
    importPrice: 30_000,
    imageUrl: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&q=80',
  },
  {
    vehicle: 'Volkswagen Golf 1.4 TSI',
    ukPrice: 10_500,
    importPrice: 5_500,
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
  },
  {
    vehicle: 'BMW 216d Gran Tourer',
    ukPrice: 8_500,
    importPrice: 4_500,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
  },
] as const;

type Example = (typeof EXAMPLES)[number];

function getSavings(example: Example) {
  const diff = example.ukPrice - example.importPrice;
  const pct = Math.round((diff / example.ukPrice) * 100);
  return { amount: diff, pct };
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

function ImportPriceCountUp({
  value,
  delayMs,
}: {
  value: number;
  delayMs: number;
}) {
  const [display, setDisplay] = useState('£0');
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = Date.now() + delayMs;
    const durationMs = DURATIONS.countUpMs;
    const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const tick = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 0) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(elapsed / durationMs, 1);
      const eased = easeOutExpo(t);
      setDisplay(formatGBP(Math.round(eased * value)));
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
      }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, [value, delayMs]);

  return <>{display}</>;
}

/** Brush-style strike path: diagonal with slight curve, like a single brush stroke. pathLength=1 for easy dash animation. */
const BRUSH_STRIKE_PATH =
  'M 2 18 C 28 8, 58 22, 98 14';

function ComparisonModule() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % EXAMPLES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    timeoutRef.current = setTimeout(advance, DURATION_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, isPaused, advance]);

  const example = EXAMPLES[index];
  const savings = getSavings(example);

  return (
    <div
      className="relative overflow-visible rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.45 }}
          className="relative grid min-h-[320px] grid-cols-1 items-center gap-0 overflow-visible lg:grid-cols-[1.12fr_1fr] lg:gap-0"
        >
          {/* Image stage — above info card (z-30); controlled overlap so card stays readable */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 1 },
              visible: {
                opacity: 1,
                scale: 1.05,
                transition: {
                  duration: DURATIONS.image,
                  delay: STAGGER.image / 1000,
                  ease: EASE,
                },
              },
              exit: { opacity: 0, scale: 1, transition: { duration: 0.4 } },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-30 flex items-center justify-center overflow-visible lg:-ml-12 lg:min-h-[420px] lg:py-8 lg:mr-[-8rem] lg:translate-x-12"
          >
            {/* Layout footprint unchanged; inner image bleeds top/bottom via scale */}
            <div className="relative aspect-[16/10] w-full overflow-visible lg:aspect-[4/3] lg:h-[380px] lg:min-h-[380px] lg:max-h-[380px] lg:w-[calc(100%+3.25rem)] lg:max-w-[580px]">
              <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-[112%] w-[118%] -translate-x-1/2 -translate-y-1/2 items-stretch justify-center overflow-visible">
                <img
                  src={example.imageUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full min-w-0 flex-shrink-0 rounded-2xl object-cover object-center shadow-[0_20px_48px_-14px_rgba(25,25,25,0.12),0_8px_36px_-8px_rgba(0,0,0,0.07)] [mask-image:radial-gradient(ellipse_98%_96%_at_50%_50%,#000_58%,rgba(0,0,0,0.88)_78%,rgba(0,0,0,0.35)_92%,transparent_100%)] lg:rounded-[1.5rem]"
                />
              </div>
            </div>
          </motion.div>

          {/* Pricing panel — full column width under image (overlap ~8rem); copy right-aligned */}
          <div
            className="relative z-10 flex min-h-[360px] w-full max-w-none flex-col justify-center rounded-2xl bg-surface-alt/80 px-4 py-8 shadow-sm backdrop-blur-md sm:px-8 sm:py-10 lg:min-h-[380px] lg:w-full lg:-translate-x-16 lg:py-10 lg:pl-32 lg:pr-10 lg:text-right lg:rounded-2xl lg:shadow-[0_12px_40px_-16px_rgba(25,25,25,0.06)] [mask-image:radial-gradient(ellipse_98%_96%_at_50%_50%,#000_0%,#000_72%,rgba(0,0,0,0.75)_86%,rgba(0,0,0,0.2)_96%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_98%_96%_at_50%_50%,#000_0%,#000_72%,rgba(0,0,0,0.75)_86%,rgba(0,0,0,0.2)_96%,transparent_100%)]"
          >
            <motion.h3
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{
                duration: DURATIONS.ukLabel,
                delay: STAGGER.image / 1000,
                ease: EASE,
              }}
              className="text-xl font-semibold tracking-tight text-primary sm:text-2xl lg:ml-auto lg:max-w-xl"
            >
              {example.vehicle}
            </motion.h3>

            {/* Typical UK price — large but secondary */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{
                duration: DURATIONS.ukLabel,
                delay: STAGGER.ukLabel / 1000,
                ease: EASE,
              }}
              className="mt-6 text-xs font-medium uppercase tracking-wider text-muted lg:ml-auto lg:block lg:max-w-xl"
            >
              Typical UK price
            </motion.p>
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{
                duration: DURATIONS.ukPrice,
                delay: STAGGER.ukPrice / 1000,
                ease: EASE,
              }}
              className="relative mt-1 inline-block lg:ml-auto lg:block"
            >
              <span className="text-xl font-semibold text-secondary sm:text-2xl">
                {formatGBP(example.ukPrice)}
              </span>
              {/* Brush-style strike — curved path, drawn on with stroke-dashoffset */}
              <svg
                className="absolute inset-0 h-full w-full overflow-visible pointer-events-none"
                viewBox="0 0 100 32"
                preserveAspectRatio="none"
                aria-hidden
              >
                <motion.path
                  d={BRUSH_STRIKE_PATH}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-ink/80"
                  pathLength={1}
                  strokeDasharray={1}
                  initial={{ strokeDashoffset: 1 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{
                    duration: DURATIONS.strike,
                    delay: STAGGER.strike / 1000,
                    ease: EASE,
                  }}
                />
              </svg>
            </motion.div>

            {/* You pay — import price dominant */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{
                duration: DURATIONS.importLabel,
                delay: STAGGER.importLabel / 1000,
                ease: EASE,
              }}
              className="mt-6 text-xs font-medium uppercase tracking-wider text-muted lg:ml-auto lg:block lg:max-w-xl"
            >
              You pay
            </motion.p>
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{
                duration: DURATIONS.importPrice,
                delay: STAGGER.importPrice / 1000,
                ease: EASE,
              }}
              className="mt-1 font-bold text-gold text-3xl sm:text-4xl lg:ml-auto lg:block lg:w-full lg:text-right lg:text-[2.5rem]"
            >
              <ImportPriceCountUp value={example.importPrice} delayMs={STAGGER.importPrice} />
            </motion.p>

            {/* Savings badge — scale + fade */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              initial="hidden"
              animate="visible"
              transition={{
                duration: DURATIONS.savings,
                delay: STAGGER.savings / 1000,
                ease: EASE,
              }}
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-olive-tint px-4 py-2 lg:ml-auto lg:self-end"
            >
              <span className="text-sm font-semibold text-olive-dark">
                Save {formatGBP(savings.amount)} ({savings.pct}%)
              </span>
            </motion.div>

            {/* Step indicators — part of the info card */}
            <div
              className="mt-8 flex items-center justify-center gap-2 lg:mt-10 lg:justify-end"
              role="tablist"
              aria-label="Comparison examples"
            >
              {EXAMPLES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Example ${i + 1} of ${EXAMPLES.length}`}
                  onClick={() => {
                    setIndex(i);
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                      timeoutRef.current = setTimeout(advance, DURATION_MS);
                    }
                  }}
                  className={`h-1.5 min-h-[6px] rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
                    i === index
                      ? 'w-7 bg-gold shadow-sm'
                      : 'w-1.5 bg-muted/40 hover:bg-muted/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function HomePriceComparison() {
  return (
    <section className="flex min-h-[75vh] flex-col justify-center border-y border-border-subtle bg-surface px-4 py-14 sm:px-6 sm:py-16 lg:min-h-[90vh] lg:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center">
        <header className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            The Singapore price advantage
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-secondary">
            Typical UK retail prices compared with importing from Singapore.
          </p>
        </header>

        <div className="mt-10 flex flex-1 flex-col justify-center sm:mt-12 lg:mt-14">
          <ComparisonModule />
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          Examples are illustrative. Actual availability and pricing vary by vehicle and timing.
        </p>
      </div>
    </section>
  );
}
