import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/const/general";

import { serialize } from "next-mdx-remote/serialize";
import MarkdownFormatter from "@/components/MarkdownFormatter";
import { SocialShareButtons } from "@/components/SocialButtons";
import { ArrowLeft } from "react-feather";
import { notFound } from "next/navigation";
import { getPodcastEpisode } from "@/lib/queries/getPodcastEpisode";
import { PODCAST } from "@/lib/const/podcast";
import { FormattedDateAgo } from "@/components/core/FormattedDateAgo";
import { PodcastDisclaimer } from "@/components/podcast/PodcastDisclaimer";
import { allPodcastEpisodes } from "contentlayer/generated";
import { NextPrevButtons } from "@/components/posts/NextPrevButtons";
import { Metadata, ResolvingMetadata } from "next";
import { PodcastRatingButtons } from "@/components/podcast/PodcastRatingButtons";
import { EpisodeMintButton } from "@/components/podcast/EpisodeMintButton";
import { mintableEpisodes } from "@/lib/const/podcast/mintable";

type PageProps = {
  params: {
    episode: string;
  };
  // searchParams?: {}
};

export async function generateStaticParams() {
  return allPodcastEpisodes.map((item) => ({
    episode: item.slug,
  }));
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // locate the single record
  // locate the current episode being requested
  const { episode } = getPodcastEpisode({
    epId: params.episode,
    withNextPrev: false,
  });

  // do nothing if the episode was not found
  if (!episode) return {};

  // get the parent images, and add the episode specific ones
  let openGraphImages = (await parent).openGraph?.images || [];
  openGraphImages.unshift(`/podcast/${episode.ep}/opengraph-image`);

  // when an episode image is set, always make that the primary image
  if (!!episode.image) {
    const url = new URL(episode.image, SITE.url);
    // make the url unique to support cache busting
    url.searchParams.set(
      "v",
      Math.floor(new Date().getTime() / 1000).toString(),
    );
    openGraphImages = [url.toString().replace(SITE.url, "")];
  }

  return {
    alternates: {
      canonical: episode.href,
    },
    title: `${episode.title} - ${PODCAST.name} #${episode.ep}`,
    description: episode.description,
    openGraph: {
      title: `${PODCAST.name} #${episode.ep} - ${
        episode.longTitle ?? episode.title
      }`,
      description: episode.description,
      // note: `images` will be auto populated by the `opengraph-image` generator
      images: openGraphImages,
    },
  };
}

export default async function Page({ params }: PageProps) {
  // locate the current episode being requested
  const { episode, next, prev } = getPodcastEpisode({
    epId: params.episode,
    withNextPrev: true,
  });
  if (!episode) {
    notFound();
  }

  // load the mintable episode details
  const mintableEpisode = mintableEpisodes[parseInt(episode.ep)];

  // serialize the markdown content for parsing via MDX
  const mdxSerialized = await serialize(episode.body.raw, {
    // scope: { }
  });

  return (
    <main className="page-container max-w-3xl !space-y-4 md:!space-y-6">
      <section className="flex justify-between items-center">
        <ul className="">
          <li>
            <Link
              href={"/podcast"}
              className="inline-flex items-center text-gray-700 gap-2 hover:underline text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Podcast Episodes
            </Link>
          </li>
        </ul>

        {!!mintableEpisode && <EpisodeMintButton mintable={mintableEpisode} />}
      </section>

      <h1 className="font-bold text-3xl md:text-4xl max-w-5xl">
        <Link href={`/podcast/${episode.ep}`} className="">
          {episode.longTitle ?? episode.title ?? "[err]"}
        </Link>
      </h1>

      <section className="flex items-center justify-between gap-4">
        <section className="flex items-center gap-2 md:gap-4">
          <Link
            href={"/podcast"}
            className="block rounded-full overflow-hidden w-12 h-12 bg-slate-300"
          >
            <Image
              width={64}
              height={64}
              src={PODCAST.image}
              alt={PODCAST.name}
              className="object-cover object-center rounded-full overflow-hidden w-12 h-12"
              priority={true}
            />
          </Link>

          <div className="space-y-0">
            <Link
              href={"/podcast"}
              className="hover:underline md:text-lg font-semibold"
            >
              {PODCAST.name}
            </Link>

            {!!episode.date && <FormattedDateAgo date={episode.date} />}
          </div>

          {/* <button className="btn mx-8 border-gray-400">Following</button> */}
        </section>

        <section className="flex items-center gap-3">
          <SocialShareButtons
            href={`/podcast/${episode.ep}`}
            message={episode.title}
          />

          {/* <button className="btn btn-blue">Mint</button> */}
        </section>
      </section>

      {/* <div className="prose-cover-image rounded-2xl overflow-hidden border border-gray-400 bg-slate-100 child-past-parent h-96 max-h-96">
        <Image
          src={"/img/sample.jpg"}
          // fill={true}
          // width={900}
          layout="fill"
          alt={"cover"}
          className="object-cover object-center"
          priority={true}
        />
      </div> */}

      {!!episode?.transistorUrl && (
        <iframe
          width="100%"
          height="180"
          frameBorder="no"
          scrolling="no"
          seamless
          src={episode.transistorUrl}
          className="border-0"
        ></iframe>
      )}

      <article className="prose max-w-full !text-lg">
        <MarkdownFormatter source={mdxSerialized} />
      </article>

      <PodcastDisclaimer />

      <PodcastRatingButtons />

      {/* <AboutTheAuthor /> */}

      <NextPrevButtons
        className="pt-10"
        next={{
          label: "Next Episode",
          href: next?.href,
        }}
        prev={{
          label: "Previous Episode",
          href: prev?.href,
        }}
      />
    </main>
  );
}
