"use client";

import Image from "next/image";
import { WALLET_STAGE } from "@/lib/solana/const";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  WalletContextState,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { SolanaAuth, createSolanaAuthTransaction } from "solana-auth";
import { SITE } from "@/lib/const/general";
import base58 from "bs58";

import devlistImage from "@/../public/img/devlist/devlist.png";
import { Keypair, Transaction } from "@solana/web3.js";
import { grindKeypairSync } from "@/lib/solana/tokens";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import {
  ApiListDevelopersPutInput,
  ApiListDevelopersPutResponse,
} from "@/types/api/developers";
import { PulseLoader } from "react-spinners";
import { solanaExplorerLink } from "@/lib/solana/helpers";
import { MetadataToggle } from "./MetadataToggle";

type ClaimDevListTokenProps = {
  twitter?: string;
  github?: string;
};

export const ClaimDevListToken = ({
  twitter,
  github,
}: ClaimDevListTokenProps) => {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { connection } = useConnection();

  const [isLedger, setIsLedger] = useState<boolean>(false);

  // state for tracking the current working step
  const [previousWalletState, setPreviousWalletState] =
    useState<WalletContextState>(wallet);
  const [processingStage, setProcessingStage] = useState<WALLET_STAGE>(
    WALLET_STAGE.IDLE,
  );

  const [mintTwitter, setMintTwitter] = useState(false);
  const [mintGithub, setMintGithub] = useState(false);

  // generate a mint keypair
  const [mint, setMint] = useState(Keypair.generate());
  useEffect(() => {
    const { keypair } = grindKeypairSync({
      startsWith: "dev",
    });

    setMint(keypair);

    return () => {
      const { keypair } = grindKeypairSync({
        startsWith: "dev",
      });

      setMint(keypair);
    };
  }, []);

  /**
   * Handle the user's claim request
   */
  const handleClaimMembershipToken = useCallback(async () => {
    if (
      processingStage !== WALLET_STAGE.IDLE &&
      processingStage !== WALLET_STAGE.WALLET_CONNECT
    ) {
      console.warn("Invalid processing stage");
      console.warn(processingStage);
      return;
    }

    try {
      if (!!wallet.wallet?.adapter) {
        setProcessingStage(WALLET_STAGE.WALLET_CONNECT);
        await wallet.connect();
      } else if (!wallet.connected) {
        walletModal.setVisible(true);
        return;
      }
    } catch (err) {}

    if (
      !wallet.publicKey?.toBase58() ||
      !wallet.signTransaction ||
      !wallet.signMessage
    ) {
      console.log("still no wallet connected");
      return;
    }

    setProcessingStage(WALLET_STAGE.WALLET_SIGN);

    // initialize a pointer to a transaction
    let transaction: Transaction | undefined;

    // create the message for the mint to sign
    const solanaAuth = new SolanaAuth({
      message: {
        domain: window.location.host,
        address: wallet.publicKey.toBase58(),
        // statement: `Sign this message with your DevList token address:`,
        statement: `Solana DevList:`,
        resources: [SITE.url],
        nonce: mint.publicKey.toBase58(),
      },
    });

    try {
      const messageToSign = new TextEncoder().encode(solanaAuth.prepare());

      if (isLedger) {
        // create a memo based transaction for the user to sign
        const tx = await createSolanaAuthTransaction({
          connection,
          solanaAuth,
        });

        // ask the user to sign this transaction (which we do not send)
        await wallet.signTransaction!(tx).then((signedTx) => {
          // store the wallet signed data
          solanaAuth.storeSignature({
            address: wallet.publicKey?.toBase58(),
            signature: base58.encode(signedTx.serialize()),
            signedMessage: base58.encode(messageToSign),
            isMemoTransaction: true,
          });
        });
      } else {
        // request the user sign the message
        await wallet.signMessage(messageToSign).then((sig) => {
          // store the wallet signed data
          solanaAuth.storeSignature({
            address: wallet.publicKey?.toBase58(),
            signature: base58.encode(sig),
            signedMessage: base58.encode(messageToSign),
          });
        });
      }
      // ensure we actually have a signature after attempting all wallet sign attempts
      if (!solanaAuth.signedData) throw Error("Unknown signature");
    } catch (err) {
      console.error("Wallet failed to sign message:", err);
      toast.error("You must sign the message with your wallet");

      // stop processing when the user did not actually sign the message
      setProcessingStage(WALLET_STAGE.IDLE);
      return;
    }

    try {
      setProcessingStage(WALLET_STAGE.BUILDING_TRANSACTION);

      await fetcher<ApiListDevelopersPutInput>("/api/lists/developers", {
        method: "PUT",
        body: {
          mint: mint.publicKey.toBase58(),
          message: JSON.stringify(solanaAuth.message),
          signedData: JSON.stringify(solanaAuth.signedData),
          metadata: {
            twitter: mintTwitter,
            github: mintGithub,
          },
        },
      })
        .then((res) => JSON.parse(res) as ApiListDevelopersPutResponse)
        .then((res) => {
          // deserialize and set the transaction provided from the server
          transaction = Transaction.from(
            base58.decode(res.serializedTransaction),
          );

          // setLoading(false);
        });

      // ensure we have a transaction ready for the user
      if (!transaction) {
        setProcessingStage(WALLET_STAGE.IDLE);
        return toast.error("Unable to build transaction");
      }

      setProcessingStage(WALLET_STAGE.WALLET_SIGN);

      try {
        // sign with the client side generated mint keypair
        transaction.partialSign(mint);

        // let the wallet send the transaction after the user signs it
        const txSig = await wallet.sendTransaction(transaction, connection, {
          maxRetries: 5,
        });

        console.log(
          "Confirming transaction:",
          solanaExplorerLink(
            "tx",
            txSig,
            connection.rpcEndpoint.includes("devnet")
              ? "devnet"
              : "mainnet-beta",
          ),
        );

        // manually confirm the transaction
        const latestBlockHash = await connection.getLatestBlockhash();
        const confirmSigResult = await connection.confirmTransaction(
          {
            signature: txSig,
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          },
          "finalized",
        );

        if (!!confirmSigResult.value.err) {
          console.error("[CONFIRM ERROR]", confirmSigResult.value.err);
          throw Error("Unable to confirm your transaction");
        }

        console.log(
          "Transaction:",
          solanaExplorerLink(
            "tx",
            txSig,
            connection.rpcEndpoint.includes("devnet")
              ? "devnet"
              : "mainnet-beta",
          ),
        );

        console.log(
          "Token account:",
          solanaExplorerLink(
            "token",
            mint.publicKey.toBase58(),
            connection.rpcEndpoint.includes("devnet")
              ? "devnet"
              : "mainnet-beta",
          ),
        );

        setProcessingStage(WALLET_STAGE.SUCCESS);

        // refresh the page
        // window.location.href = window.location.href;

        return toast.success("Success! You have claimed the DevList token!");
      } catch (err) {
        console.error(err);
        setProcessingStage(WALLET_STAGE.IDLE);

        if (typeof err == "string") return toast.error(err);
        else if (err instanceof Error) return toast.error(err.message);
        return toast.error("Transaction failed to send. Try again.");
      }
    } catch (err) {
      console.error("handleClaimMembershipToken failed::", err);

      setProcessingStage(WALLET_STAGE.IDLE);

      if (typeof err == "string") toast.error(err);
      else if (err instanceof Error) toast.error(err.message);
      else toast.error("An unknown error occurred");
    }
  }, [
    mint,
    isLedger,
    wallet,
    processingStage,
    mintTwitter,
    mintGithub,
    connection,
    walletModal,
    setProcessingStage,
  ]);

  /**
   * handle the various wallet state changes to provider better ux
   */
  useEffect(() => {
    if (previousWalletState.connected == false) {
      // not connected, but now connecting
      if (wallet.connecting == true)
        setProcessingStage(WALLET_STAGE.WALLET_CONNECT);
      // use canceled the wallet connection without connecting
      else if (wallet.connecting == false)
        setProcessingStage(WALLET_STAGE.IDLE);
      // the user just connected their wallet
      if (wallet.connected && !!wallet.publicKey) handleClaimMembershipToken();
      else if (
        !previousWalletState.wallet?.adapter &&
        !!wallet.wallet?.adapter
      ) {
        handleClaimMembershipToken();
      }
    }

    setPreviousWalletState(wallet);
  }, [
    wallet,
    handleClaimMembershipToken,
    previousWalletState,
    setPreviousWalletState,
  ]);

  return (
    <section className="md:flex grid gap-10 md:gap-6 lg:gap-8 items-center justify-center">
      <section className="space-y-6 items-center max-w-md">
        <h2 className="font-semibold text-4xl">How to claim?</h2>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="flex w-10 h-10 text-sm rounded-full bg-red-100 items-center justify-center border border-red-200 p-3">
              1
            </span>
            <h3 className="font-medium text-lg">Connect a Solana wallet</h3>
          </div>

          <p className="text-sm">
            Connect the Solana wallet you want to own your DevList token. This
            does not have to be the same one you used before.
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="flex w-10 h-10 text-sm rounded-full bg-red-100 items-center justify-center border border-red-200 p-3">
              2
            </span>
            <h3 className="font-medium text-lg">
              Customize your metadata (optional)
            </h3>
          </div>

          <p className="text-sm">
            Decide if you want your DevList token to store your Twitter and/or
            GitHub username publicly in the on-chain metadata.
            <br />
            This is optional and off by default.
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="flex w-10 h-10 text-sm rounded-full bg-red-100 items-center justify-center border border-red-200 p-3">
              3
            </span>
            <h3 className="font-medium text-lg">Mint your DevList token</h3>
          </div>

          <p className="text-sm">
            Sign a plaintext message, then sign a transaction to claim your
            non-transferrable membership token, officially joining the DevList.
          </p>
        </div>
      </section>

      <section>
        <div className="z-10 flex max-w-sm flex-shrink mx-auto flex-col !items-stretch gap-3 p-6 card">
          <Image
            alt="DevList Token"
            src={devlistImage}
            className="rounded-lg"
          />

          <section className="grid grid-cols-2 gap-2">
            <p className="col-span-full text-sm">
              Select optional on-chain metadata:
              <br />
              (optional - off by default)
            </p>
            <MetadataToggle
              disabled={processingStage !== WALLET_STAGE.IDLE}
              label="Twitter / X"
              value={twitter}
              checked={mintTwitter}
              setChecked={setMintTwitter}
            />
            <MetadataToggle
              disabled={processingStage !== WALLET_STAGE.IDLE}
              label="GitHub"
              value={github}
              checked={mintGithub}
              setChecked={setMintGithub}
            />
          </section>

          {processingStage == WALLET_STAGE.SUCCESS ? (
            <Link
              href={solanaExplorerLink(
                "token",
                mint.publicKey.toBase58(),
                connection.rpcEndpoint.includes("devnet")
                  ? "devnet"
                  : "mainnet-beta",
              )}
              target="_blank"
              className={`btn w-full btn-black inline-flex items-center py-3 justify-center text-center gap-2`}
            >
              View on Explorer
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  wallet.disconnect().then(() => walletModal.setVisible(true));
                }}
                disabled={processingStage !== WALLET_STAGE.IDLE}
                className={`btn w-full btn-black inline-flex items-center py-3 justify-center text-center gap-2`}
              >
                {claimButtonLabel({
                  stage: processingStage,
                  // placeholder: "Claim Membership Token",
                  placeholder: "Claim DevList Token",
                  success: "Success!",
                })}
              </button>

              <label
                htmlFor="ledger"
                className="flex text-sm hover:cursor-pointer items-center justify-center gap-2"
              >
                Using a Ledger to claim?
                <input
                  id="ledger"
                  name="ledger"
                  checked={isLedger}
                  type="checkbox"
                  onChange={() => setIsLedger(!isLedger)}
                />
              </label>
            </>
          )}
        </div>
      </section>
    </section>
  );
};

export const claimButtonLabel = ({
  stage,
  placeholder,
  success,
}: {
  stage: WALLET_STAGE;
  placeholder?: string;
  success: string;
}) => {
  switch (stage) {
    case WALLET_STAGE.WALLET_CONNECT:
      return "Connecting to wallet...";
    case WALLET_STAGE.WALLET_SIGN:
      return "Waiting for wallet...";
    case WALLET_STAGE.BUILDING_TRANSACTION:
      return (
        <div>
          <PulseLoader
            size={8}
            color={
              "white"
              // status == TaskStatus.DISABLED || status == TaskStatus.COMPLETE
              //   ? "black"
              //   : "white"
            }
          />
        </div>
      );
    // return <>Building transaction...</>;
    case WALLET_STAGE.SUCCESS:
      return success;
    case WALLET_STAGE.IDLE:
    // note: idle uses default
    default:
      return placeholder;
  }
};
