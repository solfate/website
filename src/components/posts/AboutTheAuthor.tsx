import Image from "next/image";
import Link from "next/link";
import { SocialShareButtons } from "@/components/SocialButtons";

export function AboutTheAuthor() {
  return (
    <section className=" items-center justify-between border border-gray-400 rounded-2xl p-8 flex items-top gap-6 w-full">
      <Link
        href={"#username"}
        className="flex-shrink-0 block rounded-full overflow-hidden w-32 h-32 bg-slate-300"
      >
        <Image
          width={128}
          height={128}
          src={"/img/nick.jpg"}
          alt={"username"}
          className="object-cover object-center rounded-full overflow-hidden w-32 h-32"
          priority={true}
        />
      </Link>

      <div className="space-y-1 flex-grow">
        <div className="flex items-center justify-between">
          <Link
            href={"#username"}
            className="hover:underline text-2xl font-semibold"
          >
            Username
          </Link>
          <button className="btn btn-blue">Follow</button>
        </div>

        <p className="text-base line-clamp-2">
          Proin consectetur sem non porta accumsan. Proin diam risus,
          pellentesque et feugiat non, fringilla ac arcu. Donec viverra
          imperdiet metus, in ullamcorper dui pharetra nec. Nam feugiat
        </p>

        <div className="pt-3 flex items-center gap-2">
          <SocialShareButtons />
        </div>
      </div>
    </section>
  );
}
