import { PODCAST_HOSTS } from "@/lib/const/podcast";
import { memo } from "react";
import { GitHub, Link as LinkIcon, Twitter } from "react-feather";
import { SocialButtonLink } from "@/components/SocialButtons";
import clsx from "clsx";
import { PodcastPerson } from "@/types";
import Image from "next/image";

type PodcastHostsHeroProps = {
  label?: string;
};

export const PodcastHostsHero = memo(({ label }: PodcastHostsHeroProps) => (
  <section className="py-8 space-y-6">
    {!!label && (
      <h2 className="w-min whitespace-nowrap px-4 mx-auto text-center text-4xl font-semibold shadow-underline shadow-hot-pink">
        {label}
      </h2>
    )}

    <section className="container grid gap-14 md:grid-cols-2">
      {PODCAST_HOSTS.map((person, index) => (
        <section key={index} className="space-y-4">
          <div className="space-x-6 flex items-center">
            <div className="avatar avatar-base">
              <Image
                src={person.img ?? "[err]"}
                className={"avatar-base"}
                width={96}
                height={96}
                alt={person.name}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-semibold md:text-3xl">
                {person.name}
              </h2>

              <PodcastHostSocialLinks person={person} />
            </div>
          </div>

          <p className="text-gray-500">{person.bio}</p>
        </section>
      ))}
    </section>
  </section>
));

type SocialLinksProps = SimpleComponentProps & {
  person: PodcastPerson;
};

/**
 * Display the standard social links for the podcast hosts
 */
export const PodcastHostSocialLinks = memo(
  ({ person, className }: SocialLinksProps) => (
    <div className={clsx("flex items-center gap-3", className)}>
      {person?.twitter && (
        <SocialButtonLink
          newTab={true}
          href={`https://twitter.com/${person.twitter}`}
          title={`@${person.twitter} on Twitter`}
          icon={Twitter}
        />
      )}

      {person?.github && (
        <SocialButtonLink
          newTab={true}
          href={`https://github.com/${person.github}`}
          title={`${person.github} on Github`}
          icon={GitHub}
        />
      )}

      {person?.website && (
        <SocialButtonLink
          newTab={true}
          href={person.website}
          title={person.website}
          icon={LinkIcon}
        />
      )}
    </div>
  ),
);
