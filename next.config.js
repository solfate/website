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
        source: "/developers",
        destination: "/devlist",
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
        source: "/nickfrosty",
        destination: "https://twitter.com/nickfrosty",
        permanent: true,
      },
      {
        source: "/podcast/nickfrosty",
        destination: "https://twitter.com/nickfrosty",
        permanent: true,
      },
      {
        source: "/jamesrp13",
        destination: "https://twitter.com/jamesrp13",
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
        hostname: "*.ipfs.dweb.link",
      },
    ],
  },
};

module.exports = withContentlayer(nextConfig);
