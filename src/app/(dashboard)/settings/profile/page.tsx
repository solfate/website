import { Metadata } from "next";
import { getUserProfile } from "@/lib/queries/users";
import ProfilePageClient from "./page-client";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings / Profile - Solfate",
};

export default async function Page() {
  // get the user's current profile data from display
  // note: we know a user is logged in here, so we should be able to get their User record
  let profile = await getUserProfile({});

  // auto create the authed user's profile if none exists
  if (!profile) {
    return redirect("/onboarding");
  }

  return <ProfilePageClient profile={profile} />;
}
