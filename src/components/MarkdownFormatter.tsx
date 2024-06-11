import { SITE } from "@/lib/const/general";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import Link from "next/link";

/**
 * Define the custom components used to render the markdown
 */
const components: MDXRemoteProps["components"] = {
  // todo: add code highlighting
  //   code: (props) => <code></code>,
  // todo: handle relative links? including making them part of the authors list?
  a: ({ ref, children, href, ...props }) => {
    href = (href!.toString() as string)
      .replace(/^(https?:\/\/)?solfate.com\//gi, "/")
      .replace(/^\/?(content|public)\//i, "/");

    if (href.startsWith("/") || href.startsWith(".")) {
      return (
        <Link {...props} href={href?.replace(/(.mdx?)$/i, "") || "#"}>
          {children}
        </Link>
      );
    }

    const url = new URL(href);
    url.searchParams.set("utm_source", SITE.name.toLowerCase());

    return (
      <a {...props} target="_blank" href={url.toString()}>
        {children}
      </a>
    );
  },
  img: ({ ref, src = "", ...props }) => (
    <img
      {...props}
      src={src
        .replace(/^(https?:\/\/)?solfate.com\//gi, "/")
        .replace(/^\/?(content|public)\//i, "/")}
    />
  ),
};

export default function MarkdownFormatter(props: MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      options={{
        mdxOptions: {
          development: process.env.NODE_ENV === "development",
        },
      }}
      components={components}
    />
  );
}
