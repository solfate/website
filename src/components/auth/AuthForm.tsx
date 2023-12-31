"use client";

import { Suspense, memo, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SITE } from "@/lib/const/general";

import base58 from "bs58";
import { SolanaSignInMessage } from "@/lib/solana/SignInMessage";
import { getCsrfToken, signIn } from "next-auth/react";
import { WalletContextState, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
// import { WalletButton } from "@/context/SolanaProviders";

// define a list of known processing steps
enum PROCESSING_STAGE {
  /** idle state, awaiting a user action */
  IDLE,
  /** completed status! */
  SUCCESS,
  /** awaiting the user to authorize their wallet to connect to the app */
  WALLET_CONNECT,
  /** awaiting the user to sign or reject the message */
  WALLET_SIGN,
}

type AuthFormProps = {
  className?: string;
  callbackPath?: string;
};

export const AuthForm = memo(({ className, callbackPath }: AuthFormProps) => {
  const wallet = useWallet();
  const walletModal = useWalletModal();

  // state for tracking the current working step
  const [previousWalletState, setPreviousWalletState] =
    useState<WalletContextState>(wallet);
  const [processingStage, setProcessingStage] = useState<PROCESSING_STAGE>(
    PROCESSING_STAGE.IDLE,
  );

  /**
   * Handler function for the "sign in with solana" option
   * note: since we are using the `useCallback` hook and using `wallet` as a dependency,
   * after the user connects their wallet, they will be auto prompted to sign the message!
   */
  const handleSignInWithSolana = useCallback(async () => {
    if (
      processingStage !== PROCESSING_STAGE.IDLE &&
      processingStage !== PROCESSING_STAGE.WALLET_CONNECT
    ) {
      console.warn("Invalid processing stage");
      console.warn(processingStage);
      return;
    }

    // when the user has not connected their wallet, trigger the modal
    if (!wallet.connected) {
      walletModal.setVisible(true);
      console.info("wallet not connected");
      return;
    }

    // if (wallet.connecting)
    setProcessingStage(PROCESSING_STAGE.WALLET_CONNECT);

    // set the default callback url
    let callbackUrl = !!callbackPath
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

      setProcessingStage(PROCESSING_STAGE.WALLET_SIGN);

      // create the message for the user to sign
      const signInMessage = new SolanaSignInMessage({
        message: {
          domain: window.location.host,
          address: wallet.publicKey.toBase58(),
          statement: `Sign in to ${SITE.name}`,
          resources: [SITE.url],
          nonce: csrf,
        },
      });

      try {
        // get the user's wallet to sign the requests (`signIn` is preferred if supported)
        if (!!wallet.signIn) {
          await wallet.signIn(signInMessage.message).then((res) => {
            // store the wallet signed data
            signInMessage.storeSignature({
              // note: the wallet could sign with a different wallet...
              address: res.account.address,
              signature: base58.encode(res.signature),
              signedMessage: base58.encode(res.signedMessage),
            });
          });
        } else {
          const messageToSign = new TextEncoder().encode(
            signInMessage.prepare(),
          );

          // request the user sign the message using the fallback methods
          // i.e wallets that do not support the SIWS spec (aka the `signIn` function)
          await wallet.signMessage(messageToSign).then((sig) => {
            // store the wallet signed data
            signInMessage.storeSignature({
              address: wallet.publicKey?.toBase58(),
              signature: base58.encode(sig),
              signedMessage: base58.encode(messageToSign),
            });
          });
        }

        // ensure we actually have a signature after attempting all wallet sign attempts
        if (!signInMessage.signedData) throw Error("Unknown signature");
      } catch (err) {
        console.error("Wallet failed to sign message:", err);
        toast.error("You must sign the message with your wallet to sign in");

        // stop processing when the user did not actually sign the message
        setProcessingStage(PROCESSING_STAGE.IDLE);
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
        message: JSON.stringify(signInMessage.message),
        signedData: JSON.stringify(signInMessage.signedData),
      })
        .then((res) => {
          // console.log("signin res:", res);

          if (!res?.ok) throw `Bad response: ${res?.error || "unknown"}`;

          setProcessingStage(PROCESSING_STAGE.SUCCESS);

          toast.success("Successfully signed in!");

          // manually redirect the user to the manually defined callbackUrl
          window.location.href = callbackUrl;
        })
        .catch((err) => {
          console.warn("signIn error:", err);
          toast.error("Unable to Sign in with Solana");
          setProcessingStage(PROCESSING_STAGE.IDLE);
          throw err;
        });
    } catch (err) {
      console.error("handleSignInWithSolana failed::", err);

      setProcessingStage(PROCESSING_STAGE.IDLE);

      toast.error("An unknown signin error occurred");
    }
  }, [wallet, processingStage, walletModal, setProcessingStage, callbackPath]);

  /**
   * handle the various wallet state changes to provider better ux
   */
  useEffect(() => {
    if (previousWalletState.connected == false) {
      // not connected, but now connecting
      if (wallet.connecting == true)
        setProcessingStage(PROCESSING_STAGE.WALLET_CONNECT);
      // use canceled the wallet connection without connecting
      else if (wallet.connecting == false)
        setProcessingStage(PROCESSING_STAGE.IDLE);
      // the user just connected their wallet
      if (wallet.connected && !!wallet.publicKey) handleSignInWithSolana();
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
      <section className="z-10 flex flex-col !items-stretch gap-2 p-8 card">
        <Suspense>
          {/* <WalletButton /> */}

          <button
            type="button"
            onClick={handleSignInWithSolana}
            disabled={processingStage !== PROCESSING_STAGE.IDLE}
            className={`btn w-full btn-black inline-flex items-center py-3 justify-center text-center gap-2`}
          >
            <SignInButtonLabel stage={processingStage} />
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
        </Suspense>
      </section>
    </div>
  );
});

const SignInButtonLabel = ({ stage }: { stage: PROCESSING_STAGE }) => {
  switch (stage) {
    case PROCESSING_STAGE.WALLET_CONNECT:
      return <>Connecting to wallet...</>;
    case PROCESSING_STAGE.WALLET_SIGN:
      return <>Waiting for wallet approval...</>;
    case PROCESSING_STAGE.SUCCESS:
      return <>Success! Redirecting...</>;
    case PROCESSING_STAGE.IDLE:
    // note: idle uses default
    default:
      return <>Sign in with Solana</>;
  }
};
