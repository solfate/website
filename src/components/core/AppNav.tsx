import NavLink from "@/components/core/NavLink";

type AppNavProps = SimpleComponentProps;

export const AppNav = ({ className = "" }: AppNavProps) => {
  return (
    <nav className={className}>
      <NavLink href="/blog">Blog</NavLink>
      <NavLink href="/podcast">Podcast</NavLink>
      {/* <NavLink href="/discover">Discover</NavLink> */}
      <NavLink href="/devlist">DevList</NavLink>
      <NavLink href="/snapshot">Snapshot</NavLink>
    </nav>
  );
};
