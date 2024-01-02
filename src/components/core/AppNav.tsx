import NavLink from "@/components/core/NavLink";

type AppNavProps = SimpleComponentProps;

export const AppNav = ({ className = "" }: AppNavProps) => {
  return (
    <nav className={className}>
      <NavLink href="/podcast">Podcast</NavLink>
      {/* <NavLink href="/discover">Discover</NavLink> */}
      <NavLink href="/developers">DevList</NavLink>
      {/* <NavLink href="/extension">Extension</NavLink> */}
    </nav>
  );
};
