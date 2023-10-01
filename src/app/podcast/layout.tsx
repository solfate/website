import MarketingFooter from "@/components/core/MarketingFooter";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      <MarketingFooter />
    </>
  );
}
