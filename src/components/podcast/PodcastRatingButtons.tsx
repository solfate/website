import { PODCAST_RATING_LOCATIONS } from "@/lib/const/podcast";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

export const PodcastRatingButtons = memo(() => (
  <section className="space-y-3">
    <h2 className="text-2xl font-bold">Did you enjoy this episode?</h2>

    <p>
      If you enjoyed this episode, please consider leaving a rating or review
      where ever you get your podcasts!
    </p>

    <div
      className={clsx(
        "gap-2 grid grid-cols-2 items-center justify-between",
        "",
      )}
    >
      {PODCAST_RATING_LOCATIONS.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          title={`Rate on ${item.label}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost inline-flex items-center gap-2 text-center justify-center"
        >
          <Image
            src={item.icon}
            alt={item.label}
            width={36}
            height={36}
            className="w-6 h-6"
          />
          Rate on {item.label}
        </Link>
      ))}
    </div>
  </section>
));
