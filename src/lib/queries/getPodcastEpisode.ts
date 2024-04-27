import { PodcastEpisode, allPodcastEpisodes } from "contentlayer/generated";

type GetPodcastEpisodeProps = {
  /** the episode id (aka episode number) */
  epId: PodcastEpisode["ep"];
  /** whether or not to include the `next` and `prev` episodes in the response */
  withNextPrev?: boolean;
};

export const getPodcastEpisode = ({
  epId,
  withNextPrev = false,
}: GetPodcastEpisodeProps) => {
  // define episode placeholders
  let [episode, next, prev]: Array<PodcastEpisode | null> = [null, null, null];

  // track the status of attempting to view the upcoming episode
  let isUpcoming = false;

  // get the current episode being viewed
  // (sorted from latest to oldest)
  const episodes = allPodcastEpisodes.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // detect when requesting the next "to-be-published" episode
  if (parseInt(epId) == parseInt(episodes[0].ep) + 1) {
    isUpcoming = true;
    // set the previous episode to be the latest
    if (withNextPrev) prev = episodes[0];
  } else {
    // locate the desired episode, and the next/prev associated
    for (let i = 0; i < episodes.length; i++) {
      // ignore all except the current `slug`
      if (episodes[i].ep != epId) continue;

      episode = episodes[i];

      // do not allow prev episode to have slug lower than 1
      if (withNextPrev && i > 0) next = episodes[i - 1];

      // do not exceed the number of episodes
      if (withNextPrev && i < episodes.length - 1) prev = episodes[i + 1];
    }
  }

  return { episode, next, prev, isUpcoming };
};
