"use client";

import React, { memo, useCallback, useMemo, useState } from "react";

import Image, { ImageProps } from "next/image";
import Dialog, { DialogHeader, DialogProps } from "@/components/core/Dialog";
import type { Session } from "next-auth";
import type { AccountsGroupByProvider } from "@/types";

import solanaIcon from "@/../public/icons/solana-black.svg";
import githubIcon from "@/../public/icons/github-square.svg";
import xIcon from "@/../public/icons/x-square.svg";
import infoIcon from "@/../public/icons/info.svg";
import Link from "next/link";
import { shortWalletAddress } from "@/lib/helpers";
import clsx from "clsx";

enum TaskStatus {
  IDLE,
  CONNECTED,
  COMPLETE,
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
            buttonLabel={
              hasSolanaAccount
                ? hasOtherAccounts
                  ? "Locked"
                  : "Change"
                : "Connect"
            }
            status={TaskStatus.CONNECTED}
            onClick={() => alert("wallet")}
          />
          {!hasOtherAccounts && (
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
            buttonLabel={"Connect"}
            status={TaskStatus.IDLE}
            onClick={() => alert("github")}
          />
          <TaskItemCard
            imageSrc={xIcon}
            title="X / Twitter"
            description="Prove you participate in the Solana community"
            buttonLabel={"Connect"}
            status={TaskStatus.IDLE}
            onClick={() => alert("twitter")}
          />
          <TaskItemCard
            imageSrc={infoIcon}
            title="Answer these 2 questions"
            description="Quick and to the point. ~2 minutes to complete."
            buttonLabel={"Start"}
            status={TaskStatus.IDLE}
            onClick={() => setDialogOpen(true)}
          />
        </div>
      </>
    );
  },
);

type TaskItemCardProps = {
  title: string;
  status: TaskStatus;
  buttonLabel: string;
  description: React.ReactNode;
  imageSrc: ImageProps["src"];
  onClick?: React.ComponentProps<"button">["onClick"];
};

export const TaskItemCard = ({
  title,
  buttonLabel,
  status,
  description,
  imageSrc,
  onClick,
}: TaskItemCardProps) => {
  const buttonClass = useMemo(() => {
    switch (status) {
      case TaskStatus.COMPLETE:
        return "";
      case TaskStatus.CONNECTED:
        return "btn-ghost";
      case TaskStatus.IDLE:
        return "btn-black";
    }

    // default return something always
    return "btn-ghost";
  }, [status]);

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

      <button
        type="button"
        className={clsx("btn w-28 justify-center", buttonClass)}
        disabled={status == TaskStatus.COMPLETE}
        aria-disabled={status == TaskStatus.COMPLETE}
        onClick={onClick}
      >
        {buttonLabel}
        {/* <FeatherIcon
            name="Check"
            strokeWidth={2}
            size={20}
            className="bg-green-600 text-white rounded-full p-[4px] flex-shrink-0"
          /> */}
        {/* <FeatherIcon
            name="X"
            strokeWidth={2}
            className="bg-red-600 text-white rounded-full p-[5px] h-7 w-7 flex-shrink-0"
          /> */}
      </button>
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
                Save Changes
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
