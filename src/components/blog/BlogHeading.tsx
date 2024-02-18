import Link from "next/link";
import { memo } from "react";

type BlogHeadingProps = {
  title: string;
  href: string;
  description?: string;
};

export const BlogHeading = memo(
  ({ title, description, href }: BlogHeadingProps) => (
    <div className="items-center flex md:text-left">
      <section className={"md:py-4 max-w-lg space-y-2"}>
        <h1 className="text-4xl md:text-4xl font-bold">
          <Link href={href}>{title}</Link>
        </h1>

        {!!description && (
          <p className="text-base md:text-lg text-gray-500">{description}</p>
        )}
      </section>

      {/* <PodcastFeedLinkButtons className="justify-center md:justify-start" /> */}
    </div>
  ),
);
