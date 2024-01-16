"use client";

import Dialog, { DialogProps } from "@/components/core/Dialog";
import { memo, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PodcastEpisode } from "contentlayer/generated";
import toast from "react-hot-toast";
import Image from "next/image";
import { SessionProvider, getCsrfToken } from "next-auth/react";
import { fetcher } from "@/lib/api";
import { PulseLoader } from "react-spinners";
import { SolanaProvider } from "@/context/SolanaProvider";
import { WalletContextState, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { WALLET_STAGE, walletButtonLabel } from "@/lib/solana/const";
import base58 from "bs58";
import { SITE } from "@/lib/const/general";
import { SolanaSignInMessage } from "@/lib/solana/SignInMessage";

import Confetti from "react-dom-confetti";

type EpisodeMintDialogProps = {
  episode: PodcastEpisode;
  onSuccess?: Function;
};

export const EpisodeMintButton = memo(({ episode }: EpisodeMintDialogProps) => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExploding, setIsExploding] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // auto open the modal via a direct url route i.e. `/<ep>?mint`
  useEffect(() => {
    if (searchParams.has("mint")) setIsOpen(true);
  }, [searchParams, setIsOpen, isOpen]);

  /**
   * make it a party!
   */
  const partyTime = useCallback(() => {
    setIsExploding(true);
    setIsComplete(true);
    return new Promise((r) =>
      setTimeout(() => {
        setIsExploding(false);
        return r;
      }, 1000),
    );
  }, [setIsExploding]);

  return (
    <SessionProvider>
      <SolanaProvider>
        <div className="absolute right-[50%]">
          <Confetti
            active={isExploding}
            config={{
              angle: -95,
              spread: 200,
              startVelocity: 80,
              // startVelocity: 45,
              elementCount: 200,
              // elementCount: 100,
              dragFriction: 0.15,
              // duration: 3000,
              duration: 5000,
              stagger: 4,
              width: "10px",
              height: "10px",
              colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
            }}
          />
        </div>

        <EpisodeMintDialog
          episode={episode}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSuccess={partyTime}
        />

        <button
          type="button"
          className={`btn ${isComplete ? "btn-ghost" : "btn-black"}`}
          disabled={isComplete}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isComplete ? <>Collected</> : <>Collect Episode</>}
        </button>
      </SolanaProvider>
    </SessionProvider>
  );
});

export const EpisodeMintDialog = memo(
  ({
    episode,
    isOpen,
    setIsOpen,
    onSuccess,
  }: EpisodeMintDialogProps & DialogProps) => {
    const searchParams = useSearchParams();

    const wallet = useWallet();
    const walletModal = useWalletModal();

    const [loading, setLoading] = useState<boolean>(false);
    const [complete, setComplete] = useState<boolean>(false);
    const [previousWalletState, setPreviousWalletState] =
      useState<WalletContextState>(wallet);
    const [processingStage, setProcessingStage] = useState<WALLET_STAGE>(
      WALLET_STAGE.IDLE,
    );

    // auto open the modal via a direct url route i.e. `/<ep>?mint`
    useEffect(() => {
      if (searchParams.has("mint")) setIsOpen(true);
    }, [searchParams, setIsOpen, isOpen]);

    /**
     *
     */
    const connectWalletAndSign = useCallback(async () => {
      try {
        // when the user has not connected their wallet, trigger the modal
        if (!!wallet.wallet?.adapter) {
          setProcessingStage(WALLET_STAGE.WALLET_CONNECT);
          await wallet.connect();
        }

        if (!wallet.publicKey?.toBase58()) {
          console.log("still no wallet connected");
          return;
        }

        setProcessingStage(WALLET_STAGE.WALLET_CONNECT);

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
          const signInMessage = new SolanaSignInMessage({
            message: {
              domain: window.location.host,
              address: wallet.publicKey.toBase58(),
              statement: `Sign in to ${SITE.name}`,
              // resources: [SITE.url],
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

            // all done with the wallet!
            setProcessingStage(WALLET_STAGE.IDLE);
            return signInMessage;
          } catch (err) {
            console.error("Wallet failed to sign message:", err);

            // stop processing when the user did not actually sign the message
            setProcessingStage(WALLET_STAGE.IDLE);
            return;
          }
        } catch (err) {
          console.error("handleSignInWithSolana failed::", err);

          setProcessingStage(WALLET_STAGE.IDLE);

          toast.error("An unknown signin error occurred");
        }
      } catch (err) {
        console.warn(err);
      }

      // always reset loading
      setLoading(false);
    }, [
      // comment for better diffs
      loading,
      setLoading,
      wallet,
      processingStage,
      walletModal,
      setProcessingStage,
    ]);

    /**
     *
     */
    const onSubmitHandler = useCallback(
      async (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (loading) return;

        try {
          // if (typeof onSuccess == "function") {
          //   setIsOpen(false);
          //   return onSuccess();
          // }

          if (!wallet.wallet?.adapter) {
            walletModal.setVisible(true);
            return;
          }

          // get the user to sign a message and verify wallet ownership
          let signInMessage = await connectWalletAndSign();

          if (!signInMessage?.signedData) {
            console.info("No signed message. Did you cancel the wallet popup?");
            return;
          }

          setLoading(true);

          await fetcher<any>(`/api/podcast/mint/${episode.ep}`, {
            method: "POST",
            body: signInMessage,
          }).then((res) => {
            console.log(res);

            toast.success(res, {
              position: "top-center",
              duration: 6000,
            });

            setIsOpen(false);
            setLoading(false);

            if (typeof onSuccess == "function") {
              onSuccess();
            }
          });
        } catch (err) {
          console.warn(err);

          if (err instanceof Error) toast.error(err.message);
          else toast.error("An unknown error occurred");
        }

        // always reset loading
        setLoading(false);
      },
      [
        // comment for better diffs
        loading,
        setLoading,
        setIsOpen,
        wallet,
        walletModal,
        connectWalletAndSign,
      ],
    );

    /**
     * handle the various wallet state changes to provider better ux
     */
    useEffect(() => {
      if (previousWalletState.connected == false) {
        // toast("prev");
        // not connected, but now connecting
        if (wallet.connecting == true)
          setProcessingStage(WALLET_STAGE.WALLET_CONNECT);
        // use canceled the wallet connection without connecting
        else if (wallet.connecting == false)
          setProcessingStage(WALLET_STAGE.IDLE);

        if (!previousWalletState.wallet?.adapter && !!wallet.wallet?.adapter) {
          onSubmitHandler();
        } else if (!!wallet.publicKey?.toBase58()) {
          onSubmitHandler();
        }
      }

      setPreviousWalletState(wallet);
    }, [wallet, onSubmitHandler, previousWalletState, setPreviousWalletState]);

    return (
      <>
        <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
          <form onSubmit={onSubmitHandler} className={"grid h-full w-full"}>
            <section className="gap-0 bg-white">
              <section className="p-5 text-center border-b h-min border-slate-200">
                <h4 className="text-xl font-semibold">Collect this Episode</h4>
                <p className="text-sm text-gray-500">
                  Mint this podcast episode as a digital collectible
                </p>
              </section>

              <section className="p-8 space-y-5 w-full">
                <div className="rounded-lg overflow-hidden border relative mx-auto max-h-64 aspect-video text-center flex items-center justify-center">
                  <Image
                    fill
                    priority={true}
                    src={episode.image || "/media/podcast/cover0.jpg"}
                    alt={""}
                    className="rounded-lg p-4"
                  />
                </div>
              </section>

              <section className="h-full px-8 py-4 space-y-2 bg-slate-100">
                <section className="flex items-center w-full gap-3 place-self-end">
                  <button
                    type="submit"
                    disabled={loading || processingStage !== WALLET_STAGE.IDLE}
                    className="order-2 btn w-full btn-black justify-center"
                  >
                    {!!loading ? (
                      <div>
                        <PulseLoader
                          size={8}
                          color={
                            // status == TaskStatus.DISABLED || status == TaskStatus.COMPLETE
                            //   ? "black" :
                            "white"
                          }
                        />
                      </div>
                    ) : (
                      walletButtonLabel({
                        stage: processingStage,
                        placeholder: "Claim & Collect",
                        success: "Success!",
                      })
                    )}
                  </button>
                </section>

                <div className="flex items-center justify-center text-sm">
                  <a
                    className="link hover:underline hover:text-hot-pink"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      wallet
                        .disconnect()
                        .then(() => walletModal.setVisible(true));
                    }}
                  >
                    Connect a different wallet?
                  </a>
                </div>
              </section>
            </section>
          </form>
        </Dialog>
      </>
    );
  },
);
