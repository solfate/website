"use client";

import { Suspense, memo, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SITE } from "@/lib/const/general";

import base58 from "bs58";
import { getCsrfToken, signIn } from "next-auth/react";
import {
  WalletContextState,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { WALLET_STAGE, walletButtonLabel } from "@/lib/solana/const";
import { AuthError } from "@/components/auth/AuthError";
import { SolanaAuth, createSolanaAuthTransaction } from "solana-auth";
// import { WalletButton } from "@/context/SolanaProviders";

type AuthFormProps = {
  className?: string;
  callbackPath?: string;
};

export const AuthForm = memo(({ className, callbackPath }: AuthFormProps) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const walletModal = useWalletModal();

  // state for tracking the current working step
  const [previousWalletState, setPreviousWalletState] =
    useState<WalletContextState>(wallet);
  const [processingStage, setProcessingStage] = useState<WALLET_STAGE>(
    WALLET_STAGE.IDLE,
  );
  const [isLedger, setIsLedger] = useState<boolean>(false);

  /**
   * Handler function for the "sign in with solana" option
   * note: since we are using the `useCallback` hook and using `wallet` as a dependency,
   * after the user connects their wallet, they will be auto prompted to sign the message!
   */
  const handleSignInWithSolana = useCallback(async () => {
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

    if (!wallet.publicKey?.toBase58()) {
      console.log("still no wallet connected");
      return;
    }

    // if (wallet.connecting)
    setProcessingStage(WALLET_STAGE.WALLET_CONNECT);

    // set the default callback url
    let callbackUrl: string = !!callbackPath
      ? `${window.location.protocol}//${window.location.host}${
          !!callbackPath ? callbackPath : window.location.pathname
        }`
      : `${window.location.protocol}//${window.location.host}`;

    if (callbackPath == "self") callbackUrl = window.location.href;

    try {
      let url = new URL(
        new URL(window.location.href).searchParams.get("callbackUrl") || "",
      );

      // only update the callback sometimes
      if (url.pathname != "/signin" && url.host == window.location.host) {
        // clean up the url some (i.e. prevent nested callback urls)
        url.searchParams.delete("callbackUrl");
        // update the callback to be used
        callbackUrl = url.toString();
      }
    } catch (err) {
      //do nothing
    }

    try {
      // get a csrf token from the server for the user to sign it
      const csrf = await getCsrfToken();
      if (!wallet.publicKey || !csrf || !wallet.signMessage) {
        // todo: should we set a stage tracker here?

        // we return here so the auto connect useEffect below can re-initiate
        // the connection flow after the user select a wallet
        return;
      }

      setProcessingStage(WALLET_STAGE.WALLET_SIGN);

      // create the message for the user to sign
      const solanaAuth = new SolanaAuth({
        message: {
          domain: window.location.host,
          address: wallet.publicKey.toBase58(),
          statement: `Sign in to ${SITE.name}`,
          resources: [SITE.url],
          nonce: csrf,
        },
      });

      try {
        const messageToSign = new TextEncoder().encode(solanaAuth.prepare());

        if (isLedger) {
          // create a memo based transaction for the user to sign
          const tx = await createSolanaAuthTransaction({
            connection,
            solanaAuth: solanaAuth,
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
        } else if (!!wallet.signIn) {
          // get the user's wallet to sign the requests (`signIn` is preferred if supported)
          await wallet.signIn(solanaAuth.message).then((res) => {
            // store the wallet signed data
            solanaAuth.storeSignature({
              // note: the wallet could sign with a different wallet...
              address: res.account.address,
              signature: base58.encode(res.signature),
              signedMessage: base58.encode(res.signedMessage),
            });
          });
        } else {
          // request the user sign the message using the fallback methods
          // i.e wallets that do not support the SIWS spec (aka the `signIn` function)
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
        toast.error("You must sign the message with your wallet to sign in");

        // stop processing when the user did not actually sign the message
        setProcessingStage(WALLET_STAGE.IDLE);
        return;
      }

      /**
       * finally, attempt to sign the user into the website
       * using the `solana` credential via next-auth
       */
      return signIn("solana", {
        // auto redirect causes some error, so we will do it manually
        redirect: false,
        // force override the callback url (if desired)
        callbackUrl,
        message: JSON.stringify(solanaAuth.message),
        signedData: JSON.stringify(solanaAuth.signedData),
      })
        .then((res) => {
          // console.log("signin res:", res);

          if (!res?.ok) throw `Bad response: ${res?.error || "unknown"}`;

          setProcessingStage(WALLET_STAGE.SUCCESS);

          toast.success("Successfully signed in!");

          // manually redirect the user to the manually defined callbackUrl
          window.location.href = callbackUrl;
        })
        .catch((err) => {
          console.warn("signIn error:", err);
          toast.error("Unable to Sign in with Solana");
          setProcessingStage(WALLET_STAGE.IDLE);
          throw err;
        });
    } catch (err) {
      console.error("handleSignInWithSolana failed::", err);

      setProcessingStage(WALLET_STAGE.IDLE);

      toast.error("An unknown signin error occurred");
    }
  }, [
    wallet,
    connection,
    isLedger,
    processingStage,
    walletModal,
    setProcessingStage,
    callbackPath,
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
      if (wallet.connected && !!wallet.publicKey) handleSignInWithSolana();
      else if (
        !previousWalletState.wallet?.adapter &&
        !!wallet.wallet?.adapter
      ) {
        handleSignInWithSolana();
      }
    }

    setPreviousWalletState(wallet);
  }, [
    wallet,
    handleSignInWithSolana,
    previousWalletState,
    setPreviousWalletState,
  ]);

  return (
    <div className={`space-y-8 ${className}`}>
      <AuthError />

      <section className="z-10 flex flex-col !items-stretch gap-2 p-8 card">
        <Suspense>
          {/* <WalletButton /> */}

          <button
            type="button"
            onClick={handleSignInWithSolana}
            disabled={processingStage !== WALLET_STAGE.IDLE}
            className={`btn w-full btn-black inline-flex items-center py-3 justify-center text-center gap-2`}
          >
            {walletButtonLabel({
              stage: processingStage,
              placeholder: "Sign in with Solana",
              success: "Success! Redirecting...",
            })}
          </button>
          <div className="flex items-center justify-center">
            <a
              className="link hover:underline hover:text-hot-pink"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                wallet.disconnect().then(() => walletModal.setVisible(true));
              }}
            >
              Connect a different wallet?
            </a>
          </div>

          <label
            htmlFor="ledger"
            className="flex hover:cursor-pointer items-center justify-center gap-2"
          >
            Using a Ledger?
            <input
              id="ledger"
              name="ledger"
              checked={isLedger}
              type="checkbox"
              onChange={() => setIsLedger(!isLedger)}
            />
          </label>
        </Suspense>
      </section>
    </div>
  );
});
