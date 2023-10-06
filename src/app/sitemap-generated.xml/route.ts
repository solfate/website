import { SITE } from "@/lib/const/general";
import { getServerSideSitemap } from "next-sitemap";

/**
 * Generate custom sitemap based on server side content
 */

export async function GET(request: Request) {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')

  return getServerSideSitemap([
    {
      loc: `${SITE.url}/test`,
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    },
    {
      loc: `${SITE.url}/test2`,
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    },
  ]);
}
