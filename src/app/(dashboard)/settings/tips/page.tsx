import { Metadata } from "next";
import { getUser, getUserProfile } from "@/lib/queries/users";
import TipPageClient from "./page-client";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { SolanaProviderId } from "@/lib/auth/const";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Settings / Tips and Donations - Solfate",
};

export default async function Page() {
  // get the user's current profile data from display
  // note: we know a user is logged in here, so we should be able to get their User record

  const user = await getUser();

  let profile = await getUserProfile();

  // auto create the authed user's profile if none exists
  if (!profile) {
    return redirect("/onboarding");
  }

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
      <Suspense>
        <TipPageClient username={user!.username} wallets={wallets} />
      </Suspense>
    </main>
  );
}
