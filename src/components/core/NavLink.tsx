"use client";

/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import Link from "next/link";
import styles from "@/styles/Nav.module.css";
import { usePathname } from "next/navigation";

type ComponentProps = SimpleComponentProps & {
  // icon;
  title?: string;
  href: string;
};

export const NavLink = ({
  // icon,
  href,
  title = "",
  children,
  className,
}: ComponentProps) => {
  const pathName = usePathname();
  const isCurrent = pathName?.startsWith(href) || false;

  return (
    <Link
      href={href}
      title={title}
      className={clsx(
        styles.link,
        isCurrent ? styles.activeLink : styles.inactiveLink,
        className,
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
