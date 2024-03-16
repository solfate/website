import { SITE } from "@/lib/const/general";
import { USERNAME_MAX_LEN } from "@/lib/const/profile";
import { getUser } from "@/lib/queries/users";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings / General - Solfate",
};

export default async function Page() {
  // get the user's current profile data from display
  // note: we know a user is logged in here, so we should be able to get their User record
  const user = await getUser({});

  // todo: we should not 404 here
  if (!user) notFound();

  return (
    <main className="container space-y-6">
      {/* <section className="flex pb-2 justify-between items-center">
        <section className="space-y-2">
          <h1 className="font-semibold text-xl">Account settings</h1>
          <p className="text-sm text-gray-500">
            A short description about this page.
          </p>
        </section>

        <button className="btn btn-black">Save</button>
      </section> */}

      <div className="card space-y-4">
        <div className="flex items-start gap-2 justify-between">
          <div className="space-y-0">
            <h2 className="font-semibold text-xl">Username</h2>
            <p className="text-gray-500">
              This is part of your unique URL here on {SITE.name}
            </p>
          </div>
          <button type="button" className={`btn btn-black`}>
            Save
          </button>
        </div>

        <div className="prefix-input">
          <label htmlFor="username">{SITE.domain}/</label>
          <input
            type="text"
            name="username"
            id="username"
            value={user.username}
            placeholder="username"
            className="input-box"
            maxLength={USERNAME_MAX_LEN}
            disabled={true}
          />
        </div>

        <p className="text-gray-500 text-sm">
          max of {USERNAME_MAX_LEN} characters: letters, numbers, dash, and
          underscore
        </p>
      </div>
    </main>
  );
}
