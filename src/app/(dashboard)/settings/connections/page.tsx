import { Metadata } from "next";
import { ConnectionCardGrid } from "@/components/dashboard/settings/ConnectionCardGrid";
import { convertAccountsToConnections, getUserSession } from "@/lib/auth";
import { getAccountsByUserId } from "@/lib/queries/accounts";
import { SettingsHeader } from "@/components/dashboard/settings/SettingsHeader";

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
    <main className="container space-y-6">
      <SettingsHeader
        title={"Connections"}
        description={"Connect external accounts, services, and wallets."}
      >
        <button
          type="submit"
          // className={clsx("btn", !pendingChanges ? "btn-ghost" : "btn-black")}
          // disabled={!pendingChanges}
          className={"btn text-center justify-center btn-ghost"}
          disabled={true}
        >
          Add Connection
        </button>
      </SettingsHeader>

      <ConnectionCardGrid connections={accountConnections} />
    </main>
  );
}
