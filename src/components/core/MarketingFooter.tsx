import Link from "next/link";
import { Twitter, Youtube } from "react-feather";
import { SocialButtonLink } from "@/components/SocialButtons";
import { SITE, TWITTER } from "@/lib/const/general";
import { PODCAST, PODCAST_TWITTER, PODCAST_YOUTUBE } from "@/lib/const/podcast";
import { AppLogo } from "@/components/core/AppLogo";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-gray-300 bg-gray-100">
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 container gap-8 py-8">
        <section className="col-span-full max-w-lg lg:col-span-2 space-y-6">
          <AppLogo logoSize={48} className="md:!text-4xl" />

          <p className="text-lg">
            Discover tools, resources, and people in the Solana blockchain
            ecosystem.
          </p>
        </section>

        <ul className="space-y-2">
          <FooterSectionTitle title={PODCAST.name} />
          {/* <FooterSectionLink href="/podcast" label="Subscribe" /> */}
          <FooterSectionLink href="/podcast#hosts" label="Meet the Hosts" />
          <FooterSectionLink href="/podcast/browse" label="Browse Episodes" />
          <FooterSectionLink href="/podcast" label="Leave a Review" />
          <FooterSectionLink href="/apple" label="Apple Podcasts" />
          <FooterSectionLink href="/spotify" label="Spotify" />
        </ul>
        <ul className="space-y-2">
          <FooterSectionTitle title="Tools & Resources" />
          <FooterSectionLink href="/developers" label="Solana DevList" />
          <FooterSectionLink href="/faucet" label="Solana Faucet" />
        </ul>
        {/* <ul className="space-y-2">
          <FooterSectionTitle title="Resources" />
          <FooterSectionLink href="#" label="Getting started" />
        </ul> */}
        {/* <ul className="space-y-2">
          <FooterSectionTitle title="Support" />
          <FooterSectionLink href="#" label="Privacy policy" />
        </ul> */}
      </section>

      <section className="container grid gap-4  md:flex items-center justify-center md:justify-between text-gray-500">
        <div className="order-2 md:order-1 text-center md:text-left">
          &copy;{new Date().getFullYear()}{" "}
          <Link href={"/"} className="underline">
            {SITE.name}
          </Link>
          {". All rights reserved."}
        </div>

        <div className="order-1 justify-center md:order-2 grid md:flex items-center gap-2">
          <div className="flex items-center justify-center">
            <SocialButtonLink
              newTab={true}
              title={"Twitter / X"}
              href={TWITTER.url}
              icon={Twitter}
              label={TWITTER.handle}
            />
          </div>
          <div className="order-1 justify-center md:order-2 flex items-center gap-2">
            <SocialButtonLink
              newTab={true}
              title={"Twitter / X"}
              href={PODCAST_TWITTER.url}
              icon={Twitter}
              label={PODCAST_TWITTER.handle}
            />
            <SocialButtonLink
              newTab={true}
              title={"YouTube"}
              href={PODCAST_YOUTUBE.url}
              icon={Youtube}
              label={PODCAST_YOUTUBE.handle}
            />
          </div>
        </div>
      </section>
    </footer>
  );
}

export const FooterSectionTitle = ({ title }: { title: string }) => {
  return (
    <li>
      <h4 className="font-semibold text-base text-gray-700">{title}</h4>
    </li>
  );
};

export const FooterSectionLink = ({
  href,
  label,
  target,
}: {
  href: string;
  label: string;
  target?: "_blank";
}) => {
  return (
    <li>
      <Link
        href={href}
        title={label}
        target={target}
        className="hover:underline"
      >
        {label}
      </Link>
    </li>
  );
};
