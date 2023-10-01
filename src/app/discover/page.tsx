"use client";

import { SimpleHeroHeader } from "@/components/core/SimpleHeroHeader";
import { FeaturedPostCard } from "@/components/posts/FeaturedPostCard";
import { SimpleAuthorCard } from "@/components/posts/SimpleAuthorCard";
import { SimplePostCard } from "@/components/posts/SimplePostCard";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="page-container">
      <SimpleHeroHeader
        title="Discover"
        description="Discover the latest content from around the Solana ecosystem."
      />

      <section className="grid md:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-y-8">
        <div className="col-span-2">
          <FeaturedPostCard
            title={"Featured post title here"}
            href={"/post"}
            date={"Oct 20, 2023"}
            imageSrc={"/img/sample2.jpg"}
          />
        </div>

        <div className=" gap-2">
          <SimplePostCard
            href={"/post"}
            date={"Oct 20, 2023"}
            title={"Secondary featured post"}
            imageSrc={"/img/sample4.jpg"}
            description={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a libero euismod, volutpat ipsum in, suscipit eros. Vivamus id porta augue. Maecenas fringilla"
            }
          />

          {/* <div>cycle through featured posts, with animation</div> */}
        </div>
      </section>
      <section className="space-y-8">
        <section className="flex items-center justify-between">
          <h2 className="font-semibold text-2xl">Discover Authors</h2>
          <Link href={"#"} className="underline">
            View more
          </Link>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SimpleAuthorCard />
          <SimpleAuthorCard />
          <SimpleAuthorCard />
          <SimpleAuthorCard />
        </section>
      </section>

      {/* <div className="rounded-2xl bg-red-400 p-4">hi</div> */}

      <section className="space-y-8">
        <section className="flex items-center justify-between">
          <h2 className="font-semibold text-2xl">Trending posts</h2>
          <Link href={"#"} className="underline">
            View more
          </Link>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SimplePostCard
            href={"/post"}
            date={"Oct 20, 2023"}
            title={"Another random post here"}
            imageSrc={"/img/sample.jpg"}
            description={
              "Curabitur a libero euismod, volutpat ipsum in, suscipit eros. Vivamus id porta augue. Maecenas fringilla"
            }
          />
          <SimplePostCard
            href={"/post"}
            date={"September 27, 2023"}
            title={
              "Different title lengths could result in different appearances for the post title"
            }
            imageSrc={"/img/sample2.jpg"}
            description={
              "Consectetur adipiscing elit. Curabitur a libero euismod, volutpat ipsum in, suscipit eros. Vivamus id porta augue. Maecenas fringilla"
            }
          />
          <SimplePostCard
            href={"/post"}
            date={"20 september 2023"}
            title={"Winning!"}
            imageSrc={"/img/sample3.jpg"}
            description={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a libero euismod, volutpat ipsum in, suscipit eros. Vivamus id porta augue. Maecenas fringilla"
            }
          />
        </section>
      </section>
    </main>
  );
}
