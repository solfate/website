import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { FormattedDateAgo } from "@/components/core/FormattedDateAgo";
import styles from "@/styles/SimplePostCard.module.css";
import { Clock } from "react-feather";
import { PodcastEpisode } from "contentlayer/generated";

type SimpleEpisodeCardProps = {
  title: PodcastEpisode["title"];
  href: PodcastEpisode["href"];
  imageSrc?: PodcastEpisode["image"];
  description?: PodcastEpisode["description"];
  imageAlt?: string;
  date?: PodcastEpisode["date"];
  duration?: PodcastEpisode["duration"];
  priority?: boolean
};

export const SimpleEpisodeCard = memo(
  ({
    title,
    href,
    description,
    date,
    imageSrc,
    imageAlt,
    duration,
    priority
  }: SimpleEpisodeCardProps) => {
    return (
      <div className={styles.card}>
        {!!imageSrc && (
          <Link href={href} className={styles.image}>
            <Image
              src={imageSrc}
              layout={"fill"}
              alt={imageAlt ?? title}
              title={imageAlt ?? title}
                priority={priority}
            />
          </Link>
        )}

        <div className={styles.details}>
          <h4 className={styles.title}>
            <Link href={href}>{title}</Link>
          </h4>

          <section className={styles.meta}>
            {!!duration && (
              <p className={styles.minor}>
                <Clock strokeWidth={1.1} />
                {duration}
              </p>
            )}

            {!!date && (
              <FormattedDateAgo date={date} className={styles.minor} />
            )}
          </section>

          {!!description && (
            <p className={`${styles.description} fade-bottom`}>{description}</p>
          )}
        </div>
      </div>
    );
  },
);
