import { SITE } from "@/lib/const/general";
import Image from "next/image";
import Link from "next/link";

export const AppLogo = () => {
  return (
    <Link href={"/"} className="font-bold text-2xl inline-flex gap-3">
      <Image
        src={"/icon.svg"}
        width={32}
        height={32}
        alt={SITE.name}
        className="w-8 h-8"
      />
      {SITE.name}
    </Link>
  );
};
