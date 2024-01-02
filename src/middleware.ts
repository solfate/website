import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import { parse } from "@/lib/middleware/utils";
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
  const { domain } = parse(req);

  if (domain == "solfate.link" || domain == "sulfate.link") {
    return RedirectMiddleware(req);
  }

  return NextResponse.next();
}
