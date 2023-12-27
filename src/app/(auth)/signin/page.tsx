import { Metadata } from "next";
import { SITE } from "@/lib/const/general";
import { AuthForm } from "@/components/auth/AuthForm";
import { getUserSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: `${SITE.name} - Sign In`,
};

export default async function Page() {
  const session = await getUserSession();
  console.error("page session:", session);


  return (
    <main className="container w-full max-w-md px-4 py-8 md:py-12 space-y-6">
      <section className="max-w-2xl mx-auto space-y-2 text-center container">
        <h1 className="justify-around gap-4 space-x-5 text-4xl font-bold md:text-5xl inline-flex items-center align-middle">
          Sign In
        </h1>

        <p className="mx-auto text-lg text-gray-700">
          Connect a Solana wallet to sign in
        </p>
      </section>

      <AuthForm />
    </main>
  );
}
