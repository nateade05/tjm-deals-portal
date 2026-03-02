# TJM Deals Portal

Next.js App Router app for Singapore car deals delivered and registered in the UK.

## Required env vars

Create `.env.local` in the project root with:

- **NEXT_PUBLIC_SUPABASE_URL** — your Supabase project URL
- **NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY** — your Supabase publishable (anon) key

Supabase storage bucket used for listing media: **listing-media** (private; signed URLs for public viewing).

WhatsApp business number is configured in **`/src/lib/constants.ts`** (`BUSINESS_WHATSAPP_E164`). Default: Singapore +6591749115.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint

## Deploy (Vercel)

1. Push the repo to GitHub. If the app lives in a subdirectory (e.g. `tjm-deals-portal`), set **Root Directory** to that folder in the Vercel project settings.
2. In Vercel, add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (for both Production and Preview).
3. Deploy: `npx vercel --prod` from the app directory, or use the Vercel dashboard to deploy from the connected Git repo.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
