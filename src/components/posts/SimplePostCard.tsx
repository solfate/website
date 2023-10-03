import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { FormattedDateAgo } from "@/components/core/FormattedDateAgo";
import styles from "@/styles/SimplePostCard.module.css";

type SimplePostCardProps = {
  title: string;
  href: string;
  imageSrc?: string;
  description?: string;
  imageAlt?: string;
  date?: string;
  username: string;
  avatarImage?: string;
};

export const SimplePostCard = memo(
  ({
    title,
    href,
    description,
    date,
    imageSrc,
    imageAlt,
    username,
    avatarImage,
  }: SimplePostCardProps) => {
    return (
      <div className={styles.card}>
        {!!imageSrc && (
          <Link href={href} className={styles.image}>
            <Image
              src={imageSrc}
              layout={"fill"}
              alt={imageAlt ?? title}
              title={imageAlt ?? title}
              //   priority={true}
            />
          </Link>
        )}

        <div className={styles.details}>
          <h4 className={styles.title}>
            <Link href={href}>{title}</Link>
          </h4>

          <section className={styles.meta}>
            <Link
              href={`/profile/${username}`}
              className={styles.userContainer}
            >
              {!!avatarImage && (
                <span className={styles.avatar}>
                  <Image
                    width={64}
                    height={64}
                    src={avatarImage}
                    alt={username}
                    title={username}
                  />
                </span>
              )}
              <span className={""}>{username}</span>
            </Link>

            {!!date && <FormattedDateAgo date={date} />}
          </section>

          {!!description && (
            <p className={`${styles.description} fade-bottom`}>{description}</p>
          )}
        </div>
      </div>
    );
  },
);
