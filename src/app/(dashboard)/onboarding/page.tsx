import { Metadata } from "next";
import OnboardingPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Welcome to Solfate!",
};

export default async function Page() {
  return <OnboardingPageClient />;
}
