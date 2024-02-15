import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { FormattedDateAgo } from "@/components/core/FormattedDateAgo";
import styles from "@/styles/SimplePostCard.module.css";
import { BlogPost } from "contentlayer/generated";
import { Person } from "@/types";

type SimpleBlogPostCardProps = {
  title: BlogPost["title"];
  href: BlogPost["href"];
  imageSrc?: BlogPost["image"];
  description?: BlogPost["description"];
  imageAlt?: string;
  date?: BlogPost["date"];
  priority?: boolean;
  author?: Person;
};

export const SimpleBlogPostCard = memo(
  ({
    title,
    href,
    description,
    date,
    imageSrc,
    imageAlt,
    priority,
    author,
  }: SimpleBlogPostCardProps) => {
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
            {!!author && (
              <p className={styles.minor}>
                <Image
                  src={author.img}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                {author.name}
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
