export type ListingCategory = 'in_stock' | 'opportunity';

export type PricingCategory = 'premium_economy' | 'economy' | 'premium_suvs' | 'luxury';

export type ListingStatus = 'draft' | 'live' | 'sold' | 'archived';

export type ListingMediaType = 'image' | 'video';

export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'sold' | 'lost';

export interface Listing {
  id: string;
  title: string;
  make: string | null;
  model: string | null;
  year: number | null;
  mileage_mi: number | null;
  colour: string | null;
  transmission: string | null;
  fuel: string | null;
  category: ListingCategory;
  /** Optional segment for filters / display; null if not set */
  pricing_category: PricingCategory | null;
  status: ListingStatus;
  price_landed_gbp: number | null;
  estimated_resale_gbp: number | null;
  description: string | null;
  listed_at: string;
  created_at: string;
  updated_at: string;
}

export interface ListingMedia {
  id: string;
  listing_id: string;
  type: ListingMediaType;
  storage_path: string;
  sort_order: number;
  created_at: string;
}

export interface Lead {
  id: string;
  listing_id: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  company: string | null;
  website: string | null;
  message: string | null;
  created_at: string;
  status: LeadStatus;
}

export interface SalesAttribution {
  id: string;
  listing_id: string;
  lead_id: string;
  sold_price_gbp: number | null;
  notes: string | null;
  created_at: string;
}

