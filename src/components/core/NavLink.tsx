"use client";

/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "@/styles/Nav.module.css";

type ComponentProps = SimpleComponentProps & {
  // icon;
  title?: string;
  href: string;
};

export default function NavLink({
  // icon,
  href,
  title = "",
  children,
}: ComponentProps) {
  const pathName = usePathname();
  const isCurrent = pathName?.startsWith(href) || false;

  return (
    <Link
      href={href}
      title={title}
      className={clsx(
        styles.link,
        isCurrent ? styles.activeLink : styles.inactiveLink,
      )}
    >
      {children}
    </Link>
  );
}
