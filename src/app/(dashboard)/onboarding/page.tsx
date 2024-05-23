import { Metadata } from "next";
import { getUser } from "@/lib/queries/users";
import OnboardingPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Welcome to Solfate!",
};

export default async function Page() {
  // const user = await getUser({});

  return <OnboardingPageClient />;
  // return <OnboardingPageClient user={user} />;
}
