import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

interface LeadBody {
  listing_id?: string | null;
  name: string;
  phone: string;
  email: string;
  country: string;
  company?: string;
  website?: string;
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

    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from('leads')
      .insert({
        listing_id: body.listing_id ?? null,
        name: body.name,
        phone: body.phone,
        email: body.email,
        country: body.country,
        company: body.company ?? null,
        website: body.website ?? null,
      })
      .select('id')
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, lead_id: data.id });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

