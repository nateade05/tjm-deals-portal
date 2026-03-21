/**
 * Bump when replacing `public/favicon.ico` / icons so browsers drop stale tab/omnibox cache
 * (Chrome keeps favicons per-URL; `?v=` forces a new cache key).
 */
export const FAVICON_VERSION = '2';

export const BRAND_SHORT = 'TJ Motors';
export const BRAND_FULL = 'Thangamani Jeyam Motors';
export const TAGLINE = 'Singapore car deals, delivered and registered in the UK';

/** WhatsApp business number (Singapore). Configure here or override via env. */
export const BUSINESS_WHATSAPP_E164 = '+6591749115';

/** @deprecated Use BRAND_SHORT */
export const SITE_NAME = BRAND_SHORT;
/** @deprecated Use TAGLINE */
export const SITE_TAGLINE = TAGLINE;
