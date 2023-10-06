import { SimpleEpisodeCard } from "@/components/podcast/SimpleEpisodeCard";
import { PODCAST } from "@/lib/const/podcast";
import { computePagination } from "@/lib/helpers";
import { allPodcastEpisodes } from "contentlayer/generated";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "react-feather";

export const metadata: Metadata = {
  title: `${PODCAST.name} - Browse episodes`,
  alternates: {
    canonical: "/podcast/episodes",
  },
};

type PageProps = {
  searchParams: {
    /** current page being viewed */
    page: string | undefined;
    /** number of results per page */
    take: string | undefined;
  };
};

export default function Page({
  searchParams: { page = "1", take = "9" },
}: PageProps) {
  const pagination = computePagination({
    page,
    take,
    totalItems: allPodcastEpisodes.length,
  });

  // get the listing of episodes, sorted by their episode date
  const episodes = allPodcastEpisodes
    .sort((a, b) => parseFloat(b.ep) - parseFloat(a.ep))
    .slice(pagination.startIndex, pagination.startIndex + pagination.take);

  return (
    <main className="page-container py-10">
      {/* <PodcastHero
        featuredEpisode={mostRecent}
        featuredLabel={`Latest episode: #${mostRecent.ep}`}
      /> */}

      <section className="space-y-8">
        <section className="flex items-center justify-between">
          <h1 className="font-semibold text-4xl">Browse Podcast Episodes</h1>
          {/* <Link
            href={"/podcast/episodes"}
            className="btn inline-flex items-center gap-2"
          >
            View more
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </Link> */}
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

        <section className=" flex items-center justify-center gap-3">
          {pagination.page > 1 && (
            <Link
              href={`/podcast/episodes?page=${pagination.prev}`}
              className="btn"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              Prev
            </Link>
          )}

          {pagination.page < pagination.totalPages && (
            <Link
              href={`/podcast/episodes?page=${pagination.next}`}
              className="btn"
            >
              Next
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </Link>
          )}
        </section>
      </section>
    </main>
  );
}
