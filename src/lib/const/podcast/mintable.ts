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
  animationUrl: string;
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
    image: `https://bafkreidhs42ecmvfzr2tn4vwdneblmvgpnk43fud3or72bqplb5i5n5b7i.ipfs.dweb.link/`,
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
    image: `https://bafybeiewqb2oyemqjp2edes5iplrnpymzvfajfptji52tey74bsbs2sehi.ipfs.dweb.link/`,
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
    image: `https://bafkreicp64dqxhib7lixjm3di57qdnfs662qptihsrsohh77fldxh27ycq.ipfs.dweb.link/`,
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
    image: `https://bafkreiaxvzq7rnzk7gl7pkc3ffotpbs7wuecvgnjrghx53himb5wgal6ba.ipfs.dweb.link/`,
    animationUrl: `https://bafybeigvfpy2htco23y72rfhljqkbunz7xllgsxxuxxkzhy5aq2hscod4a.ipfs.dweb.link/`,
    attributes: {
      episode: 45,
      guest: "Rishi",
      project: "Mycelium",
      clip: "intro",
    },
  },
};
