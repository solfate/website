import { PodcastFeedLinkButtons } from "@/components/podcast/PodcastFeedLinkButtons";
import { SimpleAuthorCard } from "@/components/posts/SimpleAuthorCard";
import { SimplePostCard } from "@/components/posts/SimplePostCard";
import { PODCAST } from "@/lib/const/podcast";
import { podcastEpisodeImage } from "@/lib/podcast";
import { PodcastEpisode, allPodcastEpisodes } from "contentlayer/generated";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "react-feather";

export const metadata: Metadata = {
  alternates: {
    canonical: "/podcast",
  },
};

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
            Latest Episode #{mostRecent.ep}
          </h2>

          <SimplePostCard
            title={mostRecent.title}
            href={mostRecent.href}
            date={mostRecent.date}
            imageSrc={mostRecent.image ?? podcastEpisodeImage()}
            description={mostRecent.description}
            username=""
            avatarImage=""
          />
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
          <Link
            href={"/podcast/episodes"}
            className="btn inline-flex items-center gap-2"
          >
            View more
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </Link>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {episodes.map((episode, key) => (
            <SimplePostCard
              key={key}
              href={episode.href}
              date={episode.date}
              title={episode.title}
              imageSrc={episode.image}
              description={episode.description}
              username=""
              avatarImage=""
            />
          ))}
        </section>
      </section>
    </main>
  );
}
