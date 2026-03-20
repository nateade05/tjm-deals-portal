import { NextResponse } from 'next/server';
import type { PostgrestError } from '@supabase/supabase-js';
import { supabaseServerPublic, supabaseServerServiceRole } from '@/lib/supabase/server';

interface LeadBody {
  listing_id?: string | null;
  name: string;
  phone: string;
  email: string;
  country: string;
  company?: string;
  website?: string;
}

const LIMITS = {
  name: 200,
  phone: 50,
  email: 254,
  country: 120,
  company: 200,
  website: 2000,
} as const;

function clip(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max);
}

/** Only pass through a real UUID so FK never fails on junk. */
function normalizeListingId(raw: unknown): string | null {
  if (raw == null || raw === '') return null;
  const s = String(raw).trim();
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)
  ) {
    return null;
  }
  return s;
}

function isForeignKeyViolation(err: PostgrestError | null): boolean {
  if (!err) return false;
  const msg = (err.message ?? '').toLowerCase();
  const details = (err.details ?? '').toLowerCase();
  return (
    err.code === '23503' ||
    msg.includes('foreign key') ||
    details.includes('foreign key') ||
    msg.includes('violates foreign key constraint')
  );
}

function isRlsViolation(err: PostgrestError | null): boolean {
  const m = (err?.message ?? '').toLowerCase();
  return m.includes('row-level security') || m.includes('row level security');
}

function logLeadInsertError(err: PostgrestError | null, context: string) {
  if (!err) return;
  console.error(`[api/leads] ${context}`, {
    message: err.message,
    code: err.code,
    details: err.details,
    hint: err.hint,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadBody;

    if (!body.name || !body.phone || !body.email || !body.country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const listingId = normalizeListingId(body.listing_id);

    const row = {
      listing_id: listingId,
      name: clip(String(body.name).trim(), LIMITS.name),
      phone: clip(String(body.phone).trim(), LIMITS.phone),
      email: clip(String(body.email).trim(), LIMITS.email),
      country: clip(String(body.country).trim(), LIMITS.country),
      company: body.company != null ? clip(String(body.company).trim(), LIMITS.company) || null : null,
      website: body.website != null ? clip(String(body.website).trim(), LIMITS.website) || null : null,
      source: 'website' as const,
    };

    const service = supabaseServerServiceRole();
    const supabase = service ?? (await supabaseServerPublic());

    if (!service && process.env.NODE_ENV === 'production') {
      console.warn(
        '[api/leads] SUPABASE_SERVICE_ROLE_KEY is not set — using anon key. If inserts fail with RLS, add the service role key (Settings → API) to your host env, or run the leads RLS migration in Supabase.'
      );
    }

    async function doInsert(payload: typeof row) {
      return supabase.from('leads').insert(payload).select('id');
    }

    let { data, error } = await doInsert(row);
    let inserted = Array.isArray(data) ? data[0] : null;

    if (error && listingId && isForeignKeyViolation(error)) {
      logLeadInsertError(error, 'FK violation — retrying without listing_id');
      const retry = { ...row, listing_id: null };
      ({ data, error } = await doInsert(retry));
      inserted = Array.isArray(data) ? data[0] : null;
    }

    if (error || !inserted?.id) {
      logLeadInsertError(error, 'Insert failed');
      const debug =
        process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview'
          ? {
              debug: error?.message ?? 'No row returned',
              code: error?.code,
              hint: isRlsViolation(error)
                ? 'Add SUPABASE_SERVICE_ROLE_KEY to the server env, or run supabase/migrations/*leads*.sql in the SQL Editor.'
                : error?.hint,
            }
          : isRlsViolation(error)
            ? {
                hint: 'Server configuration: leads insert blocked. Contact the site owner.',
              }
            : {};

      return NextResponse.json(
        {
          error: 'Failed to create lead',
          ...debug,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, lead_id: inserted.id });
  } catch (e) {
    console.error('[api/leads] Uncaught:', e);
    return NextResponse.json(
      {
        error: 'Invalid request',
        ...(process.env.NODE_ENV === 'development' && e instanceof Error
          ? { debug: e.message }
          : {}),
      },
      { status: 400 }
    );
  }
}
