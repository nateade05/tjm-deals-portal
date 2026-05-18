import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { BRAND_SHORT, FAVICON_VERSION, TAGLINE } from "@/lib/constants";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const faviconIco = `/favicon.ico?v=${FAVICON_VERSION}`;

export const viewport: Viewport = {
  themeColor: "#faf9f6",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND_SHORT} | Singapore car deals landed in the UK`,
    template: `%s | ${BRAND_SHORT}`,
  },
  description: TAGLINE,
  icons: {
    /**
     * PNG first: new URL vs old Vercel `.ico` cache on localhost.
     * `.ico` uses `?v=` so Chrome’s favicon DB treats it as a fresh URL.
     * (Avoid `src/app/favicon.ico` — Next adds a second hashed `/favicon.ico?...` link.)
     */
    icon: [
      { url: `/icon.png?v=${FAVICON_VERSION}`, type: "image/png", sizes: "512x512" },
      { url: faviconIco, sizes: "any" },
    ],
    shortcut: faviconIco,
    apple: [{ url: `/apple-icon.png?v=${FAVICON_VERSION}`, type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: `${BRAND_SHORT} | Singapore car deals landed in the UK`,
    description: TAGLINE,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-background text-primary" style={{ colorScheme: "light" }} suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        {children}
        {GA_ID && (
          <>
            {/* Define window.gtag before hydration so component useEffect calls don't miss it */}
            <Script id="ga-define" strategy="beforeInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
            `}</Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-config" strategy="afterInteractive">{`
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
      </body>
    </html>
  );
}
