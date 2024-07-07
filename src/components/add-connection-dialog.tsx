"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCallback, useEffect, useState } from "react";
import { getCsrfToken, signIn } from "next-auth/react";
import { Icons } from "@/components/ui/icons";
import {
  useConnection,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { WALLET_STAGE } from "@/lib/solana/const";
import { createSolanaAuthTransaction, SolanaAuth } from "solana-auth";
import { SITE } from "@/lib/const/general";
import base58 from "bs58";
import toast from "react-hot-toast";
import { SolanaProviderId } from "@/lib/auth/const";

type AuthPlatforms = "twitter" | "github" | "solana";

export function AddConnectionDialog() {
  const [loading, setLoading] = useState<false | AuthPlatforms>(false);

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

  const baseCallback = "/settings/connections";

  /**
   * Authenticate to Twitter / X
   */
  const twitterAuth = useCallback(() => {
    setLoading("twitter");
    return signIn("twitter", {
      redirect: false,
      // force override the callback data
      callbackUrl: `${baseCallback}?type=twitter`,
    });
  }, []);

  /**
   * Authenticate to GitHub
   */
  const githubAuth = useCallback(() => {
    setLoading("github");
    return signIn("github", {
      redirect: false,
      // force override the callback data
      callbackUrl: `${baseCallback}?type=github`,
    });
  }, []);

  /**
   * Handler function for the "sign in with solana" option
   * note: since we are using the `useCallback` hook and using `wallet` as a dependency,
   * after the user connects their wallet, they will be auto prompted to sign the message!
   */
  const solanaAuth = useCallback(async () => {
    // setLoading("solana");

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
        wallet.disconnect().then(() => walletModal.setVisible(true));
        return;
      }
    } catch (err) {}

    if (!wallet.publicKey?.toBase58()) {
      console.log("still no wallet connected");
      walletModal.setVisible(true);
      return;
    }

    // if (wallet.connecting)
    setProcessingStage(WALLET_STAGE.WALLET_CONNECT);

    try {
      // get a csrf token from the server for the user to sign it
      const csrf = await getCsrfToken();
      if (!wallet.publicKey || !csrf || !wallet.signMessage) {
        // todo: should we set a stage tracker here?

        // we return here so the auto connect useEffect below can re-initiate
        // the connection flow after the user select a wallet
        console.log("wait here");
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
        toast.error("You must sign the message to verify your wallet");

        // stop processing when the user did not actually sign the message
        setProcessingStage(WALLET_STAGE.IDLE);
        return;
      }

      /**
       * finally, attempt to sign the user into the website
       * using the `solana` credential via next-auth
       */
      return signIn(SolanaProviderId, {
        // auto redirect causes some error, so we will do it manually
        redirect: false,
        callbackUrl: `${baseCallback}?type=solana`,
        message: JSON.stringify(solanaAuth.message),
        signedData: JSON.stringify(solanaAuth.signedData),
      })
        .then((res) => {
          console.log("signin res:", res);

          if (!res?.ok) throw `Bad response: ${res?.error || "unknown"}`;
          if (res.error) throw res.error;

          setProcessingStage(WALLET_STAGE.SUCCESS);

          toast.success("Successfully connected your Solana wallet!");

          // manually redirect the user to the manually defined callbackUrl
          window.location.href = `${baseCallback}?type=solana`;
        })
        .catch((err) => {
          console.warn("signIn error:", err);
          let message = "Unable to verify Solana wallet";
          if (typeof err == "string") message = err;
          toast.error(message);
          setProcessingStage(WALLET_STAGE.IDLE);
          throw err;
        });
    } catch (err) {
      console.error("handleSignInWithSolana failed::", err);

      setProcessingStage(WALLET_STAGE.IDLE);

      toast.error("An unknown Solana wallet error occurred");
    }
  }, [
    wallet,
    connection,
    isLedger,
    processingStage,
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
      if (wallet.connected && !!wallet.publicKey) solanaAuth();
      else if (
        !previousWalletState.wallet?.adapter &&
        !!wallet.wallet?.adapter
      ) {
        solanaAuth();
      }
    }

    setPreviousWalletState(wallet);
  }, [wallet, solanaAuth, previousWalletState, setPreviousWalletState]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Connect Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect an Account</DialogTitle>
          <DialogDescription>
            Connect a new Solana wallet, external account, or third-party
            service
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          <DialogClose asChild>
            <Button
              onClick={() =>
                wallet.disconnect().then(() => walletModal.setVisible(true))
              }
              variant="outline"
              type="button"
              disabled={Boolean(loading)}
            >
              {loading == "solana" ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.solana className="mr-2 h-4 w-4" />
              )}
              Solana Wallet
            </Button>
          </DialogClose>

          <Button
            onClick={twitterAuth}
            variant="outline"
            type="button"
            disabled={Boolean(loading)}
          >
            {loading == "twitter" ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.twitter className="mr-2 h-4 w-4" />
            )}
            Twitter / X.com
          </Button>

          <Button
            type="button"
            onClick={githubAuth}
            variant="outline"
            disabled={Boolean(loading)}
          >
            {loading == "github" ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.gitHub className="mr-2 h-4 w-4" />
            )}
            GitHub
          </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
