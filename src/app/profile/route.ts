import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const session = await getUserSession();

  if (!!session?.user?.username) {
    redirect(`/${session.user.username}`);
  } else {
    redirect("/signin");
  }
}
