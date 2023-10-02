import { PODCAST_FEED_LOCATIONS } from "@/lib/const/podcast";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

type PodcastFeedLinkButtonsProps = SimpleComponentProps;

export const PodcastFeedLinkButtons = memo(
  ({ className }: PodcastFeedLinkButtonsProps) => (
    <section className="space-y-3">
      <div className={clsx("gap-4 flex items-center", className)}>
        {PODCAST_FEED_LOCATIONS.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            title={item.label}
            className="inline-flex"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={36}
              height={36}
              className="w-9 h-9"
            />
          </Link>
        ))}
      </div>

      <p className="text-gray-500 text-sm">
        or search <span className="italic">&quot;Solana Solfate&quot;</span>{" "}
        <br />
        where ever you get your podcasts
      </p>
    </section>
  ),
);
