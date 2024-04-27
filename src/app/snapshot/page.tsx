import { PageHero } from "@/components/core/PageHero";
import { SimplePostCard } from "@/components/posts/SimplePostCard";
import { ROUTE_PREFIX_SNAPSHOT } from "@/lib/const/general";
import { NewsletterPost, allNewsletterPosts } from "contentlayer/generated";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "react-feather";

export const metadata: Metadata = {
  alternates: {
    canonical: ROUTE_PREFIX_SNAPSHOT,
  },
};

export default function Page() {
  // get the listing of posts, sorted by their post id
  const posts = allNewsletterPosts
    .sort((a, b) => parseFloat(b.id) - parseFloat(a.id))
    .slice(0); // prevent mutating the original

  // extract the most recent episode
  // trust me: this will always have a value unless contentlayer fails
  const mostRecent = posts.shift() as NewsletterPost;

  return (
    <main className="page-container">
      <PageHero
        title={"Solfate Snapshot"}
        description={
          "where we'll be diving into some of the biggest updates from Solana ecosystem teams and builders from the last week! Last week we saw many new product launches, NFT standards, and protocol features entering the space."
        }
        href={ROUTE_PREFIX_SNAPSHOT}
      >
        <SimplePostCard
          href={mostRecent.href}
          title={mostRecent.title}
          imageSrc={mostRecent.image}
          description={mostRecent.description}
        />
      </PageHero>

      {/* todo: signup form */}

      <section className="space-y-8">
        <section className="flex items-center justify-between">
          <h2 className="font-semibold text-2xl">Recent Newsletter Editions</h2>
          <Link
            href={`${ROUTE_PREFIX_SNAPSHOT}/browse/1`}
            className="btn btn-ghost inline-flex items-center gap-2"
          >
            View More
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </Link>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, key) => (
            <SimplePostCard
              key={key}
              href={post.href}
              date={post.date}
              title={post.title}
              imageSrc={post.image}
              description={post.description}
            />
          ))}
        </section>
      </section>
    </main>
  );
}
