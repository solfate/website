import { ROUTE_PREFIX_SNAPSHOT } from "@/lib/const/general";
import { redirect } from "next/navigation";

export default function Page() {
  return redirect(`${ROUTE_PREFIX_SNAPSHOT}/browse/1`);
}
