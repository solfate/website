/**
 * Wallet shortcuts for the Solfate Podcast NFT collection
 */

import { SITE } from "@/lib/const/general";
import { PODCAST_TWITTER, PODCAST_YOUTUBE } from "@/lib/const/podcast";
import { WalletShortcutSchema } from "@/types/shortcuts";
import { allPodcastEpisodes } from "contentlayer/generated";

const podcastUrl = new URL(`https://${SITE.domain}/podcast`);

export const GET = () => {
  const latestEpisode = allPodcastEpisodes.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];

  return Response.json({
    version: 1,
    shortcuts: [
      {
        icon: "view",
        label: "Listen to latest episode",
        uri: `${podcastUrl.toString()}/${latestEpisode.ep}`,
        // keeping this internal will allow people to mint the
        // episodes via their wallet's browser on mobile
        prefersExternalTarget: false,
      },
      // {
      //   icon: "view",
      //   label: "Watch latest episodes",
      //   uri: podcastUrl.toString(), // todo: get a youtube link for each episode
      //   prefersExternalTarget: true,
      // },
      {
        icon: "view",
        label: "Explore podcast episodes",
        uri: `${podcastUrl.toString()}/browse/1`,
        prefersExternalTarget: false,
      },
      {
        icon: "view", // hopefully we can get a `youtube` icon
        label: `Subscribe on YouTube`,
        uri: PODCAST_YOUTUBE.url,
        prefersExternalTarget: true,
      },
      {
        icon: "twitter",
        label: `Follow ${PODCAST_TWITTER.handle} on Twitter`,
        uri: PODCAST_TWITTER.url,
        prefersExternalTarget: true,
      },
    ],
  } as WalletShortcutSchema);
};
