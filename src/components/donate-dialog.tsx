"use client";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  useUnifiedWallet,
  useConnection,
  UnifiedWalletButton,
  UnifiedWalletProvider,
  ConnectionProvider,
} from "@jup-ag/wallet-adapter";
import { cn } from "@/lib/utils";
import { TREASURY_PLATFORM_FEE } from "@/lib/const/solana";
import { Icons } from "./ui/icons";
import { createTipSolTransaction } from "@/lib/solana/actions";

export function DonateDialog(props: {
  tokenSymbol?: string;
  walletAddress: string;
  label?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <ConnectionProvider
      endpoint={
        process?.env?.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta")
      }
    >
      <UnifiedWalletProvider
        wallets={[]}
        config={{
          autoConnect: false,
          env: "mainnet-beta",
          metadata: {
            name: "UnifiedWallet",
            description: "UnifiedWallet",
            url: "https://jup.ag",
            iconUrls: ["https://jup.ag/favicon.ico"],
          },
          // notificationCallback: {},
          walletlistExplanation: {
            href: "https://station.jup.ag/docs/additional-topics/wallet-list",
          },
          theme: "dark",
          lang: "en",
          notificationCallback: {
            onConnect: () => {
              setModalOpen(true);
            },
            onConnecting: () => {
              setModalOpen(true);
            },
            onNotInstalled: () => {},
            onDisconnect: () => {},
          },
        }}
      >
        <DonateDialogInner
          {...props}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </UnifiedWalletProvider>
    </ConnectionProvider>
  );
}
export function DonateDialogInner({
  walletAddress,
  tokenSymbol = "SOL",
  label = "Send Tip",
  modalOpen,
  setModalOpen,
}: {
  tokenSymbol?: string;
  walletAddress: string;
  label?: string;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const wallet = useUnifiedWallet();
  const { connection } = useConnection();

  const [walletState, setWalletState] = useState(false);
  const [amount, setAmount] = useState("");

  async function transferSol(tokenAmount: string) {
    let amount: number = 0;
    try {
      if (!tokenAmount) throw "An amount is required";
      amount = parseFloat(tokenAmount);
      if (Number.isNaN(amount))
        throw "Invalid amount provided. It must be a number";
      if (amount <= 0) throw "Amount must be greater than zero";
    } catch (err) {
      let message = "Invalid amount provided";
      if (typeof err == "string") message = err;
      return toast.error(message);
    }

    let recipient: PublicKey;
    try {
      recipient = new PublicKey(walletAddress);
    } catch (err) {
      throw "Invalid recipient wallet address provided";
    }

    if (!wallet.publicKey) {
      // console.log("still no wallet connected");
      return toast.error("You must connect a wallet");
    }

    setWalletState(true);

    try {
      if (amount <= 0) throw "Amount must be greater than zero";

      // todo: verify the sender has at least `amount` of tokens
      const balance = await connection.getBalance(wallet.publicKey);
      if (balance < amount + amount * TREASURY_PLATFORM_FEE) {
        throw `Insufficient ${tokenSymbol} balance. Currently: ${balance / LAMPORTS_PER_SOL} ${tokenSymbol}`;
      }

      const transaction = createTipSolTransaction(
        wallet.publicKey,
        recipient,
        amount,
      );
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      const sig = await wallet.sendTransaction(transaction, connection);
      // .catch((err) => {
      //   console.log(err);
      //   throw "Transaction error";
      // })
      // .finally(() => {
      //   alert("derp");
      // });

      console.log("signature:", sig);

      if (!sig) throw "Unable to confirm transaction";

      // confirm the transaction?
      // todo

      return toast.success("Transaction complete!");
    } catch (err) {
      console.error("failed::", err);

      let message = "An unknown error occurred";

      if (typeof err == "string") message = err;
      else if (err instanceof Error) message = err.message;

      toast.error(message);
    } finally {
      // setLoading(false);

      setWalletState(false);
    }
  }

  useEffect(() => {
    if (modalOpen) {
      // Pushing the change to the end of the call stack
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 0);

      return () => clearTimeout(timer);
    } else {
      document.body.style.pointerEvents = "auto";
    }
  }, [modalOpen]);

  return (
    <Dialog
      modal={true}
      open={modalOpen}
      onOpenChange={() => setModalOpen(!modalOpen)}
    >
      <DialogTrigger asChild>
        <Button variant="info">{label}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {walletState && (
          <div className="z-10 rounded-lg absolute w-full bg-black h-full bg-opacity-50 flex flex-col items-center justify-center">
            <Icons.spinner className="size-12 animate-spin text-white" />
            <p className="text-xl font-medium text-secondary">
              Waiting for wallet...
            </p>
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="text-2xl">Send a Tip</DialogTitle>
          <DialogDescription>
            Help support this builder by tipping them directly with{" "}
            {tokenSymbol}, sending it to their public wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 relative">
          <UnifiedWalletButton
            buttonClassName={cn(
              buttonVariants({ variant: "default" }),
              "!h-auto !py-3 !rounded-lg !text-base !font-normal",
            )}
            currentUserClassName={cn(
              buttonVariants({ variant: "default" }),
              "!h-auto !py-3 !rounded-lg !text-base !font-normal",
            )}
          />
          {!!wallet.publicKey && (
            <>
              <div className="grid grid-cols-3 justify-between gap-2">
                <Button
                  type="button"
                  disabled={walletState}
                  onClick={() => transferSol("0.1")}
                  className="w-full whitespace-pre-wrap h-auto"
                >{`Send 0.1 ${tokenSymbol}`}</Button>
                <Button
                  type="button"
                  disabled={walletState}
                  onClick={() => transferSol("0.5")}
                  className="w-full whitespace-pre-wrap h-auto"
                >{`Send 0.5 ${tokenSymbol}`}</Button>
                <Button
                  type="button"
                  disabled={walletState}
                  onClick={() => transferSol("1.0")}
                  className="w-full whitespace-pre-wrap h-auto"
                >{`Send 1.0 ${tokenSymbol}`}</Button>
              </div>

              <div className="flex item-center  gap-2 justify-center">
                <hr className="block my-auto bg-muted-foreground h-[1px] flex-grow" />
                <div className="flex-shrink-0">or</div>
                <hr className="my-auto bg-muted-foreground h-[1px] flex-grow" />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  transferSol(amount);
                }}
                className="space-y-8"
              >
                <div className="flex items-center gap-2">
                  <Input
                    disabled={walletState}
                    placeholder={`Enter any amount of ${tokenSymbol} to send`}
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                  />
                  <Button type="submit" disabled={walletState}>
                    Send
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
        <DialogFooter className="grid grid-cols-1">
          <DialogClose asChild>
            <Button type="button" variant={"outline"}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
