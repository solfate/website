// "use client";

import { memo } from "react";
import clsx from "clsx";
import Link from "next/link";
import {
  FeatherIcon,
  type FeatherIconName,
} from "@/components/core/FeatherIcon";

export const SettingsSidebar = memo(
  ({ className = "" }: SimpleComponentProps) => {
    // const pathName = usePathname();

    return (
      <aside
        className={clsx(
          "flex-shrink-0 space-y-4 p-4 pt-2 md:pt-4 flex flex-col w-[15rem]",
          className,
        )}
      >
        <ul className="space-y-1 flex-grow">
          <li>
            <SidebarHeading label="Settings" />
          </li>
          <li>
            <SidebarLink href="/" icon="Settings" label="General" />
          </li>
          <li>
            <SidebarLink href="/profile" icon="User" label="Profile" />
          </li>
          {/* <li>
            <SidebarLink href="/invites" icon="Key" label="Invites" />
          </li> */}
          <li>
            <SidebarLink
              href="/connections"
              icon="Database"
              label="Connections"
            />
          </li>
          {/* <li>
            <SidebarLink
              href="/notifications"
              icon="Bell"
              label="Notifications"
            />
          </li> */}
          {/* <li>
            <SidebarHeading label="Team" />
          </li>
          <li>
            <SidebarLink href="/team" icon="Users" label="Members" />
          </li>
          <li>
            <SidebarHeading label="Advanced" />
          </li>
          <li>
            <SidebarLink href="/advanced/api" icon="Code" label="API Keys" />
          </li> */}
        </ul>
      </aside>
    );
  },
);

type SidebarHeadingProps = {
  className?: string;
  label: string;
  icon?: FeatherIconName;
  hideLabel?: boolean;
};

export const SidebarHeading = memo(
  ({ label, icon, hideLabel = false }: SidebarHeadingProps) => {
    return (
      <h5 className="flex h-8 uppercase gap-2 font-semibold items-center py-2 text-xs mt-3 text-gray-500">
        {typeof icon !== "undefined" && (
          <FeatherIcon
            name={icon}
            className="flex-shrink-0 place-self-center"
          />
        )}

        <span className={clsx(!!hideLabel && "md:hidden")}>{label}</span>
        <div className={clsx(!!hideLabel && " md:border-t w-full h-1")}></div>
      </h5>
    );
  },
);

type SidebarLinkProps = {
  className?: string;
  href: string;
  label: string;
  icon: FeatherIconName;
  hideLabel?: boolean;
};

export const SidebarLink = memo(
  ({ href, icon, label, className, hideLabel = false }: SidebarLinkProps) => {
    return (
      <Link
        href={`/settings${href}`}
        className={clsx(
          "group flex gap-3 items-center text-sm p-2 rounded-md",
          "text-gray-500",
          "hover:text-black hover:font-medium hover:bg-hot-pink hover:bg-opacity-5",
          className,
        )}
      >
        <FeatherIcon
          name={icon}
          className="flex-shrink-0 place-self-center group-hover:text-hot-pink"
        />

        <span className={clsx(!!hideLabel && "md:hidden")}>{label}</span>
      </Link>
    );
  },
);
