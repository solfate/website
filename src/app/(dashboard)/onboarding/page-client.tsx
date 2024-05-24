"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/const/general";
import { OnboardingStepCounter } from "./components/OnboardingStepCounter";
import { USERNAME_MAX_LEN } from "@/lib/const/profile";
import { FeatherIcon } from "@/components/core/FeatherIcon";
import { SessionProvider, signIn } from "next-auth/react";
import Link from "next/link";
import clsx from "clsx";
import { Avatar } from "@/components/core/Avatar";
import { onboardingFlow } from "./actions";
import { ActionFormState } from "@/types";
import { useFormState, useFormStatus } from "react-dom";
import { ONBOARDING_STEPS, schema } from "./const";
import { z } from "zod";
import { ApiUploadPostInput, ApiUploadPostResponse } from "@/types/api/general";
import { fetcher } from "@/lib/api";
import toast from "react-hot-toast";

type OnboardingStepProps = {
  currentStep: number;
  state: ActionFormState<typeof schema>;
};

export default function OnboardingPageClient() {
  const [state, formAction] = useFormState(onboardingFlow, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (
      !!state.success &&
      !!state.data?.step &&
      parseInt(state.data.step) > ONBOARDING_STEPS.LENGTH_SIZE
    ) {
      signIn("jwt", {
        redirect: false,
      });
    }
  }, [state]);

  return (
    <SessionProvider>
      {/* <OnboardingProvider> */}

      {!!state.success &&
      !!state.data?.step &&
      parseInt(state.data.step) > ONBOARDING_STEPS.LENGTH_SIZE ? (
        <main className="container text-center space-y-8 py-8 md:py-20 max-w-lg mx-auto">
          <header className="space-y-2">
            {/* <AppLogo wordmarkHeight={32} logoSize={42} /> */}

            <h1 className="font-bold text-3xl md:text-4xl">
              Welcome{" "}
              <span className="hidden md:inline-block">to the club</span> 🎉
            </h1>

            <p className="text-center text-gray-500">
              Your profile has been created and is now live!
            </p>
          </header>

          <Link
            href={`/${state.data!.username}`}
            // target="_blank"
            className="btn btn-ghost inline-flex gap-4 text-lg !px-7 !py-3"
          >
            {`${SITE.domain}/${state.data!.username}`}
            <FeatherIcon name="ExternalLink" size={18} strokeWidth={1.5} />
          </Link>

          {/* <div className="card space-y-6">
            <h2 className="font-semibold text-2xl">Next steps</h2>

            <p className="">
              Complete your profile with a <>custom profile picture</> and{" "}
              <>adding links</> to share with the world.
            </p>

            <section className="flex flex-col gap-3 items-center justify-center">
              <Link href={"/dashboard/profile"} className="btn btn-black">
                Complete your profile
              </Link>
            </section>
          </div> */}
        </main>
      ) : (
        <form
          action={formAction}
          className="container space-y-8 py-8 md:py-10 max-w-lg mx-auto"
        >
          <input type="hidden" name="step" value={state.data?.step || "1"} />

          <header className="text-center space-y-1">
            <h1 className="font-bold text-3xl md:text-4xl">
              {/* <AppLogo logoSize={36} /> */}
              Welcome to Solfate!
            </h1>
            <p className="text-lg text-gray-500">
              Let&apos;s get your profile setup fren :)
            </p>
          </header>

          <OnboardingStepCounter
            totalSteps={ONBOARDING_STEPS.LENGTH_SIZE}
            currentStep={parseInt(state.data?.step || "1")}
          />

          <OnboardingWizard
            state={state}
            currentStep={parseInt(state.data?.step || "1")}
          />
          {/* 
          <p className="text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link href={"/signin"} className="underline hover:text-black">
              Sign in
            </Link>
          </p> */}
        </form>
      )}

      {/* </OnboardingProvider> */}
    </SessionProvider>
  );
}

const OnboardingWizard = memo(({ currentStep, state }: OnboardingStepProps) => {
  switch (currentStep) {
    case ONBOARDING_STEPS.SET_USERNAME: {
      return (
        <OnboardingStep1SetUsername
          state={state}
          currentStep={ONBOARDING_STEPS.SET_USERNAME}
        />
      );
    }
    case ONBOARDING_STEPS.UPLOAD_AVATAR: {
      return (
        <OnboardingStep2UploadAvatarUploadAvatar
          state={state}
          currentStep={ONBOARDING_STEPS.UPLOAD_AVATAR}
        />
      );
    }
    case ONBOARDING_STEPS.BASIC_PROFILE: {
      return (
        <OnboardingStep3BasicProfile
          state={state}
          currentStep={ONBOARDING_STEPS.BASIC_PROFILE}
        />
      );
    }
  }

  // default return a helpful error
  return (
    <section className="max-w-lg mx-auto space-y-8">
      <div className="card bg-red-300 border-red-500">
        <h2 className="font-semibold text-xl">Oops, there is an error...</h2>
        <p className="text-sm">
          An unknown error has occurred and you should not be seeing this
          message.
          <br />
          Try refreshing the page. If you continue to see this error, contact
          support.
        </p>
      </div>

      {/* <section className="flex items-center justify-center">
        <Link
          href={`/onboarding`}
          className={`btn btn-black mx-auto inline-flex gap-2`}
        >
          Restart the Onboarding
        </Link>
      </section> */}
    </section>
  );
});

const OnboardingStep1SetUsername = memo(({ state }: OnboardingStepProps) => {
  const { pending } = useFormStatus();

  return (
    <section className="max-w-lg mx-auto space-y-6 text-center">
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl">Choose a username</h2>
        <p className="text-gray-500 text-sm">
          This is part of your unique URL here on {SITE.name}.
        </p>
      </div>

      <section className="grid gap-2">
        <div
          className={`prefix-input w-full ${Object.hasOwn(state.errors || {}, "username") && "!border-red-500"}`}
        >
          <label htmlFor="username">{SITE.domain}/</label>
          <input
            type="text"
            name="username"
            defaultValue={state.data?.username || ""}
            id="username"
            placeholder="username"
            className={`input-box`}
            maxLength={USERNAME_MAX_LEN}
            disabled={pending}
            aria-disabled={pending}
          />
        </div>

        <p className="text-gray-500 text-sm">
          max of {USERNAME_MAX_LEN} characters: letters, numbers, dash, and
          underscore
        </p>
      </section>

      {state.errors || state.message ? (
        <p className="text-red-500">
          {state.errors
            ? Object.keys(state.errors).map((key, index) => {
                // if (key == "step") return "";

                return `${key}: ${state.errors![key as keyof z.input<typeof schema>]}. `;
              })
            : state.message || "An error occurred"}
        </p>
      ) : null}

      <section className="flex items-center justify-center gap-2">
        {/* <button
          type="button"
          disabled={pending}
          aria-disabled={pending}
          className={`btn btn-ghost mx-auto`}
          disabled={loading}
          onClick={(e) => toast.error("Tweet to ask")}
        >
          Need an invite?
        </button> */}
        <button
          type="submit"
          disabled={pending}
          aria-disabled={pending}
          className={`btn btn-black mx-auto inline-flex gap-2`}
        >
          Continue
          <FeatherIcon name="ArrowRight" />
        </button>
      </section>
    </section>
  );
});

/**
 * Upload an avatar image
 */
const OnboardingStep2UploadAvatarUploadAvatar = memo(
  ({ currentStep, state }: OnboardingStepProps) => {
    const { pending } = useFormStatus();

    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    /**
     * handler function for uploading the selected file
     */
    const handleUploadFile = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        // do nothing if there is no file selected
        if (!e.target.files?.[0] || !!previewImage) return;

        // stop if uploading is already in progress
        if (!!uploading) return;

        // todo: better upload progress tracking?

        // todo: better error handling here
        // error on multiple files selected
        if (e.target.files.length > 1)
          return toast.error("Only 1 file may be uploaded at a time");

        const file = e.target.files[0];

        // this will preview the image as on the page, prior to any actual upload
        // toggle the image preview mode while uploading begins
        setPreviewImage(URL.createObjectURL(file));
        setUploading(true);

        try {
          const presignedData: ApiUploadPostResponse =
            await fetcher<ApiUploadPostInput>("/api/upload", {
              method: "POST",
              body: {
                type: "profile",
                fileDetails: {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  lastModified: file.lastModified,
                },
              },
            }).then((res) => JSON.parse(res));

          const uploadRes = await fetch(presignedData.signedUrl, {
            method: "PUT",
            body: file,
          });

          if (!uploadRes.ok) {
            console.error(uploadRes);
            throw "Upload failed";
          }

          setProfileImage(presignedData.assetUrl);
        } catch (err) {
          console.warn("[upload error]", err);

          let message = "An upload error occurred";
          if (typeof err == "string") message = err;

          toast.error(message);
        }

        fileRef.current?.blur();
        setPreviewImage(null);
        setUploading(false);
      },
      [
        previewImage,
        fileRef,
        setProfileImage,
        setPreviewImage,
        uploading,
        setUploading,
      ],
    );

    return (
      <section className="max-w-lg mx-auto space-y-8">
        <input type="hidden" name="step" value={currentStep} />
        <input
          type="hidden"
          name="username"
          value={state.data?.username || ""}
        />
        <input
          type="hidden"
          name="image"
          value={profileImage || state.data?.image || ""}
        />

        <input
          aria-hidden={true}
          hidden={true}
          ref={fileRef}
          disabled={uploading || pending}
          aria-disabled={uploading || pending}
          className="hidden"
          type="file"
          name="avatar"
          id="avatar"
          onChange={handleUploadFile}
        />

        <div className="text-center space-y-2">
          <h2 className="font-semibold text-2xl">Upload a profile picture</h2>
          <p className="text-gray-500 text-sm">
            This is optional, but helps you stand out. If you do not set a
            custom one, we will generate one for you.
          </p>
        </div>

        <section className="grid sm:flex mx-auto gap-6 items-center sm:w-min">
          <button
            type="button"
            onClick={() => fileRef?.current?.click()}
            title="Upload an avatar image"
            className={clsx(
              "block relative border mx-auto justify-center text-center border-transparent hover:border-gray-500 rounded-full",
              uploading ? "opacity-50 " : "",
            )}
            disabled={uploading || pending}
            aria-disabled={uploading || pending}
          >
            {uploading && (
              <span className="absolute w-full items-center align-middle justify-center h-full flex bg-white bg-opacity-50 z-10">
                <FeatherIcon
                  name="UploadCloud"
                  size={48}
                  className="text-black"
                />
              </span>
            )}
            <Avatar
              href="#"
              as="span"
              size={128}
              imageSrc={previewImage || profileImage || ""}
              className="w-32 h-32"
            />
          </button>

          <div className="grid grid-rows-2 sm:grid-rows-1 grid-flow-row whitespace-nowrap items-center gap-4 text-center">
            <button
              type="button"
              disabled={uploading || pending}
              aria-disabled={uploading || pending}
              // onClick={() => fileRef?.current?.click()}
              className="btn btn-black w-full justify-center text-center"
            >
              Upload Image
            </button>
            <button
              type="button"
              disabled={uploading || pending}
              onClick={() => {
                setProfileImage(null);
                setPreviewImage(null);
              }}
              className="btn w-full btn-ghost justify-center text-center"
            >
              Remove Image
            </button>
          </div>
        </section>

        {/* todo: have a few options the user can select */}

        {state.errors || state.message ? (
          <p className="text-red-500">
            {state.errors
              ? Object.keys(state.errors).map((key, index) => {
                  // if (key == "step") return "";

                  return `${key}: ${state.errors![key as keyof z.input<typeof schema>]}. `;
                })
              : state.message || "An error occurred"}
          </p>
        ) : null}

        <section className="flex items-center justify-center gap-2">
          {/* <button
            type="button"
            disabled={pending}
            aria-disabled={pending}
            onClick={() => {
              router.replace(`/onboarding?step=${currentStep - 1}`);
            }}
            className={`btn btn-ghost mx-auto inline-flex gap-2`}
          >
            <FeatherIcon name="ArrowLeft" />
            Back
          </button> */}
          <button
            type="submit"
            disabled={uploading || pending}
            aria-disabled={uploading || pending}
            className={`btn btn-black mx-auto inline-flex gap-2`}
          >
            Next
            <FeatherIcon name="ArrowRight" />
          </button>
        </section>
      </section>
    );
  },
);

/**
 *
 */
const OnboardingStep3BasicProfile = memo(
  ({ currentStep, state }: OnboardingStepProps) => {
    const { pending } = useFormStatus();

    return (
      <section
        //  action={}
        className="max-w-lg mx-auto space-y-8"
      >
        <input type="hidden" name="step" value={currentStep} />
        <input type="hidden" name="username" value={state.data?.username} />
        <input type="hidden" name="image" value={state.data?.image || ""} />

        <div className="text-center space-y-2">
          <h2 className="font-semibold text-2xl">Tell us about yourself</h2>
          <p className="text-gray-500 text-sm">
            Share some basic info to be displayed publicly on your profile Page.
          </p>
        </div>
        <div className="space-y-2">
          <div className="space-y-1">
            <label htmlFor="name" className="block">
              Display name:
            </label>

            {/* <p className="text-gray-500 text-sm"></p> */}

            <input
              type="text"
              name="name"
              id="name"
              defaultValue={state.data?.name || ""}
              disabled={pending}
              aria-disabled={pending}
              placeholder={"Defaults to your username"}
              className="input-box w-full"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="oneLiner" className="block">
              Single line tag line:
            </label>

            {/* <p className="text-gray-500 text-sm"></p> */}

            <input
              type="text"
              name="oneLiner"
              id="oneLiner"
              defaultValue={state.data?.oneLiner || ""}
              disabled={pending}
              aria-disabled={pending}
              placeholder={"Just one line"}
              className="input-box w-full"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="bio" className="block">
              Bio:
            </label>

            {/* <p className="text-gray-500 text-sm"></p> */}

            <textarea
              name="bio"
              id="bio"
              defaultValue={state.data?.bio || ""}
              disabled={pending}
              aria-disabled={pending}
              placeholder="Describe yourself and tell the world"
              className="w-full h-28 max-h-28"
              // disabled={true}
            />
          </div>
        </div>

        {state.errors || state.message ? (
          <p className="text-red-500">
            {state.errors
              ? Object.keys(state.errors).map((key, index) => {
                  // if (key == "step") return "";

                  return `${key}: ${state.errors![key as keyof z.input<typeof schema>]}. `;
                })
              : state.message || "An error occurred"}
          </p>
        ) : null}

        <section className="flex items-center justify-center gap-2">
          {/* <button
            type="button"
            disabled={pending}
            aria-disabled={pending}
            onClick={() => {
              router.replace(`/onboarding?step=${currentStep - 1}`);
            }}
            className={`btn btn-ghost mx-auto inline-flex gap-2`}
          >
            <FeatherIcon name="ArrowLeft" />
            Back
          </button> */}
          <button
            type="submit"
            disabled={pending}
            aria-disabled={pending}
            className={`btn btn-black mx-auto inline-flex gap-2`}
          >
            Complete Profile
            {/* <FeatherIcon name="ArrowRight" /> */}
          </button>
        </section>
      </section>
    );
  },
);
