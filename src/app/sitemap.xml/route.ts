import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(request: NextRequest) {
  const base = request.nextUrl.origin;
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from('listings')
    .select('id')
    .eq('status', 'live');
  const liveIds = (data ?? []).map((l: { id: string }) => l.id);

  const urls: { loc: string; changefreq: string; priority?: string }[] = [
    { loc: `${base}/`, changefreq: 'weekly', priority: '1' },
    { loc: `${base}/how-it-works`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${base}/listings`, changefreq: 'weekly', priority: '0.9' },
    ...liveIds.map((id) => ({ loc: `${base}/listings/${id}`, changefreq: 'weekly', priority: '0.7' })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <changefreq>${u.changefreq}</changefreq>${u.priority ? `\n    <priority>${u.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
