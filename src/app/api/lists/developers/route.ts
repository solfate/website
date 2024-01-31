/**
 * API handlers for the "/api/lists/developers" endpoint
 */

import prisma from "@/lib/prisma";
import { groupAccountsByProvider, withUserAuth } from "@/lib/auth";
import {
  DEVLIST_UPDATE_AUTHORITY,
  MINT_COOLDOWN_SECONDS,
} from "@/lib/const/devlist";
import { getAccountsByUserId } from "@/lib/queries/accounts";
import { SolanaSignInMessage } from "@/lib/solana/SignInMessage";
import { createNonTransferableTokenTransaction } from "@/lib/solana/tokens";
import {
  ApiListDevelopersPostInput,
  ApiListDevelopersPutInput,
} from "@/types/api/developers";
import { DevListApplicationExtraData } from "@/types/api/lists";
import { WalletList } from "@prisma/client";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { TokenMetadata } from "@solana/spl-token-metadata";
import { Connection, PublicKey } from "@solana/web3.js";
import base58 from "bs58";
import { GithubProfile } from "next-auth/providers/github";
import { TwitterProfile } from "next-auth/providers/twitter";
import { checkMintAndUpdateApplicantStatus } from "@/lib/lists";
import { solanaExplorerLink } from "@/lib/solana/helpers";

// set the max length for the question info
const MAX_LEN = 250;

// configure the default values for this wallet list endpoint
const WALLET_LIST_DEFAULTS: {
  cohort: WalletList["cohort"];
  type: WalletList["type"];
  status: WalletList["status"];
} = {
  // current working cohort
  cohort: 2,
  // developer list
  type: "DEVELOPER",
  // waitlist all new additions by default
  status: "PENDING",
};

type ListMember = {
  token: string;
  owner: string;
};

/**
 * handler for listing all owners of the DevList token (aka members)
 */
export const GET = async () => {
  try {
    const applicants = await prisma.walletList.findMany({
      where: {
        type: "DEVELOPER",
        // status: "ACTIVE",
        assetId: {
          not: null,
        },
      },
    });

    let [pendingApplicants, unclaimedApplicants] = await Promise.all([
      prisma.walletList.count({
        where: {
          type: "DEVELOPER",
          status: "PENDING",
          assetId: {
            equals: null,
          },
        },
      }),
      prisma.walletList.count({
        where: {
          type: "DEVELOPER",
          status: "UNCLAIMED",
          assetId: {
            equals: null,
          },
        },
      }),
    ]);

    const connection = new Connection(process.env.SOLANA_RPC, {
      commitment: "single",
    });

    //
    const members: ListMember[] = [];

    //
    for (let i = 0; i < applicants.length; i++) {
      // an assetId is required
      if (!applicants[i]?.assetId) continue;

      const assetId = applicants[i].assetId as string;

      // when the member has not been fully activated, attempt to do so
      if (applicants[i].status != "ACTIVE") {
        // console.log(applicants[i]);

        try {
          // attempt to verify if the token as actually allocated on chain, and update the status accordingly
          const accountInfo = await checkMintAndUpdateApplicantStatus(
            applicants[i].id,
            connection,
            new PublicKey(assetId),
            "ACTIVE",
          );

          // console.log(assetId as string, accountInfo);
          // console.log(solanaExplorerLink("token", assetId));

          // force update the current record's state
          if (!!accountInfo) {
            applicants[i].status = "ACTIVE";
          } else {
            unclaimedApplicants++;
            continue;
          }
        } catch (err) {
          console.error("[DEVLIST MEMBER UPDATE]", err);
          continue;
        }
      }

      members.push({
        token: assetId,
        owner: applicants[i].wallet,
      });
    }

    // serialize and encode the transaction while sending it to the client
    return Response.json({
      list: "DevList",
      date: new Date().toISOString(),
      url: "https://solfate.com/devlist",
      count: {
        members: members.length,
        unclaimed: unclaimedApplicants,
        pending: pendingApplicants,
        total: pendingApplicants + unclaimedApplicants + members.length,
      },
      // randomly sort the members array
      members: members.sort(() => Math.random() - 0.5),
    });
  } catch (err) {
    console.error(err);

    return new Response("An unknown error occurred", {
      status: 400,
    });
  }
};

/**
 * handler for adding new applicants to the waitlist
 */
export const POST = withUserAuth(async ({ req, session }) => {
  // debug("developers post");

  const input: ApiListDevelopersPostInput = await req.json();

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
          id: accounts.twitter?.[0].providerAccountId as string,
          username: (
            accounts.twitter?.[0].provider_profile as object as TwitterProfile
          ).data.username,
        },
        github: {
          id: accounts.github?.[0].providerAccountId as string,
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
      userId: session.user.id,
      type: WALLET_LIST_DEFAULTS.type,
      status: WALLET_LIST_DEFAULTS.status,
      cohort: WALLET_LIST_DEFAULTS.cohort,
      wallet: accounts.solanaWallet,
      twitter: accounts.twitter.username,
      // note: the `data` should store the username and uid from the provider in case username change
      data: {
        github: accounts.github,
        twitter: accounts.twitter,
      } as DevListApplicationExtraData,
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

/**
 * handler for allowing accepted applicants to mint the DevList token
 */
export const PUT = withUserAuth(async ({ req, session }) => {
  // debug("developers put");

  try {
    // ensure all the required server keys/data are available
    if (!process.env.DEVLIST_SERVER_KEY || !process.env.SOLANA_RPC) {
      return new Response("Internal error. Missing data backend data.", {
        status: 500,
      });
    }

    const input: ApiListDevelopersPutInput = await req.json();

    // perform the input validation
    if (!input.mint.trim()) {
      return new Response("You are required to provide the mint address", {
        status: 400,
      });
    }

    // ensure we have a valid public key
    let mint: PublicKey | undefined;
    try {
      mint = new PublicKey(input.mint.trim());
    } catch (err) {
      return new Response("Invalid mint address", {
        status: 400,
      });
    }

    // parse the signed message provided within the request
    const signInMessage = new SolanaSignInMessage({
      signedData: input.signedData,
      message: input.message,
      overrides: {
        nonce: mint.toBase58(),
      },
    });

    // actually validate/check the submitted message for the signature
    if (!signInMessage.verifyAny()) {
      return new Response("Could not validate the signed message", {
        status: 400,
      });
    }

    // get the user's application
    const applicant = await prisma.walletList.findFirst({
      where: {
        userId: session.user.id,
        type: "DEVELOPER",
      },
    });

    if (!applicant) {
      return new Response("You are not on this list", {
        status: 400,
      });
    }

    if (applicant.status == "PENDING") {
      return new Response("Your application is still under review", {
        status: 400,
      });
    } else if (applicant.status == "ACTIVE") {
      return new Response("You have already claimed the token", {
        status: 400,
      });
    }

    // only allow unclaimed applicants to proceed
    if (applicant.status != "UNCLAIMED") {
      return new Response("You have no token claim available", {
        status: 400,
      });
    }

    const DEVLIST_SERVER_KEY =
      await getKeypairFromEnvironment("DEVLIST_SERVER_KEY");

    const connection = new Connection(process.env.SOLANA_RPC);

    const owner = new PublicKey(signInMessage.message.address);

    /**
     * when the user has an asset id and status=UNCLAIMED,
     * the transaction was either canceled by them or the transaction failed
     */
    if (!!applicant.assetId) {
      try {
        const { mintTimestamp } = applicant.data as DevListApplicationExtraData;

        if (!mintTimestamp) {
          throw Error("Unknown mint timestamp");
        }

        console.log("mint", new Date(mintTimestamp));
        console.log("now", new Date(Date.now()));
        console.log("ago", new Date(Date.now() - MINT_COOLDOWN_SECONDS * 1000));
        console.log(
          "pass",
          mintTimestamp < Date.now() - MINT_COOLDOWN_SECONDS * 1000,
        );

        // make sure the user has passed the minting cooldown period
        if (mintTimestamp >= Date.now() - MINT_COOLDOWN_SECONDS * 1000) {
          return new Response(
            `Slow down there tiger, you are now in a minting cooldown period. Try again in a few moments`,
            {
              status: 429,
            },
          );
        }

        // check if the current `assetId` already exists (aka the user has claimed)
        const accountInfo = await checkMintAndUpdateApplicantStatus(
          applicant.id,
          connection,
          new PublicKey(applicant.assetId),
        );

        if (!!accountInfo) {
          return new Response(`You have already claimed your token.`, {
            status: 403,
          });
        }

        /**
         * when here, we are safe to allow the user to reattempt the mint
         * automatically resetting the stored mint details
         */
      } catch (err) {
        console.error("[DevList claim]", err);
        return new Response(`Minting error occurred. Contact support.`, {
          status: 400,
        });
      }
    }

    // DevList metadata to store in mint account
    const metadata: TokenMetadata = {
      // note: we reset the `updateAuthority` to the final desired key later
      // but it is required to sign in order to set `additionalMetadata` during the mint transaction
      updateAuthority: mint,
      mint: mint,
      name: "Solana DevList Membership",
      symbol: "DevList",
      uri: "https://arweave.net/pU-bAhOLQfDDQxByxThtgqfmXc7Wrcg15pzziDK-o5A",
      // set the additional custom metadata
      additionalMetadata: [],
    };

    const applicantData = applicant.data as DevListApplicationExtraData;

    // dynamically add in the additional metadata
    if (input.metadata?.github === true) {
      metadata.additionalMetadata.push([
        "github",
        applicantData.github.username,
      ]);
    }
    if (input.metadata?.twitter === true) {
      metadata.additionalMetadata.push([
        "twitter",
        applicantData.twitter.username,
      ]);
    }

    let [_newApplicant, transaction] = await Promise.all([
      // store the asset id while we create the transaction
      prisma.walletList.update({
        where: {
          id: applicant.id,
        },
        data: {
          // always stored the updated token mint address
          assetId: mint.toBase58(),
          // always reset the cached wallet (allowing the user to mint with any wallet they want)
          wallet: owner.toBase58(),
          // store the current time stamp to process the mint cooldown period
          data: Object.assign(applicant.data as DevListApplicationExtraData, {
            mintTimestamp: Date.now(),
            attemptedAssets: [mint.toBase58()].concat(
              (applicant.data as DevListApplicationExtraData).attemptedAssets ||
                [],
            ),
          }),
        },
      }),
      // create the devlist token minting transaction
      createNonTransferableTokenTransaction({
        connection,
        mint: mint,
        owner: owner,
        payer: owner,
        metadata,
        authority: DEVLIST_SERVER_KEY.publicKey,
        // set the final update authority
        updateAuthority: DEVLIST_UPDATE_AUTHORITY,
      }),
    ]);

    // get the latest blockhash since we need to sign with the server key
    await connection
      .getLatestBlockhash()
      .then(({ blockhash }) => (transaction.recentBlockhash = blockhash));

    // partially sign the transaction with the server key
    transaction.sign(DEVLIST_SERVER_KEY);

    // serialize and encode the transaction while sending it to the client
    return Response.json({
      assetId: mint,
      serializedTransaction: base58.encode(
        transaction.serialize({
          // this transaction is only partially signed
          verifySignatures: false,
        }),
      ),
    });
  } catch (err) {
    console.error(err);

    return new Response("An unknown error occurred", {
      status: 400,
    });
  }
});
