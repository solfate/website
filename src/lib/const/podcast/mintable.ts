/**
 * This file contains all the details for a mintable podcast episode
 */

/**
 * Used to control when the "mint episode" button will be displayed in the UI
 */
export const OLDEST_MINTABLE_EPISODE = 42;

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

type MintableEpisode = {
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
    image: `https://bafybeibtlkonvjiobghnslvum3o7p3wlphg6h5msztpkfpf252h4pbkura.ipfs.dweb.link/`,
    animationUrl: `https://bafybeienxm3zhackrdkgonm6dnkjc5nsm2tv5ejkz3dtvmxeendfp5qyje.ipfs.dweb.link/`,
    attributes: {
      episode: 42,
      guest: "Siong",
      project: "Jupiter",
      clip: "intro",
    },
  },
  // 43: {
  //   episode: 43,
  //   name: "EP#43 - GJ and FlipsideCrypto",
  //   description:
  //     "GJ Flannery, the Head of Community at Flipside Crypto, discusses how " +
  //     "Flipside provides data the Solana ecosystem as a public good. " +
  //     "Including how analysts can get paid SOL to create analytics dashboard.",
  //   image: `https://.ipfs.dweb.link/`,
  //   animationUrl: `https://bafybeiaxweucvkcdigpwht6sigmghm4f2vll6me6v6eslsiee3d2czerzi.ipfs.dweb.link/`,
  //   attributes: {
  //     episode: 43,
  //     guest: "GJ",
  //     project: "Flipside",
  //     clip: "intro",
  //   },
  // },
};
