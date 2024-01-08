import { Metadata } from "next";
import { SITE } from "@/lib/const/general";
import { SolanaProvider } from "@/context/SolanaProvider";
// import { getUserSession } from "@/lib/auth";
// import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `${SITE.name} - Sign In`,
  description: "" + "",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getUserSession();
  // if (!!session) {
  //   /**
  //    * todo: handle smart redirects based on url query params
  //    * because of how next-auth works, errored auth attempted via external
  //    * providers (like when the user rejects) will redirect back to the sign in
  //    * page, where there is likely a better place to redirect them
  //    *
  //    */
  //   redirect("/");
  // }

  return <SolanaProvider autoConnect={false}>{children}</SolanaProvider>;
}
