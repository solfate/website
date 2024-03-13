import { memo } from "react";
import styles from "@/styles/Nav.module.css";
import { NavLink } from "@/components/core/NavLink";

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
    return (
      <section
        className={`container !flex !flex-col !p-0 hide-scroll-bar ${className}`}
      >
        <div
          className={`${styles.linksListing} ${styles.horizontalScrollContainer} hide-scroll-bar !justify-normal !gap-0 !space-x-0`}
        >
          {links.map((link, key) => (
            <NavLink key={key} href={link.href} className={styles.subNavLink}>
              {link.label}
            </NavLink>
          ))}
        </div>
      </section>
    );
  },
);
