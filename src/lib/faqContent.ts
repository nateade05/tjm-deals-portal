export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How does importing from Singapore work?',
    answer:
      'We source vehicles from Singapore\'s dealer network and private sellers, inspect them before purchase, then handle all shipping, UK customs clearance, and DVLA registration on your behalf. You receive a fully registered, road-legal car without managing any of the logistics yourself.',
  },
  {
    question: 'What is included in the landed price?',
    answer:
      'The landed price covers the vehicle cost, shipping (RoRo or container), UK import duty, VAT, and DVLA registration including plates. There are no hidden fees — what you see is what you pay to get the car on the road.',
  },
  {
    question: 'How long does the full process take?',
    answer:
      'From purchase to delivery typically takes 10–14 weeks. Shipping from Singapore to the UK is 6–8 weeks, with preparation, customs clearance, and registration accounting for the remainder.',
  },
  {
    question: 'Are Singapore cars right-hand drive?',
    answer:
      'Yes. Singapore drives on the left, so all vehicles are right-hand drive — no conversion required. They arrive ready for UK roads.',
  },
  {
    question: 'What condition are the vehicles in?',
    answer:
      'Singapore has strict vehicle inspection laws (LTA standards) and low average mileage due to the COE system, which means cars are generally well-maintained. Every vehicle we purchase is inspected before shipping, and preparation work is completed before export.',
  },
  {
    question: 'Do the cars come with a UK MOT?',
    answer:
      'Yes. Every vehicle is put through a UK MOT before being registered and delivered to you.',
  },
  {
    question: 'Can I request a specific make or model?',
    answer:
      'Absolutely. If you don\'t see what you\'re looking for in our current listings, get in touch via WhatsApp and we can source specific makes, models, or specifications from Singapore on your behalf.',
  },
  {
    question: 'Why are Singapore imports cheaper than buying in the UK?',
    answer:
      'Singapore\'s Certificate of Entitlement (COE) system caps the number of vehicles on the road. When a COE expires, cars are deregistered and often exported at significant discounts relative to UK retail prices — despite being in excellent condition with low mileage.',
  },
  {
    question: 'How do I enquire about a vehicle?',
    answer:
      'Hit "Chat on WhatsApp" on any listing or in the navigation. We respond quickly and can answer specific questions about condition, history, or availability.',
  },
];
