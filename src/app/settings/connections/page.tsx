import { Metadata } from "next";
import { ConnectionCardGrid } from "@/components/dashboard/settings/ConnectionCardGrid";
import { convertAccountsToConnections, getUserSession } from "@/lib/auth";
import { getAccountsByUserId } from "@/lib/queries/accounts";

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
      {/* <p>Connections have not been enabled.</p> */}

      <section className="flex pb-2 justify-between items-center">
        <section className="space-y-2">
          <h1 className="font-semibold text-xl">Connections</h1>
          <p className="text-sm text-gray-500">
            Connect external accounts, services, and wallets.
          </p>
        </section>

        {/* <button className="btn btn-black">Save</button> */}
      </section>

      <ConnectionCardGrid connections={accountConnections} />
    </main>
  );
}
