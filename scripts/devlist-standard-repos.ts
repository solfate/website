import dotenv from "dotenv";
import { Octokit } from "octokit";
import prisma from "@/lib/prisma";
import { exit, sleep } from "@/lib/scripts";
import type { GithubProfile } from "next-auth/providers/github";

dotenv.config();

const STANDARD_GITHUB_REPOS = [
  // solana labs
  "https://github.com/solana-labs/solana",
  // "https://github.com/solana-mobile/mobile-wallet-adapter",
  // solana foundation
  // "https://github.com/solana-foundation/solana-improvement-documents",
  "https://github.com/solana-foundation/developer-content",
  // metaplex
  "https://github.com/metaplex-foundation/js",
  "https://github.com/metaplex-foundation/js-deprecated",
  // "https://github.com/metaplex-foundation/sugar",
  "https://github.com/metaplex-foundation/developer-hub",
  "https://github.com/metaplex-foundation/metaplex-program-library",
  "https://github.com/metaplex-foundation/mpl-token-metadata",
  "https://github.com/metaplex-foundation/mpl-bubblegum",
  "https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure",
  // "https://github.com/metaplex-foundation/umi",
  // community driven frameworks
  // "https://github.com/coral-xyz/anchor",
  // assorted public goods
  "https://github.com/rpcpool/yellowstone-grpc",
  // "https://github.com/clockwork-xyz/clockwork",
  // "https://github.com/clockwork-xyz/sdk",
  // "https://github.com/openbook-dex/program",
  // "https://github.com/openbook-dex/openbook-v2",
  // "https://github.com/openbook-dex/openbook-ts",
  // "https://github.com/openbook-dex/openbook-dex-ui",
];

/**
 * Get the list of all all DevList applicants that are potentially eligible
 */
const users = await prisma.user.findMany({
  where: {
    walletList: {
      some: {
        // we are only checking the dev list applications
        type: "DEVELOPER",
        // only applicants that have not been approved yet
        status: "PENDING",
        // we are only interested in those that have not minted the token
        // assetId: "",
      },
    },
  },
  include: {
    accounts: {
      where: {
        provider: "github",
      },
    },
    walletList: {
      where: {
        type: "DEVELOPER",
      },
    },
  },
});

// console.log(users);

if (!users || users.length == 0) {
  exit("There are no pending DevList applicants");
}

// todo: here: full loop of all users? or maybe only a slice of them

const user = users[0];

console.log("-------------------------------------------------------------");
console.log("username:", user.username);
console.log("total accounts (expect 1):", user.accounts.length);

if (!user.accounts[0].provider_profile) exit("No provider profile data");

console.log(user.accounts[0].provider_profile as GithubProfile);

// extract the common data to use
const { login: username } = user.accounts[0].provider_profile as GithubProfile;
let {
  // comment for better diffs
  access_token: accessToken,
  expires_at: accessTokenExpiration,
  refresh_token: refreshToken,
  refresh_token_expires_in,
} = user.accounts[0];

if (!username) exit("Unknown github username");

console;

/**
 * when the access token is expired, fallback to a default server access token
 * note: this will prevent us from looking at the user's private repos
 */
if (
  accessTokenExpiration == null ||
  new Date((accessTokenExpiration as number) * 1000) > new Date()
) {
  console.info("[INFO]", "using the user's access token");
  console.info(
    "[INFO]",
    "token expiration:",
    accessTokenExpiration
      ? new Date((accessTokenExpiration as number) * 1000)
      : "never?",
  );
} else {
  console.info("[INFO]", "user's github access token has expired");

  // the github access tokens will normally auto expire and need to be refreshed
  // todo: refresh the user's access token
  // https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens#refreshing-a-user-access-token-with-a-refresh-token

  // todo: fallback to a server token
  accessToken = process.env.GITHUB_ACCESS_TOKEN || null;
  console.info("[INFO]", "using the server's access token");
}

// initializing octokit with the user's github auth token will allow us to read their private repos
const octokit = new Octokit({
  auth: accessToken,
});

// track the user data for each repo
const userData = {
  username,
  total: {
    commits: 0,
    activity: 0,
  },
  commits: [],
  activity: [],
};

/**
 * Begin the loop of all standard repos to collect the standard data
 */
for (let i = 0; i < STANDARD_GITHUB_REPOS.length; i++) {
  const [_, owner, repo] = STANDARD_GITHUB_REPOS[i].split(
    /^https?\:\/\/github.com\/([\w-]*)\/([\w-]*)/i,
  );
  const fullRepo = `${owner}/${repo}`;

  console.log("\n-------------------------------------------");
  console.log("[BEGIN]", `Checking ${fullRepo}...`);

  /**
   * get the user's commits on the repo
   */
  try {
    console.log("[FETCH]", `${fullRepo} commits for ${username}`);
    const commits = await octokit
      .request("GET /repos/{owner}/{repo}/commits", {
        owner,
        repo,
        per_page: 100,
        page: 1,
        author: username || undefined,
      })
      .then((res) => res.data);
    console.log(commits[0]);
    console.log("total count:", commits.length);

    // record the user data desired
    userData.total.commits += commits.length;
    userData.commits.push({
      repo: fullRepo,
      checkedAt: new Date().toISOString(),
      count: commits.length,
    } as never);
  } catch (err) {
    if (err instanceof Error) console.warn("[WARN]", err.message);
    else console.warn("[WARN]", err);
  }

  await sleep(2000);

  /**
   * get the user's activity on the repo
   */
  try {
    console.log("[FETCH]", `${fullRepo} activity for ${username}`);
    const activity = await octokit
      .request("GET /repos/{owner}/{repo}/activity", {
        owner,
        repo,
        // per_page: 100,
        // page: 1,
        actor: username || undefined,
      })
      .then((res) => res.data);
    console.log(activity[0]);
    console.log("total count:", activity.length);

    // record the user data desired
    userData.total.activity += activity.length;
    userData.activity.push({
      repo: fullRepo,
      checkedAt: new Date().toISOString(),
      count: activity.length,
    } as never);
  } catch (err) {
    if (err instanceof Error) console.warn("[WARN]", err.message);
    else console.warn("[WARN]", err);
  }

  console.log("[FINISH]", `Checking ${fullRepo}`);

  // no reason to sleep on the very last repo check
  if (i + 1 != STANDARD_GITHUB_REPOS.length) {
    console.log("[DELAY]", "sleep");
    await sleep(5000);
  }
}

console.log("[COMPLETE]", "user data for:", username);
console.log(userData);

// todo: save this data locally
