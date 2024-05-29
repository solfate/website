/**
 *
 */
const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/drip",
        destination: "https://drip.haus/solfate",
        permanent: true,
      },
      {
        source: "/developers",
        destination: "/devlist",
        permanent: true,
      },
      {
        source: "/newsletter",
        destination: "/snapshot",
        permanent: true,
      },
      {
        source: "/snapshotref",
        destination: "/snapshot",
        permanent: true,
      },
      {
        source: "/newsletters",
        destination: "/snapshot",
        permanent: true,
      },
      {
        source: "/snapshots",
        destination: "/snapshot",
        permanent: true,
      },
      {
        source: "/twitter",
        destination: "https://twitter.com/SolfatePod",
        permanent: true,
      },
      {
        source: "/youtube",
        destination: "https://youtube.com/@SolfatePod",
        permanent: true,
      },
      {
        source: "/spotify",
        destination:
          "https://open.spotify.com/show/5YnYJdFDfEM16Om3v4VRcs?si=4SW7C3wNS_eWYz7YCFfdcw",
        permanent: true,
      },
      {
        permanent: true,
        source: "/apple",
        destination:
          "https://podcasts.apple.com/us/podcast/solfate-podcast/id1663919657",
        permanent: true,
      },
      {
        source: "/pcast",
        destination:
          "https://pca.st/podcast/f7e2e7d0-7293-013b-f273-0acc26574db2",
        permanent: true,
      },
      {
        source: "/pocketcasts",
        destination:
          "https://pca.st/podcast/f7e2e7d0-7293-013b-f273-0acc26574db2",
        permanent: true,
      },
      {
        source: "/youtube",
        destination: "https://youtube.com/@SolfatePod",
        permanent: true,
      },
      {
        source: "/podcast/7.5",
        destination: "/podcast/7-5",
        permanent: true,
      },
      {
        source: "/podcast/nickfrosty",
        destination: "https://twitter.com/nickfrosty",
        permanent: true,
      },
      {
        source: "/podcast/jamesrp13",
        destination: "https://twitter.com/jamesrp13",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.solfate.com",
      },
      // {
      //   protocol: "https",
      //   hostname: "storage.googleapis.com",
      //   pathname: "/assets.solfate.com/**",
      // },
    ],
  },
};

module.exports = withContentlayer(nextConfig);
