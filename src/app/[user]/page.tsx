import { notFound, redirect } from "next/navigation";
import { getUserProfile } from "@/lib/queries/users";
import { ProfileSection } from "@/components/users/ProfileSection";
import { getUserSession } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSection,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import DevListImage from "@/../public/img/devlist/devlist.png";
import { Profile, User, WalletList } from "@prisma/client";
import prisma from "@/lib/prisma";
import { DevListApplicationExtraData } from "@/types/api/lists";
import { formattedDate } from "@/lib/utils";
import Link from "next/link";
import { DonateDialog } from "@/components/donate-dialog";
import { Button } from "@/components/ui/button";

import { SocialLinks } from "@/components/SocialLinks";
import { SubNav } from "@/components/core/SubNav";
import { Avatar } from "@/components/core/Avatar";

type PageProps = {
  params: {
    user: string;
  };
};

export default async function Page({ params }: PageProps) {
  if (!params.user) return notFound();

  const session = await getUserSession();

  const isViewingOwnProfile =
    session?.user.username.toLowerCase() == params.user.toLowerCase();

  // get the product's record from the database
  const profile = (await getUserProfile({
    username: params.user,
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  })) as Profile & { user: { id: User["id"] } };

  if (!profile) {
    // direct the user to setup their profile
    if (isViewingOwnProfile) return redirect("/onboarding");

    return notFound();
  }

  const isAuthedUserProfile =
    session?.user.username.toLowerCase() == profile.username.toLowerCase();

  // get the mint timestamp and prevent data leakage
  const devlistMintTimestamp: number | undefined = await prisma.walletList
    .findUnique({
      where: {
        wallet_list_userId_and_type: {
          userId: profile.user.id,
          type: "DEVELOPER",
        },
      },
    })
    .then((devlist) => {
      if (devlist && devlist.status == "ACTIVE")
        return (devlist.data as DevListApplicationExtraData)
          .mintTimestamp as number;
      else return undefined;
    });

  return (
    <>
      <ProfileHeader
        profile={profile}
        isAuthedUserProfile={isAuthedUserProfile}
      />

      <main className="container md:!py-12 min-h-[60vh] max-w-5xl gap-4 md:gap-y-10 flex flex-col md:flex-row justify-between">
        <section className="min-w-80 md:max-w-80 md:order-2 flex flex-col gap-4">
          {profile.walletAddress ? (
            <DonateDialog walletAddress={profile.walletAddress} />
          ) : isViewingOwnProfile ? (
            <Card className="border-destructive border-dashed">
              <CardHeader>
                <CardTitle>
                  Start accepting tips and donations on Solana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant={"success"}
                  className="block text-center"
                >
                  <Link href={"/settings/tips"}>Add a Public Wallet</Link>
                </Button>
              </CardContent>
              <CardFooter className="!block space-y-1">
                <p className="">
                  Add a public Solana wallet to accept tips and donations from
                  others directly to your wallet
                </p>
                <p className="text-muted-foreground text-sm italic">
                  Only you see this message
                </p>
              </CardFooter>
            </Card>
          ) : null}

          {devlistMintTimestamp && (
            <DevListCard mintTimestamp={devlistMintTimestamp} />
          )}
        </section>

        <section className="flex-grow md:order-1">
          <ProfileSection
            title={`About ${profile.name || `@${profile.username}`}`}
          >
            <p className="whitespace-pre-wrap break-words">
              {profile.bio || profile.oneLiner || (
                <span className="italic text-gray-400">
                  Nothing to see here :)
                </span>
              )}
            </p>
          </ProfileSection>
        </section>
      </main>
    </>
  );
}

const DevListCard = ({ mintTimestamp }: { mintTimestamp: number }) => {
  return (
    <Card className="flex p-2 gap-4 items-center">
      <CardContent className="flex p-0">
        <Link href={"/devlist"}>
          <Image
            src={DevListImage}
            alt="DevList"
            className="size-20 rounded-md overflow-hidden"
            width={80}
            height={80}
          />
        </Link>
      </CardContent>
      <CardHeader className="p-0">
        <CardTitle className="text-xl">
          <Link href={"/devlist"}>DevList Member</Link>
        </CardTitle>
        <CardSection>
          <p>
            since <i>{formattedDate(new Date(mintTimestamp))}</i>
          </p>
          <Link href={"/devlist"} className="link">
            Learn More
          </Link>
        </CardSection>
      </CardHeader>
    </Card>
  );
};

const ProfileHeader = ({
  profile,
  isAuthedUserProfile,
}: {
  profile: NonNullable<Awaited<ReturnType<typeof getUserProfile>>>;
  isAuthedUserProfile: boolean;
}) => (
  <header className="border-b border-gray-300 bg-white">
    <section className="container mx-auto max-w-5xl flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-2 !py-6 md:!py-10">
      <div className="flex gap-3 md:gap-5 items-center flex-grow">
        <Avatar
          size={128}
          username={profile.username}
          title={profile.name || profile.username}
          imageSrc={profile.image}
          href={`/${profile.username}`}
          className="rounded-full size-20 md:size-32"
        />

        <div className="flex-grow space-y-2 md:space-y-3">
          <section className="space-y-0">
            <h1 className="text-black line-clamp-1 text-xl md:text-3xl font-semibold">
              <Link href={`/${profile.username}`} className="">
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
          className={"order-1 md:order-2"}
          twitter={profile.twitter}
          github={profile.github}
          website={profile.website}
        />
        {isAuthedUserProfile && (
          <Link
            href={"/settings/profile"}
            className="btn btn-ghost order-2 md:order-1"
          >
            Edit Profile
          </Link>
        )}
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
);
