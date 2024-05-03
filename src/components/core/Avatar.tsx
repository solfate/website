import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import type { Profile } from "@prisma/client";
import BoringAvatar from "boring-avatars";

type AvatarProps = {
  href: string;
  title?: string;
  imageSrc?: Option<string>;
  className?: string;
  size: number;
  as?: "span" | "a" | "link";
  priority?: boolean;
  username?: Profile["username"];
  image?: Profile["image"];
};

export const Avatar = memo(
  ({
    href,
    username,
    priority,
    imageSrc,
    className,
    title,
    size,
    as,
  }: AvatarProps) => {
    const ComponentToUse = as == "span" ? "span" : Link;

    return (
      <ComponentToUse
        title={title}
        href={as != "span" ? href : ""}
        className={clsx(
          "overflow-hidden rounded-full border border-gray-200 bg-white",
          "flex items-center justify-center flex-shrink-0 aspect-square",
          `size-[${size}px]`,
          className,
        )}
      >
        {imageSrc ? (
          <Image
            priority={priority}
            alt={username || ""}
            title={username}
            src={imageSrc}
            width={size}
            height={size}
            className="block object-fill place-self-center aspect-square"
          />
        ) : (
          <BoringAvatar
            square={true}
            size={size}
            name={username}
            variant="beam"
            colors={["#0A0310", "#49007E", "#FF005B", "#FF7D10", "#FFB238"]}
          />
        )}
      </ComponentToUse>
    );
  },
);
