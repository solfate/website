"use client";

import React, { memo, useCallback, useMemo, useState } from "react";

import Image, { ImageProps } from "next/image";
import Dialog, { DialogHeader, DialogProps } from "@/components/core/Dialog";
import type { Session } from "next-auth";
import type { AccountsGroupByProvider } from "@/types";
import { signIn, signOut } from "next-auth/react";

import solanaIcon from "@/../public/icons/solana-black.svg";
import githubIcon from "@/../public/icons/github-square.svg";
import xIcon from "@/../public/icons/x-square.svg";
import infoIcon from "@/../public/icons/info.svg";
import Link from "next/link";
import { shortWalletAddress } from "@/lib/helpers";
import clsx from "clsx";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";

enum TaskStatus {
  IDLE,
  CONNECTED,
  COMPLETE,
  DISABLED,
}

type DeveloperListFormProps = {
  session: Option<Session>;
  groupedAccounts: Option<AccountsGroupByProvider>;
};

export const DeveloperListForm = memo(
  ({ session, groupedAccounts }: DeveloperListFormProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    // simplified status of the user having connected their wallet
    const hasSolanaAccount =
      !!session?.user.id && !!groupedAccounts?.solana.length;

    // simplified status of if the user has connected ANY other social accounts
    const hasOtherAccounts =
      !!groupedAccounts?.github.length || !!groupedAccounts?.twitter.length;

    // simplified status of having connected all accounts
    const hasAllAccounts =
      hasSolanaAccount &&
      !!groupedAccounts?.github.length &&
      !!groupedAccounts?.twitter.length;

    /**
     * Authenticate to Twitter / X
     */
    const twitterAuth = useCallback(
      () =>
        signIn("twitter", {
          redirect: true,
          // force override the callback data
          callbackUrl: window.location.href,
        }),
      [],
    );

    /**
     * Authenticate to GitHub
     */
    const githubAuth = useCallback(
      () =>
        signIn("github", {
          redirect: true,
          // force override the callback data
          callbackUrl: window.location.href,
        }),
      [],
    );

    /**
     * Solana signout with callback
     */
    const handleSolana = useCallback(() => {
      // construct a callback url to bring the user back to the `/developers` page after signin
      const url = new URL(
        "/signin",
        `${window.location.protocol}//${window.location.host}`,
      );
      url.searchParams.set(
        "callbackUrl",
        `${window.location.protocol}//${window.location.host}/developers`,
      );

      // if the user is not signed in, redirect to the signin page
      if (!hasSolanaAccount) window.location.href = url.toString();
      // if user has connected a wallet and any other account, do nothing
      else if (hasSolanaAccount && hasOtherAccounts) return;
      // if the user has connected a solana account, but not other socials, aid them in swapping wallets
      else
        return signOut({
          redirect: true,
          callbackUrl: url.toString(),
        });
    }, [hasSolanaAccount, hasOtherAccounts]);

    /**
     * Developer questionnaire callback
     */
    const handleQuestions = useCallback(() => {
      if (!hasSolanaAccount)
        return toast.error("You must sign in with a Solana wallet");
      else if (
        !groupedAccounts?.github.length ||
        !groupedAccounts?.twitter.length
      )
        return toast.error("Connect your GitHub and Twitter first");
      // actually open the dialog
      else return setDialogOpen(true);
    }, [hasSolanaAccount, hasOtherAccounts]);

    return (
      <>
        <DeveloperListQuestionsDialog
          isOpen={dialogOpen}
          setIsOpen={setDialogOpen}
        />

        <div className="max-w-2xl mx-auto space-y-4">
          <TaskItemCard
            imageSrc={solanaIcon}
            title="Solana Wallet"
            description={
              !hasSolanaAccount ? (
                "Connect any Solana wallet. Even a burner."
              ) : (
                <>
                  Connected to{" "}
                  <Link
                    href={`https://solana.fm/address/${groupedAccounts.solana[0].providerAccountId}`}
                    target="_blank"
                    className="underline hover:text-hot-pink"
                  >
                    {shortWalletAddress(
                      groupedAccounts.solana[0].providerAccountId,
                    )}
                  </Link>
                </>
              )
            }
            button={
              <ButtonWithLoader
                status={
                  hasSolanaAccount
                    ? hasOtherAccounts
                      ? TaskStatus.COMPLETE
                      : TaskStatus.CONNECTED
                    : TaskStatus.IDLE
                }
                children={
                  hasSolanaAccount
                    ? hasOtherAccounts
                      ? "Locked"
                      : "Change"
                    : "Connect"
                }
                onClick={handleSolana}
              />
            }
          />
          {hasSolanaAccount && !hasOtherAccounts && (
            <div className="text-center card text-sm border-yellow-500 bg-yellow-300">
              <h4 className="font-semibold text-base">Caution</h4>
              <p>
                Once you connect <span className="font-bold">ANY</span> other
                accounts below, you will <span className="font-bold">NOT</span>{" "}
                be able to change your wallet address. Be sure this is the
                wallet address you want listed{" "}
                <span className="font-bold">publicly</span> on this list.
              </p>
            </div>
          )}
          <TaskItemCard
            imageSrc={githubIcon}
            title="GitHub"
            description="Prove your contributions to the Solana ecosystem"
            button={
              <ButtonWithLoader
                onClick={
                  !!groupedAccounts?.github.length ? undefined : githubAuth
                }
                status={
                  !!groupedAccounts?.github.length
                    ? TaskStatus.COMPLETE
                    : TaskStatus.IDLE
                }
                children={
                  !!groupedAccounts?.github.length ? "Completed" : "Connect"
                }
              />
            }
          />
          <TaskItemCard
            imageSrc={xIcon}
            title="X / Twitter"
            description="Prove you participate in the Solana community"
            button={
              <ButtonWithLoader
                onClick={
                  !!groupedAccounts?.twitter.length ? undefined : twitterAuth
                }
                status={
                  !!groupedAccounts?.twitter.length
                    ? TaskStatus.COMPLETE
                    : TaskStatus.IDLE
                }
                children={
                  !!groupedAccounts?.twitter.length ? "Completed" : "Connect"
                }
              />
            }
          />
          <TaskItemCard
            imageSrc={infoIcon}
            title="Answer these 2 questions"
            description="Quick and to the point. ~2 minutes to complete."
            button={
              <ButtonWithLoader
                status={hasAllAccounts ? TaskStatus.IDLE : TaskStatus.DISABLED}
                onClick={handleQuestions}
                children={"Start"}
              />
            }
          />
        </div>
      </>
    );
  },
);

type ButtonWithLoaderProps = {
  children: React.ReactNode;
  loading?: boolean;
  status: TaskStatus;
  onClick?: React.ComponentProps<"button">["onClick"];
};

export const ButtonWithLoader = ({
  children,
  loading,
  status,
  onClick,
}: ButtonWithLoaderProps) => {
  const buttonClass = useMemo(() => {
    switch (status) {
      case TaskStatus.COMPLETE:
      case TaskStatus.COMPLETE:
      case TaskStatus.CONNECTED:
        return "btn-ghost";
      case TaskStatus.DISABLED:
      case TaskStatus.IDLE:
        return "btn-black";
    }

    // default return something always
    return "btn-ghost";
  }, [status]);

  return (
    <button
      type="button"
      className={clsx("btn w-28 justify-center", buttonClass)}
      disabled={status == TaskStatus.COMPLETE || status == TaskStatus.DISABLED}
      aria-disabled={
        status == TaskStatus.COMPLETE || status == TaskStatus.DISABLED
      }
      onClick={onClick}
    >
      {!!loading ? (
        <div>
          <PulseLoader size={8} color="white" />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

type TaskItemCardProps = {
  title: string;
  description: React.ReactNode;
  imageSrc: ImageProps["src"];
  button: React.ReactNode;
};

export const TaskItemCard = ({
  title,
  description,
  imageSrc,
  button,
}: TaskItemCardProps) => {
  return (
    <div className="card flex items-center justify-between">
      <div className="flex gap-3 items-center">
        <Image
          priority
          src={imageSrc}
          alt="Connect GitHub"
          className="w-10 h-10 md:w-12 md:h-12"
        />
        <div className="space-y-0">
          <h4 className="font-semibold text-xl inline-flex gap-2">{title}</h4>
          <p className="text-sm">{description}</p>
        </div>
      </div>

      {button}
    </div>
  );
};

export const DeveloperListQuestionsDialog = (props: DialogProps) => {
  //   const {
  //     profileData,
  //     updateProfileData,
  //     elementEditorOpen,
  //     setElementEditorOpen,
  //     elementToEdit,
  //   } = useContext(ProfileEditorContext);

  // initialize the state tracker for the on-page form state
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    why: "",
    who: "",
  });

  // auto reset the editor's state when the `elementToEdit` changes
  //   useEffect(() => {
  //     setFormData(elementToEdit);
  //     setHasChanges(false);
  //   }, [elementToEdit, setFormData, setHasChanges]);

  // helper function to handle the various input state changes
  function updateFormState(name: keyof typeof formData, value: string) {
    // track the status of pending changes
    if (!hasChanges) setHasChanges(true);
    // actually update the form's state
    const data = { ...formData };
    data[name] = value as never;
    setFormData(data);
  }

  /**
   *
   */
  const onSubmitHandler = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // if (!profileData || !elementToEdit || !formData) return;

      // todo:

      // reset the dialog state
      // resetDialog(null);
    },
    [
      // comment for better diffs
      formData,
      // profileData,
      // elementToEdit,
      // updateProfileData,
      // resetDialog,
    ],
  );

  return (
    <Dialog {...props} className="max-w-lg">
      <form onSubmit={onSubmitHandler} className={"grid h-full w-full"}>
        <section className="gap-0 bg-white">
          <DialogHeader
            title={"Answer these 2 questions"}
            description={"Quick and to the point. ~2 minutes to complete."}
          />

          <section className="p-5 space-y-5 w-full">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="rounded-full flex items-center justify-center text-sm flex-shrink-0 bg-gray-200 w-6 h-6">
                  1
                </div>
                <h5 className="font-semibold text-base">
                  Why should you be on this list?
                </h5>
              </div>
              <textarea
                onChange={(e) => updateFormState("why", e.target.value)}
                className="input w-full h-28"
                placeholder="Share details that may be relevant (max 250 chars)"
              ></textarea>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="rounded-full flex items-center justify-center text-sm flex-shrink-0 bg-gray-200 w-6 h-6">
                  2
                </div>
                <h5 className="font-semibold text-base">
                  Who can vouch for you?
                </h5>
              </div>
              <textarea
                onChange={(e) => updateFormState("who", e.target.value)}
                className="input w-full h-28"
                placeholder="Share anyone you think will vouch for you and your contributions to the Solana ecosystem (i.e. people, entities, communities) (max 250 chars)"
              ></textarea>
            </div>
          </section>

          <section className="h-full px-8 py-4 bg-slate-100">
            <section className="flex items-center w-full gap-3 place-self-end">
              <button
                type="submit"
                disabled={!hasChanges}
                className="order-2 btn w-full btn-black justify-center"
              >
                Submit
              </button>
              <button
                type="button"
                className="order-1 w-full btn btn-ghost justify-center !border-gray-300"
                onClick={() => props.setIsOpen(false)}
              >
                Cancel
              </button>
            </section>
          </section>
        </section>
      </form>
    </Dialog>
  );
};
