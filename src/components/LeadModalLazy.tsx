'use client';

import dynamic from 'next/dynamic';
import type { LeadModalContext, ListingInfo } from '@/components/LeadModal';

export type { LeadModalContext, ListingInfo };

export const LeadModal = dynamic(
  () => import('@/components/LeadModal').then((m) => ({ default: m.LeadModal })),
  { ssr: false }
);
