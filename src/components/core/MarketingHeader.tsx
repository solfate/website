"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import styles from "@/styles/Nav.module.css";
import { Menu as MenuIcon, X as XIcon, Mic as MicIcon } from "react-feather";
import { AppLogo } from "@/components/core/AppLogo";
import { AppNav } from "@/components/core/AppNav";
import { HeaderUserMenu } from "./HeaderUserMenu";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export default function MarketingHeader({
  session,
}: {
  session?: Option<Session>;
}) {
  const pathName = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setShowMenu(false);
  }, [pathName]);

  return (
    <SessionProvider session={session}>
      <header className={styles.nav}>
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        {!!showMenu && (
          <div
            onClick={() => setShowMenu(false)}
            className={styles.overlay}
            aria-hidden="true"
          />
        )}

        <div className={`${styles.inner} container`}>
          <div className={styles.linksListing}>
            <AppLogo /*className="pr-8" showImage={true}*/ />

            <AppNav className={styles.desktopMenu} />

            {showMenu && (
              <AppNav
                className={`${styles.mobileMenu} ${
                  showMenu ? styles.dropdownActive : styles.dropdownInactive
                }`}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* <Link href={"/signin"} className={`btn btn-ghost`}>
              Sign in
            </Link> */}

            <HeaderUserMenu className="" />
          </div>

          <div className={styles.mobileActionMenu}>
            <Link href="/podcast" className="icon-md">
              <MicIcon className="w-full" />
            </Link>

            <button className="icon-lg" onClick={(e) => setShowMenu(!showMenu)}>
              {showMenu ? (
                <XIcon className="w-full" />
              ) : (
                <MenuIcon className="w-full" />
              )}
            </button>
          </div>
        </div>
      </header>
    </SessionProvider>
  );
}
