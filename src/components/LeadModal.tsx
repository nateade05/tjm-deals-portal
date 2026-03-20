'use client';

import { useRef, useState } from 'react';
import { BUSINESS_WHATSAPP_E164 } from '@/lib/constants';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { formatGBP } from '@/lib/format';
import { LEAD_COUNTRY_OTHERS, LEAD_COUNTRY_TOP } from '@/lib/countryOptions';
import {
  DEFAULT_PHONE_DIAL,
  PHONE_DIAL_OTHER,
  PHONE_DIAL_PRIORITY,
} from '@/lib/phoneDialCodes';
import { leadSchema } from '@/lib/validations/lead';

export type LeadModalContext = 'general' | 'listing';

export interface ListingInfo {
  id: string;
  title: string;
  year?: number | null;
  make?: string | null;
  model?: string | null;
  category: string;
  price_landed_gbp?: number | null;
}

interface LeadModalProps {
  context: LeadModalContext;
  listing?: ListingInfo | null;
  onClose: () => void;
}

/** Avoid showing Zod / library wording to visitors. */
function userFacingFieldError(field: string, raw: string): string {
  const t = raw.toLowerCase();
  if (
    t.includes('expected string') ||
    t.includes('received undefined') ||
    t.includes('received null') ||
    t.includes('invalid input') ||
    t.includes('invalid_type')
  ) {
    if (field === 'company' || field === 'website') {
      return 'Please check this field or leave it blank.';
    }
    return 'Please check this field and try again.';
  }
  return raw;
}

function buildWhatsAppMessage(context: LeadModalContext, name: string, listing?: ListingInfo | null): string {
  const carTitle =
    listing && listing.year && listing.make && listing.model
      ? `${listing.year} ${listing.make} ${listing.model}`
      : listing?.title ?? 'this vehicle';

  if (context === 'listing' && listing) {
    const lines: string[] = [
      `Hi TJMotors, my name is ${name}. I'm interested in the ${carTitle} (Listing ID: ${listing.id}). Could you please confirm availability and share the next steps? Thank you.`,
    ];
    if (listing.price_landed_gbp != null) {
      lines.push(`Your price: ${formatGBP(listing.price_landed_gbp)}`);
    }
    return lines.join('\n');
  }

  return `Hi TJMotors, my name is ${name}. I'm interested in importing a car from Singapore to the UK. Could you share what you currently have available and how the process works? Thank you.`;
}

export function LeadModal({ context, listing, onClose }: LeadModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    const form = formRef.current;
    if (!form) return;

    const name = (form.querySelector('[name="name"]') as HTMLInputElement).value.trim();
    const phoneDial = (form.querySelector('[name="phone_dial"]') as HTMLSelectElement).value.trim();
    const phoneNational = (form.querySelector('[name="phone"]') as HTMLInputElement).value.trim();
    const phone = `${phoneDial} ${phoneNational}`.replace(/\s+/g, ' ').trim();
    const email = (form.querySelector('[name="email"]') as HTMLInputElement).value.trim();
    const country = (form.querySelector('[name="country"]') as HTMLSelectElement).value;
    const company = (form.querySelector('[name="company"]') as HTMLInputElement)?.value?.trim();
    const website = (form.querySelector('[name="website"]') as HTMLInputElement)?.value?.trim();

    const parsed = leadSchema.safeParse({
      name,
      phone,
      email,
      country,
      company,
      website,
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0]?.toString();
        if (path) next[path] = userFacingFieldError(path, issue.message);
      }
      setErrors(next);
      return;
    }
    setErrors({});

    const payload = {
      listing_id: context === 'listing' && listing ? listing.id : null,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      country: parsed.data.country,
      ...(parsed.data.company && { company: parsed.data.company }),
      ...(parsed.data.website && { website: parsed.data.website }),
    };

    try {
      setSubmitting(true);
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setSubmitError(json.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      const text = buildWhatsAppMessage(context, parsed.data.name, listing);
      const url = buildWhatsAppUrl({ phoneE164: BUSINESS_WHATSAPP_E164, text });
      window.location.href = url;
    } catch {
      setSubmitError('Unable to submit your details. Please check your connection and try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal aria-labelledby="lead-modal-title">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="lead-modal-title" className="text-lg font-semibold text-primary">
            Chat on WhatsApp
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-muted hover:bg-surface-alt hover:text-secondary transition-colors"
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {submitError && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </p>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="lead-name" className="block text-sm font-medium text-secondary">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              maxLength={120}
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
            />
            {errors.name && <p className="mt-0.5 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <p id="lead-phone-label" className="block text-sm font-medium text-secondary">
              Phone <span className="text-red-500">*</span>
            </p>
            <div
              className="mt-1 flex rounded-lg border border-border-subtle bg-surface transition-colors focus-within:border-gold focus-within:ring-1 focus-within:ring-gold"
              role="group"
              aria-labelledby="lead-phone-label"
            >
              <label htmlFor="lead-phone-dial" className="sr-only">
                Country calling code
              </label>
              <select
                id="lead-phone-dial"
                name="phone_dial"
                defaultValue={DEFAULT_PHONE_DIAL}
                className="max-w-[min(13rem,52%)] shrink-0 cursor-pointer border-0 border-r border-border-subtle bg-surface-alt/60 py-2 pl-2.5 pr-1 text-sm text-primary focus:outline-none focus:ring-0 sm:max-w-[11rem]"
              >
                <optgroup label="Common">
                  {PHONE_DIAL_PRIORITY.map(({ dial, label }) => (
                    <option key={dial} value={dial}>
                      {label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="More countries">
                  {PHONE_DIAL_OTHER.map(({ dial, label }) => (
                    <option key={`${dial}-${label}`} value={dial}>
                      {label}
                    </option>
                  ))}
                </optgroup>
              </select>
              <label htmlFor="lead-phone" className="sr-only">
                Mobile or landline number
              </label>
              <input
                id="lead-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel-national"
                inputMode="tel"
                maxLength={18}
                placeholder="e.g. 7700 900123"
                className="min-w-0 flex-1 border-0 bg-transparent py-2 pl-3 pr-3 text-primary placeholder:text-muted/70 focus:outline-none focus:ring-0"
              />
            </div>
            {errors.phone && <p className="mt-0.5 text-xs text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="lead-email" className="block text-sm font-medium text-secondary">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              maxLength={254}
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
            />
            {errors.email && <p className="mt-0.5 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="lead-country" className="block text-sm font-medium text-secondary">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              id="lead-country"
              name="country"
              required
              autoComplete="country-name"
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
              defaultValue=""
            >
              <option value="" disabled>
                Select country
              </option>
              <optgroup label="Common">
                {LEAD_COUNTRY_TOP.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </optgroup>
              <optgroup label="All countries">
                {LEAD_COUNTRY_OTHERS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </optgroup>
            </select>
            {errors.country && <p className="mt-0.5 text-xs text-red-600">{errors.country}</p>}
          </div>
          <div>
            <label htmlFor="lead-company" className="block text-sm font-medium text-secondary">
              Company
            </label>
            <input
              id="lead-company"
              name="company"
              type="text"
              autoComplete="organization"
              maxLength={200}
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
            />
            {errors.company && <p className="mt-0.5 text-xs text-red-600">{errors.company}</p>}
          </div>
          <div>
            <label htmlFor="lead-website" className="block text-sm font-medium text-secondary">
              Website
            </label>
            <input
              id="lead-website"
              name="website"
              type="text"
              inputMode="url"
              autoComplete="url"
              maxLength={2000}
              placeholder="e.g. namotors.co.uk"
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
            />
            {errors.website && <p className="mt-0.5 text-xs text-red-600">{errors.website}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-border-strong bg-surface py-2.5 text-sm font-medium text-secondary hover:bg-surface-alt transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-full bg-[#25D366] py-2.5 text-sm font-medium text-white hover:bg-[#20bd5a] disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Open WhatsApp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
