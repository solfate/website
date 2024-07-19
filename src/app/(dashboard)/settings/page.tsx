import { Metadata } from "next";
import { getUser } from "@/lib/queries/users";
import SettingsPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Settings / General - Solfate",
};

export default async function Page() {
  const user = await getUser();

  return (
    <main className="container space-y-6">
      <SettingsPageClient user={user} />
    </main>
  );
}
