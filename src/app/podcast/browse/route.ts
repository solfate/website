import { redirect } from "next/navigation";

export async function GET(request: Request) {
  redirect("/podcast/browse/1");
}
