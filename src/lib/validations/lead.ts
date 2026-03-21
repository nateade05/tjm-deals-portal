import { z } from 'zod';
import { COUNTRY_OPTION_SET } from '@/lib/countryOptions';

/** Digits only for phone length checks (allows +, spaces, dashes in input). */
function countPhoneDigits(s: string): number {
  return s.replace(/\D/g, '').length;
}

/**
 * Accepts bare domains (mymotors.co.uk), www…, protocol-relative URLs, then validates.
 */
export function normalizeLeadWebsite(raw: string): string {
  let t = raw.trim();
  if (t === '') return '';
  if (t.startsWith('//')) {
    t = `https:${t}`;
  } else if (!/^https?:\/\//i.test(t)) {
    t = `https://${t}`;
  }
  try {
    const u = new URL(t);
    if (
      u.protocol === 'http:' &&
      u.hostname &&
      !/^(localhost|127\.0\.0\.1)$/i.test(u.hostname)
    ) {
      u.protocol = 'https:';
      return u.href;
    }
  } catch {
    /* invalid until refine */
  }
  return t;
}

function isValidHttpUrlForLead(s: string): boolean {
  if (s === '') return true;
  try {
    const u = new URL(s);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    return Boolean(u.hostname && u.hostname.length > 0);
  } catch {
    return false;
  }
}

/** Optional form fields may be omitted, null, or undefined — normalize before string rules. */
const optionalFormString = z.union([z.string(), z.undefined(), z.null()]);

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name (at least 2 characters).')
    .max(120, 'Name is too long — please use 120 characters or fewer.')
    .refine((s) => /[\p{L}\p{M}]/u.test(s), 'Please use letters in your name.'),

  phone: z
    .string()
    .trim()
    .min(1, 'Please enter your phone number.')
    .max(42, 'Phone number looks too long — please check and try again.')
    .refine(
      (s) => {
        const n = countPhoneDigits(s);
        return n >= 8 && n <= 15;
      },
      'Please enter a valid number (8–15 digits in total, including country code).'
    ),

  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address.')
    .email('That doesn’t look like a valid email — please check and try again.')
    .max(254, 'Email address is too long.'),

  country: z
    .string()
    .refine((c) => COUNTRY_OPTION_SET.has(c), 'Please choose your country from the list.'),

  company: optionalFormString
    .transform((v) => (v == null ? '' : String(v)).trim())
    .refine((s) => s.length <= 200, 'Company name is too long — 200 characters maximum.')
    .transform((s) => (s === '' ? undefined : s)),

  website: optionalFormString
    .transform((v) => (v == null ? '' : String(v)).trim())
    .transform((s) => (s === '' ? '' : normalizeLeadWebsite(s)))
    .refine((s) => s.length <= 2000, 'Website address is too long.')
    .refine((s) => s === '' || isValidHttpUrlForLead(s), {
      message: 'Please enter a valid website (e.g. mymotors.co.uk).',
    })
    .transform((s) => (s === '' ? undefined : s)),
});
