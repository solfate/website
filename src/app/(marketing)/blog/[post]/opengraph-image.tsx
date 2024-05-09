import { notFound } from "next/navigation";
import { PostImage } from "@/lib/images/post-image";
import { allBlogPosts } from "contentlayer/generated";
import { SITE } from "@/lib/const/general";

export const runtime = "nodejs";

export const contentType = "image/png";

export const size = {
  width: 1200,
  height: 630,
};

// Image generation
export default async function Image({ params }: { params: { post: string } }) {
  //
  const post = allBlogPosts.filter((p) => p.slug == params.post)[0];
  if (!post) {
    notFound();
  }

  return await PostImage(size, {
    title: post.title,
    heading: `Solfate Blog`,
    url: `${SITE.domain}/blog`,
    // set the podcast's default cover image
    // avatarImage: `${SITE.url}${PODCAST.image}`,
  });
}
