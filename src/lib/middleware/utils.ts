import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/const/general";
import { getToken } from "next-auth/jwt";
import type { Session } from "next-auth";

/**
 * Parse standard data out of a middleware Request
 */
export const parse = (req: NextRequest) => {
  let domain = (req.headers.get("host") as string).replace("www.", "");

  // handle local development and vercel preview URLs
  if (domain === "localhost:3000" || domain.endsWith(".vercel.app")) {
    domain = SITE.domain;
  }

  // `path` is the path of the URL (e.g. solfate.com/podcast/1 -> /podcast/1)
  let path = req.nextUrl.pathname;

  // `fullPath` is the full URL path (along with search params)
  const searchParams = req.nextUrl.searchParams.toString();
  const fullPath = `${path}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // key is the first route in the path
  const key = decodeURIComponent(path.split("/")[1]);

  // fullKey is the full path without the first slash
  const fullKey = decodeURIComponent(path.slice(1));

  return { domain, path, fullPath, key, fullKey };
};

/**
 * Get user's session directly via the JWT. This is useful directly in middleware.
 */
export async function getTokenSession(req: NextRequest) {
  return (await getToken({ req })) as Session["user"];
}

/**
 * Middleware helper to protect routes from user access unless they meet the desired criteria
 */
export async function protectRoutesViaMiddleware({
  protectedKeys,
  currentKey,
  req,
}: {
  protectedKeys: string[];
  currentKey: string;
  req: NextRequest;
}) {
  if (protectedKeys.includes(currentKey)) {
    const session = await getTokenSession(req);
    if (!session || !session.id || !session.username) {
      return true;
    }
  }
  return false;
}
