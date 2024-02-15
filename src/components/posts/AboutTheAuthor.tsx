import type { Person } from "@/types";
import Image from "next/image";
import Link from "next/link";
import solfateLogoOrange from "@/../public/logo-orange.svg";
import { SocialLinksForPerson } from "@/components/SocialLinksForPerson";

type AboutTheAuthorProps = {
  author: Person;
};

export const AboutTheAuthor = ({ author }: AboutTheAuthorProps) => {
  return (
    <section className="border border-gray-2 rounded-2xl p-6 md:p-8 md:flex items-top gap-6 w-full">
      <div className="flex flex-col justify-center items-center gap-3">
        <Link
          href={`https://twitter.com/${author.twitter}`}
          target={"_blank"}
          className="flex-shrink-0 mx-auto block rounded-full overflow-hidden w-32 h-32 md:w-32 md:h-32 bg-slate-300"
        >
          <Image
            width={128}
            height={128}
            src={author.img || solfateLogoOrange}
            alt={author.name || ""}
            className="object-cover object-center rounded-full overflow-hidden"
            priority={false}
          />
        </Link>

        <div className="pt-3 flex items-center gap-2">
          <SocialLinksForPerson person={author} />
        </div>

        <div className="block md:hidden space-y-0">
          <Link
            href={`https://twitter.com/${author.twitter}`}
            target={"_blank"}
            className="hover:underline text-2xl font-semibold line-clamp-1"
          >
            {author.name}
          </Link>

          {!!author.title && (
            <p className="text-sm text-gray-400 line-clamp-1">{author.title}</p>
          )}
        </div>
      </div>

      <div className="space-y-2 flex-grow">
        <div className="space-y-0 hidden md:block">
          <Link
            href={`https://twitter.com/${author.twitter}`}
            target={"_blank"}
            className="hover:underline text-2xl font-semibold line-clamp-1"
          >
            {author.name}
          </Link>

          {!!author.title && (
            <p className="text-sm text-gray-400 line-clamp-1">{author.title}</p>
          )}
        </div>

        {!!author.bio && <p className="text-base">{author.bio}</p>}
      </div>
    </section>
  );
};
