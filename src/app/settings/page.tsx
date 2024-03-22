import { Metadata } from "next";
import { getUser } from "@/lib/queries/users";
import { GeneralSettingsEditor } from "@/components/dashboard/settings/GeneralSettingsEditor";

export const metadata: Metadata = {
  title: "Settings / General - Solfate",
};

export default async function Page() {
  const user = await getUser({});

  return <GeneralSettingsEditor user={user} />;
}
