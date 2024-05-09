import { SimpleEpisodeCard } from "@/components/podcast/SimpleEpisodeCard";
import { PODCAST } from "@/lib/const/podcast";
import { computePagination } from "@/lib/helpers";
import { allPodcastEpisodes } from "contentlayer/generated";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "react-feather";

// define the number of episodes per page
const BROWSE_TAKE_PER_PAGE = 9;

type PageProps = {
  params: {
    /** current page being viewed */
    page: string | undefined;
  };
  searchParams: {
    /** number of results per page */
    take: string | undefined;
  };
};

export async function generateStaticParams() {
  const pagination = computePagination({
    take: BROWSE_TAKE_PER_PAGE,
    totalItems: allPodcastEpisodes.length,
  });

  return new Array(pagination.totalPages).fill("").map((_item, count) => ({
    page: (count + 1).toString(),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: `${PODCAST.name} - Browse episodes`,
    alternates: {
      canonical: `/podcast/browse/${params.page}`,
    },
  };
}

export default function Page({
  params: { page = "1" },
}: // searchParams: { take = "9" },
PageProps) {
  const pagination = computePagination({
    page,
    take: BROWSE_TAKE_PER_PAGE,
    totalItems: allPodcastEpisodes.length,
  });

  // get the listing of episodes, sorted by their episode date
  const episodes = allPodcastEpisodes
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
            href={"/podcast/browse"}
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
              href={`/podcast/browse/${pagination.prev}`}
              className="btn btn-ghost"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              Prev
            </Link>
          )}

          {pagination.page < pagination.totalPages && (
            <Link
              href={`/podcast/browse/${pagination.next}`}
              className="btn btn-ghost"
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
