import { PODCAST_FEED_LOCATIONS } from "@/lib/const/podcast";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

type PodcastFeedLinkButtonsProps = SimpleComponentProps;

export const PodcastFeedLinkButtons = memo(
  ({ className }: PodcastFeedLinkButtonsProps) => (
    <section className="space-y-4">
      <div className={clsx("gap-2 flex items-center", className)}>
        {PODCAST_FEED_LOCATIONS.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            title={item.label}
            className="btn !p-2 border hover:border-gray-400 hover:bg-white opacity-80 hover:opacity-100"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={36}
              height={36}
              className="w-8 h-8"
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
