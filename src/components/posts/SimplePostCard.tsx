import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { FormattedDateAgo } from "../core/FormattedDateAgo";

type SimplePostCardProps = {
  title: string;
  href: string;
  imageSrc?: string;
  description?: string;
  imageAlt?: string;
  date?: string;
};

export const SimplePostCard = memo(
  ({
    title,
    href,
    description,
    date,
    imageSrc,
    imageAlt,
  }: SimplePostCardProps) => {
    return (
      <div className="bg-white border hover:shadow-md hover:border-gray-500 cursor-default border-gray-300 rounded-2xl overflow-hidden">
        {!!imageSrc && (
          <Link
            href={href}
            className="block w-full rounded-t-2xl overflow-hidden bg-gray-200 relative h-56"
          >
            <Image
              src={imageSrc}
              layout={"fill"}
              alt={imageAlt ?? title}
              title={imageAlt ?? title}
              className={"object-cover object-center"}
              //   priority={true}
            />
          </Link>
        )}

        <div className="px-4 py-4 grid gap-2">
          <h4 className="font-bold text-xl max-w-5xl line-clamp-2">
            <Link href={href}>{title}</Link>
          </h4>

          <section className="flex items-center gap-4 justify-between">
            <Link
              href={"#username"}
              className="hover:underline text-base flex items-center gap-2"
            >
              <span className="block rounded-full w-7 h-7 overflow-hidden bg-slate-300">
                <Image
                  width={64}
                  height={64}
                  src={"/img/nick.jpg"}
                  alt={"username"}
                  title={"username"}
                  className="object-cover object-center rounded-full overflow-hidden w-7 h-7"
                />
              </span>
              <span className="">Username</span>
            </Link>

            {!!date && <FormattedDateAgo date={date} />}
          </section>

          {!!description && (
            <p className="text-gray-500 fade-bottom h-24 line-clamp-4">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  },
);
