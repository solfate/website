import { SITE } from "@/lib/const/general";
import { allPodcastEpisodes } from "contentlayer/generated";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return allPodcastEpisodes.map((post) => {
    return {
      url: `${SITE.url}${post.href}`,
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8,
    };
  });
}
