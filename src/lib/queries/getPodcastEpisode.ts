import { PodcastEpisode, allPodcastEpisodes } from "contentlayer/generated";

type GetPodcastEpisodeProps = {
  slug: string;
};

export const getPodcastEpisode = ({ slug }: GetPodcastEpisodeProps) => {
  // define episode placeholders
  let [episode, next, prev]: Array<PodcastEpisode | null> = [null, null, null];

  // get the current episode being viewed
  const episodes = allPodcastEpisodes.sort(
    (a, b) => parseFloat(b.slug) - parseFloat(a.slug),
  );

  // locate the desired episode, and the next/prev associated
  for (let i = 0; i < episodes.length; i++) {
    // ignore all except the current `slug`
    if (episodes[i].slug != slug) continue;

    episode = episodes[i];

    // do not allow prev episode to have slug lower than 1
    if (i > 0) next = episodes[i - 1];

    // do not exceed the number of episodes
    if (i < episodes.length - 1) prev = episodes[i + 1];
  }

  return { episode, next, prev };
};
