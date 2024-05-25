import NavLink from "@/components/core/NavLink";
import {
  ROUTE_PREFIX_BLOG,
  ROUTE_PREFIX_DEVLIST,
  ROUTE_PREFIX_PODCAST,
  ROUTE_PREFIX_SNAPSHOT,
} from "@/lib/const/general";
import styles from "@/styles/Nav.module.css";

type AppNavProps = SimpleComponentProps;

export const AppNav = ({ className = "" }: AppNavProps) => {
  return (
    <nav className={className}>
      {/* <NavLink href={ROUTE_PREFIX_DISCOVER}>Discover</NavLink> */}
      <NavLink href={ROUTE_PREFIX_BLOG} className={styles.primaryNavLink}>
        Blog
      </NavLink>
      <NavLink href={ROUTE_PREFIX_PODCAST} className={styles.primaryNavLink}>
        Podcast
      </NavLink>
      <NavLink href={ROUTE_PREFIX_SNAPSHOT} className={styles.primaryNavLink}>
        Snapshot
      </NavLink>
      <NavLink href={ROUTE_PREFIX_DEVLIST} className={styles.primaryNavLink}>
        DevList
      </NavLink>
    </nav>
  );
};
