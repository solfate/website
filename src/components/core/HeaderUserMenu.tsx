import React, { Fragment, memo } from "react";
import { Menu, Transition } from "@headlessui/react";
import { FeatherIcon, FeatherIconName } from "./FeatherIcon";
import styles from "@/styles/HeaderUserMenu.module.css";
import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { signOut, useSession } from "next-auth/react";
import { shortWalletAddress } from "@/lib/helpers";
// import logomark from "@/../public/logomark.svg";

export const HeaderUserMenu = memo(({}: SimpleComponentProps) => {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <Link href={"/signin"} className={`btn btn-ghost`}>
        Sign in
      </Link>
    );
  }

  return (
    <Menu as="div" className={styles.menu}>
      <div>
        <Menu.Button className={`${styles.button} btn btn-ghost`}>
          <FeatherIcon
            name="User"
            size={24}
            strokeWidth={1.4}
            aria-hidden="true"
          />
          {shortWalletAddress(session.user.username) || "[err]"}

          {/* {!!session?.user.image ? (
            <Image
              src={session.user.image}
              //   blurDataURL={logomark}
              alt={""}
              width={24}
              height={24}
              className={"border border-gray-200 bg-white rounded-full"}
            />
          ) : (
            <FeatherIcon
              name="User"
              size={24}
              strokeWidth={1.4}
              aria-hidden="true"
            />
          )} */}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className={styles.items}>
          {!!session?.user.username && (
            <div
              // href={`/${session.user.username}`}
              className={styles.heading}
            >
              <FeatherIcon
                name="User"
                aria-hidden="true"
                size={24}
                className="flex-shrink-0"
              />
              <div className="line-clamp-1">
                {shortWalletAddress(session.user.username) || "[err]"}
              </div>
            </div>
          )}

          {/* <div className={styles.section}>
            <MenuItemLink href="/settings" label="Settings" icon="Settings" />
            <MenuItemLink href="/billing" label="Billing" icon="Disc" />
          </div> */}
          <div className={styles.section}>
            <MenuItemButton
              label="Sign out"
              icon="LogOut"
              // todo: maybe we should trigger a popup for the user while the redirect is happening
              onClick={() => signOut()}
            />
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
});

/**
 *
 */
const MenuItemButton = memo(
  ({
    label,
    icon,
    children,
    ...props
  }: JSX.IntrinsicElements["button"] & {
    label: string;
    icon?: FeatherIconName;
    children?: React.ReactNode;
  }) => (
    <Menu.Item>
      {({ active }) => (
        <button
          className={clsx(
            styles.item,
            active ? styles.active : styles.inactive,
          )}
          {...props}
        >
          {typeof children != "undefined" ? (
            children
          ) : (
            <>
              {label}
              <FeatherIcon name={icon} aria-hidden="true" />
            </>
          )}
        </button>
      )}
    </Menu.Item>
  ),
);

/**
 *
 */
const MenuItemLink = memo(
  ({
    label,
    icon,
    children,
    ...props
  }: LinkProps & {
    label: string;
    icon?: FeatherIconName;
    children?: React.ReactNode;
  }) => (
    <Menu.Item>
      {({ active }) => (
        <Link
          className={clsx(
            styles.item,
            active ? styles.active : styles.inactive,
          )}
          {...props}
        >
          {typeof children != "undefined" ? (
            children
          ) : (
            <>
              {label}
              <FeatherIcon name={icon} aria-hidden="true" />
            </>
          )}
        </Link>
      )}
    </Menu.Item>
  ),
);
