/**
 * Common navigation routes (like those used in the primary nav)
 */

enum NavRouteNames {
  devlist = "devlist",
  blog = "blog",
  snapshot = "snapshot",
  podcast = "podcast",
}

export const NAV_ROUTES: { [key in NavRouteNames]: LinkDetails } = {
  blog: {
    title: "Blog",
    href: "/blog",
    description:
      "We write about blockchain things, mostly in the Solana ecosystem.",
  },
  snapshot: {
    title: "Snapshot Newsletter",
    href: "/snapshot",
    description:
      "Byte-sized email newsletter with the updates from Solana ecosystem.",
  },
  devlist: {
    title: "Solana DevList",
    href: "/devlist",
    description:
      "A verified list of Solana Developers and their wallet addresses.",
  },
  podcast: {
    title: "Solfate Podcast",
    href: "/podcast",
    description:
      "Interviews with blockchain founders and builders in the Solana ecosystem.",
  },
};
