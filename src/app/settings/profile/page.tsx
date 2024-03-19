import { Metadata } from "next";
import { ProfileEditorForm } from "@/components/dashboard/settings/ProfileEditorForm";
import { getUserProfile } from "@/lib/queries/users";

export const metadata: Metadata = {
  title: "Settings / Profile - Solfate",
};

export default async function Page() {
  // get the user's current profile data from display
  // note: we know a user is logged in here, so we should be able to get their User record
  const profile = await getUserProfile({});

  // todo: handle no profile being found (we likely need to generate one)

  return <ProfileEditorForm profile={profile} />;
}
