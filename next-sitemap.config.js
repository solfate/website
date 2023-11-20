const SITE_URL = "https://solfate.com";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    // "/sitemap-generated.xml", // <= exclude custom dynamic sitemap
  ],
  robotsTxtOptions: {
    additionalSitemaps: [
      // `${SITE_URL}/sitemap-generated.xml`, // add custom dynamic sitemap
    ],
  },
};
