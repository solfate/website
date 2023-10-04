import { PODCAST } from "@/lib/const/podcast";
import Link from "next/link";
import { PodcastFeedLinkButtons } from "@/components/podcast/PodcastFeedLinkButtons";
import { PodcastEpisode } from "contentlayer/generated";
import { SimpleEpisodeCard } from "./SimpleEpisodeCard";
import { podcastEpisodeImage } from "@/lib/podcast";

type PodcastHeroProps = {
  /** the episode to be featured in this hero section */
  featuredEpisode: PodcastEpisode;
  /** custom label to be displayed above the episode card */
  featuredLabel?: string;
};

export const PodcastHero = ({
  featuredEpisode,
  featuredLabel,
}: PodcastHeroProps) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-y-10 md:mx-20">
      <div className="col-span-2 items-center flex flex-grow">
        <div>
          <section className={"py-4 max-w-lg space-y-2"}>
            <h1 className="text-4xl md:text-5xl font-bold">
              <Link href="/podcast">{PODCAST.name}</Link>
            </h1>

            <p className="text-base md:text-lg text-gray-500">
              {PODCAST.description}
            </p>
          </section>

          <PodcastFeedLinkButtons />
        </div>
      </div>

      <div className="grid gap-2">
        <h2 className="font-semibold text-center text-3xl md:text-2xl">
          {featuredLabel ?? `Episode #${featuredEpisode.ep}`}
        </h2>

        <SimpleEpisodeCard
          title={featuredEpisode.title}
          href={featuredEpisode.href}
          date={featuredEpisode.date}
          imageSrc={featuredEpisode.image ?? podcastEpisodeImage()}
          description={featuredEpisode.description}
          duration={featuredEpisode.duration}
        />
      </div>
    </section>
  );
};
