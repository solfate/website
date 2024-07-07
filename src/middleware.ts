import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import { parse, shouldProtectRoute } from "@/lib/middleware/utils";
import RedirectMiddleware from "@/lib/middleware/RedirectMiddleware";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { domain, key } = parse(req);

  if (
    domain == "solfate.link" ||
    domain == "sulfate.link" ||
    domain == "app.localhost:3000"
  ) {
    return RedirectMiddleware(req);
  }

  // require the user to be authenticated to access these routes
  if (
    await shouldProtectRoute({
      protectedKeys: ["dashboard", "settings", "welcome", "onboarding"],
      req: req,
      currentKey: key,
    })
  ) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // enable better handling of custom callbacks via next-auth
  if (key == "signin" && req.nextUrl.searchParams.get("callbackUrl")) {
    try {
      const callbackUrl = new URL(
        req.nextUrl.searchParams.get("callbackUrl") || req.nextUrl,
      );
      if (req.nextUrl.host != callbackUrl.host)
        throw "External url. Do not redirect.";

      if (
        req.nextUrl.pathname != "signin" &&
        callbackUrl.pathname != "signin"
      ) {
        req.nextUrl.searchParams.delete("callbackUrl");
        req.nextUrl.pathname = callbackUrl.pathname;
        return NextResponse.redirect(req.nextUrl);
      }
    } catch (err) {
      // do nothing
    }
  }

  return NextResponse.next();
}
