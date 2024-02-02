import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Octokit } from "octokit";
import prisma from "@/lib/prisma";
import { exit, saveJsonCacheDataSync, sleep } from "@/lib/scripts";
import { retryWithBackoff } from "@/lib/helpers";

const COHORT_TO_APPROVE: number = 0;
const REQUEST_QUANTITY: number = 200;

/**
 * set the minimum threshold to auto approve a user (based on cumulative github activity)
 */
const AUTO_APPROVAL_THRESHOLD: number = 5;

/**
 * whether or not to check applicants that have already been checked with this script
 */
const RECHECK_GITHUB_REPOS: boolean = true;

dotenv.config();

// declare the cache dir to save all the devlist data
const devlistCacheDir = path.resolve("./.cache/devlist/pending");

try {
  fs.statfsSync(devlistCacheDir);
} catch (err) {
  // todo: force create the required directories
  exit("devlist cache dir does not exist");
}

const STANDARD_GITHUB_REPOS = [
  // solana labs
  "https://github.com/solana-labs/solana",
  "https://github.com/solana-labs/solana-program-library",
  "https://github.com/solana-labs/solana-web3.js",
  "https://github.com/solana-labs/wallet-adapter",
  "https://github.com/solana-labs/explorer",
  "https://github.com/solana-mobile/mobile-wallet-adapter",
  "https://github.com/solana-labs/dapp-scaffold",
  "https://github.com/solana-labs/governance-ui",
  "https://github.com/solana-labs/governance-docs",
  // solana foundation
  "https://github.com/solana-foundation/developer-content",
  "https://github.com/solana-foundation/solana-improvement-documents",
  // solana developers
  "https://github.com/solana-developers/solana-cookbook",
  "https://github.com/solana-developers/program-examples",
  "https://github.com/solana-developers/create-solana-dapp",
  // metaplex
  "https://github.com/metaplex-foundation/js",
  "https://github.com/metaplex-foundation/js-deprecated",
  "https://github.com/metaplex-foundation/sugar",
  "https://github.com/metaplex-foundation/developer-hub",
  "https://github.com/metaplex-foundation/metaplex-program-library",
  "https://github.com/metaplex-foundation/mpl-token-metadata",
  "https://github.com/metaplex-foundation/mpl-bubblegum",
  "https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure",
  "https://github.com/metaplex-foundation/umi",
  // helium
  "https://github.com/helium/helium-program-library",
  "https://github.com/helium/wallet-app",
  "https://github.com/helium/helium-vote",
  "https://github.com/helium/docs",
  // superteam the best team
  "https://github.com/SuperteamDAO/earn",
  "https://github.com/SuperteamDAO/solathon",
  "https://github.com/SuperteamDAO/superteam-reputation",
  // community driven repos and other public goods
  "https://github.com/coral-xyz/anchor",
  "https://github.com/jito-foundation/jito-solana",
  "https://github.com/rpcpool/yellowstone-grpc",
  "https://github.com/clockwork-xyz/clockwork",
  "https://github.com/clockwork-xyz/sdk",
  "https://github.com/openbook-dex/program",
  "https://github.com/openbook-dex/openbook-v2",
  "https://github.com/openbook-dex/openbook-ts",
  "https://github.com/openbook-dex/openbook-dex-ui",
  "https://github.com/LibrePlex/libreplex-program-library",
  "https://github.com/LibrePlex/sample-ui",
  "https://github.com/arihantbansal/cubik",
  "https://github.com/Lightprotocol/light-protocol",
  "https://github.com/orca-so/whirlpools",
  "https://github.com/Web3-Builders-Alliance/soda",
  "https://github.com/holaplex/reward-center-program",
  // magic block
  "https://github.com/magicblock-labs/Solana.Unity-SDK",
  "https://github.com/magicblock-labs/bolt",
  "https://github.com/magicblock-labs/Solana.Unity.Metaplex",
  "https://github.com/magicblock-labs/Solana.Unity.Anchor",
  "https://github.com/magicblock-labs/Solana.Unity-Core",
  // marinade
  "https://github.com/marinade-finance/liquid-staking-program",
  "https://github.com/marinade-finance/marinade-ts-sdk",
  "https://github.com/marinade-finance/marinade-ts-cli",
];

console.log("Total repos to check:", STANDARD_GITHUB_REPOS.length);

/**
 * Get the list of all all DevList applicants that are potentially eligible
 */
const applicants = await prisma.walletList.findMany({
  // limit the number of waitlist applicants to parse at a time
  take: REQUEST_QUANTITY,
  orderBy: {
    // the unchecked applications (aka `null`) will appear first
    // lastCheck: "asc",
    id: "desc",
  },
  where: {
    AND: {
      // we are only checking the devlist applications
      type: "DEVELOPER",
      // only applicants that have not been approved yet
      status: "PENDING",
      // only parse applications in the desired cohort
      cohort: !!COHORT_TO_APPROVE ? COHORT_TO_APPROVE : undefined,
      lastCheck: RECHECK_GITHUB_REPOS ? undefined : null,
    },
  },
  include: {
    user: {
      include: {
        accounts: {
          // we need the person's github account stored from the OAuth connection
          where: {
            provider: "github",
          },
        },
      },
    },
  },
});

if (!applicants || applicants.length == 0) {
  exit("There are no pending DevList applicants");
}

console.log("Total applicants:", applicants.length);

for (let i = 0; i < applicants.length; i++) {
  const startTime = Date.now();
  const applicant = applicants[i];

  // parse the custom data stored in the application
  const customData: {
    twitter: { id: string; username: string };
    github: { id: string; username: string };
  } = applicant.data as any;

  const username = customData.github.username;

  if (!customData.github.username) exit("unable to locate the github username");
  if (!username) exit("Unknown github username");

  console.log("\n\n");
  console.log("-------------------------------------------------------------");
  console.log("-------------------------------------------------------------");
  console.log(`github: https://github.com/${customData.github.username}`);
  console.log(`twitter: https://twitter.com/${customData.twitter.username}\n`);

  const accessToken = process.env.GITHUB_ACCESS_TOKEN || null;

  // initializing octokit with the user's github auth token will allow us to read their private repos
  const octokit = new Octokit({
    auth: accessToken,
  });

  // track the user data for each repo
  const userData: any = {
    username,
    applicantId: applicant.id,
    twitter: `https://twitter.com/${customData.twitter.username}`,
    github: `https://github.com/${customData.github.username}`,
    lastUpdate: new Date().toISOString(),
    total: {
      totalsUpdatedAt: new Date().toISOString(),
      commits: 0,
      activity: 0,
    },
    repos: {},
  };

  /**
   * Begin the loop of all standard repos to collect the standard data
   */
  for (let j = 0; j < STANDARD_GITHUB_REPOS.length; j++) {
    const [_, owner, repo] = STANDARD_GITHUB_REPOS[j].split(
      /^https?\:\/\/github.com\/([\w-]*)\/([\w-\.]*)/i,
    );
    const fullRepo = `${owner}/${repo}`;

    // @ts-ignore
    if (!userData.repos?.[fullRepo as never]) userData.repos[fullRepo] = {};

    console.log("-------------------------------------------");
    console.log(
      "[BEGIN]",
      `Checking repo ${j + 1} of ${
        STANDARD_GITHUB_REPOS.length
      } for ${username}`,
    );
    console.log("[REPO]", `${fullRepo}`);

    try {
      // console.log("[FETCH]", `${fullRepo} data for ${username}`);

      const [commits, activity] = await Promise.all([
        /** get the user's commits on the repo */
        retryWithBackoff(
          octokit
            .request("GET /repos/{owner}/{repo}/commits", {
              owner,
              repo,
              per_page: 100,
              page: 1,
              author: username || undefined,
            })
            .then((res) => res.data),
        ),
        /** get the user's activity on the repo */
        retryWithBackoff(
          octokit
            .request("GET /repos/{owner}/{repo}/activity", {
              owner,
              repo,
              per_page: 31, // 30 is the default
              // page: 1,
              actor: username || undefined,
            })
            .then((res) => res.data),
        ),
      ]);

      // console.log(commits[0]);
      console.log("commits count:", commits.length);
      // console.log(activity[0]);
      console.log("activity count:", activity.length);

      // record the user data desired
      userData.total.commits += commits.length;
      // @ts-ignore
      userData.repos[fullRepo] = Object.assign(userData.repos[fullRepo], {
        checkedAt: new Date().toISOString(),
        commits: commits.length,
      });

      // record the user data desired
      userData.total.activity += activity.length;
      // @ts-ignore
      userData.repos[fullRepo] = Object.assign(userData.repos[fullRepo], {
        checkedAt: new Date().toISOString(),
        activity: activity.length,
      });
    } catch (err) {
      if (err instanceof Error) console.warn("[WARN]", err.message);
      else console.warn("[WARN]", err);
    }

    console.log("\n[FINISH]", `checking ${fullRepo}`);

    try {
      saveJsonCacheDataSync(
        path.join(devlistCacheDir, `${userData.username}.json`),
        userData,
        // combine the existing and the old data
        true,
      );

      console.log(
        "[SAVE]",
        `Saved the "${fullRepo}" repo data to the local cache`,
      );
    } catch (err) {
      console.log("[WARN]", `unable to save the current repo data`);
    }

    console.log(
      `User time elapsed: ${(Date.now() - startTime) / 1000} seconds`,
    );

    // no reason to sleep on the very last repo check
    if (j + 1 != STANDARD_GITHUB_REPOS.length) {
      console.log("[DELAY]", "sleep\n");
      await sleep(1000 * (1 + Math.random()));
    }
  }

  console.log(
    "\n[COMPLETE]",
    `repo data for ${username} - ${i + 1} of ${applicants.length} in queue`,
  );
  console.log(userData.total);
  // console.log(userData);

  // perform the standard checks to auto approve a devlist applicant
  let autoApprove = false;

  // check for lots of commits total
  if (
    userData.total.commits + userData.total.commits >=
    AUTO_APPROVAL_THRESHOLD
  ) {
    autoApprove = true;
  }

  // check for specific commit thresholds on specific repos
  // i.e. encourage more contributions to these repos
  // if (userData.repos?.["solana-labs/solana"]?.commits > 5) autoApprove = true;

  // always update the wallet list records
  await prisma.walletList.update({
    where: {
      id: applicant.id,
    },
    data: {
      lastCheck: new Date(),
      status: autoApprove ? "UNCLAIMED" : undefined,
    },
  });

  // when auto approved, update the devlist application
  if (autoApprove) {
    // move the user cache file to the `approved` dir
    fs.renameSync(
      path.join(devlistCacheDir, `${userData.username}.json`),
      path.join(devlistCacheDir, `../approved`, `${userData.username}.json`),
    );

    console.log("🎉 auto approved!!");
  }

  console.log(`github: https://github.com/${customData.github.username}`);
  console.log(`twitter: https://twitter.com/${customData.twitter.username}\n`);

  console.log(
    `Total time to complete github user "${username}" was: ${
      (Date.now() - startTime) / 1000
    } seconds`,
  );
}
