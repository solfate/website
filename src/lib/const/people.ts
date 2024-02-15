/*
  Specific constants for Solfate people and authors
*/

import { Person } from "@/types";

/**
 * Static list of the authors that create content on Solfate
 *
 * note: adding new people requires updating the ContentLayer `BlogPost.author` field
 */
export const SOLFATE_AUTHORS: {
  [key in "nick" | "james"]: Person;
} = {
  nick: {
    name: "Nick Frostbutter",
    img: "/img/nick.jpg",
    twitter: "nickfrosty",
    github: "nickfrosty",
    website: "https://nick.af",
    title: "Host of the Solfate Podcast",
    bio: "Nick is a self taught developer and submariner. He spends his free time \
    writing docs and technical articles, as well as building side projects. \
    He strives to one day make a living online from those projects.",
  },
  james: {
    name: "James P.",
    img: "/img/james.jpg",
    twitter: "jamesrp13",
    github: "jamesrp13",
    // website: "",
    title: "Host of the Solfate Podcast",
    bio: "James is still trying to figure out what to do when he grows up, \
    but he's been making a living for almost a decade by creating software \
    and educating devs through his software agency Unboxed. So much for that Econ degree.",
  },
};
