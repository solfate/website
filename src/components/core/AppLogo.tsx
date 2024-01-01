import { SITE } from "@/lib/const/general";
import Image from "next/image";
import Link from "next/link";
import icon from "@/../public/icon-orange.svg";

type AppLogoProps = {
  className?: string;
  logoSize: number;
};

export const AppLogo = ({ className = "", logoSize }: AppLogoProps) => {
  return (
    <Link
      href={"/"}
      className={`font-bold text-[1.7rem] inline-flex items-center gap-3 ${className}`}
    >
      <Image
        priority
        src={icon}
        width={logoSize}
        height={logoSize}
        alt={SITE.name}
      />
      {SITE.name}
    </Link>
  );
};
