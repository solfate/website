import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/const/general";

import solfateLogoOrange from "@/../public/logo-orange.svg";
import MarkdownFormatter from "@/components/MarkdownFormatter";
// import { SocialShareButtons } from "@/components/SocialButtons";
import { ArrowLeft } from "react-feather";
import { notFound } from "next/navigation";
import { FormattedDateAgo } from "@/components/core/FormattedDateAgo";
import { allBlogPosts } from "contentlayer/generated";
import { Metadata, ResolvingMetadata } from "next";
import { SOLFATE_AUTHORS } from "@/lib/const/people";
import { AboutTheAuthor } from "@/components/posts/AboutTheAuthor";
import { NewsletterSignupWidget } from "@/components/content/NewsletterSignupWidget";
import { getBlogPost } from "@/lib/queries/getBlogPost";

type PageProps = {
  params: {
    post: string;
  };
  // searchParams?: {}
};

export async function generateStaticParams() {
  return allBlogPosts
    .filter((post) => post.category == "blog")
    .map((item) => ({
      post: item.slug,
    }));
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // locate the current post being requested
  const { post } = getBlogPost({
    slug: params.post,
    withNextPrev: false,
  });
  // do nothing if the post was not found
  if (!post) return {};

  // get the parent images, and add the post specific ones
  let openGraphImages = (await parent).openGraph?.images || [];
  openGraphImages.unshift(`${post.href}/opengraph-image`);

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
    title: `${post.title} - ${SITE.name} Blog`,
    description: post.description,
    openGraph: {
      title: `${SITE.name} - ${post.longTitle ?? post.title}`,
      description: post.description,
      // note: `images` will be auto populated by the `opengraph-image` generator
      images: openGraphImages,
    },
  };
}

export default function Page({ params }: PageProps) {
  // locate the current post being requested
  const { post, next, prev } = getBlogPost({
    slug: params.post,
    withNextPrev: true,
  });
  if (!post) {
    return notFound();
  }

  const author = SOLFATE_AUTHORS[post.author];

  // load the mintable post details
  // const mintableEpisode = mintableEpisodes[parseInt(post.ep)];

  return (
    <main className="page-container max-w-3xl !space-y-6 md:!space-y-8">
      <section className="flex justify-between items-center">
        <ul className="">
          <li>
            <Link
              href={"/blog"}
              className="inline-flex items-center text-gray-500 gap-2 hover:underline text-sm hover:text-black"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </li>
        </ul>

        {/* {!!mintableEpisode && <EpisodeMintButton mintable={mintableEpisode} />} */}
      </section>

      <h1 className="font-bold text-3xl md:text-4xl max-w-5xl">
        <Link href={post.href} className="hover:underline">
          {post.longTitle ?? post.title ?? "[err]"}
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
          {/* <SocialShareButtons href={post.href} message={post.title} /> */}

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
        <MarkdownFormatter source={post.body.raw} />
      </article>

      <NewsletterSignupWidget />

      <AboutTheAuthor author={author} />

      {/* <NextPrevButtons
        className="pt-10"
        next={{
          label: "Next post",
          href: next?.href,
        }}
        prev={{
          label: "Previous post",
          href: prev?.href,
        }}
      /> */}
    </main>
  );
}
