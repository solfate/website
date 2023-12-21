import { Metadata } from "next";
import { SITE } from "@/lib/const/general";

export const metadata: Metadata = {
  title: `${SITE.name} - Sign In`,
  description: "" + "",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
