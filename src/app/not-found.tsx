import { SimplePostCard } from "@/components/posts/SimplePostCard";
import { SITE } from "@/lib/const/general";
import { podcastEpisodeImage } from "@/lib/podcast";
import { PodcastEpisode, allPodcastEpisodes } from "contentlayer/generated";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "react-feather";

export const metadata: Metadata = {
  title: `${SITE.name} - Page not found`,
};

/**
 * note:
 * for some reason, when  the marketing footer is loaded on this page,
 * the social button styles do not apply...
 * specifically from the `module.css` file and when direct visit a 404 page.
 * if the user routes to the page via internal navigation, then it works fine
 */

export default async function NotFound() {
  // get the listing of episodes, sorted by their episode date
  const recentEpisode = allPodcastEpisodes
    .sort((a, b) => parseFloat(b.ep) - parseFloat(a.ep))
    .slice(0, 1)[0] as PodcastEpisode;

  return (
    <main className="page-container !space-y-8 md:py-20">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-y-10 md:mx-20">
        <div className="col-span-2 items-center flex flex-grow text-center md:text-left">
          <div>
            <section className={"py-4 md:py-8 max-w-lg space-y-2"}>
              <h1 className="text-4xl md:text-5xl font-bold">Page not found</h1>

              <p className="text-base md:text-lg text-gray-500">
                Looks like you hit a wall. We could not find the page you were
                looking for...
              </p>
            </section>

            <Link
              href="/"
              className="btn inline-flex font-semibold border-gray-300"
            >
              No place like home
              <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
            </Link>

            {/* <PodcastFeedLinkButtons /> */}
          </div>
        </div>

        <div className="grid gap-2">
          <h2 className="font-semibold text-center text-3xl md:text-2xl">
            Latest Podcast Episode #{recentEpisode.ep}
          </h2>

          <SimplePostCard
            title={recentEpisode.title}
            href={recentEpisode.href}
            date={recentEpisode.date}
            imageSrc={recentEpisode.image ?? podcastEpisodeImage()}
            description={recentEpisode.description}
          />
        </div>
      </section>
    </main>
  );
}
