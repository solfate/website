import { Metadata } from "next";
import { getUser, getUserProfile } from "@/lib/queries/users";
import SettingsPageClient from "./page-client";
import prisma from "@/lib/prisma";
import { SolanaProviderId } from "@/lib/auth/const";

export const metadata: Metadata = {
  title: "Settings / General - Solfate",
};

export default async function Page() {
  const user = await getUser({});

  const profile = await getUserProfile();

  const wallets = (
    await prisma.account.findMany({
      where: { userId: user?.id, provider: SolanaProviderId },
      select: { providerAccountId: true },
    })
  ).map((item) => item.providerAccountId);

  if (profile?.walletAddress) {
    const index = wallets.findIndex((item) => item === profile.walletAddress);
    if (index >= 0) wallets.splice(index, 1);
    wallets.unshift(profile.walletAddress);
  } else {
    wallets.unshift("");
  }

  return (
    <main className="container space-y-6">
      <SettingsPageClient user={user} wallets={wallets} />
    </main>
  );
}
