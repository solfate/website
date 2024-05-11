import { NextResponse } from "next/server";
import { ROUTE_PREFIX_SNAPSHOT } from "@/lib/const/general";

export async function GET(req: Request) {
  return NextResponse.redirect(
    new URL(`${ROUTE_PREFIX_SNAPSHOT}/browse/1`, req.url),
  );
}
