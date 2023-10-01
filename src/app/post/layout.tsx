import MarketingFooter from "@/components/core/MarketingFooter";
// import PostFooter from "@/components/core/PostFooter";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      {/* <PostFooter /> */}
      <MarketingFooter />
    </>
  );
}
