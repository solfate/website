import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/auth";
import { SettingsSidebar } from "@/components/dashboard/settings/SettingsSidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Layout({ children }: LayoutProps) {
  // ensure a user is logged in for all dashboard/settings routes
  const session = await getUserSession();
  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <>
      {/* <DashboardHeader session={session} /> */}

      {/* <section className="border-b border-gray-300 bg-white">
        <section className="container py-8 flex justify-between items-center">
          <h1 className="font-semibold text-2xl">Account settings</h1>

          <button className="btn btn-black">derp</button>
        </section>
      </section> */}

      <section className="container md:flex flex-row !p-0">
        <SettingsSidebar />

        <section className="flex-grow">{children}</section>
      </section>

      {/* <DashboardFooter /> */}
    </>
  );
}
