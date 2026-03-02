'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import type { Listing } from '@/lib/supabase/types';
import {
  CAR_MAKES,
  CAR_COLOURS,
  TRANSMISSION_OPTIONS,
  FUEL_OPTIONS,
} from '@/lib/carOptions';
import {
  formatGBPNumberString,
  formatMilesNumberString,
  stripNonDigits,
} from '@/lib/format';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1970 + 1 }, (_, i) => CURRENT_YEAR - i);

const optionalInt = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => (v === '' || v === undefined ? undefined : Number(v)))
  .refine((v) => v === undefined || (Number.isFinite(v) && Number.isInteger(v)), 'Must be a whole number');

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['in_stock', 'opportunity']),
  year: optionalInt,
  mileage_mi: optionalInt,
  price_landed_gbp: optionalInt,
  estimated_resale_gbp: optionalInt,
});

type FormErrors = Record<string, string>;

function capitalizeFirst(s: string): string {
  const t = s.trim();
  if (!t) return '';
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function computeTitle(year: number | null, make: string, model: string): string {
  return [year, make, model].filter(Boolean).map(String).join(' ').trim();
}

interface ListingFormProps {
  mode: 'create' | 'edit';
  listing?: Listing | null;
  listingId?: string;
  createAction: (formData: FormData) => Promise<{ error?: string } | void | { id: string }>;
  updateAction: (formData: FormData) => Promise<{ error?: string } | void>;
  /** When false, no submit button (e.g. edit page uses external CTA). Default true. */
  showSubmitButton?: boolean;
  /** Optional form id for external submit button (e.g. form="id"). */
  formId?: string;
}

export function ListingForm({
  mode,
  listing,
  listingId,
  createAction,
  updateAction,
  showSubmitButton = true,
  formId,
}: ListingFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isCreate = mode === 'create';

  const [year, setYear] = useState<number | ''>(listing?.year ?? (isCreate ? 2016 : ''));
  const [make, setMake] = useState(listing?.make ?? '');
  const [model, setModel] = useState(listing?.model ?? '');
  const [manualTitleOverride, setManualTitleOverride] = useState<string | null>(() => {
    if (!listing?.title) return null;
    const computed = computeTitle(listing.year ?? null, listing.make ?? '', listing.model ?? '');
    return listing.title.trim() === computed ? null : listing.title.trim();
  });

  const [colour, setColour] = useState(() => {
    const c = listing?.colour ?? '';
    if (c.startsWith('Other')) return 'Other';
    if (c && !CAR_COLOURS.includes(c as (typeof CAR_COLOURS)[number])) return 'Other';
    return c;
  });
  const [colourNotes, setColourNotes] = useState(() => {
    if (!listing?.colour) return '';
    if (listing.colour.startsWith('Other:')) return listing.colour.slice(6).trim();
    if (listing.colour && !CAR_COLOURS.includes(listing.colour as (typeof CAR_COLOURS)[number]))
      return listing.colour;
    return '';
  });
  const [transmission, setTransmission] = useState(listing?.transmission ?? '');
  const [fuel, setFuel] = useState(listing?.fuel ?? '');

  const [mileageValue, setMileageValue] = useState<number | null>(listing?.mileage_mi ?? null);
  const [mileageDisplay, setMileageDisplay] = useState(() =>
    listing?.mileage_mi != null ? String(listing.mileage_mi) : ''
  );
  const [mileageFocused, setMileageFocused] = useState(false);

  const [priceLandedValue, setPriceLandedValue] = useState<number | null>(listing?.price_landed_gbp ?? null);
  const [priceLandedDisplay, setPriceLandedDisplay] = useState(() =>
    listing?.price_landed_gbp != null ? String(listing.price_landed_gbp) : ''
  );
  const [priceLandedFocused, setPriceLandedFocused] = useState(false);

  const [estimatedResaleValue, setEstimatedResaleValue] = useState<number | null>(
    listing?.estimated_resale_gbp ?? null
  );
  const [estimatedResaleDisplay, setEstimatedResaleDisplay] = useState(() =>
    listing?.estimated_resale_gbp != null ? String(listing.estimated_resale_gbp) : ''
  );
  const [estimatedResaleFocused, setEstimatedResaleFocused] = useState(false);

  const computedTitle = computeTitle(
    year === '' ? null : year,
    make.trim(),
    model.trim()
  );
  const effectiveTitle = (manualTitleOverride !== null && manualTitleOverride !== '')
    ? manualTitleOverride
    : computedTitle;

  const mileageShowDisplay = !mileageFocused && (mileageDisplay !== '' || mileageValue != null);
  const priceLandedShowDisplay = !priceLandedFocused && (priceLandedDisplay !== '' || priceLandedValue != null);
  const estimatedResaleShowDisplay = !estimatedResaleFocused && (estimatedResaleDisplay !== '' || estimatedResaleValue != null);

  const updateMileage = useCallback((raw: string) => {
    const digits = stripNonDigits(raw);
    setMileageDisplay(digits);
    setMileageValue(digits === '' ? null : parseInt(digits, 10) || null);
  }, []);
  const updatePriceLanded = useCallback((raw: string) => {
    const digits = stripNonDigits(raw);
    setPriceLandedDisplay(digits);
    setPriceLandedValue(digits === '' ? null : parseInt(digits, 10) || null);
  }, []);
  const updateEstimatedResale = useCallback((raw: string) => {
    const digits = stripNonDigits(raw);
    setEstimatedResaleDisplay(digits);
    setEstimatedResaleValue(digits === '' ? null : parseInt(digits, 10) || null);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setErrors({});
    const form = e.currentTarget;
    const formData = new FormData(form);

    const titleToSave = effectiveTitle;
    formData.set('title', titleToSave);
    formData.set('mileage_mi', mileageValue != null ? String(mileageValue) : '');
    formData.set('price_landed_gbp', priceLandedValue != null ? String(priceLandedValue) : '');
    formData.set('estimated_resale_gbp', estimatedResaleValue != null ? String(estimatedResaleValue) : '');
    formData.set('colour', colour === 'Other' && colourNotes.trim() ? `Other: ${colourNotes.trim()}` : colour);

    const parsed = schema.safeParse({
      title: formData.get('title'),
      category: formData.get('category') || 'in_stock',
      year: formData.get('year'),
      mileage_mi: formData.get('mileage_mi'),
      price_landed_gbp: formData.get('price_landed_gbp'),
      estimated_resale_gbp: formData.get('estimated_resale_gbp'),
    });

    if (!parsed.success) {
      const next: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0]?.toString() ?? 'form';
        next[path] = issue.message;
      }
      setErrors(next);
      return;
    }

    if (mode === 'create') {
      const result = await createAction(formData);
      if (result && 'error' in result && result.error) {
        setSubmitError(result.error);
        return;
      }
      return;
    }

    if (mode === 'edit' && listingId) {
      const result = await updateAction(formData);
      if (result && 'error' in result && result.error) {
        setSubmitError(result.error);
        return;
      }
      setSubmitError(null);
      router.refresh();
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-6">
      {!isCreate && listingId && (
        <input type="hidden" name="listing_id" value={listingId} />
      )}
      {submitError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      )}

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-zinc-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={listing?.category ?? 'in_stock'}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        >
          <option value="in_stock">In stock</option>
          <option value="opportunity">Opportunity</option>
        </select>
      </div>

      {/* Vehicle basics */}
      <section>
        <h3 className="text-sm font-semibold text-zinc-800">Vehicle basics</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-zinc-700">
              Year
            </label>
            <select
              id="year"
              name="year"
              value={year === '' ? '' : String(year)}
              onChange={(e) => setYear(e.target.value === '' ? '' : Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            >
              <option value="">—</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-zinc-700">
              Make
            </label>
            <select
              id="make"
              name="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            >
              <option value="">Select make</option>
              {CAR_MAKES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-zinc-700">
              Model
            </label>
            <input
              id="model"
              name="model"
              type="text"
              value={model}
              onChange={(e) => setModel(capitalizeFirst(e.target.value))}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            />
          </div>
          <div>
            <label htmlFor="mileage_mi" className="block text-sm font-medium text-zinc-700">
              Mileage (mi)
            </label>
            <input
              id="mileage_mi"
              type="text"
              inputMode="numeric"
              value={mileageShowDisplay ? formatMilesNumberString(mileageDisplay || String(mileageValue ?? '')) : (mileageDisplay || '')}
              onChange={(e) => updateMileage(e.target.value)}
              onFocus={() => setMileageFocused(true)}
              onBlur={() => setMileageFocused(false)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            />
            {errors.mileage_mi && <p className="mt-1 text-xs text-red-600">{errors.mileage_mi}</p>}
          </div>
          <div>
            <label htmlFor="colour" className="block text-sm font-medium text-zinc-700">
              Colour
            </label>
            <select
              id="colour"
              name="colour"
              value={colour}
              onChange={(e) => {
                const v = e.target.value;
                setColour(v);
                if (v !== 'Other') setColourNotes('');
              }}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            >
              <option value="">—</option>
              {CAR_COLOURS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {colour === 'Other' && (
              <input
                type="text"
                placeholder="Colour notes"
                value={colourNotes}
                onChange={(e) => setColourNotes(e.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
              />
            )}
          </div>
        </div>
      </section>

      {/* Specs */}
      <section>
        <h3 className="text-sm font-semibold text-zinc-800">Specs</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="transmission" className="block text-sm font-medium text-zinc-700">
              Transmission
            </label>
            <select
              id="transmission"
              name="transmission"
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            >
              <option value="">—</option>
              {TRANSMISSION_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="fuel" className="block text-sm font-medium text-zinc-700">
              Fuel
            </label>
            <select
              id="fuel"
              name="fuel"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            >
              <option value="">—</option>
              {FUEL_OPTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h3 className="text-sm font-semibold text-zinc-800">Pricing</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price_landed_gbp" className="block text-sm font-medium text-zinc-700">
              Price landed (GBP)
            </label>
            <input
              id="price_landed_gbp"
              type="text"
              inputMode="numeric"
              value={priceLandedShowDisplay ? formatGBPNumberString(priceLandedDisplay || String(priceLandedValue ?? '')) : (priceLandedDisplay || '')}
              onChange={(e) => updatePriceLanded(e.target.value)}
              onFocus={() => setPriceLandedFocused(true)}
              onBlur={() => setPriceLandedFocused(false)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            />
            {errors.price_landed_gbp && <p className="mt-1 text-xs text-red-600">{errors.price_landed_gbp}</p>}
          </div>
          <div>
            <label htmlFor="estimated_resale_gbp" className="block text-sm font-medium text-zinc-700">
              Est. resale (GBP)
            </label>
            <input
              id="estimated_resale_gbp"
              type="text"
              inputMode="numeric"
              value={estimatedResaleShowDisplay ? formatGBPNumberString(estimatedResaleDisplay || String(estimatedResaleValue ?? '')) : (estimatedResaleDisplay || '')}
              onChange={(e) => updateEstimatedResale(e.target.value)}
              onFocus={() => setEstimatedResaleFocused(true)}
              onBlur={() => setEstimatedResaleFocused(false)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            />
            {errors.estimated_resale_gbp && <p className="mt-1 text-xs text-red-600">{errors.estimated_resale_gbp}</p>}
          </div>
        </div>
      </section>

      {/* Description */}
      <section>
        <h3 className="text-sm font-semibold text-zinc-800">Description</h3>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={listing?.description ?? ''}
          className="mt-3 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        />
      </section>

      {/* Title (auto) at bottom - only in edit mode; create uses server-computed title */}
      {!isCreate && (
        <section className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
          <h3 className="text-sm font-semibold text-zinc-800">Listing title</h3>
          {manualTitleOverride === null ? (
            <div className="mt-2">
              <p className="text-base font-medium text-zinc-900">
                Your listing title: <span className="text-zinc-700">{computedTitle || '—'}</span>
              </p>
              <button
                type="button"
                onClick={() => setManualTitleOverride(computedTitle || '')}
                className="mt-2 text-sm font-medium text-zinc-600 underline hover:text-zinc-900"
              >
                Edit title
              </button>
            </div>
          ) : (
            <div className="mt-2">
              <input
                type="text"
                value={manualTitleOverride}
                onChange={(e) => setManualTitleOverride(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                placeholder="Custom title"
              />
              <button
                type="button"
                onClick={() => setManualTitleOverride(null)}
                className="mt-2 text-sm font-medium text-zinc-600 underline hover:text-zinc-900"
              >
                Use auto title
              </button>
            </div>
          )}
        </section>
      )}

      {showSubmitButton && (
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            {isCreate ? 'Create listing (draft)' : 'Save changes'}
          </button>
        </div>
      )}
    </form>
  );
}
