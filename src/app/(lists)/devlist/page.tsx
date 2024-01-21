import { Metadata } from "next";
import { SITE } from "@/lib/const/general";

import crownEmoji from "@/../public/icons/crown.svg";
import Image from "next/image";
import { getUserSession, groupAccountsByProvider } from "@/lib/auth";
import { getAccountsByUserId } from "@/lib/queries/accounts";
import prisma from "@/lib/prisma";
import { DeveloperListFAQ } from "@/components/lists/DeveloperListFAQ";
import { DeveloperListForm } from "@/components/lists/DeveloperListForm";
import { DevListStatusMessage } from "@/components/lists/DevListStatusMessage";
import { ClaimDevListToken } from "@/components/lists/ClaimDevListToken";
import { SolanaProvider } from "@/context/SolanaProvider";
import { Connection, PublicKey } from "@solana/web3.js";
import { checkMintAndUpdateApplicantStatus } from "@/lib/lists";

export const metadata: Metadata = {
  title: `Solana DevList - Verified Solana Developers | ${SITE.name}`,
  description:
    "A verified list of Solana developers. " +
    "The community of developers is doing thankless work building. " +
    "This helps make it easier to provide value back to them",
  alternates: {
    canonical: "/devlist",
  },
  openGraph: {
    images: "/img/social/devlist.png?786yr",
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

  // locate the user's DevList application
  if (!!session?.user.id && !!groupedAccounts.solana?.[0].providerAccountId) {
    listRecord = await prisma.walletList.findFirst({
      where: {
        type: "DEVELOPER",
        userId: session.user.id,
      },
    });

    // check if the current `assetId` already exists (aka the user has claimed)
    if (listRecord && !!listRecord.assetId && listRecord.status != "ACTIVE") {
      const connection = new Connection(process.env.SOLANA_RPC, {
        commitment: "single",
      });

      const accountInfo = await checkMintAndUpdateApplicantStatus(
        listRecord.id,
        connection,
        new PublicKey(listRecord.assetId),
        "ACTIVE",
      );

      // force update the current record's state
      if (!!accountInfo) listRecord.status = "ACTIVE";
    }
  }

  return (
    <main className="container min-h-[80vh] space-y-8">
      <section className="max-w-2xl mx-auto space-y-8 text-center">
        <section className="space-y-1">
          <h1 className="relative justify-around text-4xl font-bold md:text-5xl inline-flex items-center align-middle">
            <span className="leading-tight">Solana DevList</span>
            <Image
              priority
              src={crownEmoji}
              alt=""
              // width={32}
              // height={32}
              className="absolute left-[-14px] scale-x-flip top-[-10px] rotate-[-35deg] w-7 h-7 md:w-8 md:h-8"
            />
          </h1>

          <h4 className="font-medium text-xl">
            a <span className="shadow-hot-pink">verified list</span> of Solana
            Developers
          </h4>
        </section>

        {listRecord?.status != "UNCLAIMED" && (
          <p className="mx-auto text-base md:text-lg text-gray-700">
            The community of <span className="">Solana Developers</span> is
            always busy building, often for thankless work. Especially{" "}
            <span className="shadow-hot-pink">open source contributors</span>.
            The Solana DevList aims to help support ways to provide value back
            to these{" "}
            <span className="shadow-hot-pink">dedicated developers</span>.
          </p>
        )}
      </section>

      {!!listRecord ? (
        <SolanaProvider autoConnect={false}>
          <DevListStatusMessage application={listRecord} />

          {listRecord.status == "ACTIVE" ? <></> : <ClaimDevListToken />}
        </SolanaProvider>
      ) : (
        <>
          <DeveloperListForm groupedAccounts={groupedAccounts} />
          <DeveloperListFAQ />
        </>
      )}
    </main>
  );
}
