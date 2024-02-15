import MarketingFooter from "@/components/core/MarketingFooter";
import { SITE } from "@/lib/const/general";
import { Metadata } from "next";

/**
 * Set the default metadata for use with all podcast related pages
 *
 * note: this overrides the parent metadata
 */
export const metadata: Metadata = {
  title: `${SITE.name} - Blog`,
  description: ". " + ".",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      <MarketingFooter />
    </>
  );
}
