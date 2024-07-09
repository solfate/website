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
                variant={"destructive"}
                className="block text-center"
              >
                <Link href={"/settings"}>Add a Public Wallet</Link>
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
          <p className="">
            {profile.bio || profile.oneLiner || (
              <span className="italic text-gray-400">
                Nothing to see here :)
              </span>
            )}
          </p>
        </ProfileSection>
      </section>
    </main>
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
