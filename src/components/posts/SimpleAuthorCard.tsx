import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

export const SimpleAuthorCard = memo(() => {
  return (
    <div className="flex items-center gap-4">
      <Link
        href={"#"}
        className="w-20 h-20 flex-shrink-0 relative rounded-full overflow-hidden bg-slate-300"
      >
        <Image
          width={128}
          height={128}
          src={"/img/nick.jpg"}
          alt={"username"}
          className="w-20 h-20 flex-shrink-0 object-cover object-center rounded-full overflow-hidden"
        />
      </Link>
      <div className="">
        <h5 className="font-semibold text-lg line-clamp-1">Username</h5>

        <p className="text-sm text-gray-500 line-clamp-2">
          Short bio for this person. Short bio for this person.Short bio for
          this person
        </p>
      </div>
    </div>
  );
});
