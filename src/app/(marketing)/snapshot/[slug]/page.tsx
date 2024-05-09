import Image from "next/image";
import Link from "next/link";
import { ROUTE_PREFIX_SNAPSHOT, SITE } from "@/lib/const/general";

import solfateLogoOrange from "@/../public/logo-orange.svg";
import { serialize } from "next-mdx-remote/serialize";
import MarkdownFormatter from "@/components/MarkdownFormatter";
import { SocialShareButtons } from "@/components/SocialButtons";
import { ArrowLeft } from "react-feather";
import { notFound, redirect } from "next/navigation";
import { getBlogPost } from "@/lib/queries/getBlogPost";
import { PODCAST } from "@/lib/const/podcast";
import { FormattedDateAgo } from "@/components/core/FormattedDateAgo";
import { NextPrevButtons } from "@/components/posts/NextPrevButtons";
import { Metadata, ResolvingMetadata } from "next";
import { SOLFATE_AUTHORS } from "@/lib/const/people";
import { allBlogPosts } from "contentlayer/generated";
import { NewsletterSignupWidget } from "@/components/content/NewsletterSignupWidget";

type PageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return allBlogPosts
    .filter((post) => post.category == "snapshot")
    .map((item) => ({
      slug: item.slug,
    }));
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { post } = getBlogPost({
    slug: params.slug,
    withNextPrev: false,
  });

  // do nothing if the post was not found
  if (!post) return {};

  // get the parent images, and add the post specific ones
  let openGraphImages = (await parent).openGraph?.images || [];
  // todo: we can add a default formatted image if we want
  // openGraphImages.unshift(
  //   `${ROUTE_PREFIX_SNAPSHOT}/${post.slug}/opengraph-image`,
  // );

  // when an post image is set, always make that the primary image
  if (!!post.image) {
    const url = new URL(post.image, SITE.url);
    // make the url unique to support cache busting
    url.searchParams.set(
      "v",
      Math.floor(new Date().getTime() / 1000).toString(),
    );
    openGraphImages = [url.toString().replace(SITE.url, "")];
  }

  return {
    alternates: {
      canonical: post.href,
    },
    title: `${post.title} - Solfate Snapshot #${post.id}`,
    description: post.description,
    openGraph: {
      title: `Solfate Snapshot #${post.id} - ${post.longTitle || post.title}`,
      description: post.description,
      // note: `images` will be auto populated by the `opengraph-image` generator
      images: openGraphImages,
    },
  };
}

export default async function Page({ params }: PageProps) {
  // locate the current post being requested
  const { post, next, prev } = getBlogPost({
    slug: new RegExp(/^(?:.*)-([\d])+$/i).exec(params.slug)?.[1] || params.slug,
    withNextPrev: true,
  });

  if (!post) {
    return notFound();
  }

  if (post.slug != params.slug.toLowerCase()) {
    return redirect(`${ROUTE_PREFIX_SNAPSHOT}/${post.slug}`);
  }

  const author = SOLFATE_AUTHORS[post.author];

  // serialize the markdown content for parsing via MDX
  const mdxSerialized = await serialize(post.body.raw, {
    // scope: { }
  });

  return (
    <main className="page-container max-w-3xl !space-y-4 md:!space-y-6">
      <section className="flex justify-between items-center">
        <ul className="">
          <li>
            <Link
              href={ROUTE_PREFIX_SNAPSHOT}
              className="inline-flex items-center text-gray-700 gap-2 hover:underline text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Snapshot Newsletter
            </Link>
          </li>
        </ul>

        {/* {!!mintableEpisode && <EpisodeMintButton mintable={mintableEpisode} />} */}
      </section>

      <h1 className="font-bold text-3xl md:text-4xl max-w-5xl">
        <Link href={`${ROUTE_PREFIX_SNAPSHOT}/${post.slug}`} className="">
          {post.longTitle || post.title || "[err]"}
        </Link>
      </h1>

      <section className="flex items-center justify-between gap-4">
        <section className="flex items-center gap-2 md:gap-4">
          <Link
            target={author.twitter ? "_blank" : "_self"}
            href={
              author.twitter ? `https://twitter.com/${author.twitter}` : "/blog"
            }
            className="block rounded-full overflow-hidden w-12 h-12 bg-transparent"
          >
            <Image
              width={64}
              height={64}
              src={author.img || solfateLogoOrange}
              alt={author.name || "Solfate"}
              className="object-cover object-center rounded-full overflow-hidden w-12 h-12"
              priority={true}
            />
          </Link>

          <div className="space-y-0">
            <Link
              target={author.twitter ? "_blank" : "_self"}
              href={
                author.twitter
                  ? `https://twitter.com/${author.twitter}`
                  : "/blog"
              }
              className="hover:underline md:text-lg font-semibold"
            >
              {author.name}
            </Link>

            {!!post.date && <FormattedDateAgo date={post.date} />}
          </div>

          {/* <button className="btn mx-8 border-gray-400">Following</button> */}
        </section>

        <section className="flex items-center gap-3">
          {/* <SocialShareButtons
            href={`${ROUTE_PREFIX_SNAPSHOT}/${post.slug}`}
            message={post.title}
          /> */}

          {/* <button className="btn btn-blue">Mint</button> */}
        </section>
      </section>

      {/* todo: do we want to display a header image? */}
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

      <NewsletterSignupWidget />

      <NextPrevButtons
        className="pt-10"
        next={{
          label: "Next Snapshot",
          href: next?.href,
        }}
        prev={{
          label: "Previous Snapshot",
          href: prev?.href,
        }}
      />
    </main>
  );
}
