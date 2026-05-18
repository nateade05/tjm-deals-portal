/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

function fire(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params);
}

export const analytics = {
  listingViewed(listing: {
    id: string;
    make?: string | null;
    model?: string | null;
    year?: number | null;
    price?: number | null;
    category?: string;
  }) {
    fire('listing_viewed', {
      listing_id: listing.id,
      make: listing.make ?? undefined,
      model: listing.model ?? undefined,
      year: listing.year ?? undefined,
      value: listing.price ?? undefined,
      category: listing.category,
    });
  },

  leadModalOpened(context: string, listingId?: string | null) {
    fire('lead_modal_opened', { context, listing_id: listingId ?? undefined });
  },

  leadSubmitted(listingId?: string | null) {
    fire('lead_submitted', { listing_id: listingId ?? undefined });
  },

  whatsappRedirected(listingId?: string | null) {
    fire('whatsapp_redirected', { listing_id: listingId ?? undefined });
  },

  galleryOpened(listingId: string) {
    fire('gallery_opened', { listing_id: listingId });
  },

  videoPlayed(listingId: string) {
    fire('video_played', { listing_id: listingId });
  },

  listingCardClicked(listing: {
    id: string;
    make?: string | null;
    model?: string | null;
    year?: number | null;
    price?: number | null;
    category?: string;
  }) {
    fire('listing_card_clicked', {
      listing_id: listing.id,
      make: listing.make ?? undefined,
      model: listing.model ?? undefined,
      year: listing.year ?? undefined,
      value: listing.price ?? undefined,
      category: listing.category,
    });
  },

  copyLinkClicked(listingId: string) {
    fire('copy_link_clicked', { listing_id: listingId });
  },
};
