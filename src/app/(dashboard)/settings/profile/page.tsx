import { Metadata } from "next";
import { getUserProfile } from "@/lib/queries/users";
import prisma from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import ProfilePageClient from "./page-client";

export const metadata: Metadata = {
  title: "Settings / Profile - Solfate",
};

export default async function Page() {
  // get the user's current profile data from display
  // note: we know a user is logged in here, so we should be able to get their User record
  let profile = await getUserProfile({});

  // auto create the authed user's profile if none exists
  if (!profile) {
    const session = await getUserSession();
    profile = await prisma.profile.create({
      data: {
        username: session!.user.username,
      },
    });
    // todo: we should check and ensure the profile was created
  }

  return <ProfilePageClient profile={profile} />;
}
