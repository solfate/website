import { BlogPost, allBlogPosts } from "contentlayer/generated";

type GetNewsletterPostProps = {
  /** the episode id (aka episode number) */
  slug: BlogPost["slug"];
  /** whether or not to include the `next` and `prev` episodes in the response */
  withNextPrev?: boolean;
};

export const getBlogPost = ({
  slug,
  withNextPrev = false,
}: GetNewsletterPostProps) => {
  let [post, next, prev]: Array<BlogPost | null> = [null, null, null];

  // get the current post being requested
  // (sorted from latest to oldest)
  const posts = allBlogPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // locate the desired post, and the next/prev associated
  for (let i = 0; i < posts.length; i++) {
    // ignore all except the current `slug`
    if (posts[i].slug != slug && posts[i].id != slug) continue;

    post = posts[i];

    // do not allow next post to have id lower than 1
    if (withNextPrev && i > 0) next = posts[i - 1];

    // do not exceed the number of posts
    if (withNextPrev && i < posts.length - 1 && i + 1 != posts.length)
      prev = posts[i + 1];
  }

  return { post, next, prev };
};
