import Image from "next/image";
import Link from "next/link";
import { Twitter, Youtube } from "react-feather";
import { SocialButtonLink } from "@/components/SocialButtons";
import { SITE, TWITTER, YOUTUBE } from "@/lib/const/general";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-gray-400 bg-gray-100">
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 container gap-8 py-8">
        <section className="col-span-full max-w-lg lg:col-span-2 space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-3xl"
          >
            <Image
              width={48}
              height={48}
              src={"/icon.svg"}
              alt={SITE.name}
              className="object-cover object-center rounded-full h-12 w-12"
              priority={false}
            />
            {SITE.name}
          </Link>

          <p className="text-lg">
            Interviews with blockchain founders and builders in the Solana
            ecosystem.
          </p>
        </section>

        <ul className="space-y-2">
          <li>
            <FooterSectionTitle title="Features" />
          </li>
          <li>
            <FooterSectionLink href="#" label="Easy to use editor" />
          </li>
        </ul>
        <ul className="space-y-2">
          <li>
            <FooterSectionTitle title="Resources" />
          </li>
          <li>
            <FooterSectionLink href="#" label="Getting started" />
          </li>
        </ul>
        <ul className="space-y-2">
          <li>
            <FooterSectionTitle title="Support" />
          </li>
          <li>
            <FooterSectionLink href="#" label="Privacy policy" />
          </li>
        </ul>
      </section>

      <section className="container grid gap-4 md:flex items-center justify-center md:justify-between text-gray-500">
        <div className="order-2 md:order-1">
          &copy;{new Date().getFullYear()}{" "}
          <Link href={"/"} className="underline">
            {SITE.name}
          </Link>
          {". All rights reserved."}
        </div>

        <div className="order-1 justify-center md:order-2 flex items-center gap-2">
          <SocialButtonLink
            title={"Twitter / X"}
            href={TWITTER.url}
            icon={Twitter}
            label={TWITTER.handle}
          />
          <SocialButtonLink
            title={"YouTube"}
            href={YOUTUBE.url}
            icon={Youtube}
            label={YOUTUBE.handle}
          />
        </div>
      </section>
    </footer>
  );
}

export const FooterSectionTitle = ({ title }: { title: string }) => {
  return <h4 className="font-semibold text-base text-gray-700">{title}</h4>;
};

export const FooterSectionLink = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => {
  return (
    <Link href={href} title={label} className="hover:underline">
      {label}
    </Link>
  );
};
