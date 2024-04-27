import MarketingFooter from "@/components/core/MarketingFooter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Solfate Snapshot`,
  description:
    "Interviews with blockchain founders and builders in the Solana ecosystem. " +
    "",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      <MarketingFooter />
    </>
  );
}
