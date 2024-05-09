import { Metadata } from "next";
import Link from "next/link";
import { ROUTE_PREFIX_SNAPSHOT } from "@/lib/const/general";
import { allBlogPosts } from "contentlayer/generated";
import { SimplePostCard } from "@/components/posts/SimplePostCard";
import { computePagination } from "@/lib/helpers";
import { ArrowLeft, ArrowRight } from "react-feather";

// define the number of episodes per page
const BROWSE_TAKE_PER_PAGE = 9;

type PageProps = {
  params: {
    /** current page being viewed */
    page: string | undefined;
  };
  searchParams: {
    /** number of results per page */
    take: string | undefined;
  };
};

export async function generateStaticParams() {
  const pagination = computePagination({
    take: BROWSE_TAKE_PER_PAGE,
    totalItems: allBlogPosts.filter((post) => post.category == "snapshot")
      .length,
  });

  return new Array(pagination.totalPages).fill("").map((_item, count) => ({
    page: (count + 1).toString(),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: `Solfate Snapshot - Browse newsletter editions`,
    alternates: {
      canonical: `${ROUTE_PREFIX_SNAPSHOT}/browse/${params.page}`,
    },
  };
}

export default function Page({
  params: { page = "1" },
}: // searchParams: { take = "9" },
PageProps) {
  let posts = allBlogPosts
    .filter((post) => post.category == "snapshot")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const pagination = computePagination({
    page,
    take: BROWSE_TAKE_PER_PAGE,
    totalItems: posts.length,
  });

  posts = posts.slice(
    pagination.startIndex,
    pagination.startIndex + pagination.take,
  );

  return (
    <main className="page-container py-10">
      <section className="space-y-8">
        <section className="flex items-center justify-between">
          <h1 className="font-semibold text-4xl">Browse Snapshot Editions</h1>
          {/* <Link
            href={`${ROUTE_PREFIX_SNAPSHOT}/browse`}
            className="btn inline-flex items-center gap-2"
          >
            View More
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </Link> */}
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

        <section className=" flex items-center justify-center gap-3">
          {pagination.page > 1 && (
            <Link
              href={`${ROUTE_PREFIX_SNAPSHOT}/browse/${pagination.prev}`}
              className="btn btn-ghost"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              Prev
            </Link>
          )}

          {pagination.page < pagination.totalPages && (
            <Link
              href={`${ROUTE_PREFIX_SNAPSHOT}/browse/${pagination.next}`}
              className="btn btn-ghost"
            >
              Next
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </Link>
          )}
        </section>
      </section>
    </main>
  );
}
