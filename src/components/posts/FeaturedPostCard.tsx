import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { FormattedDateAgo } from "../core/FormattedDateAgo";

type FeaturedPostCardProps = {
  title: string;
  href: string;
  imageSrc: string;
  imageAlt?: string;
  date?: string;
};

export const FeaturedPostCard = memo(
  ({ title, href, date, imageSrc, imageAlt }: FeaturedPostCardProps) => {
    return (
      <div className="grid gap-4">
        <Link
          href={href}
          className="block max-w-4xl rounded-2xl overflow-hidden bg-gray-200 relative h-64 md:h-96"
        >
          <Image
            src={imageSrc}
            layout={"fill"}
            alt={imageAlt ?? title}
            title={imageAlt ?? title}
            className={"object-cover object-center"}
            priority={true}
          />
        </Link>

        <div className="space-y-2">
          <h4 className="font-bold text-3xl line-clamp-2">
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
        </div>
      </div>
    );
  },
);
