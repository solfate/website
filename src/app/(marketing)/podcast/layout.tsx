import MarketingFooter from "@/components/core/MarketingFooter";
import { SITE } from "@/lib/const/general";
import { PODCAST } from "@/lib/const/podcast";
import { Metadata } from "next";

/**
 * Set the default metadata for use with all podcast related pages
 *
 * note: this overrides the parent metadata
 */
export const metadata: Metadata = {
  title: `${PODCAST.name} - Interviews with blockchain founders on Solana`,
  description:
    "Solana Podcast: Interviews with blockchain founders and builders in the Solana ecosystem. " +
    "Hosted by two developers, Nick (@nickfrosty) and James (@jamesrp13).",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      <MarketingFooter />
    </>
  );
}
