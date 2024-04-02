/**
 * This file contains all the details for a mintable podcast episode
 */

/**
 * Set the default data used as a fallback when minting
 */
export const MINTABLE_DEFAULT = {
  name: "Solfate Podcast",
  symbol: "SolfatePod",
  delegated: true,
  // we hard code the site url base to make sure we never mint a localhost url
  externalUrl: "https://solfate.com/podcast",
  externalUrlRoot: "https://solfate.com",
};

export type MintableEpisode = {
  episode: number;
  name: string;
  description: string;
  image: string;
  animationUrl?: string;
  externalUrl?: string;
  attributes: Record<EpisodeAttributes, string | number | boolean>;
};

type EpisodeAttributes = "episode" | "guest" | "project" | "clip";

/**
 * easily keyed and mintable episodes
 */
export const mintableEpisodes: {
  [key: number]: MintableEpisode;
} = {
  42: {
    episode: 42,
    name: "EP#42 - Siong and Jupiter",
    description:
      "Siong, co-founder of the Jupiter swap aggregator, details how they scaled the " +
      "protocol and thoughts and plans around the Jupiter token and JUP airdrop.",
    image: `https://solfate.com/media/podcast/mintable/ep42.jpg`,
    animationUrl: `https://bafybeienxm3zhackrdkgonm6dnkjc5nsm2tv5ejkz3dtvmxeendfp5qyje.ipfs.dweb.link/`,
    attributes: {
      episode: 42,
      guest: "Siong",
      project: "Jupiter",
      clip: "intro",
    },
  },
  43: {
    episode: 43,
    name: "EP#43 - GJ and FlipsideCrypto",
    description:
      "GJ Flannery, the Head of Community at Flipside Crypto, discusses how " +
      "Flipside provides data the Solana ecosystem as a public good. " +
      "Including how analysts can get paid SOL to create analytics dashboard.",
    image: `https://solfate.com/media/podcast/mintable/ep43.jpg`,
    animationUrl: `https://bafybeiaxweucvkcdigpwht6sigmghm4f2vll6me6v6eslsiee3d2czerzi.ipfs.dweb.link/`,
    attributes: {
      episode: 43,
      guest: "GJ",
      project: "Flipside",
      clip: "intro",
    },
  },
  44: {
    episode: 44,
    name: "EP#44 - Phantom Wallet",
    description:
      "Phantom Wallet's CEO & co-founder, Brandon, and Head of Growth, David, discusses their " +
      "UX driven approach to building the best Solana wallet they can, including maybe " +
      "open sourcing some of the wallet.",
    image: `https://solfate.com/media/podcast/mintable/ep44.jpg`,
    animationUrl: `https://bafybeidik6fxln5gs5tin6gquzzhbql73fqupplzqimdbtsmdl6xorevpm.ipfs.dweb.link/`,
    attributes: {
      episode: 44,
      guest: "Brandon",
      project: "Phantom",
      clip: "intro",
    },
  },
  45: {
    episode: 45,
    name: "EP#45 - Mycelium Networks",
    description:
      "Rishi, founder of Mycelium Networks, joins to talk all about DePIN. Including " +
      "how Mycelium is building a Helium IoT and Mobile testbed in Arkansas.",
    image: `https://solfate.com/media/podcast/mintable/ep45.jpg`,
    animationUrl: `https://bafybeigvfpy2htco23y72rfhljqkbunz7xllgsxxuxxkzhy5aq2hscod4a.ipfs.dweb.link/`,
    attributes: {
      episode: 45,
      guest: "Rishi",
      project: "Mycelium",
      clip: "intro",
    },
  },
  46: {
    episode: 46,
    name: "EP#46 - Elusiv",
    description:
      "Nico, co-founder of Elusiv, joins to talk all about their zero-knowledge " +
      "based privacy protocol on Solana that allows people to private token balances " +
      "while being AML compliant.",
    image: `https://solfate.com/media/podcast/mintable/ep46.jpg`,
    animationUrl: `https://bafybeidfz7e6ai52xonlznilbo5efthov4su2jw6cmgr3qvdhffqd3xlua.ipfs.dweb.link/`,
    attributes: {
      episode: 46,
      guest: "Nico",
      project: "Elusiv",
      clip: "intro",
    },
  },
  47: {
    episode: 47,
    name: "EP#47 - Toly",
    description:
      "An uncommon talk with Toly, the co-founder of Solana Labs and the Solana blockchain. " +
      "A glimpse into his drove him to build Solana, him balancing family/work, " +
      "and stress seeking activity to push the mind and body.",
    image: `https://solfate.com/media/podcast/mintable/ep47.jpg`,
    // animationUrl: `https://todo.ipfs.dweb.link/`,
    attributes: {
      episode: 47,
      guest: "Toly",
      project: "Solana",
      clip: "intro",
    },
  },
  48: {
    episode: 48,
    name: "EP#48 - Matty and Colosseum",
    description:
      "Matty, the co-founder of Colosseum, stops in to talk about all things Solana Hackathons. " +
      "For the past 3 years and until recently, Matty was running the Solana global hackathons. " +
      "Now, he left the foundation to start Colosseum, a dedicated company to running and " +
      "supporting the ecosystem hackathons and an accelerator.",
    image: `https://solfate.com/media/podcast/mintable/ep48.jpg`,
    // animationUrl: `https://todo.ipfs.dweb.link/`,
    attributes: {
      episode: 48,
      guest: "Matty",
      project: "Colosseum",
      clip: "intro",
    },
  },
};
