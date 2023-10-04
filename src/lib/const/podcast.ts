/*
  Specific constants for the podcast
*/

import { PodcastFeedLocation, PodcastPerson } from "@/types";
import { SITE } from "./general";

//name is a name. define it for use
export const INITIAL_EPISODES_PER_PAGE = 5;

export const PODCAST = {
  name: "Solfate Podcast",
  url: `${SITE.url}/podcast`,
  description:
    "Interviews with blockchain founders and builders in the Solana ecosystem. " +
    "Hosted by two developers.",
};

export const PODCAST_HOSTS: PodcastPerson[] = [
  {
    name: "Nick",
    img: "/img/nick.jpg",
    twitter: "nickfrosty",
    github: "nickfrosty",
    website: "https://nick.af",
    blurb: "Host of the Solfate Podcast",
    bio: "Nick is a self taught developer and submariner. He spends his free time \
    writing docs and technical articles, as well as building side projects. \
    He strives to one day make a living online from those projects.",
  },
  {
    name: "James",
    img: "/img/james.jpg",
    twitter: "jamesrp13",
    github: "jamesrp13",
    // website: "",
    blurb: "Host of the Solfate Podcast",
    bio: "James is still trying to figure out what to do when he grows up, \
    but he's been making a living for almost a decade by creating software \
    and educating devs through his software agency Unboxed. So much for that Econ degree.",
  },
];

export const PODCAST_FEED_LOCATIONS: PodcastFeedLocation[] = [
  {
    label: "RSS feed",
    href: "https://feeds.transistor.fm/solfate",
    icon: "/icons/rss.svg",
  },
  {
    label: "Apple Podcast",
    href: "https://podcasts.apple.com/us/podcast/solfate-podcast/id1663919657",
    icon: "/icons/apple.svg",
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/5YnYJdFDfEM16Om3v4VRcs",
    icon: "/icons/spotify.svg",
  },
  {
    label: "Google Podcasts",
    href: "https://podcasts.google.com/feed/aHR0cHM6Ly9mZWVkcy50cmFuc2lzdG9yLmZtL3NvbGZhdGU",
    icon: "/icons/google.svg",
  },
  // {
  //   label: "Pocketcasts",
  //   href: "https://pca.st/podcast/f7e2e7d0-7293-013b-f273-0acc26574db2",
  //   icon: "/icons/pocketcasts.svg",
  // },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@SolfatePod/podcasts",
    icon: "/icons/youtube.svg",
  },
];
