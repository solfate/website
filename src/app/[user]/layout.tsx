import { Metadata, ResolvingMetadata } from "next";
import { getUserProfile } from "@/lib/queries/users";
import MarketingFooter from "@/components/core/MarketingFooter";

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
    return {
      title: "Profile Not Found" + " - Solfate",
    };
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
    openGraph: {
      images: profile.image || "/logo-orange.png",
    },
    twitter: {
      card: "summary",
    },
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  return (
    <>
      {children}

      <MarketingFooter />
    </>
  );
}
