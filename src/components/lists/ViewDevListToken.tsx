"use client";

import Image from "next/image";
import { useConnection } from "@solana/wallet-adapter-react";
import devlistImage from "@/../public/img/devlist/devlist.png";
import Link from "next/link";
import { solanaExplorerLink } from "@/lib/solana/helpers";
import { shortWalletAddress } from "@/lib/helpers";
import { MetadataToggle } from "./MetadataToggle";
import { TokenMetadata } from "@solana/spl-token-metadata";
import { useMemo } from "react";

type ViewDevListTokenProps = {
  assetId: string | null;
  additionalMetadata?: TokenMetadata["additionalMetadata"];
  // twitter?: string;
  // github?: string;
};

export const ViewDevListToken = ({
  assetId,
  additionalMetadata,
  // twitter,
  // github,
}: ViewDevListTokenProps) => {
  const { connection } = useConnection();

  // parse the `additionalMetadata` fields for display
  const metadata = useMemo(() => {
    const parsedMetadata = {
      twitter: null,
      github: null,
    };

    // if (Array.isArray(additionalMetadata)) {
    //   additionalMetadata.forEach((record) => {
    //     if (Object.hasOwn(parsedMetadata, record[0]))
    //       parsedMetadata[record[0]] = record[1];
    //   });
    // }

    return parsedMetadata;
  }, [additionalMetadata]);

  return (
    <section className="container max-w-4xl !py-0 md:!space-y-12 !space-y-8">
      <section className="md:flex grid gap-10 md:gap-6 lg:gap-8 items-center justify-center">
        <section>
          <div className="z-10 flex max-w-sm flex-shrink mx-auto flex-col !items-stretch gap-3 p-6 card">
            <Image
              alt="DevList Token"
              src={devlistImage}
              className="rounded-lg"
            />

            <section className="grid grid-cols-2 gap-2">
              <p className="col-span-full text-sm">
                Your custom on-chain metadata:
              </p>
              <MetadataToggle
                disabled={true}
                label="Twitter / X"
                value={metadata.twitter || "n/a"}
                checked={!!metadata.twitter}
              />
              <MetadataToggle
                disabled={true}
                label="GitHub"
                value={metadata.github || "n/a"}
                checked={!!metadata.github}
              />
            </section>

            {!!assetId && (
              <>
                <Link
                  href={solanaExplorerLink(
                    "token",
                    assetId,
                    connection.rpcEndpoint.includes("devnet")
                      ? "devnet"
                      : undefined,
                  )}
                  target="_blank"
                  className={`btn w-full btn-black inline-flex items-center py-3 justify-center text-center gap-2`}
                >
                  View on Explorer
                </Link>
                {/* <Link
                  href={solanaExplorerLink(
                    "token",
                    assetId,
                    connection.rpcEndpoint.includes("devnet")
                      ? "devnet"
                      : undefined,
                  )}
                  target="_blank"
                  className="text-gray-500 text-sm text-center hover:text-black hover:underline"
                >
                  {shortWalletAddress(assetId, 14)}
                </Link> */}
              </>
            )}
          </div>
        </section>

        <section className="space-y-6 items-center max-w-md">
          <h2 className="font-semibold text-4xl">This token is different</h2>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="flex w-10 h-10 text-sm rounded-full bg-red-100 items-center justify-center border border-red-200 p-3">
                1
              </span>
              <h3 className="font-medium text-lg">
                Token Extensions (aka Token22)
              </h3>
            </div>

            <p className="text-sm">
              The DevList membership token uses <>only</> the new Token
              Extensions program (aka Token22). Including metadata and
              collection/grouping.
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="flex w-10 h-10 text-sm rounded-full bg-red-100 items-center justify-center border border-red-200 p-3">
                2
              </span>
              <h3 className="font-medium text-lg">
                Non-transferrable (aka soul-bound)
              </h3>
            </div>

            <p className="text-sm">
              You may not transfer the DevList membership token to another
              wallet, but you can burn it if you so choose. This is enforced by
              the non-transferrable extension.
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="flex w-10 h-10 text-sm rounded-full bg-red-100 items-center justify-center border border-red-200 p-3">
                3
              </span>
              <h3 className="font-medium text-lg">Explorers and Wallets</h3>
            </div>

            <p className="text-sm">
              Since Token Extensions are rather new, your favorite Solana
              wallets and explorers might not have full support for them.
              Especially NFTs created exclusively with the Token Extension
              program.
            </p>
          </div>
        </section>

        {/* <p className="max-w-md">
          <b>Important Note:</b> the DevList membership token uses the new Token
          Extensions program (aka Token22), which is not yet fully supported
          within the various Solana ecosystem wallets and explorers. This
          support is in the works by the top teams you know and love. Until
          then, this fully Token Extension (Token22) based NFT will not show
          like the NFTs you are used to.
        </p> */}
      </section>

      <p className="mx-auto">
        <b>Reminder:</b> the DevList membership token uses the new Token
        Extensions program (aka Token22), which is not yet fully supported
        within the various Solana ecosystem wallets and explorers. This support
        is in the works by the top teams you know and love. Until then, this
        fully Token Extension (Token22) based NFT will not show like the NFTs
        you are used to.
        {/* <br />
        Wallets and explorers that we know will display the DevList token:{" "}
        <Link
          href="https://phantom.app"
          target="_blank"
          className="underline hover:text-hot-pink"
        >
          Phantom
        </Link>
        . */}
      </p>
    </section>
  );
};
