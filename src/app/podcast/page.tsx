"use client";

import { SimpleHeroHeader } from "@/components/core/SimpleHeroHeader";
import { FeaturedPostCard } from "@/components/posts/FeaturedPostCard";
import { SimpleAuthorCard } from "@/components/posts/SimpleAuthorCard";
import { SimplePostCard } from "@/components/posts/SimplePostCard";
import { PODCAST } from "@/lib/const/podcast";
import { podcastEpisodeImage } from "@/lib/podcast";
import { PodcastEpisode, allPodcastEpisodes } from "contentlayer/generated";
import Link from "next/link";

export default function Page() {
  // get the listing of episodes, sorted by their episode date
  const episodes = allPodcastEpisodes
    .sort((a, b) => parseFloat(b.ep) - parseFloat(a.ep))
    .slice(0, 7);

  // extract the most recent episode
  // trust me: this will always have a value unless contentlayer fails
  const mostRecent = episodes.shift() as PodcastEpisode;

  return (
    <main className="page-container">
      <SimpleHeroHeader
        title={PODCAST.name}
        description={PODCAST.description}
        className="max-w-lg"
      />

      <section className="grid md:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-y-8">
        <div className="col-span-2">
          <FeaturedPostCard
            title={mostRecent.title}
            href={mostRecent.href}
            date={mostRecent.date}
            imageSrc={mostRecent.image ?? podcastEpisodeImage()}
          />
        </div>

        <div className=" gap-2">
          <SimplePostCard
            href={"/post"}
            date={"Oct 20, 2023"}
            title={"Secondary featured post"}
            imageSrc={"/img/sample4.jpg"}
            description={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a libero euismod, volutpat ipsum in, suscipit eros. Vivamus id porta augue. Maecenas fringilla"
            }
          />

          {/* <div>cycle through featured posts, with animation</div> */}
        </div>
      </section>

      {/* <section className="space-y-8">
      <section className="flex items-center justify-between">
      <h2 className="font-semibold text-2xl">Discover Authors</h2>
      <Link href={"#"} className="underline">
      View more
      </Link>
      </section>
      
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SimpleAuthorCard />
          <SimpleAuthorCard />
          <SimpleAuthorCard />
          <SimpleAuthorCard />
        </section>
      </section> */}

      {/* <div className="rounded-2xl bg-red-400 p-4">hi</div> */}

      <section className="space-y-8">
        <section className="flex items-center justify-between">
          <h2 className="font-semibold text-2xl">Recent episodes</h2>
          <Link href={"#"} className="underline">
            View more
          </Link>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {episodes.map((episode) => (
            <SimplePostCard
              href={episode.href}
              date={episode.date}
              title={episode.title}
              imageSrc={episode.image}
              description={episode.description}
            />
          ))}
        </section>
      </section>
    </main>
  );
}
