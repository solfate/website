import { SettingsHeader } from "@/components/dashboard/settings/SettingsHeader";
import { getUserProfile } from "@/lib/queries/users";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings / Profile - Solfate",
};

export default async function Page() {
  // get the user's current profile data from display
  // note: we know a user is logged in here, so we should be able to get their User record
  const profile = await getUserProfile({});

  // todo: handle no profile being found (we likely need to generate one)

  return (
    <main className="container space-y-6">
      <SettingsHeader
        title={"Manage Profile"}
        description={
          "Update your public profile information that anyone can see"
        }
      />

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
              value={profile.name}
              placeholder={profile.name || `@${profile.username}`}
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
              value={profile.oneLiner}
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
              value={profile.bio}
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
              value={profile.website}
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
              value={profile.twitter}
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
              value={profile.github}
              placeholder="github"
              className="input-box w-full"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
