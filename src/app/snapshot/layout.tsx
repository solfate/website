import MarketingFooter from "@/components/core/MarketingFooter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Solfate Snapshot - Solana email newsletter`,
  description:
    "Byte-sized email newsletter filled with the biggest updates " +
    "from Solana ecosystem teams and builders. " +
    "~5 minute read. Every 2 weeks. Simply free. ☀️📸",
  openGraph: {
    type: "website",
    images: "/media/social-snapshot.png?6sss",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      <MarketingFooter />
    </>
  );
}
