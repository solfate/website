import { getServerSession } from "next-auth";
import { authOptions } from "./options";
import {
  AccountConnection,
  AccountProviders,
  AccountSanitizeKeys,
  AccountsGroupByProvider,
  WithAuthHandler,
  WithSessionHandler,
} from "@/types";
import { Account } from "@prisma/client";
import { GithubProfile } from "next-auth/providers/github";
import { TwitterProfile } from "next-auth/providers/twitter";

/**
 * Get the current user's session
 */
export async function getUserSession() {
  return getServerSession(authOptions);
}

/**
 * Wrapper handler function to ensure requests are from authenticated and permissioned  users
 */
export const withUserAuth =
  (handler: WithAuthHandler) =>
  async (req: Request, { params }: { params?: Record<string, string> }) => {
    const session = await getUserSession();
    if (!session?.user.id || !session?.user.username) {
      return new Response("Unauthorized: Login required.", { status: 401 });
    }

    return handler({ req, params, session });
  };

/**
 * Wrapper handler function to ensure requests are required to have a current session
 */
export const withUserSession =
  (handler: WithSessionHandler) =>
  async (req: Request, { params }: { params?: Record<string, string> }) => {
    const session = await getUserSession();
    if (!session?.user.id) {
      return new Response("Unauthorized: Login required.", { status: 401 });
    }

    return handler({ req, params, session });
  };

/**
 * Group all the accounts by their `provider` (e.g. twitter, github, etc)
 */
export function groupAccountsByProvider(accounts: Account[], sanitize = true) {
  // init a keyed group tracker (giving type save keys for the supported providers)
  const groupedAccounts: AccountsGroupByProvider = {
    unknown: undefined,
    solana: undefined,
    twitter: undefined,
    github: undefined,
  };

  // actually perform the grouping action
  accounts.map((account) => {
    if (!Array.isArray(groupedAccounts[account.provider]))
      groupedAccounts[account.provider] = [];

    if (sanitize) {
      AccountSanitizeKeys.forEach((key) => delete account[key]);
    }

    groupedAccounts[account.provider]?.push(account);
  });

  return groupedAccounts;
}

/**
 *
 */
export function convertAccountsToConnections(
  accounts: Account[],
): AccountConnection[] {
  return accounts
    .filter((account) => account.provider != "jwt")
    .map((account) => {
      switch (account.provider.toLowerCase() as AccountProviders) {
        case "github":
          return {
            provider: "github",
            value: (account.provider_profile as GithubProfile).login,
          };
        case "twitter":
          return {
            provider: "twitter",
            value: (account.provider_profile as object as TwitterProfile).data
              .username,
          };
        case "solana":
          return {
            provider: "solana",
            value: account.providerAccountId,
          };
        default:
          // have a catch all in case a
          return {
            provider: "unknown",
            value: "unknown",
          };
      }
    });
}
