import Image from "next/image";
import Link from "next/link";

import { serialize } from "next-mdx-remote/serialize";
import MarkdownFormatter from "@/components/MarkdownFormatter";
import { SocialShareButtons } from "@/components/SocialButtons";
import { ArrowLeft } from "react-feather";

type PostFrontmatter = {
  /** title of the post */
  title: string;
  /**  */
  featured?: boolean;
  /**  */
  date?: string;
  /**  */
  description?: string;
  /**  */
  keywords?: string;
  /**  */
  image?: string;
  /**  */
  tags?: string;
};

export default async function Page() {
  // fetch the markdown file and process it
  const mdxSource = await fetch("http://localhost:3000/sample.md").then(
    async (res) => {
      const rawMarkdown = await res.text();
      // console.log(rawMarkdown);

      const serialized = await serialize<any, PostFrontmatter>(rawMarkdown, {
        parseFrontmatter: true,
        // scope: { }
      });

      console.log(serialized.frontmatter);

      return serialized;
    },
  );

  return (
    <main className="page-container max-w-4xl !space-y-6">
      <section className="">
        <ul className="">
          <li>
            <Link
              href={"/"}
              className="inline-flex items-center text-gray-700 gap-2 hover:underline text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
          </li>
        </ul>

        {/* breadcrumbs? */}
      </section>

      <h1 className="font-bold text-5xl max-w-5xl">
        {mdxSource.frontmatter.title ?? "[err]"}
      </h1>

      <section className="flex items-center justify-between gap-4">
        <section className="flex items-center gap-4">
          <Link
            href={"#username"}
            className="block rounded-full overflow-hidden w-12 h-12 bg-slate-300"
          >
            <Image
              width={64}
              height={64}
              src={"/img/nick.jpg"}
              alt={"username"}
              className="object-cover object-center rounded-full overflow-hidden w-12 h-12"
              priority={true}
            />
          </Link>

          <div className="space-y-0">
            <Link
              href={"#username"}
              className="hover:underline text-lg font-semibold"
            >
              Username
            </Link>

            {!!mdxSource.frontmatter?.date && (
              <p className="text-sm text-gray-400">
                {new Date(mdxSource.frontmatter.date).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* <button className="btn mx-8 border-gray-400">Following</button> */}
        </section>

        <section className="flex items-center gap-3">
          <SocialShareButtons />

          <button className="btn btn-blue">Mint</button>
        </section>
      </section>

      <div className="prose-cover-image rounded-2xl overflow-hidden border border-gray-400 bg-slate-100 child-past-parent h-96 max-h-96">
        <Image
          src={"/img/sample.jpg"}
          // fill={true}
          // width={900}
          layout="fill"
          alt={"cover"}
          className="object-cover object-center"
          priority={true}
        />
      </div>

      <article className="prose max-w-full !text-lg">
        <MarkdownFormatter source={mdxSource} />
      </article>

      {/* <AboutTheAuthor /> */}
    </main>
  );
}
