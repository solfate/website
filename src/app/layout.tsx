import "./globals.css";
import MarketingHeader from "@/components/core/MarketingHeader";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SITE } from "@/lib/const/general";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${SITE.name} - Interviews with blockchain founders on Solana`,
  description:
    "Interviews with blockchain founders and builders in the Solana ecosystem. Hosted by two developers, Nick (@nickfrosty) and James (@jamesrp13).",
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
      </body>
    </html>
  );
}
