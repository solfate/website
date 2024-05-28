import { Metadata } from "next";
import { SITE } from "@/lib/const/general";

import { NewsletterSignupWidget } from "@/components/content/NewsletterSignupWidget";
import showerEmoji from "@/../public/icons/shower.svg";
import Image from "next/image";

import { AirdropRequestForm } from "@/components/tools/faucet/AirdropRequestForm";

export const metadata: Metadata = {
  title: `${SITE.name} - Solana Faucet for Devnet SOL`,
  description:
    "Turn on the Solana faucet to get an airdrop of free SOL " +
    "deposited to your testnet or devnet wallet instantly.",
  alternates: {
    canonical: "/faucet",
  },
};

export default function Page() {
  return (
    <main className="container md:py-16 min-h-[80vh]">
      <section className="max-w-2xl mx-auto space-y-8 text-center container">
        <h1 className="justify-around space-x-5 text-4xl font-bold md:text-5xl inline-flex items-center align-middle">
          <Image
            priority
            src={showerEmoji}
            alt="Solana Faucet"
            className="scale-x-flip icon-xl"
          />
          <span>Solana Faucet</span>
          <Image
            priority
            src={showerEmoji}
            alt="Solana Faucet"
            className="icon-xl"
          />
        </h1>

        <p className="mx-auto text-xl text-gray-700">
          Open the Solana faucet to get SOL deposited to your
          <br />
          <span className="text-highlight">testnet</span> or{" "}
          <span className="text-highlight">devnet</span> wallet instantly.
        </p>
      </section>

      <AirdropRequestForm />

      <NewsletterSignupWidget className="max-w-2xl mx-auto" />
    </main>
  );
}
