import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getUserProfile } from "@/lib/queries/users";

import Link from "next/link";
import MarketingFooter from "@/components/core/MarketingFooter";
import { SocialLinks } from "@/components/SocialLinks";
import { SubNav } from "@/components/core/SubNav";
import { Avatar } from "@/components/core/Avatar";

type LayoutProps = {
  children: React.ReactNode;
  params: {
    user: string;
  };
};

export async function generateMetadata(
  { params }: LayoutProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // get the user's profile record from the database
  const profile = await getUserProfile({
    username: params.user,
    // include: { people: true },
  });

  // handle the 404 for no or invalid `product`
  if (!params.user || !profile) {
    return notFound();
  }

  let title = `@${profile.username}`;
  if (profile.name) {
    title = `${profile.name} (${title})`;
  }

  return {
    title: title + " - Solfate",
    description: profile.bio || profile.oneLiner,
    alternates: {
      canonical: `/${profile.username.toLowerCase()}`,
    },
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  if (!params.user) return notFound();

  // get the user's profile record from the database
  const profile = await getUserProfile({
    username: params.user,
    // include: { people: true },
  });

  if (!profile) return notFound();

  return (
    <>
      <header className="border-b border-gray-300 bg-white">
        <section className="container mx-auto max-w-5xl flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-2 !py-6 md:!py-10">
          <div className="flex gap-3 md:gap-5 items-center flex-grow">
            <Avatar
              size={128}
              title={profile.name || profile.username}
              imageSrc={profile.image}
              href={`/${profile.username}`}
              className="rounded-full size-20 md:size-32"
            />

            <div className="flex-grow space-y-2 md:space-y-3">
              <section className="space-y-0">
                <h1 className="text-black line-clamp-1 text-xl md:text-3xl font-semibold">
                  <Link href={`/${profile.username}`} className="link">
                    {profile.name || profile.username}
                  </Link>
                </h1>

                <p className="text-gray-400 text-sm line-clamp-1 hidden md:block">
                  @{profile.username}
                </p>
              </section>

              {profile.oneLiner && (
                <p className="text-gray-600 text-sm md:text-base line-clamp-2 md:line-clamp-1">
                  {profile.oneLiner}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 justify-between">
            <SocialLinks
              twitter={profile.twitter}
              github={profile.github}
              website={profile.website}
            />
            {/* <button type="button" className="btn bg-hot-pink text-white">
              Follow
            </button> */}
          </div>
        </section>

        <SubNav
          className="container mx-auto max-w-5xl"
          links={[
            {
              label: "Overview",
              href: `/${profile.username}`,
            },
          ]}
        />
      </header>

      {children}

      <MarketingFooter />
    </>
  );
}
