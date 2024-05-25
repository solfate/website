"use client";

import { AppLogo } from "@/components/core/AppLogo";
import { HeaderUserMenu } from "./HeaderUserMenu";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import {
  NavigationListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { MenuIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import Link from "next/link";
import PodcastImage from "@/../public/media/podcast/cover0.jpg";
import Image from "next/image";
import { NAV_ROUTES } from "@/lib/const/nav";
import { usePathname } from "next/navigation";

const podcast: { featured: LinkDetails; links: LinkDetails[] } = {
  featured: NAV_ROUTES["podcast"],
  links: [
    {
      title: "Meet the Hosts",
      href: "/podcast#hosts",
      description: (
        <p>
          Hosted by two developers:
          <br />
          James and Nick.
        </p>
      ),
    },
    // {
    //   title: "Past Guest",
    //   href: "/podcast#hosts",
    //   description: "View the list of past guests on the podcast.",
    // },
    {
      title: "Browse Episodes",
      href: "/podcast/browse/1",
      description: "Browse the catalog of episodes from over the years.",
    },
  ],
};

const resources: LinkDetails[] = [
  NAV_ROUTES["blog"],
  NAV_ROUTES["snapshot"],
  {
    title: "Solana Faucet",
    href: "/faucet",
    description:
      "Get SOL deposited to your testnet or devnet wallet instantly.",
  },
];

const mobile: LinkDetails[] = [
  NAV_ROUTES["podcast"],
  NAV_ROUTES["blog"],
  NAV_ROUTES["snapshot"],
  NAV_ROUTES["devlist"],
];

export default function MarketingHeader({
  session,
}: {
  session?: Option<Session>;
}) {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setOpen(false);
  }, [pathName]);

  return (
    <SessionProvider session={session}>
      <header
        className={
          "sticky top-0 z-10 lg:relative bg-background flex items-center justify-between w-full h-16 border-b border-border"
        }
      >
        <div
          className={
            "z-30 w-full flex items-center justify-between mx-auto gap-2 container"
          }
        >
          <div
            className={
              "items-center gap-2 flex-1 justify-between md:justify-start flex"
            }
          >
            <AppLogo logoSize={36} />

            <NavigationMenu className="hidden md:block">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Podcast</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            href={podcast.featured.href}
                            className="flex h-full w-full border border-transparent hover:border-primary/10 select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted hover:from-muted group hover:to-muted/50 p-6 no-underline outline-none focus:shadow-md"
                          >
                            <Image
                              src={PodcastImage}
                              alt={podcast.featured.title}
                              width={128}
                              height={128}
                              className="rounded"
                            />
                            <div className="mb-2 mt-4 text-lg font-medium group-hover:text-hot-pink">
                              {podcast.featured.title}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              {podcast.featured.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {podcast.links.map((component) => (
                        <NavigationListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </NavigationListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/snapshot" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Snapshot
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/devlist" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      DevList
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {resources.map((component) => (
                        <NavigationListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </NavigationListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {!isDesktop && (
              <Drawer direction="right" open={open} onOpenChange={setOpen}>
                <DrawerTrigger className="md:hidden" asChild>
                  {/* <Button variant="outline">
                    <MenuIcon className="w-full" />
                  </Button> */}
                  <button className="icon-lg">
                    {open ? (
                      <XIcon className="w-full" />
                    ) : (
                      <MenuIcon className="w-full" />
                    )}
                  </button>
                </DrawerTrigger>
                <DrawerContent className="rounded-none ">
                  <NavigationMenu className="flex !flex-initial flex-col p-4 gap-y-2">
                    <NavigationMenuItem className="list-none w-full flex items-center justify-between">
                      <AppLogo
                        logoSize={36} /*className="pr-8" showImage={true}*/
                      />
                      <button
                        onClick={() => setOpen(false)}
                        className="icon-lg"
                      >
                        {open ? (
                          <XIcon className="w-full" />
                        ) : (
                          <MenuIcon className="w-full" />
                        )}
                      </button>
                    </NavigationMenuItem>

                    <ul className="">
                      {mobile.map((component) => (
                        <NavigationListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </NavigationListItem>
                      ))}
                    </ul>

                    <section className="flex items-center justify-between w-full">
                      {!session?.user && (
                        <Link
                          href={"/signin"}
                          className={`btn btn-ghost w-full text-center items-center justify-center`}
                        >
                          Sign in
                        </Link>
                      )}
                    </section>
                  </NavigationMenu>
                </DrawerContent>
              </Drawer>
            )}
          </div>
          <div className="flex items-center gap-2">
            <HeaderUserMenu className="" />
          </div>
        </div>
      </header>
    </SessionProvider>
  );
}
