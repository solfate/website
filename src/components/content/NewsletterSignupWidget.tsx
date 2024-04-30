import { memo } from "react";
import { NewsletterSignupForm } from "./NewsletterSignupForm";

export const NewsletterSignupWidget = memo(
  ({ className = "" }: { className?: string }) => (
    <aside
      className={`border border-hot-pink bg-hot-pink/10 rounded-lg p-4 space-y-5 mx-12 text-center ${className}`}
    >
      <h4 className="font-semibold text-2xl">
        Join the Solfate Snapshot newsletter ☀️📸
      </h4>

      <div className="space-y-2">
        <p className="">
          Byte-sized{" "}
          <span className="underline text-black">email newsletter</span> filled
          with the biggest updates from Solana ecosystem teams and builders.
        </p>

        <p>
          ~5 minute read. Every 2 weeks. <br className="md:hidden" />
          Simply free.
        </p>
      </div>

      <NewsletterSignupForm className="mx-auto" />
    </aside>
  ),
);
