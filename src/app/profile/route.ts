import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getUserSession();

  if (!!session?.user?.username) {
    return NextResponse.redirect(new URL(`/${session.user.username}`, req.url));
  } else {
    return NextResponse.redirect(new URL(`/signin`, req.url));
  }
}
