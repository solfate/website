import { Metadata } from "next";
import MarketingFooter from "@/components/core/MarketingFooter";
import { PodcastHero } from "@/components/podcast/PodcastHero";
import { PodcastHostsHero } from "@/components/podcast/PodcastHostsHero";
import { PodcastEpisode, allPodcastEpisodes } from "contentlayer/generated";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Page() {
  // get the listing of episodes, sorted by their episode date
  const mostRecent = allPodcastEpisodes
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 1)[0] as PodcastEpisode;

  return (
    <>
      <main className="page-container">
        <PodcastHero
          featuredEpisode={mostRecent}
          featuredLabel={`Latest episode: #${mostRecent.ep}`}
        />

        <PodcastHostsHero label="Meet the Hosts" />
      </main>

      <MarketingFooter />
    </>
  );
}
