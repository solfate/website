import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parse } from "@/lib/middleware/utils";
import { SITE } from "@/lib/const/general";

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
    mint42: "/podcast/42#mint",
  };

  // located supported redirects
  if (!!SHORT_LINKS[fullKey as never]) {
    return NextResponse.redirect(
      new URL(SHORT_LINKS[fullKey as never], SITE.url),
    );
  }

  // fallback redirect to main site home page
  return NextResponse.redirect(new URL("/", SITE.url));
}
