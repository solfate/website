import { PodcastHero } from "@/components/podcast/PodcastHero";
import { SimpleEpisodeCard } from "@/components/podcast/SimpleEpisodeCard";
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
      <PodcastHero
        featuredEpisode={mostRecent}
        featuredLabel={`Latest episode: #${mostRecent.ep}`}
      />

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
            <SimpleEpisodeCard
              key={key}
              href={episode.href}
              date={episode.date}
              title={episode.title}
              imageSrc={episode.image}
              description={episode.description}
              duration={episode.duration}
            />
          ))}
        </section>
      </section>
    </main>
  );
}
