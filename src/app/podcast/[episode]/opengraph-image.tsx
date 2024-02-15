import { notFound } from "next/navigation";
import { PostImage } from "@/lib/images/post-image";
import { SITE } from "@/lib/const/general";

import { PODCAST } from "@/lib/const/podcast";
import { getPodcastEpisode } from "@/lib/queries/getPodcastEpisode";

export const runtime = "nodejs";

export const contentType = "image/png";

export const size = {
  width: 1200,
  height: 630,
};

// Image generation
export default async function Image({
  params,
}: {
  params: { episode: string };
}) {
  //
  const { episode } = getPodcastEpisode({ epId: params.episode });
  if (!episode) {
    notFound();
  }

  return await PostImage(size, {
    title: episode.title,
    heading: `Episode #${episode.ep}`,
    // set the podcast's default cover image
    avatarImage: `${SITE.url}${PODCAST.image}`,
    url: `${SITE.domain}/podcast`,
  });
}
