"use client";

import { memo, useCallback, useReducer, useRef, useState } from "react";
import type { Profile } from "@prisma/client";
import type {
  ApiUploadPostInput,
  ApiUploadPostResponse,
} from "@/types/api/general";
import { SettingsHeader } from "@/components/dashboard/settings/SettingsHeader";
import { getUserProfile } from "@/lib/queries/users";
import clsx from "clsx";
import toast from "react-hot-toast";
import { fetcher } from "@/lib/api";
import { FeatherIcon } from "@/components/core/FeatherIcon";
import { Avatar } from "@/components/core/Avatar";
import { signIn } from "next-auth/react";
import { ApiProfilePatchInput } from "@/lib/schemas/profile";

type FormState = {
  name: Profile["name"];
  bio: Profile["bio"];
  oneLiner: Profile["oneLiner"];
  website: Profile["website"];
  twitter: Profile["twitter"];
  github: Profile["github"];
  image: Profile["image"];
};

type FormAction =
  | { type: "update"; field: keyof FormState; value: string }
  // Add more action types as needed
  | { type: "reset" };

type ComponentProps = { profile: Awaited<ReturnType<typeof getUserProfile>> };

const ProfilePageClient = memo(({ profile }: ComponentProps) => {
  const [pendingChanges, setPendingChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const formReducer = useCallback(
    (state: FormState, action: FormAction) => {
      switch (action.type) {
        case "update": {
          if (!pendingChanges) setPendingChanges(true);
          return { ...state, [action.field]: action.value };
          // return Object.assign(state, { [action.field]: action.value });
        }
        // Add more cases for handling different actions (e.g., validation, submission)
        default:
          throw new Error(`Unhandled action type: ${action.type}`);
      }
    },
    [pendingChanges, setPendingChanges],
  );

  const [formData, dispatch] = useReducer(formReducer, {
    name: profile?.name || "",
    bio: profile?.bio || "",
    oneLiner: profile?.oneLiner || "",
    website: profile?.website || "",
    twitter: profile?.twitter || "",
    github: profile?.github || "",
    image: profile?.image || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    dispatch({
      type: "update",
      field: e.target.name as keyof FormState,
      value: e.target.value,
    });
  };

  const submitHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!pendingChanges || loading) return;

      // todo: perform any client side validation

      setLoading(true);

      try {
        const res = await fetcher<ApiProfilePatchInput>("/api/profile", {
          method: "PATCH",
          body: {
            ...formData,
            // forcing the twitter and github into the url format for better validation
            twitter: !!formData.twitter
              ? `https://twitter.com/${formData.twitter}`
              : undefined,
            github: !!formData.github
              ? `https://github.com/${formData.github}`
              : undefined,
          },
        });

        // force update the user's current session
        // (to capture their new image change in the jwt)
        if (!!formData.image && formData.image !== profile?.image) {
          await signIn("jwt", {
            redirect: false,
          });
        }

        setPendingChanges(false);

        return toast.success(res);
      } catch (err) {
        console.error("failed::", err);

        if (typeof err == "string") toast.error(err);
        else if (err instanceof Error) toast.error(err.message);
        else toast.error("An unknown error occurred");
      } finally {
        setLoading(false);
      }
    },
    [profile?.image, pendingChanges, formData, loading, setLoading],
  );

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

        // update the form state for the image
        dispatch({
          type: "update",
          field: "image",
          value: presignedData.assetUrl,
        });
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
    [previewImage, fileRef, setPreviewImage, uploading, setUploading],
  );

  return (
    <form onSubmit={submitHandler} className="container space-y-6">
      <SettingsHeader
        title={"Manage Profile"}
        description={
          "Update your public profile information that anyone can see"
        }
      >
        <button
          type="submit"
          className={clsx(
            "btn text-center whitespace-nowrap justify-center",
            !pendingChanges ? "btn-ghost" : "btn-black",
          )}
          disabled={!pendingChanges}
        >
          Save Changes
        </button>
      </SettingsHeader>

      <input
        aria-hidden={true}
        hidden={true}
        ref={fileRef}
        className="hidden"
        type="file"
        name="avatar"
        id="avatar"
        onChange={handleUploadFile}
      />

      <div className="card space-y-4 relative">
        <div className="flex items-start gap-2 justify-between">
          <div className="space-y-0">
            <h2 className="font-semibold text-xl">Basic Profile Information</h2>
            <p className="text-gray-500">
              Share public information about yourself on your profile
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex gap-6 items-center">
              <button
                onClick={() => fileRef?.current?.click()}
                title="Upload an avatar image"
                className={clsx(
                  "relative border border-transparent hover:border-gray-500 rounded-full",
                  uploading ? "opacity-50 " : "",
                )}
                disabled={uploading}
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
                  imageSrc={previewImage || formData.image}
                  className=""
                />
              </button>

              <div className="space-y-4">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileRef?.current?.click()}
                  className="btn btn-black"
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => {
                    dispatch({
                      type: "update",
                      field: "image",
                      value: "",
                    });
                  }}
                  className="btn btn-ghost"
                >
                  Remove Photo
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="name" className="block">
                Display name:
              </label>

              {/* <p className="text-gray-500 text-sm"></p> */}

              <input
                type="text"
                name="name"
                id="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                placeholder={formData.name || `@${profile!.username}`}
                className="input-box w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="space-y-1">
              <label htmlFor="oneLiner" className="block">
                One line headline:
              </label>

              {/* <p className="text-gray-500 text-sm"></p> */}

              <input
                type="text"
                name="oneLiner"
                id="oneLiner"
                value={formData.oneLiner || ""}
                onChange={handleInputChange}
                placeholder={""}
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
                value={formData.bio || ""}
                onChange={handleInputChange}
                placeholder="Describe yourself"
                className="w-full h-28 max-h-28"
                // disabled={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <div className="flex items-start gap-2 justify-between">
          <div className="space-y-0">
            <h2 className="font-semibold text-xl">
              Social Media and External Links
            </h2>
            <p className="text-gray-500">
              Display these accounts and external links directly on your profile
            </p>
          </div>
        </div>

        <div className="grid gap-4 max-w-96">
          <div className="prefix-input">
            <label htmlFor="website">Website:</label>
            <input
              type="text"
              name="website"
              id="website"
              value={formData.website || ""}
              onChange={handleInputChange}
              placeholder="Website URL"
              className="input-box w-full"
            />
          </div>
          <div className="prefix-input">
            <label htmlFor="twitter">twitter.com/</label>
            <input
              type="text"
              name="twitter"
              id="twitter"
              value={formData.twitter || ""}
              onChange={handleInputChange}
              placeholder="Twitter handle"
              className="input-box w-full"
              // disabled={true}
            />
          </div>
          <div className="prefix-input">
            <label htmlFor="github">github.com/</label>
            <input
              type="text"
              name="github"
              id="github"
              value={formData.github || ""}
              onChange={handleInputChange}
              placeholder="github"
              className="input-box w-full"
            />
          </div>
        </div>
      </div>
    </form>
  );
});

export default ProfilePageClient;
