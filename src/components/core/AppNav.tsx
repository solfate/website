import styles from "@/styles/Nav.module.css";
import { NavLink } from "@/components/core/NavLink";

type AppNavProps = SimpleComponentProps;

export const AppNav = ({ className = "" }: AppNavProps) => {
  return (
    <nav className={className}>
      <NavLink href="/podcast" className={styles.primaryNavLink}>
        Podcast
      </NavLink>
      <NavLink href="/devlist" className={styles.primaryNavLink}>
        DevList
      </NavLink>
      <NavLink href="/blog" className={styles.primaryNavLink}>
        Blog
      </NavLink>
      {/* <NavLink href="/extension">Extension</NavLink> */}
    </nav>
  );
};
