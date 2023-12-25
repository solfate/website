/**
 * API handlers for the "/api/lists/developers" endpoint
 */

import { groupAccountsByProvider, withUserAuth } from "@/lib/auth";
import { debug } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { getAccountsByUserId } from "@/lib/queries/accounts";
import { ApiDevelopersPostInput } from "@/types/api/developers";
import { WalletList } from "@prisma/client";
import { GithubProfile } from "next-auth/providers/github";
import { TwitterProfile } from "next-auth/providers/twitter";

// set the max length for the question info
const MAX_LEN = 250;

// configure the default values for this wallet list endpoint
const WALLET_LIST_DEFAULTS: {
  cohort: WalletList["cohort"];
  type: WalletList["type"];
  status: WalletList["status"];
} = {
  // current working cohort
  cohort: 1,
  // developer list
  type: "DEVELOPER",
  // waitlist all new additions by default
  status: "PENDING",
};

export const POST = withUserAuth(async ({ req, session }) => {
  // debug("developers post");

  const input: ApiDevelopersPostInput = await req.json();

  // perform the input validation
  if (!input.why.trim()) {
    return new Response(
      "You are required to give a reason why you should be added to this list.",
      { status: 400 },
    );
  } else if (!!input.why.trim() && input.why.length > MAX_LEN) {
    return new Response(`Your reason is too long. Max ${MAX_LEN} characters.`, {
      status: 400,
    });
  } else if (!!input.who?.trim() && input.why.trim().length > MAX_LEN) {
    return new Response(
      `Your recommended voucher is too long. Max ${MAX_LEN} characters.`,
      { status: 400 },
    );
  }

  // create a parsed listing of the desired accounts for this wallet list
  const accounts = await getAccountsByUserId({
    userId: session.user.id,
  })
    .then((accounts) => groupAccountsByProvider(accounts, true))
    .then((accounts) => {
      return {
        solanaWallet: accounts.solana?.[0].providerAccountId,
        twitter: {
          id: accounts.twitter?.[0].providerAccountId,
          username: (
            accounts.twitter?.[0].provider_profile as object as TwitterProfile
          ).data.username,
        },
        github: {
          id: accounts.github?.[0].providerAccountId,
          username: (
            accounts.github?.[0].provider_profile as object as GithubProfile
          ).login,
        },
      };
    });

  // ensure all the required accounts exist for this list of "DEVELOPERS"
  if (
    !accounts.solanaWallet ||
    !accounts.github.username ||
    !accounts.twitter.username
  ) {
    return new Response("You are missing required account connections!", {
      status: 400,
    });
  }

  // verify the current user/wallet is not already a member of the wallet list
  const currentRecord = await prisma.walletList.findFirst({
    where: {
      type: "DEVELOPER",
      wallet: accounts.solanaWallet,
    },
  });
  if (!!currentRecord) {
    return new Response("Your wallet is already on this list!", {
      status: 400,
    });
  }

  // todo: verify the grouped accounts have not been used yet
  // do we want or need to use this? maybe in the future

  // add the user to the waitlist
  const newMember = await prisma.walletList.create({
    data: {
      type: WALLET_LIST_DEFAULTS.type,
      status: WALLET_LIST_DEFAULTS.status,
      cohort: WALLET_LIST_DEFAULTS.cohort,
      wallet: accounts.solanaWallet,
      twitter: accounts.twitter.username,
      // note: the `data` should store the username and uid from the provider in case username change
      data: {
        github: accounts.github,
        twitter: accounts.twitter,
      },
      questions: {
        why: input.why,
        who: input.who,
      },
    },
  });

  // ensure the new member was added to the list
  if (!newMember) {
    return new Response("An error occurred while adding you to the list", {
      status: 400,
    });
  }

  return new Response("You have been added to the waitlist!");
});
