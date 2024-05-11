import { notFound, redirect } from "next/navigation";
import { getUserProfile } from "@/lib/queries/users";
import { ProfileSection } from "@/components/users/ProfileSection";
import { getUserSession } from "@/lib/auth";

type PageProps = {
  params: {
    user: string;
  };
};

export default async function Page({ params }: PageProps) {
  if (!params.user) return notFound();

  const session = await getUserSession();

  // get the product's record from the database
  const profile = await getUserProfile({
    username: params.user,
    // include: { people: true },
  });

  if (!profile) {
    // direct the user to setup their profile
    if (session?.user.username == params.user) {
      return redirect("/onboarding");
    }

    return notFound();
  }

  return (
    <main className="container md:!py-12 min-h-[60vh] max-w-5xl !space-y-10">
      <ProfileSection title={`About ${profile.name || `@${profile.username}`}`}>
        <p className="">
          {profile.bio || profile.oneLiner || (
            <span className="italic text-gray-400">Nothing to see here :)</span>
          )}
        </p>
      </ProfileSection>
    </main>
  );
}
