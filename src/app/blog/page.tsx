import { BlogHeading } from "@/components/blog/BlogHeading";
import { SimpleBlogPostCard } from "@/components/blog/SimpleBlogPostCard";
import { SOLFATE_AUTHORS } from "@/lib/const/people";
import { allBlogPosts } from "contentlayer/generated";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/blog",
  },
};

export default function Page() {
  // get the listing of episodes, sorted by their episode date
  const posts = allBlogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0); // prevents mutation of the original data

  // extract the most recent episode
  // trust me: this will always have a value unless contentlayer fails
  // const mostRecent = posts.shift() as BlogPost;

  return (
    <main className="page-container">
      <section className="flex items-center justify-between">
        <BlogHeading
          title="All posts"
          href="/blog"
          description="Welcome the the Solfate blog. We write about blockchain things, mostly in the Solana ecosystem."
        />

        {/* <div className="">search</div> */}
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, key) => (
          <SimpleBlogPostCard
            key={key}
            href={post.href}
            date={post.date}
            title={post.title}
            imageSrc={post.image}
            description={post.description}
            author={SOLFATE_AUTHORS[post.author]}
          />
        ))}
      </section>
    </main>
  );
}
