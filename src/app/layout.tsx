import "./globals.css";
import MarketingHeader from "@/components/core/MarketingHeader";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SITE, TWITTER } from "@/lib/const/general";

import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

/**
 * Set the global default metadata for the entire site.
 * These values will be used unless explicity overridden
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  openGraph: {
    siteName: SITE.name,
    type: "website",
    images: "/social-with-links.png",
  },
  twitter: {
    site: TWITTER.handle,
    creator: TWITTER.handle,
    card: "summary_large_image",
  },
  category: "technology",
  // todo: set robots, when needed
  // robots: {},

  // set a default title and description for every page
  title: `${SITE.name} - Interviews with blockchain founders on Solana`,
  description:
    "Interviews with blockchain founders and builders in the Solana ecosystem. " +
    "Hosted by two developers, Nick (@nickfrosty) and James (@jamesrp13).",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MarketingHeader />

        {children}

        {/* <main className="min-h-[85vh]">{children}</main> */}
        <Analytics />
      </body>
    </html>
  );
}
