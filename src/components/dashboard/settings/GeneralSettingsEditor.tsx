"use client";

import { memo, useCallback, useReducer, useState } from "react";
import { SettingsHeader } from "./SettingsHeader";
import { getUser } from "@/lib/queries/users";
import clsx from "clsx";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import { fetcher } from "@/lib/api";
import { ApiProfilePatchInput } from "@/types/api/social";
import { SITE } from "@/lib/const/general";
import { USERNAME_MAX_LEN } from "@/lib/const/profile";
import { signIn } from "next-auth/react";

type FormState = {
  username: User["username"];
};

type FormAction =
  | { type: "update"; field: keyof FormState; value: string }
  // Add more action types as needed
  | { type: "reset" };

type ComponentProps = { user: Awaited<ReturnType<typeof getUser>> };

export const GeneralSettingsEditor = memo(({ user }: ComponentProps) => {
  const [pendingChanges, setPendingChanges] = useState(false);
  const [loading, setLoading] = useState(false);

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
    username: user.username,
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
        const res = await fetcher<ApiProfilePatchInput>("/api/settings", {
          method: "PATCH",
          body: formData,
        });

        // force update the user's current session
        // (to capture their new username change in the jwt)
        if (!!formData.username) {
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
    [pendingChanges, formData, loading, setLoading],
  );

  return (
    <main className="container space-y-6">
      <SettingsHeader
        title={"General Settings"}
        description={"Manage your Solfate account settings"}
      ></SettingsHeader>

      <form onSubmit={submitHandler} className="card space-y-4">
        <div className="grid md:flex items-start gap-2 justify-between">
          <div className="space-y-0">
            <h2 className="font-semibold text-xl">Username</h2>
            <p className="text-gray-500">
              This is part of your unique URL here on {SITE.name}
            </p>
          </div>
          <button
            type="submit"
            className={clsx(
              "btn text-center justify-center",
              !pendingChanges ? "btn-ghost" : "btn-black",
            )}
            disabled={!pendingChanges}
          >
            Update
          </button>
        </div>

        <div className="prefix-input">
          <label htmlFor="username">{SITE.domain}/</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            placeholder="username"
            className="input-box"
            onChange={handleInputChange}
            maxLength={USERNAME_MAX_LEN}
            // disabled={true}
          />
        </div>

        <p className="text-gray-500 text-sm">
          max of {USERNAME_MAX_LEN} characters: letters, numbers, dash, and
          underscore
        </p>
      </form>
    </main>
  );
});
