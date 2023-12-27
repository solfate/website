import { Metadata } from "next";
import { SITE } from "@/lib/const/general";

import dropEmoji from "@/../public/icons/drop.svg";
import Image from "next/image";
import { DeveloperListForm } from "@/components/auth/DeveloperListForm";
import { getUserSession, groupAccountsByProvider } from "@/lib/auth";
import { getAccountsByUserId } from "@/lib/queries/accounts";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: `${SITE.name} - Verified Solana Developers`,
  description:
    "The community of Solana developers is doing thankless work building. " +
    "We aim to help support ways to provide value back to dedicated Solana developers.",
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

  // get the current users list record
  let listRecord = null;
  if (!!session?.user.id && !!groupedAccounts.solana?.[0].providerAccountId) {
    listRecord = await prisma.walletList.findFirst({
      where: {
        type: "DEVELOPER",
        wallet: groupedAccounts.solana[0].providerAccountId,
      },
    });
  }

  return (
    <main className="container min-h-[80vh] space-y-8">
      <section className="max-w-2xl mx-auto space-y-8 text-center">
        <h1 className="justify-around gap-3 space-x-5 text-3xl font-bold md:text-5xl inline-flex items-center align-middle">
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
          We aim to help fix this by supporting ways to provide value back to
          those dedicated developers.
        </p>
      </section>

      <DeveloperListForm
        groupedAccounts={groupedAccounts}
        onList={!!listRecord}
      />
    </main>
  );
}
