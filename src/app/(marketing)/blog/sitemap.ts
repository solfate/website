import { SITE } from "@/lib/const/general";
import { allBlogPosts } from "contentlayer/generated";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE.url}/blog`,
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8,
    },
  ];

  return staticPages.concat(
    allBlogPosts.map((post) => {
      return {
        url: `${SITE.url}${post.href}`,
        changeFrequency: "monthly",
        lastModified: new Date(),
        priority: 0.8,
      };
    }),
  );
}
