import { SITE } from "@/lib/const/general";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // list of all page routes created on the site
  const pageRoutes: string[] = [
    // comment for better diffs
    "/",
    "/blog",
    "/devlist",
    "/signin",
    "/podcast",
    "/podcast/browse",
    "/faucet",
  ];

  // list of other sitemaps on the site
  const childSitemaps: string[] = [
    // comment for better diffs
    "/podcast/sitemap.xml",
    "/blog/sitemap.xml",
  ];

  return pageRoutes.concat(childSitemaps).map((route) => {
    return {
      url: `${SITE.url}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });
}
