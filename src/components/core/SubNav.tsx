"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const SubNav = memo(
  ({
    links,
    className = "",
  }: {
    className?: string;
    links: Array<{
      href: string;
      label: string;
    }>;
  }) => {
    const pathName = usePathname();
    // const isCurrent = pathName?.startsWith(href) || false;

    return (
      <section
        className={`container !flex !flex-col !p-0 hide-scroll-bar ${className}`}
      >
        <div
          className={
            "items-center flex-1 mr-0 flex md:mr-2 md:space-x-8 md:justify-start md:overflow-auto lg:space-x-0 horizontalScrollContainer hide-scroll-bar !justify-normal !gap-0 !space-x-0"
          }
        >
          {links.map((link, key) => (
            <Link
              key={key}
              href={link.href}
              title={link.label}
              className={cn(
                "flex items-center transition-colors duration-150 ease-in-out no-underline border-transparent hover:text-hot-pink",
                pathName?.startsWith(link.href)
                  ? "text-hot-pink border-hot-pink font-semibold"
                  : "hover:text-hot-pink hover:border-hot-pink",
                "px-4 py-2 md:px-6 space-x-0 text-base border-b-[3px]",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    );
  },
);
