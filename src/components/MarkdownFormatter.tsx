"use client";
import * as mdx from "@mdx-js/react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";

/** note: this is extracted from the `MDXRemote` component */
type MDXComponentProps = React.ComponentProps<
  typeof mdx.MDXProvider
>["components"];

type MarkdownFormatterProps = {
  source: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  >;
};

/**
 * Define the custom components used to render the markdown
 */
const components: MDXComponentProps = {
  // todo: add code highlighting
  //   code: (props) => <code></code>,
  // todo: handle relative links? including making them part of the authors list?
  a: ({ ref, children, href, ...props }) => (
    <Link {...props} href={href || "#"} target="_blank">
      {children}
    </Link>
  ),
};

export default function MarkdownFormatter({ source }: MarkdownFormatterProps) {
  return <MDXRemote {...source} components={components} />;
}
