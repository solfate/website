/**
 * Personal details and metadata for a podcast person
 */
export type PodcastPerson = {
  name: string;
  img?: string;
  twitter?: string;
  github?: string;
  website?: string;
  blurb?: string;
  bio?: string;
};

/**
 * Location where people can find the episodes for the podcast
 */
export type PodcastFeedLocation = {
  label: string;
  href: string;
  icon: string;
};

/**
 * Location where people can rate the podcast
 */
export type PodcastRatingLocation = {
  label: string;
  href: string;
  icon: string;
};
