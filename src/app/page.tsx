import MarketingFooter from "@/components/core/MarketingFooter";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <main className="page-container">
        <section className="py-8">
          <h1 className="text-6xl font-bold">Discover</h1>

          <p className="text-lg text-gray-500">
            Discover the latest content from around the Solana ecosystem.
          </p>
        </section>
      </main>

      <MarketingFooter />
    </>
  );
}
