import { Metadata } from "next";
import { ConnectionCardGrid } from "@/components/dashboard/settings/ConnectionCardGrid";
import { convertAccountsToConnections, getUserSession } from "@/lib/auth";
import { getAccountsByUserId } from "@/lib/queries/accounts";
import { SettingsHeader } from "@/components/dashboard/settings/SettingsHeader";
import { AddConnectionDialog } from "@/components/add-connection-dialog";
import { SolanaProvider } from "@/context/SolanaProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import Link from "next/link";

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

        <Alert variant={"destructive"}>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>
            Collect tips/donations to any of your Solana wallets
          </AlertTitle>
          <AlertDescription>
            You do not have a public Solana wallet selected for your Solfate
            profile. You <b>cannot accept tips/donations</b> on your profile or
            blink until you select one.{" "}
            <Link
              href={"/settings/tips"}
              className="underline text-twitter hover:text-"
            >
              Select a public wallet
            </Link>{" "}
            in your &quot;Tips and Donations&quot; settings.
          </AlertDescription>
        </Alert>

        <ConnectionCardGrid connections={accountConnections} />
      </main>
    </SolanaProvider>
  );
}
