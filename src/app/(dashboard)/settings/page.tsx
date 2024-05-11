import { Metadata } from "next";
import { getUser } from "@/lib/queries/users";
import SettingsPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Settings / General - Solfate",
};

export default async function Page() {
  const user = await getUser({});

  return <SettingsPageClient user={user} />;
}
