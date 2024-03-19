"use client";

import { memo, useCallback, useReducer, useState } from "react";
import { SettingsHeader } from "./SettingsHeader";
import { getUserProfile } from "@/lib/queries/users";
import clsx from "clsx";
import { Profile } from "@prisma/client";

type ComponentProps = { profile: Awaited<ReturnType<typeof getUserProfile>> };

export const ProfileEditorForm = memo(({ profile }: ComponentProps) => {
  const [pendingChanges, setPendingChanges] = useState(false);

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
    name: profile.name,
    bio: profile.bio,
    oneLiner: profile.oneLiner,
    website: profile.website,
    twitter: profile.twitter,
    github: profile.github,
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
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!pendingChanges) return;

      console.log(formData);

      alert("submit");
    },
    [pendingChanges, formData],
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
          className={clsx("btn", !pendingChanges ? "btn-ghost" : "btn-black")}
          disabled={!pendingChanges}
        >
          Save Changes
        </button>
      </SettingsHeader>

      <div className="card space-y-4">
        <div className="flex items-start gap-2 justify-between">
          <div className="space-y-0">
            <h2 className="font-semibold text-xl">Basic Profile Information</h2>
            <p className="text-gray-500">
              Share public information about yourself on your profile
            </p>
          </div>
        </div>

        <div className="grid gap-4 max-w-[32rem]">
          <div className="space-y-1">
            <label htmlFor="name" className="block">
              Display name:
            </label>

            {/* <p className="text-gray-500 text-sm"></p> */}

            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={formData.name || `@${profile.username}`}
              className="input-box w-full"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="oneLiner" className="block">
              One line headline:
            </label>

            {/* <p className="text-gray-500 text-sm"></p> */}

            <input
              type="text"
              name="oneLiner"
              id="oneLiner"
              value={formData.oneLiner}
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
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Describe yourself"
              className="w-full h-28 max-h-28"
              // disabled={true}
            />
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
            <label htmlFor="website">https://</label>
            <input
              type="text"
              name="website"
              id="website"
              value={formData.website}
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
              value={formData.twitter}
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
              value={formData.github}
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

type FormState = {
  name: Profile["name"];
  bio: Profile["bio"];
  oneLiner: Profile["oneLiner"];
  website: Profile["website"];
  twitter: Profile["twitter"];
  github: Profile["github"];
};

type FormAction =
  | { type: "update"; field: keyof FormState; value: string }
  // Add more action types as needed
  | { type: "reset" };
