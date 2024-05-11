"use client";

import { memo } from "react";
// import { signIn } from "next-auth/react";
import { AccountConnection } from "@/types";
import toast from "react-hot-toast";
import { shortWalletAddress } from "@/lib/helpers";
import Link from "next/link";

type ConnectionCardGridProps = {
  connections: AccountConnection[];
};

export const ConnectionCardGrid = memo(
  ({ connections }: ConnectionCardGridProps) => {
    /**
     * Authenticate to Twitter / X
     */
    // const twitter = useCallback(
    //   () =>
    //     signIn("twitter", {
    //       redirect: false,
    //       // force override the callback data
    //       callbackUrl: `${window.location.protocol}//${window.location.host}/settings/connections?twitter`,
    //     }),
    //   [],
    // );

    /**
     * Authenticate to GitHub
     */
    // const github = useCallback(
    //   () =>
    //     signIn("github", {
    //       redirect: false,
    //       // force override the callback data
    //       callbackUrl: `${window.location.protocol}//${window.location.host}/settings/connections?github`,
    //     }),
    //   [],
    // );

    // todo: improve the UX by auto removing the url query params to make the url's appear cleaner to the user

    return (
      <section className="grid md:grid-cols-2 gap-4">
        {connections.map((item, key) => {
          const details = getProviderDetails(item);
          return (
            <div
              key={key}
              className="card flex items-center gap-2 justify-between "
            >
              <div className="flex items-center gap-2 flex-grow">
                <div className="space-y-1">
                  <h2 className="font-semibold text-base line-clamp-1">
                    {details.title}
                  </h2>
                  <Link
                    href={details.href}
                    target="_blank"
                    className="underline text-hot-pink text-sm line-clamp-1"
                  >
                    {details.label}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 min-w-fit flex-shrink">
                <button
                  type={"button"}
                  className={"btn btn-sm btn-ghost"}
                  onClick={() => toast("todo: allow disconnecting")}
                  disabled={true}
                >
                  {"Connected"}
                </button>
              </div>
            </div>
          );
        })}
      </section>
    );
  },
);

function getProviderDetails(connection: AccountConnection) {
  switch (connection.provider) {
    case "twitter":
      return {
        title: "Twitter / X",
        label: connection.value,
        href: `https://twitter.com/${connection.value}`,
      };
    case "github":
      return {
        title: "GitHub",
        label: connection.value,
        href: `https://github.com/${connection.value}`,
      };
    case "solana":
      return {
        title: "Solana blockchain",
        label: shortWalletAddress(connection.value),
        href: `https://solana.fm/account/${connection.value}`,
      };
    default:
      return {
        title: "Unknown",
        label: "An unknown connection was found...",
        href: "#",
      };
  }
}
