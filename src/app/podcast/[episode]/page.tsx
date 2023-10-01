import Image from "next/image";
import Link from "next/link";

import { serialize } from "next-mdx-remote/serialize";
import MarkdownFormatter from "@/components/MarkdownFormatter";
import { SocialShareButtons } from "@/components/SocialButtons";
import { ArrowLeft } from "react-feather";
import { notFound } from "next/navigation";
import { usePodcastEpisode } from "@/hooks/usePodcastEpisode";
import { PODCAST } from "@/lib/const/podcast";

type PageProps = {
  params: {
    episode: string;
  };
};

export default async function Page({ params }: PageProps) {
  // locate the current episode
  const { episode } = usePodcastEpisode({ slug: params.episode });
  if (!episode) {
    notFound();
  }

  // serialize the markdown content for parsing via MDX
  const mdxSerialized = await serialize(episode.body.raw, {
    // scope: { }
  });

  return (
    <main className="page-container max-w-3xl !space-y-6">
      <section className="">
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

        {/* breadcrumbs? */}
      </section>

      <h1 className="font-bold text-5xl max-w-5xl">
        {episode.title ?? "[err]"}
      </h1>

      <section className="flex items-center justify-between gap-4">
        <section className="flex items-center gap-4">
          <Link
            href={"/podcast"}
            className="block rounded-full overflow-hidden w-12 h-12 bg-slate-300"
          >
            <Image
              width={64}
              height={64}
              src={"/img/cover0.jpg"}
              alt={PODCAST.name}
              className="object-cover object-center rounded-full overflow-hidden w-12 h-12"
              priority={true}
            />
          </Link>

          <div className="space-y-0">
            <Link
              href={"/podcast"}
              className="hover:underline text-lg font-semibold"
            >
              {PODCAST.name}
            </Link>

            {!!episode.date && (
              <p className="text-sm text-gray-400">
                {new Date(episode.date).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* <button className="btn mx-8 border-gray-400">Following</button> */}
        </section>

        <section className="flex items-center gap-3">
          <SocialShareButtons />

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

      <article className="prose max-w-full !text-lg">
        <MarkdownFormatter source={mdxSerialized} />
      </article>

      {/* <AboutTheAuthor /> */}
    </main>
  );
}
