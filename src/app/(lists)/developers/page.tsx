import { Metadata } from "next";
import { SITE } from "@/lib/const/general";

import dropEmoji from "@/../public/icons/drop.svg";
import Image from "next/image";
import { DeveloperListForm } from "@/components/auth/DeveloperListForm";
import { getUserSession, groupAccountsByProvider } from "@/lib/auth";
import { getAccountsByUserId } from "@/lib/queries/accounts";

export const metadata: Metadata = {
  title: `${SITE.name} - Verified Solana Developers`,
  description: "" + "",
  alternates: {
    canonical: "/developers",
  },
};

export default async function Page() {
  const session = await getUserSession();
  // group all the accounts by their `provider` (e.g. twitter, github,
  const groupedAccounts = await getAccountsByUserId({
    userId: session?.user.id,
  }).then((accounts) => groupAccountsByProvider(accounts, true));

  return (
    <main className="container min-h-[80vh]">
      <section className="max-w-2xl mx-auto space-y-8 text-center container">
        <h1 className="justify-around gap-3 space-x-5 text-4xl font-bold md:text-5xl inline-flex items-center align-middle">
          <Image
            priority
            src={dropEmoji}
            alt="Solana Airdrop"
            className="scale-x-flip icon-xl"
          />
          <span className="leading-tight">
            Verified
            <br />
            Solana Developers
          </span>
          <Image
            priority
            src={dropEmoji}
            alt="Solana Airdrop"
            className="icon-xl"
          />
        </h1>

        <p className="mx-auto text-lg text-gray-700">
          The community of <span>Solana developers</span> is always busy
          building, often for thankless work. Especially{" "}
          <span>open source</span> contributors.
          <br />
          We aim to help fix this.
        </p>
      </section>

      <DeveloperListForm groupedAccounts={groupedAccounts} />
    </main>
  );
}
