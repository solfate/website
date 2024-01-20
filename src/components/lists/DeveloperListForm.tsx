"use client";

import React, { memo, useCallback, useMemo, useState } from "react";

import Image, { ImageProps } from "next/image";
import Dialog, { DialogHeader, DialogProps } from "@/components/core/Dialog";
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
import { TwitterProfile } from "next-auth/providers/twitter";
import { GithubProfile } from "next-auth/providers/github";
import { fetcher } from "@/lib/api";
import { ApiDevelopersPostInput } from "@/types/api/developers";
import { ApiAuthDisconnectDeleteInput } from "@/types/api/auth";

enum TaskStatus {
  IDLE,
  CONNECTED,
  COMPLETE,
  DISABLED,
}

type DeveloperListFormProps = {
  groupedAccounts: Option<AccountsGroupByProvider>;
};

export const DeveloperListForm = memo(
  ({ groupedAccounts }: DeveloperListFormProps) => {
    const [loading, setLoading] = useState<false | string>(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    /**
     * Simplified tracking data for the connected accounts
     */
    const accounts = useMemo(
      () => {
        const data = {
          // extract the connected solana wallet address
          solana: !!groupedAccounts?.solana?.length
            ? groupedAccounts.solana[0].providerAccountId
            : false,
          // extract the connected twitter username
          twitter: !!groupedAccounts?.twitter?.length
            ? (
                groupedAccounts.twitter[0]
                  .provider_profile as object as TwitterProfile
              ).data.username
            : false,
          // extract the connected github username
          github: !!groupedAccounts?.github?.length
            ? (
                groupedAccounts.github[0]
                  .provider_profile as object as GithubProfile
              ).login
            : false,
          // assorted other state trackers
          hasOtherAccounts: false,
          hasAllAccounts: false,
        };

        // simplified status of if the user has connected ANY other social accounts
        data.hasOtherAccounts = !!data.github || !!data.twitter;
        // simplified status of having connected all accounts
        data.hasAllAccounts = !!data.solana && !!data.github && !!data.twitter;

        return data;
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [groupedAccounts, loading],
    );

    /**
     * Authenticate to Twitter / X
     */
    const twitterAuth = useCallback(() => {
      setLoading("twitter");
      return signIn("twitter", {
        redirect: true,
        // force override the callback data
        callbackUrl: window.location.href,
      });
    }, []);

    /**
     * Authenticate to GitHub
     */
    const githubAuth = useCallback(() => {
      setLoading("github");
      return signIn("github", {
        redirect: true,
        // force override the callback data
        callbackUrl: window.location.href,
      });
    }, []);

    /**
     * Solana signout with callback
     */
    const handleSolana = useCallback(() => {
      // construct a callback url to bring the user back to the `/devlist` page after signin
      const url = new URL(
        "/signin",
        `${window.location.protocol}//${window.location.host}`,
      );
      url.searchParams.set(
        "callbackUrl",
        `${window.location.protocol}//${window.location.host}/devlist`,
      );

      // if the user is not signed in, redirect to the signin page
      if (!accounts.solana) window.location.href = url.toString();
      // if user has connected a wallet and any other account, do nothing
      else if (!!accounts.solana && accounts.hasOtherAccounts) return;
      // if the user has connected a solana account, but not other socials, aid them in swapping wallets
      else
        return signOut({
          redirect: true,
          callbackUrl: url.toString(),
        });
    }, [accounts]);

    /**
     * Process an account disconnect request
     */
    const disconnectAccount = useCallback(
      async ({ provider, providerAccountId }: ApiAuthDisconnectDeleteInput) => {
        if (!!loading) return;

        if (!provider || !providerAccountId) {
          return toast.error("Missing account details");
        }

        try {
          setLoading(provider);
          await fetcher<ApiAuthDisconnectDeleteInput>("/api/auth/disconnect", {
            method: "DELETE",
            body: {
              provider,
              providerAccountId,
            },
          })
            .then((res) => {
              // console.log(res);

              if (groupedAccounts) {
                delete groupedAccounts[provider as unknown as any];
              }

              toast.success(res);

              return true;
            })
            .catch((err) => {
              console.error(err);
              if (typeof err == "string") toast.error(err);
              else if (err instanceof Error) toast.error(err.message);
              else toast.error("An error occurred");
            });
        } catch (err) {
          console.error("An unknown error occurred", "[0x1235]");
          console.error(err);
          toast.error("An unknown error occurred...");
        }

        // finally reset the loading state
        setLoading(false);
      },
      [
        // comment for better diffs
        loading,
        setLoading,
      ],
    );

    /**
     * Developer questionnaire callback
     */
    const handleQuestions = useCallback(() => {
      if (!accounts.solana)
        return toast.error("You must sign in with a Solana wallet");
      else if (
        !groupedAccounts?.github?.length ||
        !groupedAccounts?.twitter?.length
      )
        return toast.error("Connect your GitHub and Twitter first");
      // actually open the dialog
      else return setDialogOpen(true);
    }, [accounts, groupedAccounts]);

    return (
      <>
        <DeveloperListQuestionsDialog
          isOpen={dialogOpen}
          setIsOpen={setDialogOpen}
        />
        {!accounts.solana ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <TaskItemCard
              imageSrc={solanaIcon}
              title="Solana Wallet"
              description={
                !!accounts.solana ? (
                  <>
                    {"Connected to "}
                    <Link
                      href={`https://solana.fm/address/${accounts.solana}`}
                      target="_blank"
                      className="underline hover:text-hot-pink"
                    >
                      {shortWalletAddress(accounts.solana as string)}
                    </Link>
                  </>
                ) : (
                  <>
                    Connect{" "}
                    <span className="hidden md:inline-block">
                      a Solana wallet
                    </span>{" "}
                    to get started
                  </>
                  // "Connect any Solana wallet. Even a burner."
                )
              }
              button={
                <ButtonWithLoader
                  status={
                    !!accounts.solana
                      ? accounts.hasOtherAccounts
                        ? TaskStatus.DISABLED
                        : TaskStatus.CONNECTED
                      : TaskStatus.IDLE
                  }
                  onClick={handleSolana}
                >
                  {!!accounts.solana
                    ? accounts.hasOtherAccounts
                      ? "Locked"
                      : "Change"
                    : "Connect"}
                </ButtonWithLoader>
              }
            />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="mx-auto max-w-lg text-center text-sm text-gray-500">
              By connecting any accounts (i.e GitHub, Twitter/X) or applying to
              join the DevList, you agree that you have read the{" "}
              <Link href={"/devlist#faq"} className="underline">
                FAQ
              </Link>{" "}
              and agree to the{" "}
              <Link href={"/devlist#tos"} className="underline">
                Terms of Service
              </Link>{" "}
              detailed below.
            </p>

            {/* {!!accounts.solana && !accounts.hasOtherAccounts && (
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
          )} */}
            <TaskItemCard
              imageSrc={githubIcon}
              title="GitHub"
              description={
                !!accounts.github ? (
                  <>
                    {"Connected to "}
                    <Link
                      href={`https://github.com/${accounts.github}`}
                      target="_blank"
                      className="underline hover:text-hot-pink"
                    >
                      @{accounts.github}
                    </Link>
                  </>
                ) : (
                  "Prove your code contributions to the Solana ecosystem."
                )
              }
              button={
                <ButtonWithLoader
                  loading={!!loading && loading == "github"}
                  onClick={
                    !!groupedAccounts?.github?.length
                      ? () =>
                          disconnectAccount({
                            provider: "github",
                            providerAccountId: groupedAccounts.github?.[0]
                              .providerAccountId as string,
                          })
                      : githubAuth
                  }
                  status={
                    !!groupedAccounts?.github?.length
                      ? TaskStatus.COMPLETE
                      : TaskStatus.IDLE
                  }
                >
                  {!!groupedAccounts?.github?.length ? "Disconnect" : "Connect"}
                </ButtonWithLoader>
              }
            />
            <TaskItemCard
              imageSrc={xIcon}
              title="X / Twitter"
              description={
                !!accounts.twitter ? (
                  <>
                    {"Connected to "}
                    <Link
                      href={`https://twitter.com/${accounts.twitter}`}
                      target="_blank"
                      className="underline hover:text-hot-pink"
                    >
                      @{accounts.twitter}
                    </Link>
                  </>
                ) : (
                  "Prove you participate in the Solana community."
                )
              }
              button={
                <ButtonWithLoader
                  loading={!!loading && loading == "twitter"}
                  onClick={
                    !!groupedAccounts?.twitter?.length
                      ? () =>
                          disconnectAccount({
                            provider: "twitter",
                            providerAccountId: groupedAccounts.twitter?.[0]
                              .providerAccountId as string,
                          })
                      : twitterAuth
                  }
                  status={
                    !!groupedAccounts?.twitter?.length
                      ? TaskStatus.COMPLETE
                      : TaskStatus.IDLE
                  }
                >
                  {!!groupedAccounts?.twitter?.length
                    ? "Disconnect"
                    : "Connect"}
                </ButtonWithLoader>
              }
            />
            <TaskItemCard
              imageSrc={infoIcon}
              title="Answer these 2 questions"
              description="Quick and to the point. ~2 minutes to complete."
              button={
                <ButtonWithLoader
                  status={
                    accounts.hasAllAccounts
                      ? TaskStatus.IDLE
                      : TaskStatus.DISABLED
                  }
                  onClick={handleQuestions}
                >
                  Start
                </ButtonWithLoader>
              }
            />
          </div>
        )}
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
      className={clsx("btn w-full md:w-32 justify-center", buttonClass)}
      disabled={loading || status == TaskStatus.DISABLED}
      aria-disabled={loading || status == TaskStatus.DISABLED}
      onClick={onClick}
    >
      {!!loading ? (
        <div>
          <PulseLoader
            size={8}
            color={
              status == TaskStatus.DISABLED || status == TaskStatus.COMPLETE
                ? "black"
                : "white"
            }
          />
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
    <div className="card md:flex space-y-2 items-center justify-between">
      <div className="flex gap-3 items-start">
        <Image
          priority
          src={imageSrc}
          alt="Connect GitHub"
          className="w-10 h-10 md:w-12 md:h-12"
        />
        <div className="space-y-0">
          <h4 className="font-semibold text-lg md:text-xl inline-flex gap-2">
            {title}
          </h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>

      {button}
    </div>
  );
};

export const DeveloperListQuestionsDialog = (props: DialogProps) => {
  // initialize the state tracker for the on-page form state
  const [loading, setLoading] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [formData, setFormData] = useState<ApiDevelopersPostInput>({
    why: "",
    who: "",
  });

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
   * Process the user data submission
   */
  const onSubmitHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (loading) return;

      try {
        setLoading(true);
        await fetcher<ApiDevelopersPostInput>("/api/lists/developers", {
          method: "POST",
          // send the current working data
          body: formData,
        })
          .then((res) => {
            props.setIsOpen(false);
            toast.success(res);
            setHasChanges(false);

            // redirect to the `/devlist` status page
            window.location.href = "/devlist";

            return true;
          })
          .catch((err: string) => {
            toast.error(err || "An error occurred");
            console.error(err);
          });
      } catch (err) {
        toast.error("An unknown error occurred...");
        console.error("An unknown error occurred", "[0x1235]");
        console.error(err);
      }

      // finally reset the loading state
      setLoading(false);
    },
    [
      // comment for better diffs
      formData,
      setHasChanges,
      loading,
      setLoading,
      props,
    ],
  );

  return (
    <Dialog {...props} className="max-w-lg">
      <form onSubmit={onSubmitHandler} className={"grid h-full w-full"}>
        <section className="gap-0 bg-white">
          <DialogHeader
            title={"Answer these simple questions"}
            description={"Quick and to the point. ~2 minutes to complete."}
          />

          <section className="p-5 space-y-5 w-full">
            <DeveloperQuestion
              count={1}
              label={"Why should you be on this list? (required)"}
            >
              <textarea
                onChange={(e) => updateFormState("why", e.target.value)}
                className="input w-full h-28"
                maxLength={250}
                // required={true}
                placeholder="Share any details that may be relevant (max 250 chars)"
              ></textarea>
            </DeveloperQuestion>
            <DeveloperQuestion
              count={2}
              label={"Who will vouch for you?  (optional)"}
            >
              <textarea
                onChange={(e) => updateFormState("who", e.target.value)}
                className="input w-full h-28"
                maxLength={250}
                placeholder="Share anyone you think will vouch for you and your contributions to the Solana ecosystem (i.e. people, entities, communities) (max 250 chars)"
              ></textarea>

              <p className="text-sm text-gray-500">
                No more than 3 recommendations are needed, pick your strongest
                ones. Especially those that would be willing to vouch for you
                publicly!
              </p>
            </DeveloperQuestion>
            <p className="text-sm text-gray-500">
              <input type="checkbox" name="tos" id="tos" required /> I have read
              the{" "}
              <Link href={"/devlist#faq"} target="_blank" className="underline">
                FAQ
              </Link>{" "}
              and agree to the{" "}
              <Link href={"/devlist#tos"} target="_blank" className="underline">
                Terms of Service
              </Link>
              .
            </p>
          </section>

          <section className="h-full px-8 py-4 bg-slate-100">
            <section className="flex items-center w-full gap-3 place-self-end">
              <button
                type="submit"
                disabled={!hasChanges || loading}
                className="order-2 btn w-full btn-black justify-center"
              >
                {loading ? (
                  <div>
                    <PulseLoader size={8} color="white" />
                  </div>
                ) : (
                  <>Submit</>
                )}
              </button>
              <button
                type="button"
                disabled={loading}
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

const DeveloperQuestion = memo(
  ({
    count,
    label,
    children,
  }: {
    count: number;
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="rounded-full flex items-center justify-center text-sm flex-shrink-0 bg-gray-200 w-6 h-6">
          {count}
        </div>
        <h5 className="font-semibold text-base">{label}</h5>
      </div>
      {children}
    </div>
  ),
);
