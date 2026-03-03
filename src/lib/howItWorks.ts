export type HowItWorksIconKey = 'search' | 'tools' | 'ship' | 'customs' | 'plates';

export interface HowItWorksStep {
  step: number;
  title: string;
  short: string;
  long: string;
  timeframe?: string;
  icon: HowItWorksIconKey;
  bullets: string[];
}

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: 1,
    title: 'Source the right car',
    short: 'We carefully source in Singapore from private owners, part‑exchange auctions and trusted dealers.',
    long: 'Your vehicle is sourced in Singapore from a curated network of private owners, part‑exchange auctions and established dealers. We focus on well‑maintained, low‑risk stock that makes sense for the UK market.',
    timeframe: '< 1 week',
    icon: 'search',
    bullets: [
      'Access to private sellers, dealer stock and part‑exchange auctions.',
      'Focus on clean history, strong service records and sensible mileage.',
      'Shortlist vehicles that stack up commercially once landed in the UK.',
    ],
  },
  {
    step: 2,
    title: 'Prepare to showroom standard',
    short: 'Bodywork, mechanical repairs and servicing completed in Singapore’s advanced auto ecosystem.',
    long: 'The car is fully prepared in Singapore before it ever sees a UK port. Bodywork, mechanical repairs and engine/gearbox servicing are handled by trusted partners in a highly advanced automotive environment.',
    timeframe: '< 1 week',
    icon: 'tools',
    bullets: [
      'Cosmetic and bodywork rectification to showroom presentation.',
      'Mechanical checks, repairs and preventative maintenance.',
      'Engine and gearbox servicing completed before shipping.',
    ],
  },
  {
    step: 3,
    title: 'Ship to the UK',
    short: 'We load and ship by RoRo or inside secure 40-foot containers, depending on the deal.',
    long: 'Once prepared, the vehicle is booked onto the most suitable sailing to the UK, either on a Roll‑on/Roll‑off (RoRo) vessel or inside a 40-foot container alongside other cars.',
    timeframe: '6–8 weeks',
    icon: 'ship',
    bullets: [
      'Route and method selected to balance cost, timing and risk.',
      'RoRo or containerised shipping depending on vehicle and volume.',
      'Pre‑departure photos and documentation shared for your records.',
    ],
  },
  {
    step: 4,
    title: 'Clear customs & deliver',
    short: 'Arrival into Bristol or Southampton, customs cleared and moved by specialist delivery partners.',
    long: 'On arrival into the UK, specialist teams handle port clearance, customs paperwork and hand‑over to trusted delivery partners. Vehicles are moved quickly and securely to their next destination.',
    timeframe: '2–3 weeks',
    icon: 'customs',
    bullets: [
      'Arrival into Bristol or Southampton port, depending on sailing.',
      'Customs, duties and compliance handled by experienced agents.',
      'Secure movement from port to your site or our preparation facility.',
    ],
  },
  {
    step: 5,
    title: 'Register & hand over',
    short: 'We register with DVLA, fit UK plates and prepare the car for retail or your own use.',
    long: 'Once in the UK, TJMotors manages DVLA registration, number plates and any final UK‑specific checks so the car is ready for forecourt, retail or personal use.',
    timeframe: 'Ready to drive',
    icon: 'plates',
    bullets: [
      'DVLA registration completed with the correct documentation.',
      'UK number plates ordered, fitted and checked.',
      'Vehicle presented ready for sale or immediate private use.',
    ],
  },
];

