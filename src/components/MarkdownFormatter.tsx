import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import Link from "next/link";

/**
 * Define the custom components used to render the markdown
 */
const components: MDXRemoteProps["components"] = {
  // todo: add code highlighting
  //   code: (props) => <code></code>,
  // todo: handle relative links? including making them part of the authors list?
  a: ({ ref, children, href, ...props }) => (
    <Link
      {...props}
      href={
        href?.replace(/^\/(content|public)\//i, "/").replace(/(.mdx?)$/i, "") ||
        "#"
      }
      target={href!.startsWith("http") ? "_blank" : "_self"}
    >
      {children}
    </Link>
  ),
  img: ({ ref, children, alt, src, ...props }) => (
    <img
      {...props}
      alt={alt || ""}
      src={src?.replace(/^\/(content|public)\//i, "/")}
    >
      {children}
    </img>
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
