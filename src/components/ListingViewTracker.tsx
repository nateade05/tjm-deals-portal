'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

interface Props {
  id: string;
  make?: string | null;
  model?: string | null;
  year?: number | null;
  price?: number | null;
  category: string;
}

export function ListingViewTracker({ id, make, model, year, price, category }: Props) {
  useEffect(() => {
    analytics.listingViewed({ id, make, model, year, price, category });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
