import NavLink from "@/components/core/NavLink";
import {
  ROUTE_PREFIX_BLOG,
  ROUTE_PREFIX_DEVLIST,
  ROUTE_PREFIX_PODCAST,
  ROUTE_PREFIX_SNAPSHOT,
} from "@/lib/const/general";

type AppNavProps = SimpleComponentProps;

export const AppNav = ({ className = "" }: AppNavProps) => {
  return (
    <nav className={className}>
      {/* <NavLink href={ROUTE_PREFIX_DISCOVER}>Discover</NavLink> */}
      <NavLink href={ROUTE_PREFIX_BLOG}>Blog</NavLink>
      <NavLink href={ROUTE_PREFIX_PODCAST}>Podcast</NavLink>
      <NavLink href={ROUTE_PREFIX_SNAPSHOT}>Snapshot</NavLink>
      <NavLink href={ROUTE_PREFIX_DEVLIST}>DevList</NavLink>
    </nav>
  );
};
