import type { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/core/Avatar";

type SmallProfileCardProps = {
  name?: User["name"];
  username: User["username"];
  image?: User["image"];
};

export const SmallProfileCard = ({
  name,
  username,
  image,
}: SmallProfileCardProps) => (
  <Link href={`/${username}`} className="flex items-center gap-2 group">
    <Avatar
      as="span"
      size={64}
      title={username}
      imageSrc={image}
      href={`/${username}`}
      className="rounded-full size-12 border-2 border-transparent group-hover:border-hot-pink"
    />

    <span className="block">
      <h5 className="font-semibold group-hover:text-hot-pink line-clamp-1">
        {name ?? username}
      </h5>
      <p className=" text-gray-400 text-sm line-clamp-1">@{username}</p>
    </span>
  </Link>
);
