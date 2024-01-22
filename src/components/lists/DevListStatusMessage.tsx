import { memo } from "react";
import { SITE } from "@/lib/const/general";
import { DevListApplicationExtraData } from "@/types/api/lists";
import { WalletList } from "@prisma/client";
import Link from "next/link";

export const DevListStatusMessage = memo(
  ({ application }: { application: WalletList | null }) => {
    if (!application?.status) return null;

    const accounts = application.data as DevListApplicationExtraData;

    switch (application.status) {
      // active - the state when the user has claimed the token
      case "ACTIVE": {
        return (
          <div className="text-center card text-sm max-w-2xl mx-auto space-y-4 border-green-500 bg-green-300">
            <h4 className="font-semibold text-base">
              You are officially on the DevList
            </h4>
            <p>
              Congratulations, you have claimed your DevList membership token.
              <br />
              Now, we wait for the next chapter.
            </p>
          </div>
        );
      }
      // unclaimed - the state when the user is approved, but has not claimed the token
      case "UNCLAIMED": {
        return (
          <>
            <div className="text-center card text-sm max-w-2xl mx-auto space-y-4 border-green-500 bg-green-300">
              <h4 className="font-semibold text-base">You are approved!</h4>
              <p>
                Congratulations, you have been approved to join the Solana
                DevList.
                <br />
                Claim your (non-transferrable) DevList membership token to make
                it official.
              </p>
            </div>

            {/* <div className="flex items-center justify-center">
              <Link
                href={devlistTweet("approved", application.twitter)}
                target="_blank"
                className="btn inline-flex mx-auto btn-black bg-twitter border-blue-400"
              >
                Tell your Twitter frens you are approved
              </Link>
            </div> */}

            {/* <p className="max-w-xl mx-auto text-center">
              In the <span className="shadow-hot-pink">next few days</span>, we
              will enable claiming/minting right here on this page. Keep an eye
              out for <span className="">announcements</span> on the{" "}
              <Link
                target="_blank"
                href={"https://twitter.com/SolfateHQ"}
                className="underline hover:text-hot-pink"
              >
                @SolfateHQ
              </Link>{" "}
              twitter!
            </p> */}
          </>
        );
      }
      // pending - the user has applied to the list, but not yet approved or rejected
      case "PENDING": {
        if (!!application.lastCheck) {
          return (
            <>
              <h3 className="font-semibold text-center text-2xl">
                You are now in the manual review queue
              </h3>

              <div className="text-center card text-sm max-w-2xl mx-auto space-y-4 border-yellow-500 bg-yellow-300">
                <h4 className="font-semibold text-base">
                  Automated GitHub scan complete
                </h4>
                <p>
                  We have completed an{" "}
                  <span className="font-semibold">automated review</span> of
                  your GitHub account (
                  <Link
                    href={`https://github.com/${accounts.github.username}`}
                    target="_blank"
                    className="underline hover:text-hot-pink"
                  >
                    @{accounts.github.username}
                  </Link>
                  ) for public code contributions in the Solana ecosystem. While
                  we checked numerous{" "}
                  <span className="font-semibold">popular public repos</span>{" "}
                  maintained by different organizations in the Solana ecosystem,
                  we cannot check all personal (or any private) repos via this
                  automation.
                </p>

                <p>
                  You have not been auto approved via this automated scan.{" "}
                  <span className="font-semibold">
                    You are in our manual review queue
                  </span>{" "}
                  and we are working through them as fast as we can.
                </p>
              </div>

              <h3 className="font-semibold text-center text-2xl">
                Not approved by the automated scan? What now?
              </h3>

              <p className="mx-auto max-w-xl text-center">
                Even though you have not been auto approved to join the DevList{" "}
                (by our automated GitHub scanner),{" "}
                <b>you have not been rejected.</b>{" "}
                {/* <span className="font-semibold underline"> */}
                We need more information from you!
                {/* </span> */}
                <br />
                <br />
                Please share more proof of your Solana development work with the{" "}
                <Link
                  href={"https://twitter.com/SolfateHQ"}
                  target="_target"
                  className="underline hover:text-hot-pink"
                >
                  @SolfateHQ
                </Link>{" "}
                twitter account including{" "}
                <span className="font-semibold underline">
                  links to public repos
                </span>{" "}
                you have contributed to and/or having notable Solana ecosystem
                developers publicly vouch for you.
                <br />
                These can be public tweets or direct messages. We manually
                review all DevList applicants that are not auto approved.
              </p>

              <div className="flex items-center justify-center">
                <Link
                  href={devlistTweet("pending", application.twitter)}
                  target="_blank"
                  className="btn inline-flex mx-auto btn-black bg-twitter border-blue-400"
                >
                  Share info with @SolfateHQ
                </Link>
              </div>
            </>
          );
        } else {
          return (
            <>
              <div className="text-center card text-sm max-w-2xl mx-auto space-y-4 border-yellow-500 bg-yellow-300">
                <h4 className="font-semibold text-base">
                  GitHub Contributions Under Review
                </h4>
                <p>
                  Your GitHub account (
                  <Link
                    href={`https://github.com/${accounts.github.username}`}
                    target="_blank"
                    className="underline hover:text-hot-pink"
                  >
                    @{accounts.github.username}
                  </Link>
                  ) is the waitlist to join fellow verified Solana developers.
                  Your contributions to the Solana ecosystem are currently under
                  review.
                </p>
                <p>
                  If approved, you will be able to mint the soul-bound
                  membership token to your Solana wallet, officially joining the
                  DevList and granting you access to special goodies!
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Link
                  href={devlistTweet("voucher", application.twitter)}
                  target="_blank"
                  className="btn inline-flex mx-auto btn-black bg-twitter border-blue-400"
                >
                  Tell your Twitter frens to vouch for you
                </Link>
              </div>
              <p className="mx-auto max-w-lg text-center">
                👋 PS: Followers of{" "}
                <Link
                  href={"https://twitter.com/SolfateHQ"}
                  target="_target"
                  className="underline hover:text-hot-pink"
                >
                  @SolfateHQ
                </Link>{" "}
                will be reviewed first 💜
              </p>
            </>
          );
        }
      }
      // fallback for all unknown / unsupported statuses
      default: {
        return (
          <div className="text-center card text-sm max-w-2xl mx-auto space-y-4 border-red-500 bg-red-300">
            <h4 className="font-semibold text-base">
              Unknown DevList application status
            </h4>
            <p>
              Something went wrong with your DevList application. It currently
              has an unknown status. Please contact us to help get this fixed.
            </p>
          </div>
        );
      }
    }
  },
);

/**
 * helper function to construct the standard tweets
 */
const devlistTweet = (
  tweetType: "voucher" | "approved" | "pending",
  refAddress: string | null = "",
) => {
  const tweetUrl = new URL("https://twitter.com/intent/tweet");
  tweetUrl.searchParams.append("original_referer", SITE.url);
  tweetUrl.searchParams.append("related", "@SolfateHQ");

  const refText = refAddress ? `?ref=${refAddress}` : "";

  if (tweetType == "voucher") {
    tweetUrl.searchParams.append(
      "text",
      `❤️‍🔥 I just applied to join the @solana DevList! 🧑‍💻📜\n` +
        `Tell @SolfateHQ why I am a dedicated dev and should be approved to join\n` +
        `Apply yourself here too 👇\n` +
        `https://solfate.com/devlist${refText}`,
    );
  } else if (tweetType == "approved") {
    tweetUrl.searchParams.append(
      "text",
      `🧑‍💻📜 I was approved to join the @solana DevList by @SolfateHQ! ` +
        `Excited to claim my membership token soon (tm)\n` +
        `You can apply yourself here too 👇\n` +
        `https://solfate.com/devlist${refText}`,
    );
  } else if (tweetType == "pending") {
    tweetUrl.searchParams.append(
      "text",
      `🧑‍💻📜 I need to show @SolfateHQ that I am a dedicated @solana_devs to join the DevList!\n\n` +
        `Who will vouch for me?\n\n` +
        `Here are some links to repos that I have contributed to 👇`,
      // `You can apply yourself here too 👇\n` +
      // `https://solfate.com/devlist${refText}`,
    );
  } else {
    // fallback tweet message
    tweetUrl.searchParams.append(
      "text",
      `🧑‍💻📜 Checkout the @solana DevList by @SolfateHQ! ` +
        `A free and public good for the Solana ecosystem\n` +
        `Apply to the DevList here 👇\n` +
        `https://solfate.com/devlist${refText}`,
    );
  }

  return tweetUrl.toString();
};
