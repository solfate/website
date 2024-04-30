import MarketingFooter from "@/components/core/MarketingFooter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Solfate Snapshot`,
  description:
    "Byte-sized email newsletter filled with the biggest updates from Solana ecosystem teams and builders. ~5 minute read. Every 2 weeks. Simply free. ☀️📸",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      <MarketingFooter />
    </>
  );
}
