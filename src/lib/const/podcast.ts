/*
  Specific constants for the podcast
*/

import { PodcastFeedLocation, Person, PodcastRatingLocation } from "@/types";
import { SITE } from "./general";

//name is a name. define it for use
export const INITIAL_EPISODES_PER_PAGE = 5;

export const PODCAST_TWITTER = {
  handle: "@SolfatePod",
  username: "SolfatePod",
  url: "https://twitter.com/SolfatePod",
};

export const PODCAST_YOUTUBE = {
  handle: "@SolfatePod",
  username: "SolfatePod",
  url: "https://youtube.com/@SolfatePod",
};

export const PODCAST = {
  name: "Solfate Podcast",
  url: `${SITE.url}/podcast`,
  image: "/media/podcast/cover0.jpg",
  description:
    "Interviews with blockchain founders and builders in the Solana ecosystem. " +
    "Hosted by two developers.",
};

export const PODCAST_HOSTS: Person[] = [
  {
    name: "Nick",
    img: "/img/nick.jpg",
    twitter: "nickfrosty",
    github: "nickfrosty",
    website: "https://nick.af",
    title: "Host of the Solfate Podcast",
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
    title: "Host of the Solfate Podcast",
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
    href: "/apple",
    icon: "/icons/apple.svg",
  },
  {
    label: "Spotify",
    href: "/spotify",
    icon: "/icons/spotify.svg",
  },
  {
    label: "PocketCasts",
    href: "/pocketcasts",
    icon: "/icons/pocketcasts.svg",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@SolfatePod/podcasts",
    icon: "/icons/youtube.svg",
  },
];

export const PODCAST_RATING_LOCATIONS: PodcastRatingLocation[] = [
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
];
