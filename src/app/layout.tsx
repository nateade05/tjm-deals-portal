import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BRAND_SHORT, TAGLINE } from "@/lib/constants";

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
    icon: "/tjm-logo.png",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
