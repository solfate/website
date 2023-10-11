import Link from "next/link";
import { memo } from "react";
import { PodcastFeedLinkButtons } from "./PodcastFeedLinkButtons";

type PodcastFeedHeroProps = {
  title: string;
  href: string;
  description?: string;
};

export const PodcastFeedHero = memo(
  ({ title, description, href }: PodcastFeedHeroProps) => (
    <div className="col-span-2 items-center flex flex-grow">
      <div>
        <section className={"py-4 max-w-lg space-y-2"}>
          <h1 className="text-4xl md:text-5xl font-bold">
            <Link href={href}>{title}</Link>
          </h1>

          {!!description && (
            <p className="text-base md:text-lg text-gray-500">{description}</p>
          )}
        </section>

        <PodcastFeedLinkButtons />
      </div>
    </div>
  ),
);
