import { z } from 'zod';

const uuid = z.string().uuid('Invalid id');

export const saleAttributionFormSchema = z
  .object({
    listingId: uuid,
    mode: z.enum(['lead', 'manual']),
    leadId: z.union([z.string().uuid(), z.literal('')]).optional(),
    buyerName: z.string().max(200).optional(),
    buyerPhone: z.string().max(50).optional(),
    buyerEmail: z.string().max(254).optional(),
    buyerCountry: z.string().max(120).optional(),
    soldPriceGbp: z.string().optional(),
    soldAt: z.string().min(1, 'Sale date is required'),
    notes: z.string().max(2000).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.mode === 'lead') {
      if (!val.leadId || val.leadId === '') {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select a lead', path: ['leadId'] });
      }
    } else {
      const name = val.buyerName?.trim() ?? '';
      if (!name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter the buyer name',
          path: ['buyerName'],
        });
      }
      const em = val.buyerEmail?.trim() ?? '';
      if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid email', path: ['buyerEmail'] });
      }
    }
  });

export type SaleAttributionFormInput = z.infer<typeof saleAttributionFormSchema>;

function parsePrice(raw: string | undefined): number | null {
  if (raw == null || raw.trim() === '') return null;
  const n = Number(raw.replace(/,/g, ''));
  if (Number.isNaN(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

function parseSoldAt(isoLocal: string): string | null {
  const d = new Date(isoLocal);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

/** Normalized payload for Supabase (after validation). */
export function toSaleAttributionPayload(parsed: SaleAttributionFormInput): {
  listing_id: string;
  lead_id: string | null;
  buyer_name: string | null;
  buyer_phone: string | null;
  buyer_email: string | null;
  buyer_country: string | null;
  sold_price_gbp: number | null;
  sold_at: string;
  notes: string | null;
} {
  const sold_price_gbp = parsePrice(parsed.soldPriceGbp);
  const sold_at = parseSoldAt(parsed.soldAt);
  if (!sold_at) {
    throw new Error('Invalid sale date');
  }

  if (parsed.mode === 'lead') {
    return {
      listing_id: parsed.listingId,
      lead_id: parsed.leadId as string,
      buyer_name: null,
      buyer_phone: null,
      buyer_email: null,
      buyer_country: null,
      sold_price_gbp,
      sold_at,
      notes: parsed.notes?.trim() || null,
    };
  }

  return {
    listing_id: parsed.listingId,
    lead_id: null,
    buyer_name: parsed.buyerName!.trim(),
    buyer_phone: parsed.buyerPhone?.trim() || null,
    buyer_email: parsed.buyerEmail?.trim() || null,
    buyer_country: parsed.buyerCountry?.trim() || null,
    sold_price_gbp,
    sold_at,
    notes: parsed.notes?.trim() || null,
  };
}
