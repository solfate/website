import { Metadata } from "next";
import { ConnectionCardGrid } from "@/components/dashboard/settings/ConnectionCardGrid";
import { convertAccountsToConnections, getUserSession } from "@/lib/auth";
import { getAccountsByUserId } from "@/lib/queries/accounts";
import { SettingsHeader } from "@/components/dashboard/settings/SettingsHeader";
import { AddConnectionDialog } from "@/components/add-connection-dialog";
import { SolanaProvider } from "@/context/SolanaProvider";

export const metadata: Metadata = {
  title: "Settings / Connections - Solfate",
};

export default async function Page() {
  // note: we have already confirmed the user is already signed in
  const session = await getUserSession();

  const accountConnections = convertAccountsToConnections(
    await getAccountsByUserId({
      userId: session?.user?.id,
    }),
  );

  return (
    <SolanaProvider autoConnect={false}>
      <main className="container space-y-6">
        <SettingsHeader
          title={"Connections"}
          description={"Connect external accounts, services, and wallets."}
        >
          <AddConnectionDialog />
        </SettingsHeader>

        <ConnectionCardGrid connections={accountConnections} />
      </main>
    </SolanaProvider>
  );
}
