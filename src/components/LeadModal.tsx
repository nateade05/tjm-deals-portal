'use client';

import { useRef, useState } from 'react';
import { BUSINESS_WHATSAPP_E164 } from '@/lib/constants';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { formatGBP } from '@/lib/format';
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
      lines.push(`Landed UK price: ${formatGBP(listing.price_landed_gbp)}`);
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
    const phone = (form.querySelector('[name="phone"]') as HTMLInputElement).value.trim();
    const email = (form.querySelector('[name="email"]') as HTMLInputElement).value.trim();
    const country = (form.querySelector('[name="country"]') as HTMLInputElement).value.trim();
    const company = (form.querySelector('[name="company"]') as HTMLInputElement)?.value?.trim();
    const website = (form.querySelector('[name="website"]') as HTMLInputElement)?.value?.trim();

    const parsed = leadSchema.safeParse({
      name,
      phone,
      email,
      country,
      company: company || undefined,
      website: website || undefined,
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0]?.toString();
        if (path) next[path] = issue.message;
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
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
            />
            {errors.name && <p className="mt-0.5 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="lead-phone" className="block text-sm font-medium text-secondary">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              required
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
            />
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
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
            />
            {errors.email && <p className="mt-0.5 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="lead-country" className="block text-sm font-medium text-secondary">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-country"
              name="country"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
            />
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
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>
          <div>
            <label htmlFor="lead-website" className="block text-sm font-medium text-secondary">
              Website
            </label>
            <input
              id="lead-website"
              name="website"
              type="url"
              placeholder="https://"
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
