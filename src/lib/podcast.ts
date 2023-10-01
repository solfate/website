/**
 * Collection of helper functions for use with the podcast
 */

import { randomNumberInRange } from "./helpers";

/**
 * Compute a podcast episode's primary image
 *
 * todo: support absolute urls and external urls
 */
export function podcastEpisodeImage(fileName: string | undefined = undefined) {
  return fileName
    ? `/media/podcast/episodes/${fileName}`
    : `/media/podcast/cover${randomNumberInRange(0, 4)}.jpg`;
}
