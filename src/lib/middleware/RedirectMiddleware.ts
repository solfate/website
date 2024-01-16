import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parse } from "@/lib/middleware/utils";
import { SITE, TWITTER } from "@/lib/const/general";

export default async function RedirectMiddleware(
  req: NextRequest,
  ev?: NextFetchEvent,
) {
  const { domain, fullKey } = parse(req);

  // prevent using the root route for anything
  if (!domain || !fullKey) {
    return NextResponse.redirect(new URL("/", SITE.url));
  }

  // define the set list of known redirects
  const SHORT_LINKS = {
    mint42: "/podcast/42",
    mint43: "/podcast/43",
  };

  // located supported redirects
  if (!!SHORT_LINKS[fullKey as never]) {
    const tweetUrl = new URL("https://twitter.com/intent/tweet");
    tweetUrl.searchParams.append(
      "text",
      `I want to mint ${
        TWITTER.handle
      } episodes as NFTs on @solana!\nPlease gib @nickfrosty and @jamesrp13 🙏\nLike this one 👇\n${new URL(
        SHORT_LINKS[fullKey as never],
        SITE.url,
      )}`,
    );
    tweetUrl.searchParams.append("original_referer", SITE.url);
    tweetUrl.searchParams.append("related", TWITTER.handle);

    return NextResponse.redirect(new URL(tweetUrl.toString()));

    // return NextResponse.redirect(
    //   new URL(SHORT_LINKS[fullKey as never], SITE.url),
    // );
  }

  // fallback redirect to main site home page
  return NextResponse.redirect(new URL("/", SITE.url));
}
