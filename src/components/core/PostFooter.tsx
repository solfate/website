import { SITE } from "@/lib/const/general";
import Image from "next/image";
import Link from "next/link";
import icon from "@/../public/icon-orange.svg";

export default function AppFooter() {
  return (
    <footer className="border-t border-gray-400 bg-gray-100">
      <div className="flex items-center justify-between container py-10 px-4">
        <div className="flex items-center divide-x divide-gray-600 text-sm gap-3">
          <p className="">&copy;{"username"}</p>

          <Link href={"#"} className="pl-2 underline">
            Terms of Use
          </Link>
          <Link href={"#"} className="pl-2 underline">
            Privacy Policy
          </Link>
        </div>

        <div className="">
          <Link href={"/"} className="btn text-sm px-3 border-gray-400">
            <Image
              width={24}
              height={24}
              src={icon}
              alt={SITE.name}
              className="object-cover object-center rounded-full overflow-hidden w-6 h-6"
            />
            Powered by {SITE.name}
          </Link>
        </div>
      </div>
    </footer>
  );
}
