import { podcastEpisodeImage } from "./src/lib/podcast";
import { createStandardSlug } from "./src/lib/helpers";
import { defineDocumentType, makeSource } from "contentlayer/source-files";

/**
 * Podcast episode schema
 */
export const PodcastEpisode = defineDocumentType(() => ({
  name: "PodcastEpisode",
  filePathPattern: `podcast/episodes/**/*.md`,
  fields: {
    title: {
      type: "string",
      description: "The title of the episode",
      required: true,
    },
    longTitle: {
      type: "string",
      description: "The longer title of the episode",
      required: false,
    },
    date: {
      type: "date",
      description: "The public date of the episode",
      required: false,
    },
    draft: {
      type: "boolean",
      description: "Draft status of the episode",
      required: false,
    },
    featured: {
      type: "boolean",
      description: "Whether or not this episode is featured",
      required: false,
    },

    description: {
      type: "string",
      description:
        "Brief description of the episode (also used in the SEO metadata)",
      required: true,
    },
    tags: {
      type: "string",
      // type: "list",
      // of: { type: "string" },
      description: "Comma separated listing of tags",
      required: false,
    },
    image: {
      type: "string",
      description: "Social share image",
    },

    transistorUrl: {
      type: "string",
      description:
        "Brief description of the episode (also used in the SEO metadata)",
      required: true,
    },
    duration: {
      type: "string",
      description: "Duration of the episode",
      required: true,
    },
  },
  computedFields: {
    ep: {
      description: "Episode number (aka the file name)",
      type: "string",
      resolve: (record) => createStandardSlug(record._id),
    },
    draft: {
      description: "Draft status of the episode",
      type: "boolean",
      resolve: (record) =>
        record?.draft ?? record._raw.sourceFileName.startsWith("_"),
    },
    slug: {
      description: "Computed slug of the episode",
      type: "string",
      resolve: (record) => record?.slug ?? createStandardSlug(record._id),
    },
    href: {
      description: "Local url path of the episode",
      type: "string",
      resolve: (record) =>
        `/podcast/${record?.slug ?? createStandardSlug(record._id)}`,
    },
    image: {
      description: "Primary image for the podcast episode",
      type: "string",
      resolve: (record) => podcastEpisodeImage(record.image),
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [PodcastEpisode],
});
